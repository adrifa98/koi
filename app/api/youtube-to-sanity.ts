import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { google, youtube_v3 } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
dotenv.config();

type Video = Required<Pick<youtube_v3.Schema$SearchResult, 'id' | 'snippet'>> & {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { high: { url: string } };
  };
};

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
});

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

const CHANNEL_URLS = [
  'https://www.youtube.com/@MovistarKOITV',
  'https://www.youtube.com/@MovistarKOILoL',
  'https://www.youtube.com/@TorontoUltra',
  'https://www.youtube.com/@MovistarKOIValorant',
  'https://www.youtube.com/@MovistarKOIVODS'
];

async function fetchLatestVideos(channelId: string, maxResults = 4): Promise<Video[]> {
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
    if (data.items) {
      videos = data.items.filter((item): item is Video => item.id?.videoId !== undefined && item.snippet !== undefined);
    }
  } catch (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error);
  }
  return videos;
}


function parseISO8601Duration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

async function isVideoInSanity(videoId: string): Promise<boolean> {
  const query = `*[_type == "video" && videoId == "${videoId}"]{_id}`;
  const result = await client.fetch(query);
  return result.length > 0;
}

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
      console.log(`Imported new video: ${video.snippet.title} with ID: ${result._id}`);
    } catch (err) {
      console.error('Error importing video:', err);
    }
  }
}

async function checkForNewVideos() {
  for (const url of CHANNEL_URLS) {
    try {
      const channelIdRes = await youtube.channels.list({ part: ['id'], forHandle: url.replace('https://www.youtube.com/@', ''), key: process.env.YOUTUBE_API_KEY });
      const channelData = channelIdRes.data as youtube_v3.Schema$ChannelListResponse;
      if (channelData.items && channelData.items.length > 0) {
        const id = channelData.items[0].id;
        const videos = await fetchLatestVideos(id!, 4);
        console.log(`Checking for new videos from ${url}`);
        await importNewVideos(videos);
      }
    } catch (error) {
      console.error(`Error processing channel ${url}:`, error);
    }
  }
  console.log('Checked for new videos.');
}




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await checkForNewVideos();
    // Test code
    await client.create({ _type: 'video', title: 'Test Video 1234', videoId: '1234', channelName: 'Test Channel', publishedAt: new Date().toISOString() });
    res.status(200).json({ message: 'YouTube videos checked and imported successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error importing videos', details: error });
  }
}


console.log('YouTube to Sanity cron job ready with Vercel.');
