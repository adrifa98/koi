"use client"
import {
  CodIcon,
  EafcIcon,
  FortniteIcon,
  KoiIcon,
  LeagueIcon,
  PokemonIcon,
  ValorantIcon,
} from "@/components/layout/navbar/GameIcons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FloatingCoins } from "@/components/ui/floating-coins"
import { Link } from "@/i18n/routing"
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion"
import { MessageCircle } from 'lucide-react'
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

type Discussion = {
  id: string
  title: string
  subName: string
  replies: number
}

const getGameIcon = (subName: string) => {
  switch (subName.toLowerCase()) {
    case "league-of-legends":
      return <LeagueIcon className="h-4 w-4 text-muted-foreground" />
    case "valorant":
      return <ValorantIcon className="h-4 w-4 text-muted-foreground" />
    case "pokemon":
      return <PokemonIcon className="h-4 w-4 text-muted-foreground" />
    case "call-of-duty":
      return <CodIcon className="h-4 w-4 text-muted-foreground" />
    case "eafc":
      return <EafcIcon className="h-4 w-4 text-muted-foreground" />
    case "fortnite":
      return <FortniteIcon className="h-4 w-4 text-muted-foreground" />
    default:
      return <KoiIcon className="h-4 w-4 text-muted-foreground" />
  }
}

export function FishSection({ discussions }: { discussions: Discussion[] }) {
  const t = useTranslations()
  const tCommunity = useTranslations("community")
  const tKoiTv = useTranslations("koiTv")
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mobileScrollProgress = useMotionValue(1)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Controlar el scroll solo cuando la sección está en vista y estamos en desktop
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (!sectionRef.current || window.innerWidth < 1024) return

      const rect = sectionRef.current.getBoundingClientRect()
      const isInView = rect.top <= window.innerHeight * 0.3

      if (isInView && latest > 0 && latest < 0.85) {
        document.body.style.overflow = ""
      } else {
        document.body.style.overflow = ""
      }
    })

    return () => {
      unsubscribe()
      document.body.style.overflow = ""
    }
  }, [scrollYProgress])

  // Animaciones basadas en el scroll
  const leftSectionOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0])
  const rightSectionOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 1])

  const fishX = useTransform(scrollYProgress, [0, 1.3], ["110vw", "-150vw"])
  const fishY = useTransform(scrollYProgress, [0, 1.3], ["-30vh", "70vh"])
  const fishOpacity = useTransform(scrollYProgress, [0, 0.02, 0.87, 1.3], [0, 1, 1, 0])

  useEffect(() => {
    let prevScroll = scrollYProgress.get()

    const unsubscribeSpeed = scrollYProgress.onChange((latest) => {
      if (!videoRef.current) return

      // Si hay diferencia en el scroll, está scrolleando
      if (Math.abs(latest - prevScroll) > 0.001) {
        videoRef.current.playbackRate = 5
      } else {
        videoRef.current.playbackRate = 1
      }

      prevScroll = latest
    })

    return () => {
      unsubscribeSpeed()
      // Resetear la velocidad al desmontar
      if (videoRef.current) {
        videoRef.current.playbackRate = 1
      }
    }
  }, [scrollYProgress])

  const CommunityContent = () => (
    <Card className="bg-background/50 backdrop-blur-sm border-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{tCommunity("title")}</h2>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">{tCommunity("latestPosts")}</h3>
          <div className="space-y-2">
            {discussions.length > 0 ? (
              discussions.map((discussion) => (
                <Link
                  key={discussion.id}
                  href={`/post/${discussion.id}`}
                  className="flex items-center justify-between py-2 hover:bg-white/5 transition-colors rounded-lg px-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    {getGameIcon(discussion.subName)}
                    <span className="text-sm group-hover:text-primary transition-colors line-clamp-1 max-w-[280px]">
                      {discussion.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{discussion.replies}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground">{tCommunity("noDiscussions")}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <>
      {/* Versión móvil */}
      <div className="lg:hidden -mt-14">
        <section className="min-h-screen bg-background py-20">
          <div className="container">
            <div className="space-y-20">
              <div className="w-full">
                <CommunityContent />
                <div className="flex justify-center mt-8">
                  <Button size="lg" variant="outline">
                    {tCommunity("viewMore")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Versión desktop */}
      <div className="hidden lg:block">
        <div ref={containerRef} className="relative h-[300vh] -mt-40">
          <section ref={sectionRef} className="sticky top-0 h-screen w-full">
            <div className="container h-full">
              <div className="relative grid grid-cols-2 gap-8 h-full">
                {/* Left Content - Community Module */}
                <motion.div
                  className="flex flex-col justify-start pt-24 relative"
                  style={{ opacity: leftSectionOpacity }}
                >
                  <div className="w-full pt-20">
                    <CommunityContent />
                    <div className="flex justify-center">
                      <Link href="/community">
                        <Button size="lg" variant="outline">
                          {tCommunity("viewMore")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Right Content - Text with Coins */}
                <motion.div className="flex items-center relative" style={{ opacity: rightSectionOpacity }}>
                  <FloatingCoins scrollProgress={rightSectionOpacity} />
                  <div className="space-y-4 text-center max-w-xl mx-auto relative z-10 px-8">
                    <h2 className="text-4xl font-bold">{tKoiTv("title")}</h2>
                    <p className="text-lg text-muted-foreground">
                      {tKoiTv("description")}
                    </p>
                    <div className="pt-2">
                      <Link href="/tv">
                        <Button size="lg">{tKoiTv("viewButton")}</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Fish Video */}
            <motion.div
              style={{
                x: fishX,
                y: fishY,
                opacity: fishOpacity,
              }}
              className="fixed top-1/3 -translate-y-1/2 w-[600px] pointer-events-none mix-blend-screen"
            >
              <video ref={videoRef} autoPlay loop muted playsInline className="w-full carpa">
                <source src="/home/carpa.webm" type="video/webm" />
              </video>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  )
}

