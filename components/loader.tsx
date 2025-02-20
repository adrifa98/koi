"use client"

import { useEffect, useState } from "react"
import { useLoading } from "./loading-provider"

export function Loader() {
  const { isLoading } = useLoading()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let hideTimeout: NodeJS.Timeout

    if (isLoading) {
      setVisible(true)
      setProgress(0)

      // Iniciamos el progreso
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          if (prev < 30) return prev + 2
          if (prev < 60) return prev + 1
          return prev + 0.5
        })
      }, 10)
    } else if (visible) {
      // Completamos el progreso
      setProgress(100)

      // Ocultamos después de la animación
      hideTimeout = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 200)
    }

    return () => {
      clearInterval(progressInterval)
      clearTimeout(hideTimeout)
    }
  }, [isLoading, visible])

  if (!visible) return null

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] h-0.5">
      <div
        className="h-full w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left",
          transition: isLoading ? "transform 100ms cubic-bezier(0.65, 0, 0.35, 1)" : "transform 200ms ease-out",
          backgroundSize: "200% 100%",
          animation: "gradient 2s ease infinite",
        }}
      />
    </div>
  )
}

