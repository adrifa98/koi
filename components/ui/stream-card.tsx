"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TwitchStream } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { useLocale } from "next-intl"

interface StreamCardProps {
  stream: TwitchStream
  className?: string
}

export function StreamCard({ stream, className = "" }: StreamCardProps) {
    const router = useRouter()
    const locale = useLocale()
    const handleStreamClick = useCallback(
    (stream: TwitchStream) => {
        if (stream.is_live) {
        router.push(`/${locale}/tv/live/${stream.user_login}`)
        }
    },
    [router, locale], // Added locale to dependencies
    )
  return (
    <Card onClick={() => handleStreamClick(stream)}
      className={cn(
        "w-[280px] bg-background/80 backdrop-blur border border-border/50 hover:bg-accent/50 transition-colors min-h-18",
        className, 
      )}
    >
      <CardContent className="p-3 flex items-center justify-between min-h-[70px]">
        <div className="flex items-center gap-2">
          <Image
            src={stream.profile_image_url || "/placeholder.svg"}
            alt={stream.user_name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{stream.user_name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{stream.game_name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="text-[12px] font-medium text-muted-foreground whitespace-nowrap">
              {stream.viewer_count.toLocaleString()}
            </div>
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

