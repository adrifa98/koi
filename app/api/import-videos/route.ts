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

// Función para obtener videos recientes de un canal
async function fetchLatestVideos(channelId: string, maxResults: number): Promise<Video[]> {
  const videos: Video[] = []
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

    for (const item of data.items) {
      if (!item.id?.videoId || !item.snippet) continue
      if (videoDetails[item.id.videoId] >= 60) {
        videos.push(item as Video)
      }
    }
  } catch (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error)
  }
  return videos
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

async function checkForNewVideos() {
  console.log("🔍 Checking for new videos...")

  for (const { url, maxResults } of CHANNELS) {
    try {
      console.log(`📡 Fetching channel ID for ${url}...`)
      const channelIdRes = await youtube.search.list({
        part: ["snippet"],
        type: ["channel"],
        q: url.replace("https://www.youtube.com/@", ""),
        maxResults: 1,
      })

      const channelData = channelIdRes.data as youtube_v3.Schema$SearchListResponse
      if (!channelData.items || channelData.items.length === 0) {
        console.log(`⚠️ No channel data found for ${url}`)
        continue
      }

      const channelId = channelData.items[0].id?.channelId ?? ""
      if (!channelId) {
        console.log(`⚠️ Channel ID not found for ${url}, skipping.`)
        continue
      }

      console.log(`📺 Found channel ID: ${channelId}`)

      const videos = await fetchLatestVideos(channelId, maxResults)
      console.log(`🎥 Found ${videos.length} videos from ${url}`)

      await importNewVideos(videos)
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

