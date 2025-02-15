"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { forwardRef, useEffect, useRef } from "react"
import * as THREE from "three"

export const DistortionEffect = forwardRef<HTMLCanvasElement, { className?: string }>(function DistortionEffect(
  { className },
  ref,
) {
  const localRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || localRef
  const shaderRef = useRef<{
    material: THREE.ShaderMaterial
    geometry: THREE.BufferGeometry
    renderer: THREE.WebGLRenderer
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    })

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        
        // Enhanced wave effect
        float waves = sin(uv.y * 15.0 + time) * cos(uv.x * 8.0 - time) * intensity;
        waves += sin(uv.x * 10.0 - time * 0.5) * cos(uv.y * 12.0 + time * 0.7) * intensity * 0.5;
        
        // Sparkle effect
        float sparkle = random(uv + time) * intensity;
        
        // Colors
        vec3 color1 = vec3(0.6, 0.2, 0.9);
        vec3 color2 = vec3(0.2, 0.5, 1.0);
        vec3 color = mix(color1, color2, waves + sparkle);
        
        // Enhanced fading
        float verticalFade = pow(1.0 - abs(uv.y - 0.5) * 2.0, 2.0);
        float horizontalFade = 1.0 - pow(abs(uv.x - 0.5) * 2.0, 2.0);
        
        // Smooth radial gradient from center
        vec2 center = vec2(0.5);
        float dist = distance(uv, center);
        float radialFade = 1.0 - smoothstep(0.2, 0.8, dist);
        
        // Combine all fading effects
        float finalFade = verticalFade * horizontalFade * radialFade;
        
        // Final color with enhanced transparency
        gl_FragColor = vec4(color, (waves + sparkle) * 0.3 * finalFade);
      }
    `

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    camera.position.z = 1

    shaderRef.current = {
      material,
      geometry,
      renderer,
    }

    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      const delta = time - lastTime
      if (delta > 16) {
        material.uniforms.time.value = time / 1000
        material.uniforms.intensity.value = 0.5 + Math.sin(time / 1000) * 0.2
        renderer.render(scene, camera)
        lastTime = time
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      const { clientWidth, clientHeight } = canvas
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)
    handleResize()
    animate(0)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
      if (shaderRef.current) {
        const { geometry, material, renderer } = shaderRef.current
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    }
  }, [canvasRef])

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />
})

