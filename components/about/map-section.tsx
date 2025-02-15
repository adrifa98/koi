"use client"

import { gsap } from "gsap"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface Location {
  name: string
  coordinates: [number, number] // percentages [x, y]
}

const locations: Location[] = [
  { name: "Toronto", coordinates: [26, 28] },
  { name: "Madrid", coordinates: [44, 33] },
  { name: "Berlín", coordinates: [49, 27] },
]

// Helper function to convert percentage to SVG coordinates
function percentageToSVGCoord(percent: [number, number], viewBox: { width: number; height: number }): [number, number] {
  return [(percent[0] * viewBox.width) / 100, (percent[1] * viewBox.height) / 100]
}

// Helper function to create a curved path between two points
function createCurvedPath(
  start: [number, number],
  end: [number, number],
  viewBox: { width: number; height: number },
): string {
  const startCoord = percentageToSVGCoord(start, viewBox)
  const endCoord = percentageToSVGCoord(end, viewBox)

  // Calculate control point for the quadratic curve
  const midX = (startCoord[0] + endCoord[0]) / 2
  const midY = Math.min(startCoord[1], endCoord[1]) - 50 // Control point above the line

  return `M ${startCoord[0]} ${startCoord[1]} Q ${midX} ${midY} ${endCoord[0]} ${endCoord[1]}`
}

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || !svgRef.current || !titleRef.current || !descriptionRef.current) return

    // Animate title words
    const titleWords = titleRef.current.querySelectorAll(".text-word")
    gsap.set(titleWords, {
      opacity: 0,
      y: 20,
    })

    gsap.to(titleWords, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top center+=100",
        end: "bottom center",
      },
    })

    // Animate description words
    const descriptionWords = descriptionRef.current.querySelectorAll(".text-word")
    gsap.set(descriptionWords, {
      opacity: 0,
      y: 20,
    })

    gsap.to(descriptionWords, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05, // Slightly faster stagger for the longer text
      ease: "power2.out",
      scrollTrigger: {
        trigger: descriptionRef.current,
        start: "top center+=100",
        end: "bottom center",
      },
    })

    // Animate markers
    gsap.fromTo(
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

    // Animate base paths
    const paths = document.querySelectorAll(".connection-path")
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()

      // Initial animation to draw the line
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
          delay: 0.5,
        },
      )

      // Add subtle pulse animation
      gsap.to(path, {
        strokeOpacity: 0.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.5,
      })
    })

    // Animate traveling glow
    const glowPath = document.querySelector(".glow-path") as SVGPathElement
    if (glowPath) {
      const paths = [
        createCurvedPath(locations[0].coordinates, locations[1].coordinates, viewBox), // Toronto to Madrid
        createCurvedPath(locations[1].coordinates, locations[2].coordinates, viewBox), // Madrid to Berlin
        createCurvedPath(locations[2].coordinates, locations[0].coordinates, viewBox), // Berlin to Toronto
      ]

      let currentPathIndex = 0

      const animateNextPath = () => {
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
              animateNextPath()
            },
          },
        )
      }

      setTimeout(animateNextPath, 2500)
    }
  }, [])

  // SVG viewBox dimensions
  const viewBox = { width: 1000, height: 500 }

  // Create all possible paths between locations
  const allPaths = locations.flatMap((start, i) =>
    locations.slice(i + 1).map((end, j) => ({
      id: `${i}-${j}`,
      d: createCurvedPath(start.coordinates, end.coordinates, viewBox),
    })),
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden [perspective:300px] -mt-32">
      {/* Title */}
      <div ref={titleRef} className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-full z-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white">
          {"Comunidad Internacional".split(" ").map((word, index) => (
            <span key={index} className="text-word inline-block mx-[0.2em]">
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* Description */}
      <div
        ref={descriptionRef}
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-full z-10 text-center px-4"
      >
        <p className="text-xl md:text-2xl font-light text-black dark:text-white max-w-4xl mx-auto">
          {"Con sedes en Madrid, Berlín y Toronto, conectamos talentos y comunidades globales, impulsando un ecosistema vibrante en los esports. España y Latinoamérica forman el corazón de nuestra afición, mientras que Canadá y nuestros seguidores internacionales completan una comunidad global apasionada y única."
            .split(" ")
            .map((word, index) => (
              <span key={index} className="text-word inline-block mx-[0.2em]">
                {word}
              </span>
            ))}
        </p>
      </div>

      <div className="w-[98vw] mx-auto [transform:rotateX(10deg)]">
        <div ref={mapRef} className="relative w-full aspect-[2/1]">
          {/* Base map */}
          <div className="relative w-full h-full">
            <Image
              src="/mapa.png"
              alt="World map"
              fill
              className="object-contain dark:opacity-[0.35] opacity-[0.13]"
              priority
            />
          </div>

          {/* SVG layer for connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Enhanced glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Base gradient for paths */}
              <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
              </linearGradient>

              {/* Traveling glow gradient */}
              <linearGradient id="glowGradient" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Base connection paths */}
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

            {/* Single traveling glow that will be animated through all paths */}
            <path
              className="glow-path"
              stroke="url(#glowGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
          </svg>

          {/* Location markers with tooltips */}
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
              {/* Marker with glow effect */}
              <div className="relative">
                <div className="location-point w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <div className="absolute inset-0 -m-1 rounded-full bg-blue-500/30 animate-ping" />
              </div>

              {/* City name tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-2 py-1 rounded-md shadow-lg">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {location.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

