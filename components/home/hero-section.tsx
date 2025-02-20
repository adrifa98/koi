"use client"

import type React from "react"

import Canvas from "@/components/home/canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MagneticLogo } from "@/components/ui/magnetic-logo"
import MatchCard from "@/components/ui/match-card"
import { StreamCard } from "@/components/ui/stream-card"
import type { Match } from "@/lib/sanity"
import type { TwitchStream } from "@/lib/types"
import { Instagram, InstagramIcon as TiktokIcon, Twitch, Twitter } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"

const sponsors = [
  "/patros/movistar.png",
  "/patros/cupra.png",
  "/patros/razer.png",
  "/patros/mahou.png",
  "/patros/omen.png",
  "/patros/ecoembes.png",
  "/patros/medicos.png",
]

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitch, href: "#" },
  { icon: TiktokIcon, href: "#" },
]

interface HeroSectionProps {
  initialMatches: Match[]
  twitchStreams: TwitchStream[]
}

export function HeroSection({ initialMatches, twitchStreams }: HeroSectionProps) {
  const t = useTranslations()
  const tHome = useTranslations("home")
  const tMatch = useTranslations("match")
  const [matches, setMatches] = useState<Match[]>([])
  const [topStreams, setTopStreams] = useState<TwitchStream[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null)
  const [hoveredStreams, setHoveredStreams] = useState(false)

  useEffect(() => {
    console.log("Initial matches:", initialMatches)
    setMatches(initialMatches)
  }, [initialMatches])

  useEffect(() => {
    if (hoveredMatch === 0) {
      console.log("Dropdown matches:", matches.slice(1, 4))
    }
  }, [hoveredMatch, matches])

  useEffect(() => {
    const liveStreams = twitchStreams
      .filter((stream) => stream.is_live)
      .sort((a, b) => b.viewer_count - a.viewer_count)
      .slice(0, 8) // Get top 8 streams for main + dropdown
    setTopStreams(liveStreams)
  }, [twitchStreams])

  return (
    <div className="background-header overflow-hidden -mt-4">
      <header className="w-full h-screen">
        <div className="relative flex w-full h-full overflow-visible">
          {/* Contenido central */}
          <div className="absolute inset-0">
            <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? "blur-sm" : ""}`}>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="bg-cover bg-center w-full h-full object-cover animate-fade-down"
              >
                <source src="/home/background.mp4" type="video/mp4" />
                <Image src="/home/background.jpg" alt="Background" fill className="object-cover" />
              </video>
            </div>

            <div className="absolute z-2 w-full h-full top-0 left-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? "blur-sm" : ""}`}>
              <Image
                draggable={false}
                src="/home/back.png"
                alt="Dragón trasero"
                fill
                className="object-cover animate-fade-up"
              />
            </div>

            <div className="relative flex justify-center items-center w-full h-full">
              <Canvas
                onHover={(hovered) => {
                  if (window.innerWidth > 1024) {
                    if (hovered) {
                      setIsHovered(true)
                    } else {
                      // Check if we're hovering over the card
                      const card = document.querySelector(".product-card")
                      if (card) {
                        const rect = card.getBoundingClientRect()
                        const mouseEvent = window.event as MouseEvent
                        const isOverCard =
                          mouseEvent.clientX >= rect.left &&
                          mouseEvent.clientX <= rect.right &&
                          mouseEvent.clientY >= rect.top &&
                          mouseEvent.clientY <= rect.bottom

                        if (!isOverCard) {
                          setIsHovered(false)
                        }
                      } else {
                        setIsHovered(false)
                      }
                    }
                  }
                }}
              />

              {/* Product Card - LEFT SIDE */}
              <div
                className={`absolute left-1/2 -translate-x-[32rem] top-1/2 -translate-y-1/2 z-[70] transition-all duration-500 hidden lg:block product-card ${
                  isHovered ? "opacity-100 -translate-x-[32rem]" : "opacity-0 -translate-x-[34rem]"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={(e: React.MouseEvent) => {
                  // Check if we're not hovering over the shirt
                  const canvas = document.querySelector("canvas")
                  if (canvas) {
                    const rect = canvas.getBoundingClientRect()
                    const isOverCanvas =
                      e.clientX >= rect.left &&
                      e.clientX <= rect.right &&
                      e.clientY >= rect.top &&
                      e.clientY <= rect.bottom

                    if (!isOverCanvas) {
                      setIsHovered(false)
                    }
                  } else {
                    setIsHovered(false)
                  }
                }}
              >
                <Card className="w-[350px] bg-background/80 backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-sm font-medium text-primary">
                      {tHome("jersey.brand")}
                    </CardDescription>
                    <CardTitle>{tHome("jersey.title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 mb-0 pb-4">
                    <p className="text-sm">{tHome("jersey.description")}</p>
                    <div className="space-y-2 py-4">
                      <p className="text-lg font-bold">{tHome("jersey.price")}</p>
                      <Button className="w-full">{tHome("jersey.buyNow")}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div
                className={`absolute inset-0 transition-all duration-500 pointer-events-none ${isHovered ? "blur-sm" : ""}`}
              >
                <Image draggable={false} src="/home/front.png" alt="Dragón frontal" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Línea vertical con iconos sociales - IZQUIERDA */}
          <div className="absolute left-8 h-full flex flex-col items-center justify-center z-30">
            <div className="w-px flex-1 bg-primary/20" />
            <div className="space-y-4 my-4">
              <span
                className={`text-sm font-medium text-primary/60 rotate-180 [writing-mode:vertical-lr] transition-all duration-500 ${
                  isHovered ? "blur-sm" : ""
                }`}
              >
                {tHome("hashtag")}
              </span>
            </div>
            <div className="w-px flex-1 bg-gradient-to-b from-primary/20 via-primary/20 to-transparent" />
          </div>

          {/* Logos de patrocinadores - IZQUIERDA */}
          <div
            className={`absolute left-0 lg:left-32 top-32 lg:top-1/2 w-full lg:w-auto px-4 lg:px-0 lg:-translate-y-1/2 z-20 transition-all duration-500 ${
              isHovered ? "blur-sm" : ""
            }`}
          >
            <div className="hidden lg:flex gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
              {sponsors.map((sponsor, index) => (
                <MagneticLogo
                  key={index}
                  className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-lg bg-background/80 backdrop-blur border border-border/50 hover:bg-accent/50 transition-colors flex items-center justify-center"
                >
                  <Image
                    src={sponsor || "/placeholder.svg"}
                    alt={`Sponsor ${index + 1}`}
                    width={28}
                    height={28}
                    className="opacity-75 lg:w-9"
                  />
                </MagneticLogo>
              ))}
            </div>
          </div>

          {/* Match Cards and Stream Cards - DERECHA */}
          <div className="absolute right-0 lg:right-32 bottom-32 lg:bottom-auto lg:top-1/2 w-full lg:w-auto px-4 lg:px-0 lg:-translate-y-1/2 z-[40]">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Match Cards */}
              {matches.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredMatch(0)}
                  onMouseLeave={() => setHoveredMatch(null)}
                >
                  <div className={`${isHovered ? "blur-sm" : ""}`}>
                    <MatchCard match={matches[0]} />
                  </div>

                  {hoveredMatch === 0 && matches.length > 1 && (
                    <div className="absolute top-full left-0 space-y-2 pt-2 z-[45]">
                      {matches.slice(1, 4).map((match, index) => (
                        <div
                          key={match._id}
                          className="opacity-0 -translate-y-5"
                          style={{
                            animation: `dropDown 0.5s ease-out forwards`,
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stream Cards */}
              {topStreams.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredStreams(true)}
                  onMouseLeave={() => setHoveredStreams(false)}
                >
                  <div className={`${isHovered ? "blur-sm" : ""}`}>
                    <StreamCard stream={topStreams[0]} />
                  </div>

                  {hoveredStreams && topStreams.length > 1 && (
                    <div className="absolute top-full left-0 space-y-2 pt-2 z-[45]">
                      {topStreams.slice(1, 4).map((stream, index) => (
                        <div
                          key={stream.user_id}
                          className="opacity-0 -translate-y-5"
                          style={{
                            animation: `dropDown 0.5s ease-out forwards`,
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <StreamCard stream={stream} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Línea vertical con iconos sociales - DERECHA */}
          <div className="absolute right-8 h-full flex flex-col items-center justify-center z-30">
            <div className="w-px flex-1 bg-primary/20" />
            <div className="space-y-4 my-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`block text-primary/60 hover:text-primary transition-colors ${isHovered ? "blur-sm" : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
            <div className="w-px flex-1 bg-gradient-to-b from-primary/20 via-primary/20 to-transparent" />
          </div>
        </div>
      </header>
    </div>
  )
}

