"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type React from "react"

export function BlogPostNavigation() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("blog")

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(`/${locale}/blog`)
  }

  return (
    <Link href={`/${locale}/blog`} onClick={handleBack}>
      <Button variant="outline" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToBlog")}
      </Button>
    </Link>
  )
}

