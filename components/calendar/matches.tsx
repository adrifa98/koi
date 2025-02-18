"use client"

import { Countdown } from "@/components/calendar/countdown"
import { Link } from '@/i18n/routing'
import { fetchMoreMatches } from "@/lib/actions"
import type { Match } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import type { DateRange } from "react-day-picker"

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

interface MatchesProps {
  matches: Match[]
  selectedCategories: string[]
  dateRange?: DateRange
}

function getMatchStatus(match: Match) {
  const matchDate = new Date(match.matchDate)
  const now = new Date()

  let duration = 0
  switch (match.bo) {
    case "BO1":
      duration = 60 * 60 * 1000
      break
    case "BO3":
      duration = 2.5 * 60 * 60 * 1000
      break
    case "BO5":
      duration = 4 * 60 * 60 * 1000
      break
    default:
      duration = 60 * 60 * 1000
  }

  const matchEndTime = new Date(matchDate.getTime() + duration)

  if (matchDate > now) {
    return {
      status: "UPCOMING",
      display: "VS",
    }
  }

  if (now >= matchDate && now <= matchEndTime) {
    return {
      status: "LIVE",
      display: "EN DIRECTO",
    }
  }

  if (
    match.team1.score !== undefined &&
    match.team2.score !== undefined &&
    match.team1.score !== null &&
    match.team2.score !== null
  ) {
    return {
      status: "FINISHED",
      display: `${match.team1.score}-${match.team2.score}`,
    }
  }

  return {
    status: "FINISHED",
    display: "FINALIZADO",
  }
}

