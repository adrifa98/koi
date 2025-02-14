"use client"

import { ArrowLeft, ExternalLink, Heart, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CopyLink } from "@/components/tv/copy-link"; // Updated import path
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VIDEO_PROVIDERS } from "@/lib/constants";
import type { TwitchStream } from "@/lib/types";
import { useLocale, useTranslations } from 'next-intl';

interface LiveContentProps {
  stream: TwitchStream
}

export function LiveContent({ stream }: LiveContentProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }
  const locale = useLocale();
  const t = useTranslations('live');
  return (
    <div className="md:ml-[80px] w-[90%] mx-auto">
      <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto gap-4">
        {/* Main Content */}
        <div className="flex-1">
          <div className="relative">
            <div className="w-full bg-black aspect-video rounded-xl overflow-hidden">
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

          <div className="py-4">
            <h1 className="text-xl lg:text-2xl font-bold mb-4">{stream.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={`${locale}/creators/${stream.user_login}`} className="flex items-center gap-4 hover:opacity-80">
                <Avatar
                  className={`h-10 w-10 ${stream.is_live ? "ring-1 ring-red-500 ring-offset-2 ring-offset-background" : ""}`}
                >
                  <AvatarImage src={stream.profile_image_url} />
                  <AvatarFallback>{stream.user_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{stream.user_name}</span>
                  <span className="text-sm text-muted-foreground">{stream.game_name}</span>
                </div>
              </Link>

              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {stream.is_live && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
                      <Users className="h-4 w-4 text-red-500" />
                      <span>{stream.viewer_count.toLocaleString()}</span>
                    </div>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className={`hover:bg-primary/90 ${isFollowing ? "bg-primary" : ""}`}
                        onClick={() => setIsFollowing(!isFollowing)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                        {isFollowing ? t('following') : t('follow')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isFollowing ? t('unfollow') : t('followChannel')}</TooltipContent>
                  </Tooltip>

                  <CopyLink url={`${locale}/live/${stream.user_login}`} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="hover:bg-accent">
                        <a href={`https://twitch.tv/${stream.user_login}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('watchOnTwitch')}</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:w-[400px] h-[calc(100vh-180px)]">
          <iframe
            src={`https://www.twitch.tv/embed/${stream.user_login}/chat?darkpopout&parent=${process.env.NEXT_PUBLIC_VERCEL_URL || "localhost"}`}
            className="w-full h-full rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}

