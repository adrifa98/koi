"use client"

import { DatePicker } from "@/components/calendar/date-picker"
import type { Category } from "@/lib/sanity"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import Image from "next/image"
import { useEffect, useRef } from "react"
import type { DateRange } from "react-day-picker"

interface SidebarProps {
  categories: Category[]
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
  date?: DateRange
  onDateSelect?: (date: DateRange | undefined) => void
}

export function Sidebar({ categories, selectedCategories, onToggleCategory, date, onDateSelect }: SidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".category-card", {
        x: 20,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <aside className="sticky top-20 space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-semibold">Date Range</h2>
        <DatePicker date={date} onSelect={onDateSelect} className="w-full [&>div]:w-full [&_button]:w-full" />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div ref={containerRef} className="space-y-2">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onToggleCategory(category.slug.current)}
              className={cn(
                "category-card group relative flex w-full items-center gap-2 rounded-lg p-2 transition-all hover:bg-accent",
                selectedCategories.includes(category.slug.current) && "bg-accent",
              )}
            >
              {category.image?.asset?.url && (
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
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
    </aside>
  )
}

