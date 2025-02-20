"use client"

import { usePathname } from "@/i18n/routing"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type LoadingContextType = {
  isLoading: boolean
  startLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const startLoading = () => {
    console.log("Starting loading...") // Debug log
    setIsLoading(true)
  }

  // Reset loading state when pathname changes
  useEffect(() => {
    console.log("Path changed, ending loading...") // Debug log
    setIsLoading(false)
  }, [pathname])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)

