"use server"

import type { Match } from "@/lib/sanity"

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
  throw new Error("Missing Sanity environment variables")
}

export async function getLatestMatches(): Promise<Match[]> {
  const now = new Date()

  // First try to get live matches
  const liveQuery = `*[_type == "match" && matchDate <= "${now.toISOString()}" && matchDate >= "${new Date(
    now.getTime() - 4 * 60 * 60 * 1000,
  ).toISOString()}"]
  | order(matchDate asc)[0...4] {
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
  }`

  const liveUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
    liveQuery,
  )}`

  try {
    console.log("Fetching live matches...")
    const liveResponse = await fetch(liveUrl, { cache: "no-store" })
    const responseText = await liveResponse.text()
    console.log("Raw response:", responseText)

    if (!liveResponse.ok) {
      console.error("Sanity API error:", {
        status: liveResponse.status,
        statusText: liveResponse.statusText,
        body: responseText,
      })
      throw new Error(`HTTP error! status: ${liveResponse.status}`)
    }

    const liveData = JSON.parse(responseText)
    console.log("Live matches response:", liveData)

    if (liveData?.result && liveData.result.length > 0) {
      return liveData.result
    }

    console.log("No live matches, fetching upcoming matches...")
    const upcomingQuery = `*[_type == "match" && matchDate > "${now.toISOString()}"]
    | order(matchDate asc)[0...4] {
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
    }`

    const upcomingUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
      upcomingQuery,
    )}`
    const upcomingResponse = await fetch(upcomingUrl, { cache: "no-store" })

    if (!upcomingResponse.ok) {
      throw new Error(`HTTP error! status: ${upcomingResponse.status}`)
    }

    const upcomingData = await upcomingResponse.json()
    console.log("Upcoming matches response:", upcomingData)

    if (upcomingData?.result && upcomingData.result.length > 0) {
      return upcomingData.result
    }

    console.log("No upcoming matches, fetching past matches...")
    const pastQuery = `*[_type == "match" && matchDate < "${now.toISOString()}"]
    | order(matchDate desc)[0...4] {
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
    }`

    const pastUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
      pastQuery,
    )}`
    const pastResponse = await fetch(pastUrl, { cache: "no-store" })

    if (!pastResponse.ok) {
      throw new Error(`HTTP error! status: ${pastResponse.status}`)
    }

    const pastData = await pastResponse.json()
    console.log("Past matches response:", pastData)

    return pastData?.result || []
  } catch (error) {
    console.error("Error in getLatestMatches:", error)
    return []
  }
}

export async function fetchMoreMatches(direction: "before" | "after", date: string): Promise<Match[]> {
  if (!date) {
    throw new Error("Date parameter is required")
  }

  try {
    // Construir la query usando la fecha directamente en la comparación
    const operator = direction === "before" ? "<" : ">"
    const order = direction === "before" ? "desc" : "asc"

    const query = `*[_type == "match" && matchDate ${operator} "${date}"] | order(matchDate ${order})[0...10] {
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
    }`

    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
      query,
    )}`

    console.log("Fetching matches:", {
      direction,
      date,
      query,
    })

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Sanity API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log("Matches response:", data)

    return data.result
  } catch (error) {
    console.error("Error in fetchMoreMatches:", error)
    throw error
  }
}
