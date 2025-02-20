"use server"

import type { Player } from "@/types/player"
import type { Category, Match, SanityVideo } from "@/types/sanity"
import { client } from "./client"

export type { Category, Match }; // Exportar los tipos

// Funciones de players
export async function getPlayersByCategory(categorySlug: string): Promise<Player[]> {
  console.log("=== Fetching Players ===")
  console.log("Category slug:", categorySlug)

  try {
    const query = `*[_type == "player" && $categorySlug in categories[]->slug.current] {
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
        channel,
        subCategory,
        "image": {
          "asset": {
            "url": image.asset->url
          }
        }
      }
    }`

    console.log("Executing query:", query)
    console.log("With params:", { categorySlug })

    const players = await client.fetch<Player[]>(query, { categorySlug })

    console.log("=== Query Results ===")
    console.log("Total players found:", players.length)
    players.forEach((player) => {
      console.log(`Player "${player.username}":`, {
        id: player._id,
        categories: player.categories.map((cat) => ({
          slug: cat.slug.current,
          subCategory: cat.subCategory,
          name: cat.name,
        })),
      })
    })

    // Ordenar jugadores primero por subcategoría
    const sortedPlayers = players.sort((a: Player, b: Player) => {
      const aCategory = a.categories.find((cat) => cat.slug.current === categorySlug)
      const bCategory = b.categories.find((cat) => cat.slug.current === categorySlug)

      const aSubCategory = aCategory?.subCategory || ""
      const bSubCategory = bCategory?.subCategory || ""

      return aSubCategory.localeCompare(bSubCategory)
    })

    return sortedPlayers
  } catch (error) {
    console.error("=== Error Fetching Players ===")
    console.error("Error details:", error)
    return []
  }
}

// Funciones de matches
export async function getMatches(): Promise<Match[]> {
  const now = new Date()

  const query = `{
    "before": *[_type == "match" && matchDate < $now] | order(matchDate desc)[0...20] {
      _id,
      bo,
      channel,
      "categoryChannel": category->channel,
      category->{
        _id,
        name,
        slug,
        channel,
        "image": image.asset->{url,alt}
      },
      team1{
        name,
        score,
        "image": image.asset->{url,alt}
      },
      team2{
        name,
        score,
        "image": image.asset->{url,alt}
      },
      matchDate
    },
    "after": *[_type == "match" && matchDate >= $now] | order(matchDate asc)[0...20] {
      _id,
      bo,
      channel,
      "categoryChannel": category->channel,
      category->{
        _id,
        name,
        slug,
        channel,
        "image": image.asset->{url,alt}
      },
      team1{
        name,
        score,
        "image": image.asset->{url,alt}
      },
      team2{
        name,
        score,
        "image": image.asset->{url,alt}
      },
      matchDate
    },
    "total": count(*[_type == "match"]),
    "earliest": *[_type == "match"] | order(matchDate asc)[0].matchDate,
    "latest": *[_type == "match"] | order(matchDate desc)[0].matchDate
  }`

  try {
    console.log("Fetching matches...")
    const result = await client.fetch(query, { now: now.toISOString() })

    // Combinar y ordenar los resultados
    const matches = [...result.before.reverse(), ...result.after]
    return matches
  } catch (error) {
    console.error("Error fetching matches:", error)
    return []
  }
}

// Funciones de categories
export async function getCategories(): Promise<Category[]> {
  const query =
    '*[_type == "category"] | order(_createdAt asc) {_id,name,slug,current,description,en,es,image{asset->{url},alt}}'

  try {
    const result = await client.fetch(query, {}, { next: { revalidate: 60 } })
    return result
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Funciones de videos
export async function getVideos(): Promise<SanityVideo[]> {
  try {
    const result = await client.fetch(
      `*[_type == "video"]{
        _id,
        title,
        videoId,
        channelName,
        publishedAt,
        duration
      }`,
      {},
      { next: { revalidate: 60 } },
    )

    return result.map((video: any) => ({
      ...video,
      videoId: extractVideoId(video.videoId),
      thumbnailUrl:
        video.thumbnailUrl || `https://img.youtube.com/vi/${extractVideoId(video.videoId)}/maxresdefault.jpg`,
    }))
  } catch (error) {
    console.error("Error fetching videos:", error)
    return []
  }
}

export async function getVideo(videoId: string): Promise<SanityVideo | null> {
  try {
    const result = await client.fetch(
      `*[_type == "video" && (videoId match "*${videoId}*")][0]{
        _id,
        title,
        videoId,
        channelName,
        publishedAt,
        duration
      }`,
      {},
      { next: { revalidate: 60 } },
    )

    if (!result) return null

    return {
      ...result,
      videoId: extractVideoId(result.videoId),
      thumbnailUrl:
        result.thumbnailUrl || `https://img.youtube.com/vi/${extractVideoId(result.videoId)}/maxresdefault.jpg`,
    }
  } catch (error) {
    console.error("Error fetching video:", error)
    return null
  }
}

function extractVideoId(url: string): string {
  if (!url) return ""
  if (!url.includes("/") && !url.includes("watch?v=")) return url
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&]+)/i)
  return match ? match[1] : url
}

