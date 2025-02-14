"use client"

import gsap from "gsap"
import { Info, Play } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.from(heroRef.current, {
      opacity: 0,
      duration: 1,
    })
      .from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
      })
      .from(
        descriptionRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4",
      )
  }, [])

  return (
    <div ref={heroRef} className="relative h-[50vh] md:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <video autoPlay muted loop className="h-full w-full object-cover" poster="/placeholder.svg">
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60" />
      </div>
      <div className="relative container mx-auto h-full flex items-center px-4">
        <div className="max-w-2xl space-y-4 pt-16">
          <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Tears of Steel
          </h1>
          <p
            ref={descriptionRef}
            className="text-base md:text-lg text-muted-foreground line-clamp-3 md:line-clamp-none"
          >
            In an apocalyptic future, a group of soldiers and scientists takes refuge in Amsterdam to try to understand
            what was destroyed the world.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="font-semibold">
              <Play className="mr-2 h-5 w-5" /> Play
            </Button>
            <Button size="lg" variant="secondary" className="font-semibold">
              <Info className="mr-2 h-5 w-5" /> More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

