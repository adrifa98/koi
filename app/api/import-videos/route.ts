import { createClient } from "@sanity/client"
import { google } from "googleapis"

const CHANNELS = [
  "https://www.youtube.com/@MovistarKOITV",
  "https://www.youtube.com/@MovistarKOILoL",
  "https://www.youtube.com/@TorontoUltra",
  "https://www.youtube.com/@MovistarKOIValorant",
  "https://www.youtube.com/@MovistarKOIVODS",
]

const MAX_RESULTS = 5 // Número de videos a obtener por canal
const MIN_DURATION = 60 // Duración mínima en segundos (1 minuto)

// Configuración del cliente de Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: "2023-01-01",
  useCdn: false,
})

// Configuración de la API de YouTube
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

async function getExistingVideoIds(): Promise<Set<string>> {
  const query = `*[_type == "video"]{videoId}`
  const results = await client.fetch<{ videoId: string }[]>(query)
  return new Set(results.map((video) => video.videoId))
}

async function createVideo(videoData: any, duration: number) {
  try {
    console.log("🔄 Intentando crear video en Sanity:", {
      title: videoData.snippet.title,
      videoId: videoData.id.videoId,
      channelName: videoData.snippet.channelTitle,
    })

    const doc = {
      _type: "video",
      title: videoData.snippet.title,
      videoId: videoData.id.videoId,
      channelName: videoData.snippet.channelTitle,
      publishedAt: new Date(videoData.snippet.publishedAt).toISOString(),
      duration: duration,
    }

    // Validar que todos los campos requeridos estén presentes
    if (!doc.title || !doc.videoId || !doc.channelName || !doc.publishedAt) {
      throw new Error("Faltan campos requeridos")
    }

    console.log("📄 Documento a crear:", JSON.stringify(doc, null, 2))

    const result = await client
      .create(doc)
      .then((res) => {
        console.log("✅ Video creado exitosamente en Sanity:", res._id)
        return res
      })
      .catch((err) => {
        console.error("❌ Error específico de Sanity:", err)
        throw err
      })

    return result
  } catch (error) {
    console.error("❌ Error detallado al crear video:", error)
    throw error
  }
}

export async function GET() {
  try {
    // Validar variables de entorno
    if (!process.env.YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY is required")
    if (!process.env.SANITY_PROJECT_ID) throw new Error("SANITY_PROJECT_ID is required")
    if (!process.env.SANITY_DATASET) throw new Error("SANITY_DATASET is required")
    if (!process.env.SANITY_TOKEN) throw new Error("SANITY_TOKEN is required")

    // Verificar conexión con Sanity
    try {
      await client.fetch('*[_type == "video"][0]')
      console.log("✅ Conexión con Sanity verificada")
    } catch (error) {
      console.error("❌ Error conectando con Sanity:", error)
      throw new Error("No se pudo conectar con Sanity")
    }

    // Obtener IDs de videos existentes
    const existingVideoIds = await getExistingVideoIds()
    console.log(`📝 Videos existentes encontrados: ${existingVideoIds.size}`)

    let videosCreados = 0
    let erroresCreacion = 0

    // Procesar cada canal
    for (const channelUrl of CHANNELS) {
      try {
        console.log(`\n📺 Procesando canal: ${channelUrl}`)

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

        console.log(`🎯 ID del canal encontrado: ${channelId}`)

        // Obtener videos del canal
        const videosResponse = await youtube.search.list({
          part: ["snippet"],
          channelId,
          order: "date",
          type: ["video"],
          maxResults: MAX_RESULTS,
        })

        const videos = videosResponse.data.items
        if (!videos?.length) {
          console.log(`ℹ️ No se encontraron videos en: ${channelUrl}`)
          continue
        }

        console.log(`🎥 Encontrados ${videos.length} videos recientes`)

        // Procesar cada video
        for (const video of videos) {
          try {
            if (!video.id?.videoId || !video.snippet) {
              console.log("⚠️ Video sin ID o snippet, saltando...")
              continue
            }

            // Verificar si el video ya existe
            if (existingVideoIds.has(video.id.videoId)) {
              console.log(`📝 Video ya existe: ${video.snippet.title}`)
              continue
            }

            // Obtener detalles del video (duración)
            const detailsResponse = await youtube.videos.list({
              part: ["contentDetails"],
              id: [video.id.videoId],
            })

            const videoDetails = detailsResponse.data.items?.[0]
            if (!videoDetails?.contentDetails?.duration) {
              console.log("⚠️ No se encontró la duración del video, saltando...")
              continue
            }

            // Convertir duración ISO 8601 a segundos
            const duration = videoDetails.contentDetails.duration
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
            if (!match) {
              console.log("⚠️ Formato de duración inválido, saltando...")
              continue
            }

            const hours = Number.parseInt(match[1] || "0") * 3600
            const minutes = Number.parseInt(match[2] || "0") * 60
            const seconds = Number.parseInt(match[3] || "0")
            const totalSeconds = hours + minutes + seconds

            // Filtrar videos cortos
            if (totalSeconds < MIN_DURATION) {
              console.log(`⏭️ Saltando video corto: ${video.snippet.title}`)
              continue
            }

            // Crear el video en Sanity
            await createVideo(video, totalSeconds)
            videosCreados++
          } catch (error) {
            console.error(`❌ Error procesando video individual:`, error)
            erroresCreacion++
          }
        }
      } catch (error) {
        console.error(`❌ Error procesando canal ${channelUrl}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Videos procesados correctamente",
        stats: {
          videosCreados,
          erroresCreacion,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("❌ Error general:", error)
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

