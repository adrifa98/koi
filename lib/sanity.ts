"use server"
import type { SanityVideo } from "@/types/sanity"
import imageUrlBuilder from "@sanity/image-url"
import { createClient } from "next-sanity"


const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
  throw new Error("Missing Sanity environment variables")
}


export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-02-12",
  useCdn: false,
})


const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source).url()
}

export interface Category {
  _id: string
  name: {
    en: string
    es: string
  }
  slug: {
    current: string
    _type: string
  }
  current: null
  description: null
  en: null
  es: null
  image: {
    asset: {
      url: string
    }
    alt: null
  }
}

export interface Match {
  _id: string
  bo: string
  channel: string | null
  categoryChannel: string | null // New field from the query
  category: {
    _id: string
    name: {
      en: string
      es: string
    }
    slug: {
      current: string
      _type: string
    }
    channel: string | null
    image: {
      url: string
      alt: null
    }
  }
  team1: {
    name: string
    score: number
    image: {
      url: string
      alt: null
    } | null
  }
  team2: {
    name: string
    score: number
    image: {
      url: string
      alt: null
    } | null
  }
  matchDate: string
}

export async function getMatches(): Promise<Match[]> {
  const now = new Date()

  // Ajustar el rango para obtener más partidos inicialmente
  const query = `{
    "before": *[_type == "match" && matchDate < $now] | order(matchDate desc)[0...20] {
      _id,
      bo,
      category->{
        _id,
        name,
        slug,
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
      category->{
        _id,
        name,
        slug,
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

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}&$now="${now.toISOString()}"`

  try {
    console.log("Fetching initial matches...")
    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Initial matches data:", {
      beforeCount: data.result.before.length,
      afterCount: data.result.after.length,
      total: data.result.total,
      earliest: data.result.earliest,
      latest: data.result.latest,
    })

    // Combinar y ordenar los resultados
    const matches = [...data.result.before.reverse(), ...data.result.after]
    return matches
  } catch (error) {
    console.error("Error fetching matches:", error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  const query =
    '*[_type == "category"] | order(_createdAt asc) {_id,name,slug,current,description,en,es,image{asset->{url},alt}}'
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`

  try {
    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getVideos(): Promise<SanityVideo[]> {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=*[_type == "video"]{_id,title,videoId,channelName,publishedAt,duration}`
  const response = await fetch(url, { next: { revalidate: 60 } })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.result.map((video: any) => ({
    ...video,
    videoId: extractVideoId(video.videoId),
    thumbnailUrl: video.thumbnailUrl || `https://img.youtube.com/vi/${extractVideoId(video.videoId)}/maxresdefault.jpg`,
  }))
}

export async function getVideo(videoId: string): Promise<SanityVideo | null> {
  const query = `*[_type == "video" && (videoId match "*${videoId}*")][0]{_id,title,videoId,channelName,publishedAt,duration}`
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`

  const response = await fetch(url, { next: { revalidate: 60 } })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (!data.result) return null

  return {
    ...data.result,
    videoId: extractVideoId(data.result.videoId),
    thumbnailUrl:
      data.result.thumbnailUrl || `https://img.youtube.com/vi/${extractVideoId(data.result.videoId)}/maxresdefault.jpg`,
  }
}

function extractVideoId(url: string): string {
  if (!url) return ""
  if (!url.includes("/") && !url.includes("watch?v=")) return url
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&]+)/i)
  return match ? match[1] : url
}

