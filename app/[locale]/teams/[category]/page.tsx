import { PlayersGrid } from "@/components/teams/players-grid"
import { getPlayersByCategory } from "@/lib/sanity/queries"; // Actualizada la importación
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

const validCategories = [
  "league-of-legends",
  "valorant",
  "pokemon",
  "toronto-ultra",
  "eafc",
  "fortnite",
  // Añadimos también los slugs cortos
  "lol",
  "val",
  "pkm",
  "cod",
  "fc",
  "fn",
]

export default async function TeamPage({ params }: { params: { category: string } }) {
  if (!validCategories.includes(params.category)) {
    notFound()
  }

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

export function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }))
}

