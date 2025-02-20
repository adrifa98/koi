"use client"

import { Link } from "@/i18n/routing"
import type { Collection } from "@/lib/shopify/types"
import { createUrl } from "@/lib/utils"
import { usePathname, useSearchParams } from "next/navigation"

interface CollectionsProps {
  collections: Collection[]
  defaultTitle: string
}

export default function Collections({ collections, defaultTitle }: CollectionsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPath = pathname.split("/").pop()

  return (
    <nav>
      <h3 className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">Collections</h3>
      <ul className="hidden md:block">
        <li className="mt-2 flex text-black dark:text-white">
          <Link
            href={createUrl("/search", searchParams)}
            className={`w-full text-sm ${pathname === "/search" ? "underline underline-offset-4" : ""}`}
          >
            {defaultTitle}
          </Link>
        </li>
        {collections.map((collection) => (
          <li key={collection.handle} className="mt-2 flex text-black dark:text-white">
            <Link
              href={createUrl(`/search/${collection.handle}`, searchParams)}
              className={`w-full text-sm ${currentPath === collection.handle ? "underline underline-offset-4" : ""}`}
            >
              {collection.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

