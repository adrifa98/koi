"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useVideoPreview(videoId: string) {
  const [isHovering, setIsHovering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Construir la URL del preview
  const previewUrl = `https://www.youtube.com/watch?v=${videoId}&t=30s`

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsHovering(true)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {
          // Manejar error de reproducción
          setIsHovering(false)
        })
      }
    }, 500)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  const handleVideoLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isHovering,
    isLoading,
    videoRef,
    previewUrl,
    handleMouseEnter,
    handleMouseLeave,
    handleVideoLoad,
  }
}

