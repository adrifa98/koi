"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Category } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface CategoriesProps {
  categories: Category[]
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
}

export function Categories({ categories, selectedCategories, onToggleCategory }: CategoriesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".category-card", {
        y: 20,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (!categories || categories.length === 0) {
    return <div>No categories available</div>
  }

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-track-background scrollbar-thumb-muted-foreground">
      <div ref={containerRef} className="grid min-w-full grid-cols-7 gap-4" style={{ minWidth: "max-content" }}>
        {categories.map((category) => (
          <TooltipProvider key={category._id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onToggleCategory(category.slug.current)}
                  className={cn(
                    "category-card group relative aspect-video w-48 overflow-hidden rounded-lg hover:scale-105 hover:ring-2 hover:ring-primary translate-none transform-none",
                    selectedCategories.includes(category.slug.current)
                      ? "ring-2 ring-primary scale-105"
                      : "ring-1 ring-border",
                  )}
                >
                  <Image
                    src={category.image?.asset?.url || "/placeholder.svg"}
                    alt={category.name.en}
                    fill
                    className="object-cover duration-300 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-sm font-semibold text-white">
                    {category.name.en}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Click to {selectedCategories.includes(category.slug.current) ? "deselect" : "select"}{" "}
                  {category.name.en}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}

