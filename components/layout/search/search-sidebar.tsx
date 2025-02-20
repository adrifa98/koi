"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { sorting } from "@/lib/constants"
import type { Collection } from "@/lib/shopify/types"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchForm } from "./search-form"

interface SearchSidebarProps {
  collections: Collection[]
  sortTitle: string
}

const SortFilter = () => {
  const t = useTranslations("search.sort")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || "default"

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "default") {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup value={currentSort} onValueChange={handleSort} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="default" id="default" />
          <label htmlFor="default" className="text-sm">
            {t("default")}
          </label>
        </div>
        {sorting
          .filter((option) => option.slug !== "default")
          .map((option) => (
            <div key={option.slug} className="flex items-center gap-2">
              <RadioGroupItem value={option.slug} id={option.slug} />
              <label htmlFor={option.slug} className="text-sm">
                {t(option.title)}
              </label>
            </div>
          ))}
      </RadioGroup>
    </div>
  )
}

export function SearchSidebar({ collections, sortTitle }: SearchSidebarProps) {
  const t = useTranslations("search")
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleCollectionChange = (value: string) => {
    if (value === "all") {
      router.push(`/${locale}/search`)
    } else {
      router.push(`/${locale}/search/${value}`)
    }
  }

  const currentCollection = pathname === `/${locale}/search` ? "all" : pathname.split("/").pop()

  // Filtrar las colecciones que no queremos mostrar
  const filteredCollections = collections.filter(
    (collection) => !["all", "frontpage", "All"].includes(collection.handle.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <SearchForm />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">{t("collections.title")}</h3>
        <RadioGroup defaultValue={currentCollection} onValueChange={handleCollectionChange}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm">
                {t("collections.all")}
              </Label>
            </div>
            {filteredCollections.map((collection) => (
              <div key={collection.handle} className="flex items-center space-x-2">
                <RadioGroupItem value={collection.handle} id={collection.handle} />
                <Label htmlFor={collection.handle} className="text-sm">
                  {collection.title}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <Accordion type="single" collapsible defaultValue="sort">
        <AccordionItem value="sort">
          <AccordionTrigger>{sortTitle}</AccordionTrigger>
          <AccordionContent>
            <SortFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

