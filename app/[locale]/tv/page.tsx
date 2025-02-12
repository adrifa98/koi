import { ChannelSidebar } from "@/components/tv/channel-sidebar"
import { HeroSection } from "@/components/tv/hero-section"
import { LiveCarousel } from "@/components/tv/live-carousel"
import { VideoCarousel } from "@/components/tv/video-carousel"

// Videos de ejemplo con IDs reales de YouTube
const trendingVideos = [
  {
    id: 1,
    title: "Never Gonna Give You Up",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Me at the zoo",
    videoId: "jNQXAC9IVRw",
  },
  {
    id: 3,
    title: "Despacito",
    videoId: "kJQP7kiw5Fk",
  },
  // ... más videos
].concat(
  Array.from({ length: 7 }, (_, i) => ({
    id: i + 4,
    title: `Trending Video ${i + 4}`,
    videoId: "dQw4w9WgXcQ", // Video de ejemplo
  })),
)

// Streams de ejemplo de Twitch
const liveStreams = [
  {
    id: 1,
    title: "Just Chatting with viewers!",
    channelName: "knekro",
    viewers: 25000,
  },
  {
    id: 2,
    title: "Playing Fortnite",
    channelName: "ninja",
    viewers: 45000,
  },
  {
    id: 3,
    title: "League of Legends Ranked",
    channelName: "tfue",
    viewers: 30000,
  },
].concat(
  Array.from({ length: 7 }, (_, i) => ({
    id: i + 4,
    title: `Live Stream ${i + 4}`,
    channelName: "shroud",
    viewers: Math.floor(Math.random() * 50000),
  })),
)

const popularVideos = Array.from({ length: 10 }, (_, i) => ({
  id: i + 20,
  title: `Popular Video ${i + 1}`,
  videoId: "jNQXAC9IVRw",
}))

const newReleasesVideos = Array.from({ length: 10 }, (_, i) => ({
  id: i + 30,
  title: `New Release ${i + 1}`,
  videoId: "kJQP7kiw5Fk",
}))

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ChannelSidebar />
      <div className="ml-[72px]">
        <main>
          <HeroSection />
          <div className="space-y-8 pb-8">
            <VideoCarousel title="Trending Now" videos={trendingVideos} />
            <LiveCarousel title="Live Now" streams={liveStreams} />
            <VideoCarousel title="Popular on Netflix" videos={popularVideos} />
            <VideoCarousel title="New Releases" videos={newReleasesVideos} />
          </div>
        </main>
      </div>
    </div>
  )
}

