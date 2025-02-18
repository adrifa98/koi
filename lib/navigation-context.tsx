"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface NavigationContextType {
  startNavigation: () => void
  endNavigation: () => void
  isNavigating: boolean
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)

  const startNavigation = () => setIsNavigating(true)
  const endNavigation = () => setIsNavigating(false)

  return (
    <NavigationContext.Provider value={{ startNavigation, endNavigation, isNavigating }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}

