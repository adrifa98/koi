"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Play, Plus, Share } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { memo, useCallback, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { CARD_HEIGHT, CARD_WIDTH, VIDEO_PROVIDERS } from "@/lib/constants"
import type { TwitchStream } from "@/lib/types"
import type { SanityVideo } from "@/types/sanity"

interface VideoCardProps {
  video: SanityVideo | TwitchStream
  priority?: boolean
  type?: "youtube" | "twitch"
}

function VideoCardComponent({ video, priority = false, type = "youtube" }: VideoCardProps) {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  })

  const isTwitch = type === "twitch"
  const videoId = isTwitch ? (video as TwitchStream).user_login : (video as SanityVideo).videoId

  const urls = useMemo(() => {
    if (isTwitch) {
      const stream = video as TwitchStream
      return {
        thumbnail: stream.thumbnail_url
          .replace("{width}", CARD_WIDTH.toString())
          .replace("{height}", CARD_HEIGHT.toString()),
        preview: VIDEO_PROVIDERS.twitch.embed(stream.user_login),
        share: VIDEO_PROVIDERS.twitch.share(stream.user_login),
      }
    }

    const vid = video as SanityVideo
    return {
      thumbnail: vid.thumbnailUrl || VIDEO_PROVIDERS.youtube.thumbnail(vid.videoId),
      preview: VIDEO_PROVIDERS.youtube.embed(vid.videoId),
      share: VIDEO_PROVIDERS.youtube.share(vid.videoId),
    }
  }, [video, isTwitch])

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: isTwitch ? (video as TwitchStream).title : (video as SanityVideo).title,
        url: urls.share,
      })
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }, [video, urls.share, isTwitch])

  const handleVideoClick = useCallback(() => {
    const path = isTwitch ? `tv/live/${videoId}` : `tv/watch/${videoId}`
    router.push(path)
  }, [router, videoId, isTwitch])

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdded(true)
    // Aquí iría la lógica para añadir a la watchlist
    setTimeout(() => setIsAdded(false), 2000) // Reset después de 2 segundos
  }, [])

  return (
    <TooltipProvider>
      <div
        ref={targetRef}
        className="relative flex-none w-80 [&:hover]:z-50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="origin-center"
          whileHover={{
            scale: isTwitch ? 1.15 : 1.2,
            zIndex: isHovering ? 50 : 0,
            transition: { duration: 0.3 },
          }}
        >
          <Card className="overflow-hidden cursor-pointer bg-card h-full" onClick={handleVideoClick}>
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-video relative bg-black">
                  <Image
                    src={urls.thumbnail || "/placeholder.svg"}
                    alt={isTwitch ? (video as TwitchStream).title : (video as SanityVideo).title}
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    className="object-cover w-full h-full"
                    priority={priority}
                  />

                  {isHovering && isIntersecting && (
                    <div className="absolute inset-0 z-20">
                      <iframe
                        src={urls.preview}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}

                  {/* Overlay con botón de play */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                    <Button size="icon" variant="ghost" className="rounded-full">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>

                  {/* Badges para streams de Twitch */}
                  {isTwitch && (
                    <>
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-30">
                        LIVE
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded z-30">
                        {(video as TwitchStream).viewer_count.toLocaleString()} viewers
                      </div>
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {isHovering && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-card border-t"
                    >
                      <div className="p-4 space-y-4">
                        <h3 className="font-semibold line-clamp-2 text-sm">
                          {isTwitch ? (video as TwitchStream).title : (video as SanityVideo).title}
                        </h3>
                        {isTwitch ? (
                          <div className="flex items-center gap-3">
                            <Image
                              src={(video as TwitchStream).profile_image_url || "/placeholder.svg"}
                              alt={(video as TwitchStream).user_name}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-[14px]">{(video as TwitchStream).user_name}</p>
                              <p className="text-xs text-muted-foreground">{(video as TwitchStream).game_name}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="secondary" onClick={handleShare}>
                                  <Share className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Share</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="secondary" onClick={handleAdd} className="relative">
                                  <AnimatePresence>
                                    {isAdded ? (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                      >
                                        <Check className="h-4 w-4 text-green-500" />
                                      </motion.div>
                                    ) : (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <Plus className="h-4 w-4" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{isAdded ? "Added to Watchlist" : "Add to Watchlist"}</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}

export const VideoCard = memo(VideoCardComponent)

