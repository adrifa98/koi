
import { ChannelSidebar } from "@/components/tv/channel-sidebar"
import { HeroSection } from "@/components/tv/hero-section"
import { LiveCarousel } from "@/components/tv/live-carousel"
import { VideoCarousel } from "@/components/tv/video-carousel"
import { getVideos } from "@/lib/sanity"
import { getTwitchStreams } from "@/lib/twitch"
import type { SanityVideo } from "@/types/sanity"

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  let videos: SanityVideo[] = []
  let streams: any[] = []
  let error: Error | null = null

  try {
    ;[videos, streams] = await Promise.all([getVideos(), getTwitchStreams()])

    console.log("Fetched videos:", JSON.stringify(videos, null, 2))

    if (videos.length === 0) {
      console.warn("No videos fetched from Sanity")
    }

    // Group videos by category
    const videosByCategory = videos.reduce(
      (acc, video) => {
        if (!acc[video.category]) {
          acc[video.category] = []
        }
        acc[video.category].push(video)
        return acc
      },
      {} as Record<string, SanityVideo[]>,
    )

    console.log("Videos by category:", JSON.stringify(videosByCategory, null, 2))

    // Filter live streams
    const liveStreams = streams.filter((stream) => stream.is_live)

    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <ChannelSidebar streams={streams} />
        <div className="ml-[62px]">
          <main>
            <HeroSection />
            <div className="space-y-8 pb-8">
              {liveStreams.length > 0 && <LiveCarousel title="Live Now" streams={liveStreams} />}
              {Object.entries(videosByCategory).length > 0 ? (
                Object.entries(videosByCategory).map(([category, categoryVideos]) => (
                  <VideoCarousel
                    key={category}
                    title={category.charAt(0).toUpperCase() + category.slice(1)}
                    videos={categoryVideos}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No videos available at the moment.</p>
                  {process.env.NODE_ENV === "development" && (
                    <pre className="mt-4 p-4 bg-gray-100 rounded text-left overflow-auto">
                      {JSON.stringify({ videos, error }, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in Home page:", err)
    error = err instanceof Error ? err : new Error("An unknown error occurred")
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

