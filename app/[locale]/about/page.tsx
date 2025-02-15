"use client"

import { DistortionEffect } from "@/components/about/distortion-effect"
import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef } from "react"

gsap.registerPlugin(CustomEase, ScrollTrigger)

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const finalImageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const images = document.querySelectorAll(".floating-image")
    images.forEach((image, index) => {
      gsap.to(image, {
        yPercent: -10,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.4,
      })

      gsap.to(image, {
        rotate: 1.5,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      })
    })

    if (sectionRef.current && imagesRef.current && finalImageRef.current && textRef.current) {
      gsap.set([".side-image", ".center-image"], {
        opacity: 1,
        scale: 1,
      })
      gsap.set(finalImageRef.current, {
        opacity: 0,
        y: 0,
      })
      gsap.set(".distortion-wrapper", {
        opacity: 0,
      })
      gsap.set(".text-word", {
        opacity: 0,
        y: 20,
      })
      gsap.set(textRef.current, {
        y: 0,
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress

          if (progress <= 0.5) {
            const moveProgress = gsap.utils.clamp(0, 1, progress * 2)
            const blurProgress = gsap.utils.clamp(0, 1, (progress - 0.2) * 2.5)

            gsap.set(".left-image", {
              xPercent: moveProgress * 100,
              filter: `blur(${blurProgress * 20}px)`,
              scale: 1 - moveProgress * 0.1,
            })
            gsap.set(".right-image", {
              xPercent: moveProgress * -100,
              filter: `blur(${blurProgress * 20}px)`,
              scale: 1 - moveProgress * 0.1,
            })
            gsap.set(".center-image", {
              filter: `blur(${blurProgress * 20}px)`,
              scale: 1 - moveProgress * 0.1,
            })
          }

          if (progress > 0.25 && progress < 0.75) {
            const distortProgress = gsap.utils.clamp(0, 1, (progress - 0.25) * 2)
            gsap.set(".distortion-wrapper", {
              opacity: distortProgress,
            })
          }

          if (progress > 0.5 && progress < 0.75) {
            const fadeProgress = gsap.utils.clamp(0, 1, (progress - 0.5) * 4)
            gsap.set(".initial-images", {
              opacity: 1 - fadeProgress,
            })
            gsap.set(finalImageRef.current, {
              opacity: fadeProgress,
            })
          }

          if (progress >= 0.75) {
            const finalProgress = gsap.utils.clamp(0, 1, (progress - 0.75) * 4)

            // Move both final image and text up
            gsap.set(finalImageRef.current, {
              opacity: 1,
              y: -100 * finalProgress,
            })
            gsap.set(textRef.current, {
              y: -100 * finalProgress,
            })

            if (finalProgress > 0.2) {
              const words = document.querySelectorAll(".text-word")
              const totalWords = words.length
              const textProgress = (finalProgress - 0.2) / 0.8

              words.forEach((word, index) => {
                const wordStart = (index / totalWords) * 0.7
                const wordProgress = gsap.utils.clamp(0, 1, (textProgress - wordStart) * 3)

                gsap.set(word, {
                  opacity: wordProgress,
                  y: 20 * (1 - wordProgress),
                })
              })
            }
          }
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const text =
    "La unión de KOI, Movistar Riders y MAD Lions el 4 de enero de 2024, dio lugar a Movistar KOI, un equipo de esports que fusiona la institución y filosofía de Movistar Riders, la amplia base de fans e impacto mediático de KOI, junto con la estructura empresarial y el gen ganador de MAD Lions. Esta alianza ofrece un enfoque equilibrado entre estrategia competitiva y apoyo popular, posicionando a Movistar KOI como uno de los mayores contendientes en el ámbito global de los esports."

  return (
    <div className="min-h-[500vh] overflow-x-hidden">
      <div className="h-[100vh]" />
      <section ref={sectionRef} className="min-h-screen relative flex items-center justify-center">
        {/* Distortion effect wrapper */}
        <div className="distortion-wrapper fixed inset-0 w-full h-screen z-10">
          <DistortionEffect className="w-full h-full" />
        </div>

        {/* Text container moved outside distortion wrapper */}
        <div ref={textRef} className="absolute left-1/2 -translate-x-1/2 top-[70%] w-full z-[5] pb-40">
          <div className="relative max-w-4xl mx-auto px-4">
            <p className="text-3xl leading-relaxed text-black dark:text-white text-center pt-20">
              {text.split(" ").map((word, index) => (
                <span key={index} className="text-word inline-block mx-[0.2em]">
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Initial images */}
        <div ref={imagesRef} className="initial-images relative w-full h-full max-w-[90vw] mx-auto z-20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-8 w-full max-w-6xl px-4">
            <div className="side-image left-image floating-image w-[min(30vw,300px)] aspect-square">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <div className="absolute inset-0 mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-br mix-blend-soft-light" />
                <Image
                  src="/riders.png?height=300&width=300"
                  alt="Left image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="center-image floating-image w-[min(30vw,300px)] aspect-square">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <div className="absolute inset-0 mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-br mix-blend-soft-light" />
                <Image
                  src="/fkoi.png?height=300&width=300"
                  alt="Center image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="side-image right-image floating-image w-[min(30vw,300px)] aspect-square">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <div className="absolute inset-0 mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-br mix-blend-soft-light" />
                <Image
                  src="/mad-lions.png?height=300&width=300"
                  alt="Right image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final image */}
        <div
          ref={finalImageRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(30vw,300px)] aspect-square z-30"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <div className="absolute inset-0 mix-blend-color" />
            <Image
              src="/koi.png?height=300&width=300"
              alt="Final merged image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
      <div className="h-[300vh]" />
    </div>
  )
}

