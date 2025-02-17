"use client"
import { useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import type { MotionValue } from "framer-motion"
import { motion, useMotionValueEvent } from "framer-motion"
import { useRef, useState } from "react"
import * as THREE from "three"

function Coin({
  position,
  texture,
  rotation,
  scale = 1,
  delay = 0,
  isVisible = false,
}: {
  position: [number, number, number]
  texture: string
  rotation: [number, number, number]
  scale?: number
  delay?: number
  isVisible?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]
  const startTime = useRef(0)
  const [hasStarted, setHasStarted] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Iniciar la animación cuando la sección sea visible
      if (isVisible && !hasStarted) {
        startTime.current = state.clock.elapsedTime
        setHasStarted(true)
      }

      // Calcular el progreso de la animación
      const animationTime = state.clock.elapsedTime - startTime.current - delay
      const progress = hasStarted ? Math.min(Math.max(animationTime / 1, 0), 1) : 0

      // Ease out cúbico
      const eased = 1 - Math.pow(1 - progress, 3)

      // Animación de entrada desde abajo
      const entryOffset = (1 - eased) * 2

      // Animación de flotación
      const floatingOffset = progress > 0.5 ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0

      // Aplicar posición final
      meshRef.current.position.y = initialY - entryOffset + floatingOffset

      // Rotación continua
      if (progress > 0.5) {
        meshRef.current.rotation.y += 0.005
      }

      // Ajustar opacidad
      if (meshRef.current.material instanceof THREE.Material) {
        meshRef.current.material.opacity = eased
        meshRef.current.material.transparent = true
      }

      // Resetear la animación cuando la sección se oculta
      if (!isVisible && hasStarted) {
        setHasStarted(false)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <cylinderGeometry args={[0.25, 0.25, 0.05, 64]} />
      <meshLambertMaterial map={useTexture(texture)} transparent opacity={0} />
    </mesh>
  )
}

export function FloatingCoins({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [isVisible, setIsVisible] = useState(false)

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    setIsVisible(latest > 0.5)
  })

  const coinPositions: [number, number, number][] = [
    [-1.6, -1.3, -1], // Izquierda
    [-1.2, 1.6, -1], // Centro
    [2.4, -0.5, -1], // Derecha
  ]

  const coinRotations: [number, number, number][] = [
    [Math.PI * 0.1, Math.PI * 0.05, Math.PI * 0.2], // Primera moneda
    [Math.PI * 0.15, -Math.PI * 0.03, -Math.PI * 0.09], // Segunda moneda
    [Math.PI * 0.08, Math.PI * 0.02, Math.PI * 0.6], // Tercera moneda
  ]

  const coinScales = [1.15, 1, 0.85] // Escalas para cada moneda
  const coinDelays = [0, 0.2, 0.4] // Delays entre monedas

  const textures = ["/home/twitch.webp", "/home/tiktok.webp", "/home/youtube.webp"]

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: scrollProgress }}>
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          {coinPositions.map((position, index) => (
            <Coin
              key={index}
              position={position}
              rotation={coinRotations[index]}
              texture={textures[index]}
              scale={coinScales[index]}
              delay={coinDelays[index]}
              isVisible={isVisible}
            />
          ))}
        </Canvas>
      </div>
    </motion.div>
  )
}

