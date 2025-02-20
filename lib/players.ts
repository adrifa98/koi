"use server"

import type { Player } from "@/types/player"
import { client } from "./sanity"

export async function getPlayersByCategory(categorySlug: string): Promise<Player[]> {
  console.log("Fetching players for category:", categorySlug)

  try {
    const players = await client.fetch<Player[]>(
      `*[_type == "player" && $categorySlug in categories[]->slug.current] {
        _id,
        username,
        firstName,
        lastName,
        description,
        slug,
        twitter,
        youtube,
        twitch,
        instagram,
        image,
        "categories": categories[]->{
          _id,
          name,
          slug,
          image,
          channel,
          subCategory
        }
      }`,
      { categorySlug },
    )

    // Ordenar jugadores primero por subcategoría
    const sortedPlayers = players.sort((a: Player, b: Player) => {
      const aCategory = a.categories.find((cat) => cat.slug.current === categorySlug)
      const bCategory = b.categories.find((cat) => cat.slug.current === categorySlug)

      const aSubCategory = aCategory?.subCategory || ""
      const bSubCategory = bCategory?.subCategory || ""

      return aSubCategory.localeCompare(bSubCategory)
    })

    console.log("Found players:", sortedPlayers)
    return sortedPlayers
  } catch (error) {
    console.error("Error fetching players:", error)
    return []
  }
}

export async function getAllPlayers(): Promise<Player[]> {
  try {
    const players = await client.fetch<Player[]>(
      `*[_type == "player"] {
        _id,
        username,
        firstName,
        lastName,
        description,
        slug,
        twitter,
        youtube,
        twitch,
        instagram,
        image,
        "categories": categories[]->{
          _id,
          name,
          slug,
          image,
          channel,
          subCategory
        }
      }`,
    )

    return players
  } catch (error) {
    console.error("Error fetching all players:", error)
    return []
  }
}

