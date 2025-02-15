"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"

interface Location {
  name: string
  coordinates: [number, number]
}

const locations: Location[] = [
  { name: "Toronto", coordinates: [20, 40] },
  { name: "Madrid", coordinates: [48, 42] },
  { name: "Barcelona", coordinates: [50, 41] },
  { name: "Berlin", coordinates: [52, 40] },
]

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    gsap.from(".location-point", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.2,
    })

    gsap.from(".location-name", {
      y: 10,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.2,
      delay: 0.3,
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-[0.03]">
          <defs>
            <pattern id="diagonal-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Líneas diagonales */}
              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
              <line x1="-50" y1="50" x2="50" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="50" y1="-50" x2="150" y2="50" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div ref={mapRef} className="relative w-full aspect-[3/1] max-w-6xl mx-auto">
          {/* Puntos de ubicación */}
          {locations.map((location) => (
            <div
              key={location.name}
              className="absolute"
              style={{
                left: `${location.coordinates[0]}%`,
                top: `${location.coordinates[1]}%`,
              }}
            >
              {/* Punto */}
              <div className="relative flex flex-col items-center">
                <div className="location-point w-2 h-2 rounded-full bg-[#3b82f6]" />
                {/* Nombre */}
                <div className="location-name mt-2">
                  <span className="text-sm text-[#3b82f6] whitespace-nowrap font-light">{location.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

