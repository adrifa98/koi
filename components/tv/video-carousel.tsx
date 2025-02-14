"use client"

import { useDebounce } from "@/hooks/use-debounce"
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
  channelName?: string
  initialVideos: (SanityVideo | TwitchStream)[]
}

export function VideoCarousel({ title, videosType, channelName, initialVideos }: VideoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isNearEnd, setIsNearEnd] = useState(false)
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0)

  // Infinite Query para cargar videos (solo para YouTube)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["videos", videosType, channelName],
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      // Si es Twitch, no hacer la petición
      if (videosType === "twitch") {
        return {
          items: initialVideos,
          nextCursor: null,
        }
      }

      const searchParams = new URLSearchParams()
      if (pageParam) searchParams.set("cursor", pageParam)
      if (videosType) searchParams.set("type", videosType)
      if (channelName) searchParams.set("channel", channelName)
      searchParams.set("limit", "15")

      const response = await fetch(`/api/videos?${searchParams}`)
      if (!response.ok) throw new Error("Error fetching videos")
      return response.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [
        {
          items: initialVideos.sort((a, b) => {
            if ("publishedAt" in a && "publishedAt" in b) {
              return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            }
            if ("viewer_count" in a && "viewer_count" in b) {
              return b.viewer_count - a.viewer_count
            }
            return 0
          }),
          nextCursor: videosType === "twitch" ? null : initialVideos.length >= 15 ? "15" : null,
        },
      ],
      pageParams: [""],
    },
  })

  // Intersection Observer para el infinite scroll con buffer zone
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

  // Obtener todos los videos
  const videos = videosType === "twitch" ? initialVideos : (data?.pages.flatMap((page) => page.items) ?? initialVideos)

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

    // Detectar si estamos cerca del final para precargar
    const isNearEndThreshold = scrollWidth - clientWidth - scrollLeft < cardWidth * 3
    setIsNearEnd(isNearEndThreshold)

    // Mantener la flecha derecha visible si:
    // 1. No estamos al final del scroll O
    // 2. Hay más páginas por cargar O
    // 3. Estamos cargando la siguiente página
    const shouldShowRightArrow = !isAtEnd || hasNextPage || isFetchingNextPage

    setShowLeftArrow(!isAtStart)
    setShowRightArrow(shouldShowRightArrow)
  }, [hasNextPage, isFetchingNextPage])

  // Efecto para precargar cuando nos acercamos al final
  useEffect(() => {
    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isNearEnd, hasNextPage, isFetchingNextPage, fetchNextPage])

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

  // No mostrar el carousel si no hay videos
  if (!videos?.length) return null

  // Para streams en vivo, no mostrar infinite scroll si no hay suficientes items
  const showInfiniteScroll = videosType === "twitch" ? videos.length >= 15 : true

  return (
    <div className="group/carousel relative ml-2 md:ml-0">
      <div className="">
        <h2 className="text-2xl font-semibold mb-4 mt-[-100px]">{title}</h2>
      </div>

      <div className="relative overflow-visible">
        <div className="ml-[60px] relative overflow-visible">
          <div
            ref={containerRef}
            className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide pb-48 pt-10 snap-x snap-mandatory"
            style={{
              marginLeft: "-60px",
              paddingLeft: "0px",
              paddingRight: "60px",
              width: "calc(100% + 120px)",
              minWidth: "calc(var(--dynamic-card-width) + 120px)",
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
                  ref={showInfiniteScroll && index === videos.length - 5 ? loadMoreRef : undefined}
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

            {/* Loading placeholder */}
            {isFetchingNextPage && (
              <div
                className="snap-start flex-none animate-pulse bg-muted"
                style={{
                  width: "var(--dynamic-card-width)",
                  aspectRatio: "16/9",
                }}
              />
            )}
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
                    disabled={isScrolling}
                  >
                    <ChevronLeft className={`h-8 w-8 ${isScrolling ? "opacity-50" : ""}`} />
                  </Button>
                </div>
              )}
              {(showRightArrow || isFetchingNextPage) && (
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

