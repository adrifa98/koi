"use client"

import { ValueCard } from "@/components/about/value-card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export function ValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return

    const section = sectionRef.current
    const container = containerRef.current

    gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "center center",
        end: () => `+=${container.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const cards = [
    {
      number: "01",
      title: "Pasión",
      description:
        "Nuestra pasión por los esports impulsa la innovación y excelencia en cada aspecto de nuestra organización",
      animation: "https://cdn.lordicon.com/fpipqhrr.json",
    },
    {
      number: "02",
      title: "Competitividad",
      description:
        "Buscamos la excelencia en cada competición, impulsando el desarrollo del talento y la mejora continua",
      animation: "https://cdn.lordicon.com/rqsvgwdj.json",
    },
    {
      number: "03",
      title: "Responsabilidad social",
      description: "Comprometidos con el impacto positivo en la comunidad, promoviendo valores y desarrollo sostenible",
      animation: "https://cdn.lordicon.com/uukerzzv.json",
    },
    {
      number: "04",
      title: "Sostenibilidad",
      description:
        "Construimos un futuro sostenible para los esports, equilibrando el crecimiento con la responsabilidad ambiental",
      animation: "https://cdn.lordicon.com/hpxruznz.json",
    },
  ]

  return (
    <section className="relative">
      {/* Título de la sección */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white py-8">
            Nuestros valores
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div ref={sectionRef} className="relative min-h-screen text-black dark:text-white overflow-hidden">
        <div ref={containerRef} className="relative flex gap-4 px-6 md:px-[10vw] py-32 will-change-transform">
          {cards.map((card, index) => (
            <ValueCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

