"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
      </div>
    </main>
  )
}

