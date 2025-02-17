"use client"

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export function MagneticLogo({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)

    const distance = Math.sqrt(Math.pow(middleX, 2) + Math.pow(middleY, 2))
    const maxDistance = 100

    if (distance < maxDistance) {
      const power = (maxDistance - distance) / maxDistance
      setPosition({
        x: middleX * power * 0.3,
        y: middleY * power * 0.3,
      })
    } else {
      setPosition({ x: 0, y: 0 })
    }
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}
