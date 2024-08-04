// EditorConfig.js
import { createEditor } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";

const editor = createEditor({
  nodes: [
    HeadingNode,
    QuoteNode,
    ParagraphNode,
    TextNode,
    // Add other necessary nodes here
  ],
});

export default editor;
