"use client"

import type { Category } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface MobileCategoriesProps {
  categories: Category[]
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
}

export function MobileCategories({ categories, selectedCategories, onToggleCategory }: MobileCategoriesProps) {
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

  return (
    <div className="lg:hidden">
      <div ref={containerRef} className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onToggleCategory(category.slug.current)}
            className={cn(
              "category-card flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all hover:bg-accent",
              selectedCategories.includes(category.slug.current) && "bg-accent",
            )}
          >
            {category.image?.asset?.url && (
              <div className="relative h-5 w-5 overflow-hidden rounded-full">
                <Image
                  src={category.image.asset.url || "/placeholder.svg"}
                  alt={category.name.en}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-sm font-medium">{category.name.en}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

