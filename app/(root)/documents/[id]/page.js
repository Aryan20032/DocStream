import { Editor } from "@/components/editor/Editor";
import Header from "@/components/header";
import React from "react";

const document = () => {
  return (
    <div>
      <Header>
        <div className="flex w-fit items-center justify-center gap-2">
          <p className="document-title">title</p>
        </div>
      </Header>
      <Editor />
    </div>
  );
};

export default document;
