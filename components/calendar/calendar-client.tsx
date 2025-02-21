"use client"

import { Matches } from "@/components/calendar/matches"
import { Sidebar } from "@/components/calendar/sidebar"
import type { Category, Match } from "@/types/sanity"
import { useTheme } from "next-themes"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

interface CalendarClientProps {
  initialMatches: Match[]
  categories: Category[]
}

export function CalendarClient({ initialMatches, categories }: CalendarClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [date, setDate] = useState<DateRange | undefined>()
  const { theme, setTheme } = useTheme()

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug) ? prev.filter((slug) => slug !== categorySlug) : [...prev, categorySlug],
    )
  }

  return (
    <>
      <div className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="w-full lg:w-[65%]">
              <Matches matches={initialMatches} selectedCategories={selectedCategories} dateRange={date} />
            </div>
            <div className="hidden lg:block lg:w-[35%]">
              <Sidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleCategoryToggle}
                date={date}
                onDateSelect={setDate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

