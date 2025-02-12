"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Channel {
  id: number
  name: string
  avatar: string
  game: string
  viewers: number
  isLive: boolean
}

const SAMPLE_CHANNELS: Channel[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `Channel ${i + 1}`,
  avatar: `/placeholder.svg`,
  game: `Game ${i + 1}`,
  viewers: Math.floor(Math.random() * 10000),
  isLive: Math.random() > 0.3,
}))

export function ChannelSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: SAMPLE_CHANNELS.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 64,
    overscan: 5,
  })

  // 🔹 Al hacer hover, se expande y forzamos el recalculo del scroll
  useEffect(() => {
    if (isHovered) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.style.overflowY = "auto"
        }
      }, 100)
    } else {
      if (scrollRef.current) {
        scrollRef.current.style.overflowY = "hidden"
      }
    }
  }, [isHovered])

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded || isHovered ? 300 : 68 }}
      className="h-screen fixed left-0 top-0 bg-card border-r z-40 flex flex-col pt-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <AnimatePresence>
          {(isExpanded || isHovered) && (
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-semibold text-lg"
            >
            </motion.h2>
          )}
        </AnimatePresence>
        <motion.button
          className="p-2 rounded-full"
          animate={{ rotate: isExpanded || isHovered ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronRight />
        </motion.button>
      </div>

      {/* Contenedor de scroll con actualización dinámica */}
      <div
        ref={scrollRef}
        className="flex-1 transition-all overflow-hidden"
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
            const channel = SAMPLE_CHANNELS[virtualItem.index]
            return (
              <div
                key={channel.id}
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
                <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-accent cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={channel.avatar} loading="lazy" />
                        <AvatarFallback>{channel.name[0]}</AvatarFallback>
                      </Avatar>
                      {channel.isLive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium text-sm truncate">{channel.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{channel.game}</p>
                    </div>
                  </div>
                  {channel.isLive && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>{channel.viewers.toLocaleString()}</span>
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
