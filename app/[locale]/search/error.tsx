"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("errors.generic")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold">{t("title")}</h2>
      <p className="text-sm text-muted-foreground">{t("message")}</p>
      <Button onClick={reset}>{t("tryAgain")}</Button>
    </div>
  )
}

