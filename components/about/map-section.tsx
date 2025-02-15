"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"

const WORLD_PATH =
  "M5,25 C10,25 15,20 20,20 C25,20 30,25 35,25 C40,25 45,20 50,20 C55,20 60,25 65,25 C70,25 75,20 80,20 C85,20 90,25 95,25"

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Animar las líneas de conexión
    gsap.from(".location-line", {
      strokeDashoffset: 1000,
      duration: 2,
      ease: "none",
      stagger: 0.3,
    })

    // Animar los puntos de ubicación
    gsap.from(".location-point", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.2,
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(20, 20, 20, 1) 0%, rgba(0, 0, 0, 1) 100%)",
          backgroundSize: "100% 100%",
        }}
      />

      {/* Grid de fondo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(to right, rgba(50, 50, 50, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(50, 50, 50, 0.05) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={mapRef} className="relative w-full aspect-[2/1] max-w-6xl mx-auto">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Líneas base del mundo */}
            <path d={WORLD_PATH} className="stroke-white/10" fill="none" strokeWidth="0.15" />

            {/* Líneas de ubicación */}
            <g className="location-line stroke-cyan-400/50">
              {/* Canadá */}
              <path
                d="M20,20 L25,15 L30,15"
                fill="none"
                strokeWidth="0.15"
                strokeDasharray="1000"
                style={{ filter: "drop-shadow(0 0 2px #2dd4bf)" }}
              />
              {/* España */}
              <path
                d="M45,25 L50,20 L55,20"
                fill="none"
                strokeWidth="0.15"
                strokeDasharray="1000"
                style={{ filter: "drop-shadow(0 0 2px #2dd4bf)" }}
              />
              {/* Berlín */}
              <path
                d="M52,22 L57,17 L62,17"
                fill="none"
                strokeWidth="0.15"
                strokeDasharray="1000"
                style={{ filter: "drop-shadow(0 0 2px #2dd4bf)" }}
              />
            </g>

            {/* Puntos de ubicación */}
            <g className="location-points">
              {/* Canadá */}
              <g transform="translate(30,15)">
                <circle
                  r="0.5"
                  className="location-point fill-cyan-400"
                  style={{ filter: "drop-shadow(0 0 2px #2dd4bf)" }}
                />
                <text x="1" y="0" className="text-[2px] fill-cyan-400/70 font-mono" dominantBaseline="middle">
                  TORONTO
                </text>
              </g>
              {/* España */}
              <g transform="translate(55,20)">
                <circle
                  r="0.5"
                  className="location-point fill-cyan-400"
                  style={{ filter: "drop-shadow(0 0 2px #2dd4bf)" }}
                />
                <text x="1" y="0" className="text-[2px] fill-cyan-400/70 font-mono" dominantBaseline="middle">
                  ESPAÑA
                </text>
              </g>
              {/* Berlín */}
              <g transform="translate(62,17)">
                <circle
                  r="0.5"
                  className="location-point fill-cyan-400"
                  style={{ filter: "drop-shadow(0 0 2px #2dd4bf)" }}
                />
                <text x="1" y="0" className="text-[2px] fill-cyan-400/70 font-mono" dominantBaseline="middle">
                  BERLÍN
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Título con estética tech */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-8">
          <div className="px-4 py-2 bg-black/50 border border-cyan-400/20 backdrop-blur-sm">
            <p className="text-cyan-400/70 text-sm font-mono">
              <span className="opacity-50">&lt;</span> GLOBAL PRESENCE <span className="opacity-50">/&gt;</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

