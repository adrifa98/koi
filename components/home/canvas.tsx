"use client"

import { Center, Environment, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import React, { useEffect, useRef, useState } from "react"
import type * as THREE from "three"
import type { Group } from "three"

type CameraRigProps = {
  children: React.ReactNode
  isHovered: boolean
}

const CameraRig = React.memo(({ children, isHovered }: CameraRigProps) => {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (groupRef.current && mounted) {
      groupRef.current.scale.set(0.7, 0.7, 0.7)
    }
  }, [mounted])

  useFrame((state, delta) => {
    if (groupRef.current && mounted) {
      easing.damp3(camera.position, [0, 0.1, isHovered ? 1.5 : 2], 0.25, delta)
      groupRef.current.rotation.set(state.pointer.y / 12, -state.pointer.x / 8, 0)
    }
  })

  return <group ref={groupRef}>{children}</group>
})
CameraRig.displayName = "CameraRig"

const Shirt = React.memo(() => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene } = useGLTF("https://movistar-koi.vercel.app/home/camiseta.glb")
  const shirtMesh = scene.children[0] as THREE.Mesh
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (meshRef.current && mounted) {
      meshRef.current.rotation.set(-10 * (Math.PI / 180), -25 * (Math.PI / 180), 0)
    }
  }, [mounted])

  useFrame((state) => {
    if (meshRef.current && mounted) {
      const t = state.clock.getElapsedTime()
      meshRef.current.position.y = 0.05 + Math.sin(t / 2) * 0.02
    }
  })

  return <mesh ref={meshRef} geometry={shirtMesh.geometry} material={shirtMesh.material} />
})
Shirt.displayName = "Shirt"

const ShirtCanvas = ({ onHover }: { onHover: (isHovered: boolean) => void }) => {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current || typeof window === "undefined") return

    const handleMouseEnter = () => onHover(true)
    const handleMouseLeave = () => onHover(false)

    const element = containerRef.current

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mounted, onHover])

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 w-[400px] lg:w-[500px] h-screen cursor-pointer flex items-center justify-center"
    >
      <div className="w-full aspect-square">
        <Canvas camera={{ position: [0, 0.3, 12], fov: 18 }} gl={{ preserveDrawingBuffer: true, antialias: true }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight color="#83b5ff" intensity={1} position={[5, 3, 5]} />
          <CameraRig isHovered={false}>
            <Center>
              <Shirt />
            </Center>
          </CameraRig>
        </Canvas>
      </div>
    </div>
  )
}

export default ShirtCanvas

