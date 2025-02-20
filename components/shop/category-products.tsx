"use client"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Link } from "@/i18n/routing"
import type { Product } from "@/lib/shopify/types"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

interface CategoryProductsProps {
  title: string
  products: Product[]
}

export function CategoryProducts({ title, products }: CategoryProductsProps) {
  const locale = useLocale()
  const t = useTranslations("shop")

  if (!products?.length) return null

  const categoryPath = `/search/${title.toLowerCase()}`

  return (
    <section className="container">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t(`categories.${title.toLowerCase()}`)}</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href={categoryPath}>
            {t("categories.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {products.map((product) => (
            <CarouselItem key={product.handle} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
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
        <CarouselPrevious className="-left-12 hidden lg:flex" />
        <CarouselNext className="-right-12 hidden lg:flex" />
      </Carousel>
    </section>
  )
}

