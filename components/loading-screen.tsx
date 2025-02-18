"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular un tiempo mínimo de carga para que la animación se vea
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="relative flex items-center justify-center">
            {/* Logo container con animación de scale */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{
                scale: [0.5, 1.1, 1],
                transition: {
                  duration: 1.5,
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
              className="relative h-32 w-32"
            >
              {/* Círculo de fondo con glow effect */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-primary/20 to-primary blur-2xl" />

              {/* Logo */}
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-20 w-20 animate-[spin_3s_linear_infinite]">
                  <motion.circle
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.img
                    src="/logo.png"
                    alt="Logo"
                    className="h-12 w-12"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Texto de carga con fade in/out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -20],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="absolute -bottom-12 text-center"
            >
              <span className="text-sm font-medium text-muted-foreground">Cargando</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

