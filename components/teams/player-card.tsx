"use client"

import { Button } from "@/components/ui/button"
import { urlForImage } from "@/lib/sanity/client"
import { cn } from "@/lib/utils"
import type { Player } from "@/types/player"
import { Instagram, Twitch, Twitter, Youtube } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface PlayerCardProps {
  player: Player
  category: string
}

export function PlayerCard({ player, category }: PlayerCardProps) {
  const t = useTranslations("teams")
  // Manejar el caso donde urlForImage devuelve undefined
  const imageBuilder = urlForImage(player.image)
  const imageUrl = imageBuilder ? imageBuilder.url() : "/placeholder.svg"
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="group relative h-[220px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-900/20 to-black/80">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/chevron-pattern.svg')] bg-cover opacity-10" />

      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Image
          src="/logo.svg"
          alt="Background Logo"
          width={600}
          height={600}
          className="min-h-[600px] min-w-[600px] object-contain"
          priority
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content Container */}
      <div className="relative flex h-full items-center justify-between p-8">
        {/* Left Side - Text & Social */}
        <div className="z-10 flex flex-col">
          {/* Player Info */}
          <h3 className="text-3xl font-bold text-white">{player.username}</h3>
          <p className="mt-2 text-sm font-medium text-blue-400">
            {player.firstName} {player.lastName}
          </p>

          {/* Follow Button */}
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={handleFollowClick}
            className={cn(
              "mt-4 w-fit",
              isFollowing && "border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300",
            )}
          >
            {isFollowing ? t("player.unfollow") : t("player.follow")}
          </Button>

          {/* Social Links */}
          <div className="mt-4 flex space-x-4">
            {player.twitter && (
              <Link
                href={`https://twitter.com/${player.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-[#1DA1F2]"
                title={t("player.social.twitter")}
              >
                <Twitter className="h-5 w-5" />
              </Link>
            )}
            {player.youtube && (
              <Link
                href={`https://youtube.com/${player.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-[#FF0000]"
                title={t("player.social.youtube")}
              >
                <Youtube className="h-5 w-5" />
              </Link>
            )}
            {player.twitch && (
              <Link
                href={`https://twitch.tv/${player.twitch}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-[#9146FF]"
                title={t("player.social.twitch")}
              >
                <Twitch className="h-5 w-5" />
              </Link>
            )}
            {player.instagram && (
              <Link
                href={`https://instagram.com/${player.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-[#E4405F]"
                title={t("player.social.instagram")}
              >
                <Instagram className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Side - Player Image */}
        <div className="absolute bottom-0 right-0 h-full w-[320px] overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={player.username}
            width={500}
            height={633}
            className={cn(
              "h-full w-full object-cover object-center transition-transform duration-500",
              "scale-105 group-hover:scale-110",
            )}
          />
        </div>
      </div>
    </div>
  )
}

