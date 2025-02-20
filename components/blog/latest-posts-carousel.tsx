"use client"

import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { BlogPost } from "@/types/blog"
import { ArrowRight } from 'lucide-react'
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import * as React from "react"

interface LatestPostsCarouselProps {
  posts: BlogPost[]
}

export function LatestPostsCarousel({ posts }: LatestPostsCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isLastSlide, setIsLastSlide] = React.useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("latestPosts")

  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap())
      setIsLastSlide(api.selectedScrollSnap() === api.scrollSnapList().length - 1)
    })
  }, [api])

  const handleViewMore = () => {
    router.push(`/${locale}/blog`)
  }

  return (
    <div className="container pb-40 -mt-40">
      <h2 className="text-2xl font-bold mb-8 text-center">{t("title")}</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full ml-0"
          setApi={setApi}
        >
          <CarouselContent className="ml-0">
            {posts.map((post) => (
              <CarouselItem key={post._id} className="md:basis-1/2 lg:basis-1/3 p-4 ml-0">
                <BlogCard post={post}/>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* View More Message */}
        <div
          className={`absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none transition-opacity duration-300 ${
            isLastSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-full flex items-center justify-center">
            <Button variant="ghost" size="lg" className="pointer-events-auto" onClick={handleViewMore}>
              {t("viewMore")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

