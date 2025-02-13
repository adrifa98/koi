import { createClient } from "@sanity/client"
import { google, type youtube_v3 } from "googleapis"

const CHANNELS = [
  "https://www.youtube.com/@MovistarKOITV",
  "https://www.youtube.com/@MovistarKOILoL",
  "https://www.youtube.com/@TorontoUltra",
  "https://www.youtube.com/@MovistarKOIValorant",
  "https://www.youtube.com/@MovistarKOIVODS",
]

const MAX_RESULTS = 5 // Número de videos a obtener por canal
const MIN_DURATION = 60 // Duración mínima en segundos (1 minuto)

// Tipos para la respuesta de la API
type VideoItem = youtube_v3.Schema$SearchResult & {
  id: { videoId: string }
  snippet: Required<youtube_v3.Schema$SearchResultSnippet>
}

type VideoDetails = youtube_v3.Schema$Video & {
  id: string
  contentDetails: Required<youtube_v3.Schema$VideoContentDetails>
}

export async function GET() {
  try {
    // Validar variables de entorno
    if (!process.env.YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY is required")
    if (!process.env.SANITY_PROJECT_ID) throw new Error("SANITY_PROJECT_ID is required")
    if (!process.env.SANITY_DATASET) throw new Error("SANITY_DATASET is required")
    if (!process.env.SANITY_TOKEN) throw new Error("SANITY_TOKEN is required")

    // Inicializar clientes
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    })

    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      token: process.env.SANITY_TOKEN,
      apiVersion: "2023-01-01",
      useCdn: false,
    })

    // Obtener IDs de videos existentes en Sanity
    const existingVideos = await sanity.fetch<string[]>(`*[_type == "video"].videoId`)
    const existingVideoIds = new Set(existingVideos)

    // Procesar cada canal
    for (const channelUrl of CHANNELS) {
      try {
        console.log(`📺 Procesando canal: ${channelUrl}`)

        // Obtener ID del canal
        const channelHandle = channelUrl.split("@")[1]
        const channelResponse = await youtube.search.list({
          part: ["snippet"],
          q: channelHandle,
          type: ["channel"],
          maxResults: 1,
        })

        const channelId = channelResponse.data.items?.[0]?.id?.channelId
        if (!channelId) {
          console.log(`⚠️ No se encontró el canal: ${channelUrl}`)
          continue
        }

        // Obtener videos del canal
        const videosResponse = await youtube.search.list({
          part: ["snippet"],
          channelId,
          order: "date",
          type: ["video"],
          maxResults: MAX_RESULTS,
        })

        const videos =
          videosResponse.data.items?.filter((item): item is VideoItem => {
            return Boolean(item?.id?.videoId && item?.snippet)
          }) || []

        if (!videos.length) {
          console.log(`ℹ️ No se encontraron videos en: ${channelUrl}`)
          continue
        }

        // Obtener detalles de los videos (duración)
        const videoIds = videos.map((video) => video.id.videoId)
        const detailsResponse = await youtube.videos.list({
          part: ["contentDetails"],
          id: videoIds,
        })

        const videoDetails =
          detailsResponse.data.items?.filter((item): item is VideoDetails => {
            return Boolean(item?.id && item?.contentDetails?.duration)
          }) || []

        // Procesar cada video
        for (const video of videos) {
          // Encontrar la duración del video
          const details = videoDetails.find((detail) => detail.id === video.id.videoId)
          if (!details?.contentDetails?.duration) continue

          // Convertir duración ISO 8601 a segundos
          const duration = details.contentDetails.duration
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
          if (!match) continue

          const hours = Number.parseInt(match[1] || "0") * 3600
          const minutes = Number.parseInt(match[2] || "0") * 60
          const seconds = Number.parseInt(match[3] || "0")
          const totalSeconds = hours + minutes + seconds

          // Filtrar videos cortos
          if (totalSeconds < MIN_DURATION) {
            console.log(`⏭️ Saltando video corto: ${video.snippet.title}`)
            continue
          }

          // Verificar si el video ya existe
          if (existingVideoIds.has(video.id.videoId)) {
            console.log(`📝 Video ya existe: ${video.snippet.title}`)
            continue
          }

          // Crear documento en Sanity
          await sanity.create({
            _type: "video",
            title: video.snippet.title,
            videoId: video.id.videoId,
            channelName: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt,
            duration: totalSeconds,
          })

          console.log(`✅ Video añadido: ${video.snippet.title}`)
        }
      } catch (error) {
        console.error(`❌ Error procesando canal ${channelUrl}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Videos procesados correctamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("❌ Error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

