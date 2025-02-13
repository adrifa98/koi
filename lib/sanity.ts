import type { SanityVideo } from "@/types/sanity"

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET

export async function getVideos(): Promise<SanityVideo[]> {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-02-12/data/query/${SANITY_DATASET}?query=*[_type == "video"]{_id,title,description,videoId,thumbnailUrl,category}`
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
  const query = `*[_type == "video" && (videoId match "*${videoId}*")][0]{_id,title,description,videoId,thumbnailUrl,category}`
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

