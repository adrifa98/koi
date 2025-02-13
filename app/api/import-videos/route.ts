import { createClient } from "@sanity/client"
import { google, type youtube_v3 } from "googleapis"

// Tipado para el video obtenido de la API de YouTube
type Video = Required<Pick<youtube_v3.Schema$SearchResult, "id" | "snippet">> & {
  id: { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: { high: { url: string } }
  }
}

// Configuración del cliente de Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: "2023-01-01",
  useCdn: false,
})

// Configuración de la API de YouTube
const youtube = google.youtube({ version: "v3", auth: process.env.YOUTUBE_API_KEY })

// Lista de canales a importar
const CHANNELS: { url: string; maxResults: number }[] = [
  { url: "https://www.youtube.com/@MovistarKOITV", maxResults: 45 },
  { url: "https://www.youtube.com/@MovistarKOILoL", maxResults: 80 },
  { url: "https://www.youtube.com/@TorontoUltra", maxResults: 3 },
  { url: "https://www.youtube.com/@MovistarKOIValorant", maxResults: 1000 },
  { url: "https://www.youtube.com/@MovistarKOIVODS", maxResults: 1000 },
]

// Función para esperar con backoff exponencial
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Función modificada para obtener videos recientes de un canal con retry
async function fetchLatestVideos(channelId: string, maxResults: number, retryCount = 0): Promise<Video[]> {
  const MAX_RETRIES = 3
  const INITIAL_RETRY_DELAY = 1000 // 1 segundo

  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      channelId,
      maxResults,
      type: ["video"],
      order: "date",
    } as youtube_v3.Params$Resource$Search$List)

    const data = response.data as youtube_v3.Schema$SearchListResponse
    if (!data.items) return []

    const videoIds = data.items.map((item) => item.id?.videoId).filter(Boolean) as string[]
    const videoDetails = await fetchVideoDetails(videoIds)

    return data.items
      .filter((item) => item.id?.videoId && item.snippet && videoDetails[item.id.videoId] >= 60)
      .map((item) => item as Video)
  } catch (error: any) {
    if (error.code === 403 && error.errors?.[0]?.reason === "quotaExceeded") {
      console.log("⚠️ YouTube API quota exceeded. Skipping remaining operations.")
      return []
    }

    if (retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
      console.log(`Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms...`)
      await wait(delay)
      return fetchLatestVideos(channelId, maxResults, retryCount + 1)
    }

    console.error(`Error fetching videos for channel ${channelId}:`, error)
    return []
  }
}

async function fetchVideoDetails(videoIds: string[]): Promise<{ [key: string]: number }> {
  if (videoIds.length === 0) return {}

  const response = await youtube.videos.list({
    part: ["contentDetails"],
    id: videoIds,
  })

  return (
    response.data.items?.reduce((acc: { [key: string]: number }, item) => {
      if (item.id && item.contentDetails?.duration) {
        acc[item.id] = parseISO8601Duration(item.contentDetails.duration)
      }
      return acc
    }, {}) || {}
  )
}

function parseISO8601Duration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const matches = duration.match(regex)
  if (!matches) return 0

  const hours = Number.parseInt(matches[1] || "0", 10)
  const minutes = Number.parseInt(matches[2] || "0", 10)
  const seconds = Number.parseInt(matches[3] || "0", 10)
  return hours * 3600 + minutes * 60 + seconds
}

async function getExistingVideoIds(): Promise<Set<string>> {
  const query = `*[_type == "video"]{videoId}`
  const results = await client.fetch<{ videoId: string }[]>(query)
  return new Set(results.map((video) => video.videoId))
}

async function importNewVideos(videos: Video[]) {
  const existingVideoIds = await getExistingVideoIds()

  for (const video of videos) {
    if (existingVideoIds.has(video.id.videoId)) continue

    const doc = {
      _type: "video",
      title: video.snippet.title,
      videoId: video.id.videoId,
      channelName: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
    }

    try {
      const result = await client.create(doc)
      console.log(`✅ Imported new video: ${video.snippet.title} with ID: ${result._id}`)
    } catch (err) {
      console.error("❌ Error importing video:", err)
    }
  }
}

// Función modificada para obtener el ID del canal con retry
async function getChannelId(channelHandle: string, retryCount = 0): Promise<string | null> {
  const MAX_RETRIES = 3
  const INITIAL_RETRY_DELAY = 1000

  try {
    const channelIdRes = await youtube.search.list({
      part: ["snippet"],
      type: ["channel"],
      q: channelHandle,
      maxResults: 1,
    })

    const channelData = channelIdRes.data as youtube_v3.Schema$SearchListResponse
    return channelData.items?.[0]?.id?.channelId ?? null
  } catch (error: any) {
    if (error.code === 403 && error.errors?.[0]?.reason === "quotaExceeded") {
      console.log("⚠️ YouTube API quota exceeded. Skipping operation.")
      return null
    }

    if (retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
      console.log(`Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms...`)
      await wait(delay)
      return getChannelId(channelHandle, retryCount + 1)
    }

    console.error(`Error fetching channel ID for ${channelHandle}:`, error)
    return null
  }
}

async function checkForNewVideos() {
  console.log("🔍 Checking for new videos...")

  for (const { url, maxResults } of CHANNELS) {
    try {
      const channelHandle = url.replace("https://www.youtube.com/@", "")
      console.log(`📡 Fetching channel ID for ${channelHandle}...`)

      const channelId = await getChannelId(channelHandle)
      if (!channelId) {
        console.log(`⚠️ Could not get channel ID for ${url}, skipping.`)
        continue
      }

      console.log(`📺 Found channel ID: ${channelId}`)
      const videos = await fetchLatestVideos(channelId, maxResults)

      if (videos.length > 0) {
        console.log(`🎥 Found ${videos.length} videos from ${url}`)
        await importNewVideos(videos)
      } else {
        console.log(`ℹ️ No new videos found for ${url}`)
      }
    } catch (error) {
      console.error(`🚨 Error processing channel ${url}:`, error)
    }
  }
  console.log("✅ Finished checking for new videos.")
}

export async function GET() {
  try {
    console.log("⏳ Starting scheduled video check...")
    await checkForNewVideos()
    console.log("✅ Finished scheduled video check.")
    return new Response(JSON.stringify({ message: "YouTube videos checked and imported successfully!" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("❌ Error importing videos:", error)
    return new Response(JSON.stringify({ error: "Error importing videos", details: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

