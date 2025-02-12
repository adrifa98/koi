"use client"

import { Button } from "@/components/ui/button"
import { useVideoPlayer } from "@/contexts/video-player-context"
import { motion, type PanInfo } from "framer-motion"
import { Maximize2, Volume2, VolumeX, X } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { YouTubePlayer } from "./youtube-player"

export function MiniPlayer() {
  const { state, closeMiniPlayer, maximizeMiniPlayer, updateTimestamp } = useVideoPlayer()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false)
      setPosition({
        x: position.x + info.offset.x,
        y: position.y + info.offset.y,
      })
    },
    [position],
  )

  if (!state.videoId || !state.isMiniPlayerOpen) return null

  return (
    <motion.div
      ref={constraintsRef}
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={{
          x: position.x,
          y: position.y,
        }}
        className="relative group"
      >
        <div className="bg-card rounded-lg shadow-lg overflow-hidden w-[320px]">
          {/* Header con título y controles */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white truncate pr-4">{state.title}</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  onClick={maximizeMiniPlayer}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  onClick={closeMiniPlayer}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="aspect-video bg-black">
            <YouTubePlayer
              videoId={state.videoId}
              startTime={state.timestamp}
              onTimeUpdate={updateTimestamp}
              className="w-full h-full"
              muted={isMuted}
              controls={false}
            />
          </div>

          {/* Overlay para drag */}
          {isDragging && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-sm">Moviendo reproductor...</div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

