"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { Product } from "@/lib/shopify/types"
import Image from "next/image"
import Link from "next/link"

interface ProductCarouselProps {
  products: Product[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <div className="py-8">
      <div className="container">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.handle} className="pl-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link href={`/product/${product.handle}`} className="group block">
                  <div className="aspect-square overflow-hidden rounded-lg border bg-zinc-900">
                    <Image
                      src={product.featuredImage?.url ?? "/placeholder.svg"}
                      alt={product.featuredImage?.altText ?? product.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-primary">{product.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{product.priceRange.minVariantPrice.amount} €</p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
    </div>
  )
}

