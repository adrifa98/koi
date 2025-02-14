"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"

import { Button } from "@/components/ui/button"
import type { TwitchStream } from "@/lib/types"
import type { SanityVideo } from "@/types/sanity"
import { VideoCard } from "./video-card"

interface VideoCarouselProps {
  title: string
  videosType: string
  initialVideos: (SanityVideo | TwitchStream)[]
}

export function VideoCarousel({ title, videosType, initialVideos }: VideoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Infinite Query para cargar videos
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["videos", videosType],
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams()
      if (pageParam) searchParams.set("cursor", pageParam)
      if (videosType) searchParams.set("type", videosType)
      searchParams.set("limit", "15")

      const response = await fetch(`/api/videos?${searchParams}`)
      if (!response.ok) throw new Error("Error fetching videos")
      return response.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [{ items: initialVideos, nextCursor: null }],
      pageParams: [""],
    },
  })

  // Intersection Observer para el infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "300px",
  })

  // Cargar más videos cuando llegamos al final
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Obtener todos los videos de las páginas cargadas
  const videos = data?.pages.flatMap((page) => page.items) ?? initialVideos

  const updateArrows = useCallback(() => {
    if (!containerRef.current) return

    requestAnimationFrame(() => {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current!
      const cardWidth = containerRef.current!.querySelector("[data-card]")?.clientWidth ?? 0
      const isAtStart = scrollLeft < cardWidth * 0.25
      const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1

      setShowLeftArrow(!isAtStart)
      setShowRightArrow(!isAtEnd)
    })
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
    if (!containerRef.current) return

    requestAnimationFrame(() => {
      const container = containerRef.current!
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
    })
  }, [])

  if (!videos?.length) return null

  return (
    <div className="group/carousel relative">
      <div className="ml-[60px]">
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
              paddingRight: "16px",
              width: "calc(100% + 60px)",
              overscrollBehaviorX: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {videos.map((video, index) => {
              const key = "user_login" in video ? video.user_login : video._id
              return (
                <div
                  key={key}
                  className="snap-start flex-none"
                  data-card
                  style={{
                    width: "var(--dynamic-card-width)",
                  }}
                  ref={index === videos.length - 5 ? loadMoreRef : undefined}
                >
                  <VideoCard video={video} priority={index < 2} isFirstCard={index === 0} />
                </div>
              )
            })}
          </div>

          {videos.length > 1 && (
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
              {(showRightArrow || hasNextPage) && (
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

