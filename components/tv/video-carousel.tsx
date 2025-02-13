"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useRef } from "react"

import { Button } from "@/components/ui/button"
import { SCROLL_AMOUNT } from "@/lib/constants"
import type { SanityVideo } from "@/types/sanity"
import { VideoCard } from "./video-card"

interface VideoCarouselProps {
  title: string
  videos: SanityVideo[]
}

export function VideoCarousel({ title, videos }: VideoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [])

  if (videos.length === 0) return null

  return (
    <div className="py-16 space-y-4">
      <h2 className="text-2xl font-semibold px-4">{title}</h2>
      <div className="group relative">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-20 pt-10"
          style={{
            overscrollBehaviorX: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {videos.map((video, index) => (
            <VideoCard key={video._id} video={video} priority={index < 2} />
          ))}
        </div>
        {videos.length > 1 && (
          <>
            <div className="absolute -left-4 top-10 bottom-20 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90 rounded-full"
                onClick={() => handleScroll("left")}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>
            <div className="absolute -right-4 top-10 bottom-20 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90 rounded-full"
                onClick={() => handleScroll("right")}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

