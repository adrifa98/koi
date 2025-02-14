"use client"

import { ScrollArea, ScrollBar } from "@/app/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { TwitchStream } from "@/lib/types"
import { useLocale } from 'next-intl'
import { useRouter } from "next/navigation"
import { useCallback } from "react"
interface StoriesBarProps {
  streams: TwitchStream[]
}

export function StoriesBar({ streams }: StoriesBarProps) {
  const router = useRouter()
  const locale = useLocale();
  const handleStreamClick = useCallback(
    (stream: TwitchStream) => {
      if (stream.is_live) {
        router.push(`/${locale}/tv/live/${stream.user_login}`)
      }
    },
    [router],
  )

  return (
    <div className="md:hidden w-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-b sticky top-0 z-40">
      <ScrollArea className="w-full whitespace-nowrap py-4">
        <div className="flex w-max space-x-4 px-4">
          {streams.map((stream) => (
            <button
              key={stream.user_login}
              className="flex flex-col items-center space-y-1 py-2"
              onClick={() => handleStreamClick(stream)}
            >
              <div className="relative">
                <Avatar
                  className={`h-14 w-14 ${stream.is_live ? "ring-2 ring-red-500 ring-offset-2 ring-offset-background" : ""}`}
                >
                  <AvatarImage
                    src={stream.profile_image_url}
                    alt={stream.user_name}
                    className={!stream.is_live ? "grayscale" : ""}
                  />
                  <AvatarFallback>{stream.user_name[0]}</AvatarFallback>
                </Avatar>
                {stream.is_live && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
                )}
              </div>
              <span className="text-xs text-muted-foreground line-clamp-1 max-w-[64px]">{stream.user_name}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

