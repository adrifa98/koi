"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslations } from "next-intl"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export function ValuesSection() {
  const t = useTranslations("club")
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ... (efectos se mantienen igual)

  const cards = [
    {
      number: "01",
      title: t("values.passion.title"),
      description: t("values.passion.description"),
      animation: "https://cdn.lordicon.com/fpipqhrr.json",
    },
    {
      number: "02",
      title: t("values.excellence.title"),
      description: t("values.excellence.description"),
      animation: "https://cdn.lordicon.com/rqsvgwdj.json",
    },
    {
      number: "03",
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
      animation: "https://cdn.lordicon.com/uukerzzv.json",
    },
    {
      number: "04",
      title: t("values.community.title"),
      description: t("values.community.description"),
      animation: "https://cdn.lordicon.com/hpxruznz.json",
    },
  ]

  return (
    <section className="relative mt-20">
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white py-8">
            {t("values.title")}
          </h1>
        </div>
      </div>

      {/* ... (resto del JSX se mantiene igual) */}
    </section>
  )
}

