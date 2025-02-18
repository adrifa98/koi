"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Image from "next/image"

interface Category {
  id: string
  name: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  image?: {
    asset: {
      url: string
    }
  }
}

interface BlogCategoriesProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function BlogCategories({ categories, selectedCategory, onCategorySelect }: BlogCategoriesProps) {
  const t = useTranslations("blog")
  const tPost = useTranslations("blog.post")

  if (!categories.length) return null

  return (
    <ScrollArea className="w-full sm:w-auto">
      <div className="flex space-x-2 p-1">
        <button
          onClick={() => onCategorySelect(null)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-accent",
            !selectedCategory && "bg-accent",
          )}
        >
          {t("allPosts")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.slug.current)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-accent whitespace-nowrap",
              selectedCategory === category.slug.current && "bg-accent",
            )}
          >
            {category.image?.asset?.url && (
              <div className="relative h-5 w-5 overflow-hidden rounded-full">
                <Image
                  src={category.image.asset.url || "/placeholder.svg"}
                  alt={tPost("category", { category: category.name.en })}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {tPost("category", { category: category.name.en })}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}

