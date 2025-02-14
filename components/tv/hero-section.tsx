"use client"

import gsap from "gsap"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import type { SanityVideo } from "@/types/sanity"

interface HeroSectionProps {
  latestVideo: SanityVideo
}

export function HeroSection({ latestVideo }: HeroSectionProps) {
  const router = useRouter()
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

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

  const handlePlay = () => {
    router.push(`/watch/${latestVideo.videoId}`)
  }

  return (
    <div ref={heroRef} className="relative h-[50vh] md:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          src={`https://www.youtube.com/embed/${latestVideo.videoId}?autoplay=1&controls=0&mute=1&playsinline=1&loop=1&playlist=${latestVideo.videoId}&modestbranding=1`}
          className="w-full h-full object-cover pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1.5)", // Scale up to cover the container
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60" />
      </div>
      <div className="relative container mx-8 h-full flex items-center px-4">
        <div className="max-w-2xl space-y-4 pt-0">
          <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            {latestVideo.title}
          </h1>
          <p
            ref={descriptionRef}
            className="text-base md:text-lg text-muted-foreground line-clamp-3 md:line-clamp-none"
          >
            {"Watch the latest content from Movistar KOI"}
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="font-semibold" onClick={handlePlay}>
              <Play className="mr-2 h-5 w-5" /> Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

