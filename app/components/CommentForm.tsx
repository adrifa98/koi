"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { createComment } from "../actions";
import { SubmitButton } from "./SubmitButtons";

interface iAppProps {
  postId: string;
}

export function CommentForm({ postId }: iAppProps) {
  const ref = useRef<HTMLFormElement>(null);
  const t = useTranslations("CommentForm");

  return (
    <form
      className="mt-5"
      action={async (formData) => {
        await createComment(formData);
        ref.current?.reset();
      }}
      ref={ref}
    >
      <input type="hidden" name="postId" value={postId} />
      <Label>{t("label")}</Label>
      <Textarea
        placeholder={t("placeholder")}
        className="w-full mt-1 mb-2"
        name="comment"
      />
      <SubmitButton text={t("submit")} />
    </form>
  );
}