function shouldShowCountdown(matchDate: Date): boolean {
  const now = new Date()
  const hoursUntilMatch = Math.floor((matchDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  return hoursUntilMatch < 24 && hoursUntilMatch >= 0
}

export function Matches({ matches: initialMatches, selectedCategories, dateRange }: MatchesProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreBefore, setHasMoreBefore] = useState(true)
  const [hasMoreAfter, setHasMoreAfter] = useState(true)
  const [initialScrollDone, setInitialScrollDone] = useState(false)
  const [currentDirection, setCurrentDirection] = useState<"before" | "after" | null>(null)
  const [, setTimeUpdate] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const currentMatchRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)
  const loadingRef = useRef(false)
  const lastLoadTime = useRef(Date.now())

  useEffect(() => {
    setMatches(initialMatches)
  }, [initialMatches])

  useEffect(() => {
    if (!initialScrollDone && currentMatchRef.current && matches.length > 0) {
      setTimeout(() => {
        currentMatchRef.current?.scrollIntoView({ behavior: "instant", block: "center" })
        setInitialScrollDone(true)
      }, 100)
    }
  }, [matches, initialScrollDone])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate((prev) => prev + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadMore = useCallback(
    async (direction: "before" | "after") => {
      const hasMore = direction === "before" ? hasMoreBefore : hasMoreAfter

      if (loadingRef.current || !hasMore) return

      const now = Date.now()
      if (now - lastLoadTime.current < 1000) return

      lastLoadTime.current = now
      loadingRef.current = true
      setIsLoading(true)
      setCurrentDirection(direction)

      try {
        const referenceMatch = direction === "before" ? matches[0] : matches[matches.length - 1]
        if (!referenceMatch) return

        const newMatches = await fetchMoreMatches(direction, referenceMatch.matchDate)

        if (newMatches.length === 0) {
          if (direction === "before") {
            setHasMoreBefore(false)
          } else {
            setHasMoreAfter(false)
          }
          return
        }

        setMatches((prev) => {
          const updatedMatches = direction === "before" ? [...newMatches, ...prev] : [...prev, ...newMatches]

          if (direction === "before") {
            const oldScrollHeight = document.documentElement.scrollHeight
            const oldScrollTop = window.scrollY

            requestAnimationFrame(() => {
              const newScrollHeight = document.documentElement.scrollHeight
              const scrollDiff = newScrollHeight - oldScrollHeight
              window.scrollTo(0, oldScrollTop + scrollDiff)
            })
          }

          return updatedMatches
        })
      } catch (error) {
        console.error("Error loading matches:", error)
        if (direction === "before") {
          setHasMoreBefore(false)
        } else {
          setHasMoreAfter(false)
        }
      } finally {
        loadingRef.current = false
        setIsLoading(false)
        setCurrentDirection(null)
      }
    },
    [matches, hasMoreBefore, hasMoreAfter],
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = debounce(() => {
      if (loadingRef.current) return

      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const isScrollingUp = scrollTop < lastScrollTop.current

      lastScrollTop.current = scrollTop

      const distanceFromTop = scrollTop
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      const topThreshold = window.innerHeight * 0.3
      const bottomThreshold = window.innerHeight * 0.3

      if (isScrollingUp && distanceFromTop < topThreshold && hasMoreBefore) {
        void loadMore("before")
      } else if (!isScrollingUp && distanceFromBottom < bottomThreshold && hasMoreAfter) {
        void loadMore("after")
      }
    }, 150)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore, hasMoreBefore, hasMoreAfter])

  const getCurrentMatchIndex = () => {
    const now = new Date()
    let closestIndex = 0
    let minDiff = Number.POSITIVE_INFINITY

    matches.forEach((match, index) => {
      const matchDate = new Date(match.matchDate)
      const diff = Math.abs(matchDate.getTime() - now.getTime())
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = index
      }
    })

    return closestIndex
  }

  const filteredMatches = matches.filter((match) => {
    const matchDate = new Date(match.matchDate)
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(match.category?.slug.current)
    const dateMatch = !dateRange?.from || !dateRange?.to || (matchDate >= dateRange.from && matchDate <= dateRange.to)
    return categoryMatch && dateMatch
  })

  if (filteredMatches.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No matches found for the selected filters</p>
      </div>
    )
  }

  const currentMatchIndex = getCurrentMatchIndex()

  const MatchCard = ({ match }: { match: Match }) => {
    const matchDate = new Date(match.matchDate)
    const matchStatus = getMatchStatus(match)
    const showCountdown = shouldShowCountdown(matchDate)
    const isLive = matchStatus.status === "LIVE"

    // Get channel with explicit checks
    let channel = null
    if (match.channel) {
      channel = match.channel
    } else if (match.categoryChannel) {
      channel = match.categoryChannel
    } else if (match.category?.channel) {
      channel = match.category.channel
    }

    const CardContent = (
      <div className="w-full bg-card p-4 rounded-lg border transition-colors hover:bg-accent">
        <div className="flex items-center gap-4">
          {/* Date/Time/Countdown Section */}
          <div className="hidden sm:block">
            {showCountdown ? (
              <Countdown targetDate={matchDate} className="text-sm font-medium" />
            ) : (
              <div className="text-center">
                <div className="text-xl font-bold">{format(matchDate, "HH:mm")}</div>
                <div className="text-xs text-muted-foreground">{format(matchDate, "dd MMM", { locale: es })}</div>
              </div>
            )}
          </div>

          {/* Teams and Score Section */}
          <div className="flex-1 grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-center">
            {/* Team 1 */}
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="text-right">
                <p className="font-semibold">{match.team1.name}</p>
              </div>
              {match.team1.image?.url && (
                <div className="relative h-8 w-8">
                  <Image
                    src={match.team1.image.url || "/placeholder.svg"}
                    alt={match.team1.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Match Status */}
            <div className="flex items-center justify-center">
              {isLive ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-500">{matchStatus.display}</span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                </div>
              ) : (
                <span
                  className={cn("text-sm font-medium", matchStatus.status === "FINISHED" && "text-muted-foreground")}
                >
                  {matchStatus.display}
                </span>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              {match.team2.image?.url && (
                <div className="relative h-8 w-8">
                  <Image
                    src={match.team2.image.url || "/placeholder.svg"}
                    alt={match.team2.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold">{match.team2.name}</p>
              </div>
            </div>
          </div>

          {/* Category and Format */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            {match.category?.image?.url && (
              <div className="relative h-4 w-4">
                <Image
                  src={match.category.image.url || "/placeholder.svg"}
                  alt={match.category.name.en}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <span>{match.category?.name.en}</span>
            <span>•</span>
            <span>{match.bo}</span>
          </div>
        </div>

        {/* Mobile Date/Category/Format */}
        <div className="flex items-center justify-between mt-2 sm:hidden">
          <div>
            {showCountdown ? (
              <Countdown targetDate={matchDate} className="text-xs font-medium" />
            ) : (
              <div className="text-sm text-muted-foreground">
                {format(matchDate, "HH:mm")} · {format(matchDate, "dd MMM", { locale: es })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {match.category?.image?.url && (
              <div className="relative h-3 w-3">
                <Image
                  src={match.category.image.url || "/placeholder.svg"}
                  alt={match.category.name.en}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <span>{match.category?.name.en}</span>
            <span>•</span>
            <span>{match.bo}</span>
          </div>
        </div>
      </div>
    )

    // Return with appropriate link wrapper - only live matches get links
    if (isLive && channel) {
      return (
        <Link href={`/tv/live/${channel}`} className="block">
          {CardContent}
        </Link>
      )
    }

    // All other matches (past or upcoming) return without link
    return CardContent
  }

  return (
    <div className="relative min-h-[500px]" ref={containerRef}>
      {isLoading && currentDirection === "before" && (
        <div className="sticky top-0 z-10 flex justify-center bg-background/80 py-4 backdrop-blur">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="space-y-4">
        {filteredMatches.map((match, index) => (
          <div
            key={match._id}
            ref={index === currentMatchIndex ? currentMatchRef : null}
            className={cn(index === currentMatchIndex && "ring-2 ring-primary rounded-lg")}
          >
            <MatchCard match={match} />
          </div>
        ))}
      </div>

      {isLoading && currentDirection === "after" && (
        <div className="sticky bottom-0 z-10 flex justify-center bg-background/80 py-4 backdrop-blur">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

