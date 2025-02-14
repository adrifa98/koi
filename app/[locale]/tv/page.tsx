import { ChannelSidebar } from "@/components/tv/channel-sidebar"
import { HeroSection } from "@/components/tv/hero-section"
import { VideoCarousel } from "@/components/tv/video-carousel"
import { getVideos } from "@/lib/sanity"
import { getTwitchStreams } from "@/lib/twitch"

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  try {
    const [videos, streams] = await Promise.all([getVideos(), getTwitchStreams()])

    const channels = {
      "Movistar KOI": "Novedades",
      MovistarKOILoL: "League of Legends",
      MovistarKOIValorant: "Valorant",
      "Toronto Ultra": "Toronto Ultra",
      MovistarKOIVODS: "VODs",
    }

    const videosByChannel = Object.keys(channels).reduce(
      (acc, channel) => {
        acc[channel] = videos
          .filter((video) => video.channelName === channel)
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        return acc
      },
      {} as Record<string, typeof videos>,
    )

    const liveStreams = streams.filter((stream) => stream.is_live)

    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <ChannelSidebar streams={streams} />
        <div className="ml-[80px]">
          <main>
            <HeroSection />
            <div className="space-y-8 pb-8">
              {liveStreams.length > 0 && (
                <VideoCarousel title="Live Now" videosType="twitch" initialVideos={liveStreams} />
              )}
              {Object.entries(channels).map(
                ([channel, title]) =>
                  videosByChannel[channel]?.length > 0 && (
                    <VideoCarousel
                      key={channel}
                      title={title}
                      videosType="youtube"
                      initialVideos={videosByChannel[channel]}
                    />
                  ),
              )}
            </div>
          </main>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in Home page:", err)
    const error = err instanceof Error ? err : new Error("An unknown error occurred")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">Please try again later</p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-left overflow-auto">
              {JSON.stringify({ error: error.message, stack: error.stack }, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}

