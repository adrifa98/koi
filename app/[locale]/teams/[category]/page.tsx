import { PlayersGrid } from "@/components/teams/players-grid"
import { getCategories, getPlayersByCategory } from "@/lib/sanity/queries"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Mapeo de slugs amigables a slugs de Sanity
const categoryMapping: { [key: string]: string } = {
  lol: "league-of-legends",
  val: "valorant",
  pkm: "pokemon",
  cod: "toronto-ultra",
  fc: "eafc",
  fn: "fortnite",
}

interface Props {
  params: { category: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sanityCategorySlug = categoryMapping[params.category] || params.category

  return {
    title: `${sanityCategorySlug.charAt(0).toUpperCase() + sanityCategorySlug.slice(1)} Team`,
    description: `Meet our professional ${sanityCategorySlug} team competing at the highest level.`,
  }
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories()

    if (!categories || categories.length === 0) {
      console.error("No categories found during static generation")
      return []
    }

    // Crear un array con todos los slugs posibles (incluyendo los amigables)
    const allSlugs = categories.reduce((acc: { category: string; locale: string }[], category) => {
      if (!category.slug?.current) {
        console.warn(`Category without slug found:`, category)
        return acc
      }

      // Añadir el slug original para ambos idiomas
      acc.push({ category: category.slug.current, locale: "es" }, { category: category.slug.current, locale: "en" })

      // Añadir el slug amigable si existe
      const friendlySlug = Object.entries(categoryMapping).find(([_, value]) => value === category.slug.current)?.[0]

      if (friendlySlug) {
        acc.push({ category: friendlySlug, locale: "es" }, { category: friendlySlug, locale: "en" })
      }

      return acc
    }, [])

    console.log("Generated static paths:", allSlugs)
    return allSlugs
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function TeamPage({ params }: Props) {
  try {
    // Convertir slug amigable al slug de Sanity si es necesario
    const sanityCategorySlug = categoryMapping[params.category] || params.category

    console.log("Fetching players for category:", sanityCategorySlug)
    const players = await getPlayersByCategory(sanityCategorySlug)
    console.log("Players found:", players?.length || 0)

    if (!players || players.length === 0) {
      console.log("No players found, returning 404")
      notFound()
    }

    return <PlayersGrid players={players} category={sanityCategorySlug} />
  } catch (error) {
    console.error("Error in TeamPage:", error)
    throw error // Esto mostrará la página de error por defecto
  }
}

