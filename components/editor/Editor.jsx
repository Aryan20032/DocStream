"use client";
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import editor from "./plugins/editorConfig"; // Ensure you import your configured editor

const Editor = () => {
  const initialConfig = {
    editor,
    namespace: "MyEditor",
    theme: Theme,
    onError: (error) => {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={
          <div className="editor-placeholder">Enter some text...</div>
        }
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={(editorState) => console.log(editorState)} />
    </LexicalComposer>
  );
};

export { Editor };
