"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"

interface City {
  name: string
  coordinates: [number, number]
  region: string
}

const cities: City[] = [
  { name: "Toronto", coordinates: [23, 35], region: "América" },
  { name: "Barcelona", coordinates: [47, 35], region: "Europa" },
  { name: "Madrid", coordinates: [45, 37], region: "Europa" },
  { name: "Berlín", coordinates: [50, 32], region: "Europa" },
]

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Animar los puntos de las ciudades
    gsap.from(".city-point", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "elastic.out(1, 0.5)",
    })

    // Animar las líneas de conexión
    gsap.from(".city-line", {
      strokeDashoffset: 100,
      duration: 1.5,
      stagger: 0.1,
      ease: "none",
    })

    // Animar el pulso de los puntos
    gsap.to(".city-pulse", {
      scale: 1.5,
      opacity: 0,
      duration: 1.5,
      repeat: -1,
      ease: "none",
      stagger: {
        each: 0.5,
        repeat: -1,
      },
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-center mb-16 text-white font-mono">
          <span className="opacity-50">[</span> Presencia global <span className="opacity-50">]</span>
        </h2>

        <div ref={mapRef} className="relative w-full aspect-[2/1] max-w-6xl mx-auto">
          {/* Mapa base */}
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 0 10px rgba(147, 51, 234, 0.3))",
            }}
          >
            {/* Grid de fondo */}
            <defs>
              <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse" className="text-purple-600/10">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="currentColor" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="50" fill="url(#grid)" />

            {/* Continentes con estilo tech */}
            <g className="text-purple-900/20">
              <path
                d="M15 15 L35 15 L40 25 L30 35 L15 30 Z" // América del Norte
                className="fill-current"
                style={{ filter: "url(#glow)" }}
              />
              <path
                d="M25 35 L30 45 L20 48 L18 38 Z" // América del Sur
                className="fill-current"
                style={{ filter: "url(#glow)" }}
              />
              <path
                d="M45 20 L55 20 L58 35 L43 38 L40 30 Z" // Europa
                className="fill-current"
                style={{ filter: "url(#glow)" }}
              />
              <path
                d="M60 20 L80 25 L75 40 L58 38 Z" // Asia
                className="fill-current"
                style={{ filter: "url(#glow)" }}
              />
              <path
                d="M45 40 L60 40 L58 48 L48 48 Z" // África
                className="fill-current"
                style={{ filter: "url(#glow)" }}
              />
              <path
                d="M82 42 L85 45 L80 48 L78 45 Z" // Australia
                className="fill-current"
                style={{ filter: "url(#glow)" }}
              />
            </g>

            {/* Efecto de resplandor */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Líneas de conexión */}
          <svg viewBox="0 0 100 50" className="absolute inset-0">
            {cities.map((city, index) =>
              cities
                .slice(index + 1)
                .map((otherCity, otherIndex) => (
                  <line
                    key={`${city.name}-${otherCity.name}`}
                    x1={`${city.coordinates[0]}%`}
                    y1={`${city.coordinates[1]}%`}
                    x2={`${otherCity.coordinates[0]}%`}
                    y2={`${otherCity.coordinates[1]}%`}
                    className="city-line stroke-purple-500"
                    strokeWidth="0.2"
                    strokeDasharray="0.5 1"
                    style={{ filter: "url(#glow)" }}
                  />
                )),
            )}
          </svg>

          {/* Puntos de las ciudades */}
          {cities.map((city) => (
            <div
              key={city.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{
                left: `${city.coordinates[0]}%`,
                top: `${city.coordinates[1]}%`,
              }}
            >
              {/* Punto principal */}
              <div className="city-point w-2 h-2 rounded-full bg-purple-500 shadow-glow" />
              {/* Efecto de pulso */}
              <div className="city-pulse absolute inset-0 w-2 h-2 rounded-full bg-purple-500 opacity-75" />
              {/* Nombre de la ciudad */}
              <div className="mt-3 px-2 py-1 rounded border border-purple-500/20 bg-black/80">
                <span className="text-xs font-mono text-purple-300 whitespace-nowrap">{city.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda de regiones */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {Array.from(new Set(cities.map((city) => city.region))).map((region) => (
            <div
              key={region}
              className="flex items-center gap-2 px-3 py-1 rounded-sm border border-purple-500/20 bg-black/80"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-glow" />
              <span className="text-xs font-mono text-purple-300">{region}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Estilos globales para el efecto de resplandor */}
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 10px theme('colors.purple.500'),
                     0 0 20px theme('colors.purple.500');
        }
      `}</style>
    </section>
  )
}

