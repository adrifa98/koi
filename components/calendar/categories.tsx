"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Category } from "@/lib/sanity/queries"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

interface CategoriesProps {
  categories: Category[]
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
}

export function Categories({ categories, selectedCategories, onToggleCategory }: CategoriesProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true)
    })
  }, [])

  if (!categories || categories.length === 0) {
    return <div>No categories available</div>
  }

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-track-background scrollbar-thumb-muted-foreground">
      <div className="flex gap-4 min-w-max">
        {categories.map((category) => (
          <TooltipProvider key={category._id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onToggleCategory(category.slug.current)}
                  className={cn(
                    "relative w-48 aspect-video overflow-hidden rounded-lg transition-opacity duration-300 hover:ring-2 hover:ring-primary opacity-0",
                    selectedCategories.includes(category.slug.current) ? "ring-2 ring-primary" : "ring-1 ring-border",
                    isMounted && "opacity-100",
                  )}
                  style={{ flex: "0 0 auto" }}
                >
                  <Image
                    src={category.image?.asset?.url || "/placeholder.svg"}
                    alt={category.name.en}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
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

