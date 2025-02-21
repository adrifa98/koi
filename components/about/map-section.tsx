"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface Location {
  name: string
  coordinates: [number, number]
}

const locations: Location[] = [
  { name: "Toronto", coordinates: [26, 28] },
  { name: "Madrid", coordinates: [44, 33] },
  { name: "Berlín", coordinates: [49, 27] },
]

function percentageToSVGCoord(percent: [number, number], viewBox: { width: number; height: number }): [number, number] {
  return [(percent[0] * viewBox.width) / 100, (percent[1] * viewBox.height) / 100]
}

function createCurvedPath(
  start: [number, number],
  end: [number, number],
  viewBox: { width: number; height: number },
): string {
  const startCoord = percentageToSVGCoord(start, viewBox)
  const endCoord = percentageToSVGCoord(end, viewBox)
  const midX = (startCoord[0] + endCoord[0]) / 2
  const midY = Math.min(startCoord[1], endCoord[1]) - 50
  return `M ${startCoord[0]} ${startCoord[1]} Q ${midX} ${midY} ${endCoord[0]} ${endCoord[1]}`
}

export function MapSection() {
  const t = useTranslations("club")
  const sectionRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !mapRef.current || !svgRef.current) return

    // Timeline principal para la sección
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
    })

    // Animación de marcadores y conexiones
    const markersTl = gsap.timeline({
      scrollTrigger: {
        trigger: mapRef.current,
        start: "top center+=100",
        toggleActions: "play none none reverse",
      },
    })

    markersTl.fromTo(
      ".location-point",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.2,
      },
    )

    // Animación de las líneas de conexión
    document.querySelectorAll(".connection-path").forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.fromTo(
        path,
        {
          strokeDasharray: length,
          strokeDashoffset: length,
        },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Animación del brillo viajero
    const glowPath = document.querySelector(".glow-path") as SVGPathElement
    if (glowPath) {
      const viewBox = { width: 1000, height: 500 }
      const paths = [
        createCurvedPath(locations[0].coordinates, locations[1].coordinates, viewBox),
        createCurvedPath(locations[1].coordinates, locations[2].coordinates, viewBox),
        createCurvedPath(locations[2].coordinates, locations[0].coordinates, viewBox),
      ]

      let currentPathIndex = 0
      const animateGlow = () => {
        if (!glowPath) return

        glowPath.setAttribute("d", paths[currentPathIndex])
        const length = glowPath.getTotalLength()

        gsap.fromTo(
          glowPath,
          {
            strokeDasharray: `${length * 0.2} ${length}`,
            strokeDashoffset: length,
            opacity: 0,
          },
          {
            strokeDashoffset: -length,
            opacity: 0.8,
            duration: 8,
            ease: "none",
            onComplete: () => {
              currentPathIndex = (currentPathIndex + 1) % paths.length
              animateGlow()
            },
          },
        )
      }

      setTimeout(animateGlow, 2500)
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const viewBox = { width: 1000, height: 500 }
  const allPaths = locations.flatMap((start, i) =>
    locations.slice(i + 1).map((end, j) => ({
      id: `${i}-${j}`,
      d: createCurvedPath(start.coordinates, end.coordinates, viewBox),
    })),
  )

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] sm:min-h-screen flex flex-col justify-center overflow-hidden [perspective:300px] -mt-16 sm:-mt-32"
    >
      <div className="hidden md:flex w-[98vw] mx-auto [transform:rotateX(10deg)]">
        <div ref={mapRef} className="relative w-full aspect-[2/1]">
          {/* Base map */}
          <div className="relative w-full h-full">
            <Image
              src="/about/mapa.png"
              alt="World map"
              fill
              className="object-contain dark:opacity-[0.35] opacity-[0.13]"
              priority
            />
          </div>

          {/* SVG layer */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="glowGradient" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
              </linearGradient>
            </defs>

            {allPaths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                className="connection-path"
                stroke="url(#lineGradient)"
                strokeWidth="1"
                strokeOpacity="0.4"
                fill="none"
                filter="url(#glow)"
              />
            ))}

            <path
              className="glow-path"
              stroke="url(#glowGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
          </svg>

          {/* Location markers */}
          {locations.map((location) => (
            <div
              key={location.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${location.coordinates[0]}%`,
                top: `${location.coordinates[1]}%`,
                zIndex: 20,
              }}
            >
              <div className="relative">
                <div className="location-point w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <div className="absolute inset-0 -m-1 rounded-full bg-blue-500/30 animate-ping" />
              </div>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-2 py-1 rounded-md shadow-lg bg-white/90 dark:bg-black/90">
                  <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {location.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="map-title w-full z-30 text-center px-4 md:mt-[-500px]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{t("location.title")}</h2>
      </div>

      {/* Description */}
      <div className="map-description w-full z-30 text-center px-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl sm:max-w-4xl mx-auto">
            {t("location.description")}
          </p>
        </div>
      </div>
    </section>
  )
}

