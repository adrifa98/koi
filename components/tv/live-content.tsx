"use client"

import { ArrowLeft, Heart, Share2, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { VIDEO_PROVIDERS } from "@/lib/constants"
import type { TwitchStream } from "@/lib/types"

interface LiveContentProps {
  stream: TwitchStream
}

export function LiveContent({ stream }: LiveContentProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.share({
        title: stream.title,
        url: window.location.href,
      })
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  return (
    <div className="md:ml-[80px]">
      <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto">
        {/* Main Content */}
        <div className="flex-1">
          <div className="relative">
            <div className="w-full bg-black aspect-video">
              <iframe
                src={VIDEO_PROVIDERS.twitch.embedFull(stream.user_login)}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
            <Link href="/" className="absolute top-4 left-4 lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
          </div>

          <div className="p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={stream.profile_image_url} />
                  <AvatarFallback>{stream.user_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{stream.user_name}</span>
                  <span className="text-sm text-muted-foreground">{stream.game_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="icon">
                  <Users className="h-4 w-4" />
                  <span className="sr-only">{stream.viewer_count.toLocaleString()} viewers</span>
                </Button>
                <Button variant="secondary" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="secondary" size="icon" onClick={() => setIsFollowing(!isFollowing)}>
                  <Heart className={`h-4 w-4 ${isFollowing ? "fill-current text-red-500" : ""}`} />
                  <span className="sr-only">{isFollowing ? "Unfollow" : "Follow"}</span>
                </Button>
              </div>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold mb-4">{stream.title}</h1>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:w-[400px] h-[calc(100vh-80px)] lg:h-auto">
          <iframe
            src={`https://www.twitch.tv/embed/${stream.user_login}/chat?darkpopout&parent=${process.env.NEXT_PUBLIC_VERCEL_URL || "localhost"}`}
            className="w-full h-full min-h-[600px]"
          />
        </div>
      </div>
    </div>
  )
}

