"use client"

import Image from "next/image"

export function GallerySection() {
  const images = [
    {
      src: "/about/img1.webp?height=800&width=600",
      alt: "Gallery image 1",
    },
    {
      src: "/about/img2.webp?height=800&width=600",
      alt: "Gallery image 2",
    },
    {
      src: "/about/img3.webp?height=800&width=600",
      alt: "Gallery image 3",
    },
    {
      src: "/about/img4.webp?height=800&width=600",
      alt: "Gallery image 4",
    },
  ]

  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

