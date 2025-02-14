import { getVideos } from "@/lib/sanity"
import { getTwitchStreams } from "@/lib/twitch"
import type { TwitchStream } from "@/lib/types"
import type { ApiResponse } from "@/types/api"
import type { SanityVideo } from "@/types/sanity"
import type { NextRequest } from "next/server"
import { z } from "zod"

const QuerySchema = z.object({
  cursor: z.string().nullable().optional(),
  limit: z.coerce.number().default(15),
  type: z.enum(["youtube", "twitch"]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = QuerySchema.safeParse({
      cursor: searchParams.get("cursor"),
      limit: searchParams.get("limit"),
      type: searchParams.get("type"),
    })

    if (!parsed.success) {
      return Response.json({ error: "Invalid parameters", details: parsed.error }, { status: 400 })
    }

    const { cursor, limit, type } = parsed.data
    let items: (SanityVideo | TwitchStream)[] = []
    let nextCursor: string | null = null

    if (type === "youtube") {
      const allVideos = await getVideos()
      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit

      items = allVideos.slice(startIndex, endIndex)
      nextCursor = endIndex < allVideos.length ? endIndex.toString() : null
    } else if (type === "twitch") {
      const streams = await getTwitchStreams()
      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit

      items = streams.slice(startIndex, endIndex)
      nextCursor = endIndex < streams.length ? endIndex.toString() : null
    }

    const response: ApiResponse = {
      items,
      nextCursor,
    }

    return Response.json(response)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return Response.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

