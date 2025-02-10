"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";

export const Gif = Node.create({
  name: "gif",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-type='gif']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes, { "data-type": "gif" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node }: NodeViewProps) => {
      return <img src={node.attrs.src} alt="GIF" className="max-w-full h-auto" />;
    });
  },
});
