"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

export function IntroSection() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const words = textRef.current.querySelectorAll(".text-word")
    gsap.set(words, {
      opacity: 0,
      y: 50,
    })

    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top center+=100",
        end: "bottom center",
      },
    })
  }, [])

  return (
    <section className="min-h-[50vh] flex items-center justify-center px-4">
      <div ref={textRef} className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-tight md:leading-tight lg:leading-tight pt-48">
          {"Transformando el futuro de los esports a través de la innovación y el talento global."
            .split(" ")
            .map((word, index) => (
              <span key={index} className="text-word inline-block mx-[0.2em]">
                {word}
              </span>
            ))}
        </h1>
      </div>
    </section>
  )
}

