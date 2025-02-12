"use client"

import { useCallback, useEffect, useRef } from "react"

// Add YouTube types
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string
          playerVars?: {
            autoplay?: number
            controls?: number
            mute?: number
            start?: number
            modestbranding?: number
            rel?: number
          }
          events?: {
            onReady?: (event: { target: YTPlayer }) => void
          }
        },
      ) => YTPlayer
    }
  }

  interface YTPlayer {
    destroy: () => void
    getCurrentTime: () => number
    playVideo: () => void
    pauseVideo: () => void
  }
}

interface YouTubePlayerProps {
  videoId: string
  startTime?: number
  onTimeUpdate?: (time: number) => void
  onPlayerReady?: (player: YTPlayer) => void
  className?: string
  muted?: boolean
  controls?: boolean
}

export function YouTubePlayer({
  videoId,
  startTime = 0,
  onTimeUpdate,
  onPlayerReady,
  className = "",
  muted = false,
  controls = true,
}: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer>()
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const initPlayer = useCallback(() => {
    if (!containerRef.current) return

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 1,
        start: Math.floor(startTime),
        controls: controls ? 1 : 0,
        mute: muted ? 1 : 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: { target: YTPlayer }) => {
          onPlayerReady?.(event.target)
          // Iniciar el intervalo para actualizar el tiempo
          intervalRef.current = setInterval(() => {
            const currentTime = event.target.getCurrentTime()
            onTimeUpdate?.(currentTime)
          }, 1000)
        },
      },
    })

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      playerRef.current?.destroy()
    }
  }, [videoId, startTime, onPlayerReady, onTimeUpdate, controls, muted])

  useEffect(() => {
    // Cargar la API de YouTube si aún no está cargada
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      window.onYouTubeIframeAPIReady = initPlayer
    } else {
      initPlayer()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      playerRef.current?.destroy()
    }
  }, [initPlayer])

  return <div ref={containerRef} className={className} />
}

