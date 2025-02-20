"use client"

import Collections from "@/components/layout/search/collections"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { sorting } from "@/lib/constants"
import type { Collection } from "@/lib/shopify/types"
import { createUrl } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type React from "react"

interface SearchLayoutClientProps {
  children: React.ReactNode
  collections: Collection[]
  defaultTitle: string
  sortTitle: string
}

function FilterList({ list, title }: { list: typeof sorting; title: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const defaultSort = list[0].slug

  const sort = searchParams.get("sort")

  return (
    <div className="hidden md:block">
      <h3 className="text-xs text-neutral-500 dark:text-neutral-400">{title}</h3>
      <RadioGroup
        defaultValue={defaultSort}
        value={sort || defaultSort}
        onValueChange={(value) => {
          const newParams = new URLSearchParams(searchParams.toString())
          newParams.set("sort", value)
          router.push(createUrl(pathname, newParams))
        }}
        className="mt-3 flex flex-col gap-3"
      >
        {list.map((item) => (
          <div key={item.slug} className="flex items-center space-x-2">
            <RadioGroupItem value={item.slug} id={item.slug} />
            <Label htmlFor={item.slug} className="text-sm font-normal">
              {t(item.title)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export function SearchLayoutClient({ children, collections, defaultTitle, sortTitle }: SearchLayoutClientProps) {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <Collections collections={collections} defaultTitle={defaultTitle} />
      </div>
      <div className="order-last min-h-screen w-full md:order-none">{children}</div>
      <div className="order-none flex-none md:order-last md:w-[125px]">
        <FilterList list={sorting} title={sortTitle} />
      </div>
    </div>
  )
}

