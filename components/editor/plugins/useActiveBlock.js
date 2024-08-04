// useActiveBlock.js
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import { $getSelection, $isRangeSelection } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isRootOrShadowRoot } from "lexical";

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const getActiveBlock = useCallback(() => {
    let activeBlockType = null;
    const editorState = editor.getEditorState();
    editorState.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor.getNode();
        let element =
          anchor.getKey() === "root"
            ? anchor
            : $findMatchingParent(anchor, (e) => {
                const parent = e.getParent();
                return parent !== null && $isRootOrShadowRoot(parent);
              });

        if (!element) {
          element = anchor.getTopLevelElementOrThrow();
        }

        if ($isHeadingNode(element)) {
          activeBlockType = element.getTag();
        } else {
          activeBlockType = element.getType();
        }
      }
    });
    return activeBlockType;
  }, [editor]);

  return getActiveBlock;
}

export default useActiveBlock;
