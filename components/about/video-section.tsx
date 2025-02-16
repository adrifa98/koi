"use client"

import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

export function VideoSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => setIsPlaying(false)

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("error", handleError)

    if (videoRef.current) {
      setIsPlaying(!videoRef.current.paused)
    }

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("error", handleError)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.5,
      },
    )

    observer.observe(containerRef.current)

    // Parallax effect removed

    return () => {
      observer.disconnect()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  useEffect(() => {
    if (!videoRef.current || !isInView) return

    // Only auto-play if the video is currently paused
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {
        // Handle auto-play being blocked by browser
        console.log("Auto-play blocked")
      })
    }
  }, [isInView])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return

    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section className="relative md:flex items-center justify-center overflow-hidden mb-[-300px] md:mb-[-150px]">
      <div ref={containerRef} className="relative w-[95%] aspect-[21/9] mx-auto mb-20 mt-40">
        {/* Video container with parallax */}
        <div className="relative w-full h-full overflow-hidden rounded-3xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/about/video.mp4" type="video/mp4" />
          </video>

          {/* Controls overlay */}
          <div className="absolute top-10 right-10 flex items-center gap-6 z-10 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-20 h-20"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-20 h-20"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-10 w-10" /> : <Volume2 className="h-10 w-10" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

