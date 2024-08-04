// ToolbarPlugin.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);

  // Function to update the toolbar state based on the current editor state
  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));

        const anchor = selection.anchor.getNode();
        let activeBlockType = null;
        if ($isHeadingNode(anchor)) {
          activeBlockType = anchor.getTag();
        } else {
          activeBlockType = anchor.getType();
        }
        console.log("Active block type:", activeBlockType); // Log active block type
        setActiveBlock(activeBlockType);
      } else {
        console.log("No range selection"); // Log no range selection
      }
    });
  }, [editor]);

  useEffect(() => {
    // Register editor listeners and commands
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          console.log("Editor state updated"); // Log editor state update
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.update(() => {
            console.log("Selection changed"); // Log selection change
            updateToolbar();
          });
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );

    return () => {
      unregister();
    };
  }, [editor, updateToolbar]);

  // Function to toggle block type in the editor
  const toggleBlock = useCallback(
    (type) => {
      console.log("Toggling block type to:", type); // Log block type toggle
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          console.log("Current active block:", activeBlock); // Log current active block
          if (activeBlock === type) {
            console.log("Setting block type to paragraph"); // Log setting to paragraph
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            switch (type) {
              case "h1":
                console.log("Setting block type to h1"); // Log setting to h1
                $setBlocksType(selection, () => $createHeadingNode("h1"));
                break;
              case "h2":
                console.log("Setting block type to h2"); // Log setting to h2
                $setBlocksType(selection, () => $createHeadingNode("h2"));
                break;
              case "h3":
                console.log("Setting block type to h3"); // Log setting to h3
                $setBlocksType(selection, () => $createHeadingNode("h3"));
                break;
              case "quote":
                console.log("Setting block type to quote"); // Log setting to quote
                $setBlocksType(selection, () => $createQuoteNode());
                break;
              default:
                console.log("Setting block type to paragraph"); // Log setting to paragraph
                $setBlocksType(selection, () => $createParagraphNode());
                break;
            }
          }
        } else {
          console.log("No range selection"); // Log no range selection in toggle
        }
      });
    },
    [activeBlock, editor]
  );

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => toggleBlock("h1")}
        data-active={activeBlock === "h1" ? "" : undefined}
        className={
          "toolbar-item spaced " + (activeBlock === "h1" ? "active" : "")
        }
      >
        <i className="format h1" />
      </button>
      <button
        onClick={() => toggleBlock("h2")}
        data-active={activeBlock === "h2" ? "" : undefined}
        className={
          "toolbar-item spaced " + (activeBlock === "h2" ? "active" : "")
        }
      >
        <i className="format h2" />
      </button>
      <button
        onClick={() => toggleBlock("h3")}
        data-active={activeBlock === "h3" ? "" : undefined}
        className={
          "toolbar-item spaced " + (activeBlock === "h3" ? "active" : "")
        }
      >
        <i className="format h3" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>
    </div>
  );
}

export default ToolbarPlugin;
