"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { createComment } from "../actions";
import { SubmitButton } from "./SubmitButtons";

interface iAppProps {
  postId: string;
}

export function CommentForm({ postId }: iAppProps) {
  const ref = useRef<HTMLFormElement>(null);
  const [comment, setComment] = useState<string>("");
  const [commentLength, setCommentLength] = useState<number>(0);
  const { toast } = useToast();
  const t = useTranslations("CommentForm");

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    setCommentLength(e.target.value.length);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (commentLength > 144) {
      toast({
        title: t("errorTitle"),
        description: t("errorCommentTooLong"),
        variant: "destructive",
      });
      return;
    }

    // Enviar el comentario solo si no excede el límite
    const formData = new FormData(event.currentTarget);
    await createComment(formData);
    ref.current?.reset();
    setComment("");
    setCommentLength(0);
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit} ref={ref}>
      <input type="hidden" name="postId" value={postId} />
      <Label>{t("label")}</Label>
      <Textarea
        placeholder={t("placeholder")}
        className="w-full mt-1 mb-2"
        name="comment"
        value={comment}
        onChange={handleCommentChange}
      />
      <p className={`text-[9px] text-right ${commentLength > 144 ? "text-red-500" : "text-muted-foreground"}`}>
        {commentLength}/144
      </p>
      <SubmitButton text={t("submit")} />
    </form>
  );
}
