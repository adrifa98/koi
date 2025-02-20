"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function TeamSection() {
  const t = useTranslations("shop")

  return (
    <section className="relative overflow-hidden bg-black py-60">
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("team.title")}</h2>
          <p className="mt-4 text-lg text-gray-300">{t("team.description")}</p>
          <Button size="lg" className="mt-8">
            {t("team.shopNow")}
          </Button>
        </div>
      </div>
      <div className="absolute inset-0">
        <Image src="/shop/pro.webp" alt="Team" fill className="object-cover opacity-50" priority />
      </div>
    </section>
  )
}

