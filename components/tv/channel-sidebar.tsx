"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { TwitchStream } from "@/lib/types"

interface ChannelSidebarProps {
  streams: TwitchStream[]
}

export function ChannelSidebar({ streams }: ChannelSidebarProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: streams.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 64,
    overscan: 5,
  })

  const handleStreamClick = useCallback(
    (stream: TwitchStream) => {
      if (stream.is_live) {
        router.push(`/live/${stream.user_login}`)
      }
    },
    [router],
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.overflowY = isHovered ? "auto" : "hidden"
    }
  }, [isHovered])

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded || isHovered ? 290 : 60 }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="h-screen fixed left-0 top-0 bg-card border-r z-40 flex-col transition-all hidden md:flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {(isExpanded || isHovered) && <h2 className="font-semibold">Followed Channels</h2>}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Expandir o contraer la barra lateral"
        >
          {isExpanded || isHovered ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {/* Contenedor de scroll dinámico */}
      <div
        ref={scrollRef}
        className={`flex-1 transition-all ${isHovered ? "overflow-auto" : "overflow-hidden"}`}
        style={{
          maxHeight: "calc(100vh - 4rem)",
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const stream = streams[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div
                  className={`flex items-center justify-between gap-3 p-2 rounded-md hover:bg-accent cursor-pointer group ${
                    stream.is_live ? "opacity-100" : "opacity-60"
                  }`}
                  onClick={() => handleStreamClick(stream)}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className={`h-10 w-10 ${stream.is_live ? "ring-1 ring-red-500 ring-offset-2 ring-offset-background" : ""}`}>
                        <AvatarImage src={stream.profile_image_url} className={!stream.is_live ? "grayscale" : ""} />
                        <AvatarFallback>{stream.user_name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium text-sm truncate">{stream.user_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{stream.game_name}</p>
                    </div>
                  </div>

                  {/* Viewers alineados a la derecha */}
                  {stream.is_live && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>{stream.viewer_count.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.aside>
  )
}

