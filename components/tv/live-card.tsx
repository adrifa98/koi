"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Heart, Play, Share, Users } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDebounce } from "@/hooks/use-debounce"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { CARD_HEIGHT, CARD_WIDTH, HOVER_DELAY, PREVIEW_DURATION, VIDEO_PROVIDERS } from "@/lib/constants"

interface LiveCardProps {
  stream: {
    id: number
    title: string
    channelName: string
    viewers: number
  }
  priority?: boolean
}

function LiveCardComponent({ stream, priority = false }: LiveCardProps) {
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  })

  // Memoize URLs
  const urls = useMemo(
    () => ({
      thumbnail: VIDEO_PROVIDERS.twitch.thumbnail(stream.channelName),
      preview: VIDEO_PROVIDERS.twitch.embed(stream.channelName),
      share: VIDEO_PROVIDERS.twitch.share(stream.channelName),
    }),
    [stream.channelName],
  )

  // Debounced hover handlers
  const debouncedStartPreview = useDebounce(() => {
    setShowPreview(true)
  }, HOVER_DELAY)

  const debouncedStopPreview = useDebounce(() => {
    setShowPreview(false)
  }, HOVER_DELAY)

  useEffect(() => {
    let previewTimer: NodeJS.Timeout

    if (isHovering) {
      debouncedStartPreview()
      previewTimer = setTimeout(() => {
        setShowPreview(false)
      }, PREVIEW_DURATION)
    } else {
      debouncedStopPreview()
    }

    return () => {
      clearTimeout(previewTimer)
      debouncedStartPreview.cancel?.()
      debouncedStopPreview.cancel?.()
    }
  }, [isHovering, debouncedStartPreview, debouncedStopPreview])

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: stream.title,
        url: urls.share,
      })
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }, [stream.title, urls.share])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  const handleStreamClick = useCallback(() => {
    router.push(`tv/live/${stream.channelName}`)
  }, [router, stream.channelName])

  // Card animations
  const cardAnimations = useMemo(
    () => ({
      whileHover: {
        scale: 1.4,
        zIndex: 50,
        translateY: -50,
        transition: { duration: 0.3 },
      },
    }),
    [],
  )

  return (
    <TooltipProvider>
      <motion.div
        ref={targetRef}
        className="relative flex-none w-80 first:pl-0 last:pr-4"
        initial={false}
        onHoverStart={handleMouseEnter}
        onHoverEnd={handleMouseLeave}
        {...cardAnimations}
      >
        <Card className="overflow-hidden cursor-pointer bg-card" onClick={handleStreamClick}>
          <CardContent className="p-0">
            <motion.div className="relative" layoutId={`live-card-${stream.id}`}>
              <div className="aspect-video relative">
                <Image
                  src={urls.thumbnail || "/placeholder.svg"}
                  alt={stream.title}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  className={`object-cover w-full h-full transition-opacity duration-300 ${
                    showPreview ? "opacity-0" : "opacity-100"
                  }`}
                  loading={priority ? "eager" : "lazy"}
                  priority={priority}
                />

                {/* Live Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  LIVE
                </div>

                {/* Viewers Count */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {stream.viewers.toLocaleString()}
                </div>

                {/* Preview con overlay para prevenir interacción */}
                <AnimatePresence>
                  {showPreview && isIntersecting && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative w-full h-full">
                        <iframe src={urls.preview} className="w-full h-full" allow="autoplay" />
                        {/* Overlay transparente para prevenir interacción */}
                        <div className="absolute inset-0" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Overlay con botón de play */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>

              {/* Información expandida en hover */}
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute w-full bg-card border-t"
                  >
                    <div className="p-4 space-y-4">
                      <h3 className="font-semibold line-clamp-2">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.channelName}</p>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare()
                              }}
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Aquí iría la lógica para seguir al canal
                              }}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow Channel</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}

export const LiveCard = memo(LiveCardComponent)

