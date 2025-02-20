"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

type LoadingContextType = {
  isLoading: boolean
  currentRoute: string
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  currentRoute: "",
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [currentRoute, setCurrentRoute] = useState(pathname)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const startLoading = () => {
      setIsLoading(true)
      setCurrentRoute(pathname)
    }

    const stopLoading = () => {
      timeoutId = setTimeout(() => {
        setIsLoading(false)
      }, 1000) // Mantenemos el loader un poco más para asegurar una transición suave
    }

    startLoading()
    stopLoading()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [pathname])

  return <LoadingContext.Provider value={{ isLoading, currentRoute }}>{children}</LoadingContext.Provider>
}

export const useLoading = () => useContext(LoadingContext)

