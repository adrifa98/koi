"use client"
import Canvas from "@/components/home/canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Suspense, useState } from "react"

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <div className="background-header overflow-hidden">
        <header className="w-full h-screen">
          <div className="relative flex w-full h-full">
            {/* Texto a la izquierda */}
            <div className="absolute left-20 top-1/2 -translate-y-1/2 z-20 w-[500px]">
              <div className="space-y-6">
                <div>
                  <h1 className="text-[12rem] tracking-tight italic font-black">KOI</h1>
                </div>
              </div>
            </div>

            {/* Contenido visual a la derecha */}
            <div className="absolute right-0 w-[70%] h-full">
              <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? "blur-sm" : ""}`}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="bg-cover bg-center w-full h-full object-cover animate-fade-down"
                >
                  <source src="/home/background.mp4" type="video/mp4" />
                  <Image src="/home/background.jpg" alt="Background" fill className="object-cover" />
                </video>
              </div>

              <div className="absolute z-2 w-full h-full top-0 left-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020113] to-transparent"></div>
              </div>

              <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? "blur-sm" : ""}`}>
                <Image
                  draggable={false}
                  src="/home/back.png"
                  alt="Dragón trasero"
                  fill
                  className="object-cover animate-fade-up"
                />
              </div>

              <div className="relative flex justify-center items-center w-full h-full">
                <Suspense>
                  <Canvas onHover={setIsHovered} />
                </Suspense>

                <div
                  className={`absolute right-8 transition-all duration-500 ${
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Card className="w-[350px] bg-background/80 backdrop-blur">
                    <CardHeader>
                      <CardDescription className="text-sm font-medium text-primary">MOVISTAR KOI PROD™</CardDescription>
                      <CardTitle>JERSEY 2025</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 mb-0 pb-4">
                      <p className="text-sm">
                        La nueva camiseta oficial de Movistar KOI para la temporada 2024. Diseñada con tecnología de
                        última generación y materiales premium para máximo rendimiento y comodidad.
                      </p>
                      <div className="space-y-2 py-4">
                        <p className="text-lg font-bold pb-4">89.99€</p>
                        <Button className="w-full">Comprar ahora</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div
                className={`absolute inset-0 transition-all duration-500 pointer-events-none ${isHovered ? "blur-sm" : ""}`}
              >
                <Image
                  draggable={false}
                  src="/home/front.png"
                  alt="Dragón frontal"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}

