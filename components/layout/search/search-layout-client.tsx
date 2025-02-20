"use client"

import type React from "react"

import Collections from "@/components/layout/search/collections"
import FilterList from "@/components/layout/search/filter"
import { sorting } from "@/lib/constants"
import type { Collection } from "@/lib/shopify/types"

interface SearchLayoutClientProps {
  children: React.ReactNode
  collections: Collection[]
  defaultTitle: string
  sortTitle: string
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

