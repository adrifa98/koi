"use client";

import { generateHTML } from "@tiptap/core";
import ImageExtension from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

interface RenderTiptapProps {
  json: any; // JSONContent del editor
}

export const RenderTiptap = ({ json }: RenderTiptapProps) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (json) {
      // Evita el uso de generateHTML en el servidor
      setHtml(generateHTML(json, [StarterKit, ImageExtension]));
    }
  }, [json]);

  if (!html) return null;

  return <div dangerouslySetInnerHTML={{ __html: html }} className="prose dark:prose-invert" />;
};
