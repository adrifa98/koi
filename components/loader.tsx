"use client"

import { useLoading } from "./loading-provider"

export function Loader() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted">
      <div className="h-full animate-progress bg-primary" />
    </div>
  )
}

