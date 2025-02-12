"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useRef } from "react"

import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { SCROLL_AMOUNT } from "@/lib/constants"
import { LiveCard } from "./live-card"

interface Stream {
  id: number
  title: string
  channelName: string
  viewers: number
}

interface LiveCarouselProps {
  title: string
  streams: Stream[]
}

export function LiveCarousel({ title, streams }: LiveCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Memoize streams array to prevent unnecessary re-renders
  const memoizedStreams = useMemo(() => streams, [streams])

  // Debounced scroll handler
  const debouncedScroll = useDebounce((direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, 100)

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
          {memoizedStreams.map((stream, index) => (
            <LiveCard key={stream.id} stream={stream} priority={index < 3} />
          ))}
        </div>

        <div className="absolute -left-4 top-10 bottom-20 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90 rounded-full"
            onClick={() => debouncedScroll("left")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute -right-4 top-10 bottom-20 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90 rounded-full"
            onClick={() => debouncedScroll("right")}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}

