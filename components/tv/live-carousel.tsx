"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import type { TwitchStream } from "@/lib/types"
import { VideoCard } from "./video-card"

interface LiveCarouselProps {
  title: string
  streams: TwitchStream[]
}

export function LiveCarousel({ title, streams }: LiveCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const updateArrows = useCallback(() => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    // Solo mostrar la flecha izquierda si hemos scrolleado más del 25% del ancho de una card
    const cardWidth = containerRef.current.querySelector("[data-card]")?.clientWidth ?? 0
    const isAtStart = scrollLeft < cardWidth * 0.25
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1

    setShowLeftArrow(!isAtStart)
    setShowRightArrow(!isAtEnd)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      requestAnimationFrame(updateArrows)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateArrows)
    updateArrows()

    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateArrows)
    }
  }, [updateArrows])

  const handleScroll = useCallback((direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current
      const cardWidth = container.querySelector("[data-card]")?.clientWidth ?? 0
      const gap = 8 // gap-2 en pixels
      const scrollAmount = cardWidth + gap
      const currentScroll = container.scrollLeft
      const targetScroll =
        direction === "left"
          ? Math.floor(currentScroll / scrollAmount) * scrollAmount - scrollAmount
          : Math.ceil(currentScroll / scrollAmount) * scrollAmount + scrollAmount

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }, [])

  if (streams.length === 0) return null

  return (
    <div className="group/carousel relative">
      <div className="ml-[60px]">
        <h2 className="text-2xl font-semibold mb-4 mt-[-100px]">{title}</h2>
      </div>

      <div className="relative overflow-visible">
        {/* Contenedor principal con padding fijo */}
        <div className="ml-[60px] relative overflow-visible">
          {/* Contenedor del scroll con margen negativo para permitir scroll completo */}
          <div
            ref={containerRef}
            className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide pb-48 pt-10 snap-x snap-mandatory"
            style={{
              marginLeft: "-60px",
              paddingLeft: "60px",
              paddingRight: "16px",
              width: "calc(100% + 60px)",
              overscrollBehaviorX: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {streams.map((stream, index) => (
              <div
                key={stream.user_login}
                className="snap-start flex-none"
                data-card
                style={{
                  width: "var(--dynamic-card-width)",
                }}
              >
                <VideoCard video={stream} priority={index < 2} type="twitch" isFirstCard={index === 0} />
              </div>
            ))}
          </div>

          {streams.length > 1 && (
            <>
              {showLeftArrow && (
                <div
                  className="absolute left-0 top-10 h-[200px] w-16 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(20, 20, 20) 0%, rgba(20, 20, 20, 0.7) 50%, transparent 100%)",
                    transform: "translateX(-60px)",
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[200px] w-16 rounded-none hover:bg-transparent"
                    onClick={() => handleScroll("left")}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                </div>
              )}
              {showRightArrow && (
                <div
                  className="absolute right-0 top-10 h-[200px] w-16 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(-90deg, rgb(20, 20, 20) 0%, rgba(20, 20, 20, 0.7) 50%, transparent 100%)",
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[200px] w-16 rounded-none hover:bg-transparent"
                    onClick={() => handleScroll("right")}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

