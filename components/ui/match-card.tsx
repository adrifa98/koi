"use client"

import { Countdown } from "@/components/calendar/countdown"
import { Link } from '@/i18n/routing'
import type { Match } from "@/lib/sanity/queries"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"


interface MatchCardProps {
  match: Match
  className?: string
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

function getMatchChannel(match: Match): string | null {
  // Add console.log to debug channel data
  console.log("Match channel data:", {
    matchChannel: match.channel,
    categoryChannel: match.category?.channel,
    matchId: match._id,
  })

  if (match.channel) return match.channel
  if (match.category?.channel) return match.category.channel
  return null
}

export default function MatchCard({ match, className = "" }: MatchCardProps) {
  const matchDate = new Date(match.matchDate)
  const matchStatus = getMatchStatus(match)
  const showCountdown = shouldShowCountdown(matchDate)
  const isLive = matchStatus.status === "LIVE"
  const channel = getMatchChannel(match)

  // Debug log for link generation
  console.log("Card link data:", {
    isLive,
    channel,
    willLink: isLive && channel ? `/tv/live/${channel}` : !isLive ? "/calendar" : null,
  })

  const getCardLink = () => {
    if (isLive && channel) {
      return `/tv/live/${channel}`
    }
    if (!isLive) {
      return "/calendar"
    }
    return null
  }

  const cardLink = getCardLink()
  const CardContent = (
    <div
      className={cn(
        "w-[280px] bg-background/80 backdrop-blur rounded-lg border border-border/50 hover:bg-accent/50 transition-colors min-h-18",
        className,
      )}
    >
      <div className="p-3 space-y-2 flex flex-col justify-center min-h-[70px]">
        {/* Category, Date and Format */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            {match.category?.image?.url && (
              <div className="relative h-3 w-3">
                <Image
                  src={match.category.image.url || "/placeholder.svg"}
                  alt={match.category.name.en}
                  fill
                  className="object-contain rounded-full"
                />
              </div>
            )}
            <span>{match.category?.name.en}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {format(matchDate, "HH:mm")} · {format(matchDate, "dd MMM", { locale: es })}
            </span>
            <span>·</span>
            <span>{match.bo}</span>
          </div>
        </div>

        {/* Teams and Score */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {match.team1.image?.url && (
              <div className="relative h-5 w-5 flex-shrink-0">
                <Image
                  src={match.team1.image.url || "/placeholder.svg"}
                  alt={match.team1.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-sm font-medium truncate">{match.team1.name}</span>
          </div>

          <div className="px-2">
            {isLive ? (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              </div>
            ) : showCountdown ? (
              <Countdown targetDate={matchDate} className="text-xs font-medium" />
            ) : (
              <span
                className={cn(
                  "text-xs font-medium",
                  matchStatus.status === "FINISHED" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {matchStatus.display}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">{match.team2.name}</span>
            {match.team2.image?.url && (
              <div className="relative h-5 w-5 flex-shrink-0">
                <Image
                  src={match.team2.image.url || "/placeholder.svg"}
                  alt={match.team2.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Return with appropriate link wrapper
  return cardLink ? <Link href={cardLink}>{CardContent}</Link> : CardContent
}

