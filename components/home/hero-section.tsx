"use client"
import Canvas from "@/components/home/canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MagneticLogo } from "@/components/ui/magnetic-logo"
import { MatchCard } from "@/components/ui/match-card"
import { Instagram, InstagramIcon as TiktokIcon, Twitch, Twitter } from "lucide-react"
import Image from "next/image"
import { Suspense, useState } from "react"

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

const matches = [
  {
    team1: "FNC",
    team2: "RUSHB",
    time: "10:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "KOI",
    team2: "G2",
    time: "13:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "VIT",
    team2: "MAD",
    time: "16:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "BDS",
    team2: "AST",
    time: "19:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "SK",
    team2: "XL",
    time: "20:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "HR",
    team2: "NVE",
    time: "21:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "TH",
    team2: "GIA",
    time: "22:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "RGE",
    team2: "KC",
    time: "23:00",
    date: "17 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "MSF",
    team2: "LDLC",
    time: "00:00",
    date: "18 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
  {
    team1: "BK",
    team2: "TQ",
    time: "01:00",
    date: "18 Feb 2025",
    team1Logo: "/placeholder.svg?height=24&width=24",
    team2Logo: "/placeholder.svg?height=24&width=24",
    platforms: [
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
      { icon: "/placeholder.svg?height=20&width=20", href: "#" },
    ],
  },
]

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null)
  const [isDark, setIsDark] = useState(true)

  const getDropdownMatches = (index: number) => {
    const start = index === 0 ? 2 : 6
    const end = index === 0 ? 6 : 10
    return matches.slice(start, end)
  }

  return (
    <div className="background-header overflow-hidden -mt-8">
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
              <Suspense>
                <Canvas onHover={(hovered) => window.innerWidth > 1024 && setIsHovered(hovered)} />
              </Suspense>

              {/* Product Card - LEFT SIDE */}
              <div
                className={`absolute left-1/2 -translate-x-[32rem] top-1/2 -translate-y-1/2 z-[70] transition-all duration-500 hidden lg:block ${
                  isHovered ? "opacity-100 -translate-x-[32rem]" : "opacity-0 -translate-x-[34rem]"
                }`}
                onMouseEnter={() => {
                  setIsHovered(true)
                }}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Card className="w-[350px] bg-background/80 backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-sm font-medium text-primary">MOVISTAR KOI PROD™</CardDescription>
                    <CardTitle>JERSEY 2025</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 mb-0 pb-4">
                    <p className="text-sm">
                      La nueva camiseta oficial de Movistar KOI para la temporada 2024. Diseñada con tecnología de
                      última generación y materiales premium para máximo rendimiento y comodidad.
                    </p>
                    <div className="space-y-2 py-4">
                      <p className="text-lg font-bold pb-4">89.99€</p>
                      <Button className="w-full">Comprar ahora</Button>
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
                #SOMOSMOVISTARKOI
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
            <div className="flex gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
              {sponsors.map((sponsor, index) => (
                <MagneticLogo
                  key={index}
                  className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 bg-white/5 rounded-lg backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
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

          {/* Match Cards - DERECHA */}
          <div className="absolute right-0 lg:right-32 bottom-32 lg:bottom-auto lg:top-1/2 w-full lg:w-auto px-4 lg:px-0 lg:-translate-y-1/2 z-[60]">
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
              {matches.slice(0, 2).map((match, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredMatch(index)}
                  onMouseLeave={() => setHoveredMatch(null)}
                >
                  <div className={`transition-all duration-500 ${isHovered ? "blur-sm" : ""}`}>
                    <MatchCard match={match} />
                  </div>

                  {hoveredMatch === index && (
                    <div className="absolute top-full left-0 space-y-2 pt-2 z-[80]">
                      {getDropdownMatches(index).map((dropMatch, dropIndex) => (
                        <div
                          key={dropIndex}
                          className="opacity-0 -translate-y-5"
                          style={{
                            animation: `fadeInDown 0.5s ease-out forwards`,
                            animationDelay: `${dropIndex * 100}ms`,
                          }}
                        >
                          <MatchCard match={dropMatch} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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

