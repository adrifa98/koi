"use client";

import { Gif } from "@/app/components/GifExtension"; // Extensión GIF
import { Menubarr } from "@/app/components/MenuBar"; // Menú de herramientas
import { Button } from "@/components/ui/button";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import {
  EditorContent,
  JSONContent,
  useEditor,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const Menubar = ({ editor }: { editor: Editor | null }) => {
  const t = useTranslations("CreatePost");
  if (!editor) return null;

  return (
    <div className="sticky top-0 flex flex-wrap gap-1 p-2 border-b rounded-t-lg">
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant={editor.isActive("heading", { level: 1 }) ? "default" : "secondary"} title={t("heading1")}>
        <Heading1 size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant={editor.isActive("heading", { level: 2 }) ? "default" : "secondary"} title={t("heading2")}>
        <Heading2 size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} variant={editor.isActive("heading", { level: 3 }) ? "default" : "secondary"} title={t("heading3")}>
        <Heading3 size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBold().run()} variant={editor.isActive("bold") ? "default" : "secondary"} title={t("bold")}>
        <Bold size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant={editor.isActive("italic") ? "default" : "secondary"} title={t("italic")}>
        <Italic size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} variant={editor.isActive("strike") ? "default" : "secondary"} title={t("strikethrough")}>
        <Strikethrough size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant={editor.isActive("bulletList") ? "default" : "secondary"} title={t("bulletList")}>
        <List size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} variant={editor.isActive("orderedList") ? "default" : "secondary"} title={t("orderedList")}>
        <ListOrdered size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} variant={editor.isActive("blockquote") ? "default" : "secondary"} title={t("blockquote")}>
        <Quote size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().undo().run()} title={t("undo")}>
        <Undo size={14} />
      </Button>
      <Button onClick={() => editor.chain().focus().redo().run()} title={t("redo")}>
        <Redo size={14} />
      </Button>
      <Button
        onClick={() => {
          const url = prompt(t("enterUrl"));
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        variant={editor.isActive("link") ? "default" : "secondary"}
        title={t("insertLink")}
      >
        <Link size={14} />
      </Button>
    </div>
  );
};

interface TipTapEditorProps {
  setJson: (json: JSONContent) => void;
  json: JSONContent | null;
}

export function TipTapEditor({ setJson, json }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ blockquote: {} }), // ✅ Corrección aplicada
      LinkExtension,
      ImageExtension,
      Gif,
    ],
    content: json ?? "", // ✅ Solución: Asegura que content sea válido
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert p-2 min-h-[150px] focus:outline-none text-card-foreground dark:text-white",
      },
    },
    onUpdate: ({ editor }) => {
      setJson(editor.getJSON());
    },
  });

  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <Menubarr editor={editor} />
      <EditorContent editor={editor} className="p-2 min-h-[200px]" />
    </div>
  );
}
