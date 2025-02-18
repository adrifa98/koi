"use server"

import type { BlogPost } from "@/types/blog"

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
  throw new Error("Missing Sanity environment variables")
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    content,
    categories[]->{
      _id,
      name,
      slug,
      channel,
      "image": {
        "asset": {
          "url": image.asset->url
        }
      }
    },
    readingTime,
    "mainImage": {
      "asset": {
        "url": mainImage.asset->url
      },
      "alt": mainImage.alt
    },
    publishedAt
  }`

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
    query,
  )}`

  try {
    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const query = `*[_type == "blog" && _id == "${id}"][0]{
    _id,
    title,
    subtitle,
    content,
    categories[]->{
      _id,
      name,
      slug,
      channel,
      "image": {
        "asset": {
          "url": image.asset->url
        }
      }
    },
    readingTime,
    "mainImage": {
      "asset": {
        "url": mainImage.asset->url
      },
      "alt": mainImage.alt
    },
    publishedAt
  }`

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
    query,
  )}`

  try {
    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

