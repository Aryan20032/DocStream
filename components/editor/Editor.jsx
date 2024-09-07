"use client";
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode } from "@lexical/rich-text";
import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useEditorStatus,
} from "@liveblocks/react-lexical";
import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import { useThreads } from "@liveblocks/react";
import Comments from "../Comments";
import Loader from "../Loader";
import { DeleteModal } from "../DeleteModal";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx"; // docx for DOCX generation
// import html2pdf from "html2pdf.js"; // html2pdf for PDF generation

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({ roomId, currentUserType }) {
  const status = useEditorStatus;
  const { threads } = useThreads();
  const initialConfig = liveblocksConfig({
    namespace: "MyEditor",
    nodes: [HeadingNode],
    theme: Theme,
    onError: (error) => {
      console.error(error);
    },
    editable: currentUserType === "editor",
  });

  // Download as DOCX
  const downloadAsDocx = async () => {
    const editorContent = document.querySelector(".editor-input").innerText;
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({ children: [new TextRun(editorContent)] })],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "editor.docx");
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
          <div className="flex gap-3 ml-3">
            <button
              onClick={downloadAsDocx}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Download
            </button>
            {currentUserType === "editor" && <DeleteModal roomId={roomId} />}
          </div>
        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start">
          {status === "not-loaded" || status === "loading" ? (
            <Loader />
          ) : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === "editor" && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            <Comments />
          </LiveblocksPlugin>

          {/* Download buttons */}

          {/* <button
              onClick={downloadAsPdf}
              className="bg-green-500 text-white p-2 rounded"
            >
              Download as PDF
            </button> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
