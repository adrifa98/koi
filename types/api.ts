import type { TwitchStream } from "@/lib/types"
import type { SanityVideo } from "./sanity"

export type VideoItem = SanityVideo | TwitchStream

export interface ApiResponse {
  items: VideoItem[]
  nextCursor: string | null
  error?: string
  details?: unknown
}

