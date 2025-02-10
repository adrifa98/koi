"use client";

import { useToast } from "@/components/ui/use-toast";
import { Share } from "lucide-react";
import { useTranslations } from "next-intl";

export function CopyLink({ id }: { id: string }) {
  const { toast } = useToast();
  const t = useTranslations("CopyLink"); // Namespace en el JSON

  async function copyToClipboard() {
    await navigator.clipboard.writeText(`${location.origin}/post/${id}`);
    toast({
      description: t("successDescription"),
    });
  }

  return (
    <button className="flex items-center gap-x-1" onClick={copyToClipboard}>
      <Share className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
