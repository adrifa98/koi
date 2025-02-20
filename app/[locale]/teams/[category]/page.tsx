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
  // Convertir slug amigable al slug de Sanity si es necesario
  const sanityCategorySlug = categoryMapping[params.category] || params.category

  return {
    title: `${sanityCategorySlug.charAt(0).toUpperCase() + sanityCategorySlug.slice(1)} Team`,
    description: `Meet our professional ${sanityCategorySlug} team competing at the highest level.`,
  }
}

// Generar rutas estáticas para todas las categorías posibles
export async function generateStaticParams() {
  const categories = await getCategories()

  // Crear un array con todos los slugs posibles (incluyendo los amigables)
  const allSlugs = categories.reduce((acc: { category: string }[], category) => {
    // Añadir el slug original
    acc.push({ category: category.slug.current })

    // Añadir el slug amigable si existe
    const friendlySlug = Object.entries(categoryMapping).find(([_, value]) => value === category.slug.current)?.[0]
    if (friendlySlug) {
      acc.push({ category: friendlySlug })
    }

    return acc
  }, [])

  console.log("Generated static paths:", allSlugs)
  return allSlugs
}

export default async function TeamPage({ params }: Props) {
  // Convertir slug amigable al slug de Sanity si es necesario
  const sanityCategorySlug = categoryMapping[params.category] || params.category

  console.log("Fetching players for category:", sanityCategorySlug)
  const players = await getPlayersByCategory(sanityCategorySlug)
  console.log("Players found:", players?.length || 0)

  if (!players || players.length === 0) {
    notFound()
  }

  return <PlayersGrid players={players} category={sanityCategorySlug} />
}

