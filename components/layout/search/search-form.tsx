"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useLocale } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultSearchQuery = searchParams.get("q") || ""
  const [searchValue, setSearchValue] = useState(defaultSearchQuery)
  const locale = useLocale()

  useEffect(() => {
    setSearchValue(defaultSearchQuery)
  }, [defaultSearchQuery])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement
    const newParams = new URLSearchParams(searchParams.toString())

    if (search.value) {
      newParams.set("q", search.value)
    } else {
      newParams.delete("q")
    }

    router.push(`/${locale}/search?${newParams.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative">
        <Input
          key={defaultSearchQuery}
          type="text"
          name="search"
          placeholder="Buscar productos..."
          autoComplete="off"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
          <MagnifyingGlassIcon className="h-4" />
        </div>
      </div>
    </form>
  )
}

