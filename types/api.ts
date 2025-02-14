import type { TwitchStream } from "@/lib/types"
import type { SanityVideo } from "./sanity"

export interface ApiResponse {
  items: (SanityVideo | TwitchStream)[]
  nextCursor: string | null
  error?: string
  details?: unknown
}

