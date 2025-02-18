"use client"

import { differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns"
import { useEffect, useRef } from "react"

interface CountdownProps {
  targetDate: Date
  className?: string
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const countdownRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    const updateCountdown = () => {
      if (!countdownRef.current) return

      const now = new Date()
      const hoursUntilMatch = differenceInHours(targetDate, now)

      // Only show countdown if less than 24h away and in the future
      if (hoursUntilMatch < 24 && hoursUntilMatch >= 0) {
        const minutesUntilMatch = differenceInMinutes(targetDate, now) % 60
        const secondsUntilMatch = differenceInSeconds(targetDate, now) % 60

        // Format countdown as "23h 59m 59s" or "59m 59s" if less than an hour
        let countdown = ""
        if (hoursUntilMatch > 0) {
          countdown = `${hoursUntilMatch}h ${minutesUntilMatch}m ${secondsUntilMatch}s`
        } else if (minutesUntilMatch > 0) {
          countdown = `${minutesUntilMatch}m ${secondsUntilMatch}s`
        } else {
          countdown = `${secondsUntilMatch}s`
        }

        countdownRef.current.textContent = countdown
      }

      // Request next frame
      frameRef.current = requestAnimationFrame(updateCountdown)
    }

    // Start the animation
    updateCountdown()

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [targetDate]) // Only re-run effect if targetDate changes

  return <div ref={countdownRef} className={className} />
}

