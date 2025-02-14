import { getVideos } from "@/lib/sanity"
import { getTwitchStreams } from "@/lib/twitch"
import type { TwitchStream } from "@/lib/types"
import type { ApiResponse } from "@/types/api"
import type { SanityVideo } from "@/types/sanity"
import type { NextRequest } from "next/server"
import { z } from "zod"

const QuerySchema = z
  .object({
    cursor: z.string().nullable().optional(),
    limit: z.coerce.number().default(15),
    type: z.enum(["youtube", "twitch"]),
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
    let items: (SanityVideo | TwitchStream)[] = []
    let nextCursor: string | null = null

    if (type === "youtube") {
      const allVideos = await getVideos()
      // Filtrar por canal y ordenar por fecha
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
      // Para streams de Twitch, solo mostrar los que están en vivo y ordenar por viewers
      const liveStreams = streams.filter((stream) => stream.is_live).sort((a, b) => b.viewer_count - a.viewer_count)

      const startIndex = cursor ? Number.parseInt(cursor) : 0
      const endIndex = startIndex + limit

      items = liveStreams.slice(startIndex, endIndex)
      nextCursor = endIndex < liveStreams.length ? endIndex.toString() : null
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

