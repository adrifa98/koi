import { getVideos } from "@/lib/sanity/queries"
import { getTwitchStreams } from "@/lib/twitch"
import type { TwitchStream } from "@/lib/types"
import type { ApiResponse } from "@/types/api"
import type { SanityVideo } from "@/types/sanity"
import type { NextRequest } from "next/server"
import { z } from "zod"

// Define a union type for VideoItem
type VideoItem = SanityVideo | TwitchStream

const QuerySchema = z
  .object({
    cursor: z.string().nullable().optional(),
    limit: z.coerce.number().default(15),
    type: z.enum(["youtube", "twitch"]).optional(),
    channel: z.string().optional(),
  })
  .partial() // Make all fields optional

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = QuerySchema.safeParse({
      cursor: searchParams.get("cursor"),
      limit: searchParams.get("limit"),
      type: searchParams.get("type"),
      channel: searchParams.get("channel"),
    })

    if (!parsed.success) {
      return Response.json({ error: "Invalid parameters", details: parsed.error }, { status: 400 })
    }

    const { cursor, limit = 15, type, channel } = parsed.data
    let items: VideoItem[] = []
    let nextCursor: string | null = null

    if (type === "youtube") {
      const allVideos = await getVideos()
      const filteredVideos = channel
        ? allVideos
            .filter((video) => video.channelName === channel)
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        : allVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit

      items = filteredVideos.slice(startIndex, endIndex)
      nextCursor = endIndex < filteredVideos.length ? endIndex.toString() : null
    } else if (type === "twitch") {
      const streams = await getTwitchStreams()
      const liveStreams = streams.filter((stream) => stream.is_live).sort((a, b) => b.viewer_count - a.viewer_count)

      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit

      items = liveStreams.slice(startIndex, endIndex)
      nextCursor = endIndex < liveStreams.length ? endIndex.toString() : null
    } else {
      // Handle case when type is not provided
      const [videos, streams] = await Promise.all([getVideos(), getTwitchStreams()])
      const liveStreams = streams.filter((stream) => stream.is_live)

      // Combine arrays with type assertion
      const allItems: VideoItem[] = [...videos, ...liveStreams]

      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit
      items = allItems.slice(startIndex, endIndex)
      nextCursor = endIndex < allItems.length ? endIndex.toString() : null
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

