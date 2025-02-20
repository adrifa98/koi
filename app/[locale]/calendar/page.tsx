import { CalendarClient } from "@/components/calendar/calendar-client"
import { getCategories, getMatches } from "@/lib/sanity/queries"

export default async function Home() {
  const [matches, categories] = await Promise.all([getMatches(), getCategories()])

  return (
    <div className="min-h-screen bg-background">
      <CalendarClient initialMatches={matches} categories={categories} />
    </div>
  )
}

