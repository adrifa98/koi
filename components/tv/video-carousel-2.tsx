"use client"

import { VideoCard } from "@/components/tv/video-card"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import type { TwitchStream } from "@/lib/types"
import type { SanityVideo } from "@/types/sanity"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface VideoCarouselProps {
  title: string
  videosType: string
  channelName?: string
  initialVideos: (SanityVideo | TwitchStream)[]
}

export function VideoCarousel({ title, videosType, channelName, initialVideos }: VideoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0)

  const updateArrows = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container
    const cardWidth = container.querySelector("[data-card]")?.clientWidth ?? 0
    const gap = 8 // gap-2 en pixels
    const isAtStart = scrollLeft < cardWidth * 0.25
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1

    // Calculate which card is first visible based on scroll position
    const newFirstVisibleIndex = Math.floor(scrollLeft / (cardWidth + gap))
    setFirstVisibleIndex(newFirstVisibleIndex)

    setShowLeftArrow(!isAtStart)
    setShowRightArrow(!isAtEnd)
  }, [])

  const debouncedScroll = useDebounce(() => {
    requestAnimationFrame(updateArrows)
  }, 100)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      debouncedScroll()
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateArrows)
    updateArrows()

    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateArrows)
      debouncedScroll.cancel?.()
    }
  }, [updateArrows, debouncedScroll])

  const handleScroll = useCallback(
    (direction: "left" | "right") => {
      if (!containerRef.current || isScrolling) return

      setIsScrolling(true)
      const container = containerRef.current
      const cardWidth = container.querySelector("[data-card]")?.clientWidth ?? 0
      const gap = 8
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

      // Reset scrolling state after animation
      setTimeout(() => {
        setIsScrolling(false)
        updateArrows()
      }, 500)
    },
    [isScrolling, updateArrows],
  )

  if (!initialVideos?.length) return null

  return (
    <div className="group/carousel relative">
      <div className="ml-[60px] md:ml-[60px] px-4 md:px-0">
        <h2 className="text-2xl font-semibold mb-4 mt-[-100px]">{title}</h2>
      </div>

      <div className="relative overflow-visible">
        <div className="ml-[60px] relative overflow-visible">
          <div
            ref={containerRef}
            className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide pb-48 pt-10 snap-x snap-mandatory"
            style={{
              marginLeft: "-60px",
              paddingLeft: "60px",
              paddingRight: "60px",
              width: "calc(100% + 120px)",
              minWidth: "calc(var(--dynamic-card-width) + 120px)",
              overscrollBehaviorX: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {initialVideos.map((video, index) => {
              const key = "user_login" in video ? video.user_login : video._id
              return (
                <div
                  key={key}
                  className="snap-start flex-none"
                  data-card
                  style={{
                    width: "var(--dynamic-card-width)",
                  }}
                >
                  <VideoCard
                    video={video}
                    priority={index < 2}
                    type={videosType as "youtube" | "twitch"}
                    isFirstCard={index === firstVisibleIndex}
                  />
                </div>
              )
            })}
          </div>

          {initialVideos.length > 1 && (
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
                    disabled={isScrolling}
                  >
                    <ChevronLeft className={`h-8 w-8 ${isScrolling ? "opacity-50" : ""}`} />
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
                    disabled={isScrolling}
                  >
                    <ChevronRight className={`h-8 w-8 ${isScrolling ? "opacity-50" : ""}`} />
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

