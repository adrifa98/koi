import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { google, youtube_v3 } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

dotenv.config();

// Tipado para el video obtenido de la API de YouTube
type Video = Required<Pick<youtube_v3.Schema$SearchResult, 'id' | 'snippet'>> & {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { high: { url: string } };
  };
};

// Configuración del cliente de Sanity
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2023-01-01',
  useCdn: false,
});

// Configuración de la API de YouTube
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

// Lista de canales a importar
const CHANNELS = [
  { url: 'https://www.youtube.com/@MovistarKOITV', maxResults: 45 },
  { url: 'https://www.youtube.com/@MovistarKOILoL', maxResults: 80 },
  { url: 'https://www.youtube.com/@TorontoUltra', maxResults: 3 },
  { url: 'https://www.youtube.com/@MovistarKOIValorant', maxResults: 1000 }, // Todos
  { url: 'https://www.youtube.com/@MovistarKOIVODS', maxResults: 1000 }, // Todos
];

// Función para obtener videos recientes de un canal
async function fetchLatestVideos(channelId: string, maxResults: number): Promise<Video[]> {
  let videos: Video[] = [];
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      channelId,
      maxResults,
      type: ['video'],
      order: 'date',
      key: process.env.YOUTUBE_API_KEY,
    } as youtube_v3.Params$Resource$Search$List);

    const data = response.data as youtube_v3.Schema$SearchListResponse;
    if (!data.items) return [];

    for (const item of data.items) {
      if (!item.id?.videoId || !item.snippet) continue;

      // Obtener detalles del video (duración)
      const videoDetails = await youtube.videos.list({
        part: ['contentDetails'],
        id: [item.id.videoId],
        key: process.env.YOUTUBE_API_KEY,
      });

      const duration = videoDetails.data.items?.[0]?.contentDetails?.duration;
      const durationInSeconds = parseISO8601Duration(duration || 'PT0S');

      // Filtrar videos de menos de 1 minuto (evitar Shorts)
      if (durationInSeconds >= 60) {
        videos.push(item as Video);
      }
    }
  } catch (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error);
  }
  return videos;
}

// Función para convertir duración ISO 8601 a segundos
function parseISO8601Duration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Función para verificar si un video ya está en Sanity
async function isVideoInSanity(videoId: string): Promise<boolean> {
  const query = `*[_type == "video" && videoId == "${videoId}"]{_id}`;
  const result = await client.fetch(query);
  return result.length > 0;
}

// Función para importar nuevos videos a Sanity
async function importNewVideos(videos: Video[]) {
  for (const video of videos) {
    if (!video.id.videoId || await isVideoInSanity(video.id.videoId)) continue;

    const doc = {
      _type: 'video',
      title: video.snippet.title,
      videoId: video.id.videoId,
      channelName: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
    };

    try {
      const result = await client.create(doc);
      console.log(`✅ Imported new video: ${video.snippet.title} with ID: ${result._id}`);
    } catch (err) {
      console.error('❌ Error importing video:', err);
    }
  }
}

// Función para revisar si hay nuevos videos en los canales configurados
async function checkForNewVideos() {
  console.log('🔍 Checking for new videos...');

  for (const { url, maxResults } of CHANNELS) {
    try {
      console.log(`📡 Fetching channel ID for ${url}...`);
      const channelIdRes = await youtube.channels.list({
        part: ['id'],
        forHandle: url.replace('https://www.youtube.com/@', ''),
        key: process.env.YOUTUBE_API_KEY,
      });

      const channelData = channelIdRes.data as youtube_v3.Schema$ChannelListResponse;
      if (!channelData.items || channelData.items.length === 0) {
        console.log(`⚠️ No channel data found for ${url}`);
        continue;
      }

      const channelId = channelData.items[0].id ?? ''; // Usa '' si es undefined
        if (!channelId) {
          console.log(`⚠️ Channel ID not found for ${url}, skipping.`);
          continue;
        }

      console.log(`📺 Found channel ID: ${channelId}`);

      const videos = await fetchLatestVideos(channelId, maxResults);
      console.log(`🎥 Found ${videos.length} videos from ${url}`);

      await importNewVideos(videos);
    } catch (error) {
      console.error(`🚨 Error processing channel ${url}:`, error);
    }
  }
  console.log('✅ Finished checking for new videos.');
}

// Endpoint API para ejecutar manualmente en Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('⏳ Starting manual video check...');
    await checkForNewVideos();
    console.log('✅ Finished manual video check.');
    res.status(200).json({ message: 'YouTube videos checked and imported successfully!' });
  } catch (error) {
    console.error('❌ Error importing videos:', error);
    res.status(500).json({ error: 'Error importing videos', details: error });
  }
}

// Test automático al iniciar
(async () => {
  console.log('🚀 Running initial test check...');
  await checkForNewVideos();
  console.log('✅ Initial test completed.');
})();

console.log('🎬 YouTube to Sanity cron job ready with Vercel.');
