"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import * as React from "react"

interface TeamMember {
  name: string
  role: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Lola Lolita",
    role: "CEO",
    image: "/about/lola-lolita.webp",
  },
  {
    name: "Lola Lolita",
    role: "Director de Operaciones",
    image: "/about/lola-lolita.webp",
  },
  {
    name: "Lola Lolita",
    role: "Directora de Estrategia",
    image: "/about/lola-lolita.webp",
  },
  {
    name: "Lola Lolita",
    role: "Director de Tecnología",
    image: "/about/lola-lolita.webp",
  },
  {
    name: "Lola Lolita",
    role: "Directora de Marketing",
    image: "/about/lola-lolita.webp",
  },
  {
    name: "Lola Lolita",
    role: "Director de Contenido",
    image: "/about/lola-lolita.webp",
  },
]

export function TeamSection() {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  return (
    <section className="py-20 mb-28">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-12">Nuestro Equipo</h2>
        <div className="max-w-7xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teamMembers.map((member, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="border-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                        <p className="text-muted-foreground">{member.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

