"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Editor } from "@tiptap/react";
import axios from "axios";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Search,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface MenubarrProps {
  editor: Editor | null;
}

export const Menubarr: React.FC<MenubarrProps> = ({ editor }) => {
  const t = useTranslations("CreatePost");
  const { toast } = useToast();
  const [showGifModal, setShowGifModal] = useState(false);
  const [gifs, setGifs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gifSearchCount, setGifSearchCount] = useState(0);
  const maxGifSearches = 5;

  if (!editor) return null;

  // 🔹 Función para buscar GIFs en Giphy
  const searchGifs = async (query: string) => {
    if (!query) return;
    if (gifSearchCount >= maxGifSearches) {
      toast({
        title: t("errorTitle"),
        description: t("errorGifLimit"),
        variant: "destructive",
      });
      return;
    }

    const apiKey = "czZ2tCzgsFZntulpgmFOGKh2PSHIw5zM";
    try {
      const res = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: apiKey,
          q: query,
          limit: 10,
        },
      });
      setGifs(res.data.data.map((gif: any) => gif.images.fixed_height.url));
      setGifSearchCount(gifSearchCount + 1);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    }
  };

  return (
    <div className="sticky top-0 flex flex-wrap gap-1 p-2 border-b rounded-t-lg">
      {/* 🔹 Restaurando estilos originales de los botones e iconos */}
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title={t("heading1")}
      >
        <Heading1 size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title={t("heading2")}
      >
        <Heading2 size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title={t("heading3")}
      >
        <Heading3 size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title={t("bold")}
      >
        <Bold size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title={t("italic")}
      >
        <Italic size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title={t("strikethrough")}
      >
        <Strikethrough size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title={t("bulletList")}
      >
        <List size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title={t("orderedList")}
      >
        <ListOrdered size={14} />
      </Button>
      <Button
        className="h-6 w-6 px-0 py-0"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title={t("blockquote")}
      >
        <Quote size={14} />
      </Button>
      <Button className="h-6 w-6 px-0 py-0" onClick={() => editor.chain().focus().undo().run()} title={t("undo")}>
        <Undo size={14} />
      </Button>
      <Button className="h-6 w-6 px-0 py-0" onClick={() => editor.chain().focus().redo().run()} title={t("redo")}>
        <Redo size={14} />
      </Button>

      {/* 🔹 Modal para insertar GIF con colores ajustados */}
      <Dialog open={showGifModal} onOpenChange={setShowGifModal}>
        <DialogTrigger asChild>
          <Button className="h-6 w-6 px-0 py-0" title={t("insertGif")}>
            <ImageIcon size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[350px] p-3 rounded-lg bg-card text-card-foreground shadow-lg border border-border">
          {/* 🔹 Título y descripción accesibles */}
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-foreground">{t("insertGif")}</DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground" id="gif-modal-description">
            {t("gifDescription")}
          </p>

          <input
            type="text"
            className="border p-2 w-full rounded-md mt-2 bg-input text-foreground text-sm"
            placeholder={t("gifPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-describedby="gif-modal-description"
          />
          <Button
            className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/80 text-sm"
            onClick={() => searchGifs(searchTerm)}
          >
            <Search size={14} />
            {t("search")}
          </Button>

          <div className="grid grid-cols-2 gap-2 mt-3 max-h-[250px] overflow-y-auto">
            {gifs.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">{t("noResults")}</p>
            ) : (
              gifs.map((gif, index) => (
                <img
                  key={index}
                  src={gif}
                  className="cursor-pointer w-full h-auto rounded-md hover:opacity-80 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setImage({ src: gif }).run();
                    setShowGifModal(false);
                  }}
                />
              ))
            )}
          </div>

          <Button
            className="mt-3 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm"
            onClick={() => setShowGifModal(false)}
          >
            {t("close")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
