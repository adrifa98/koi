import { ChannelSidebar } from "@/components/tv/channel-sidebar"
import { HeroSection } from "@/components/tv/hero-section"
import { StoriesBar } from "@/components/tv/stories-bar"
import { VideoCarousel } from "@/components/tv/video-carousel"
import { getVideos } from "@/lib/sanity"
import { getTwitchStreams } from "@/lib/twitch"
import { useTranslations } from "next-intl"
import { Suspense } from "react"

export const revalidate = 60

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-32 bg-muted rounded"></div>
        <div className="h-4 w-64 bg-muted rounded"></div>
      </div>
    </div>
  )
}

export default async function Home() {
  const t = useTranslations()

  try {
    // Fetch data
    const [videos, streams] = await Promise.all([getVideos(), getTwitchStreams()])

    const channels = {
      "Movistar KOI": t("sections.news"),
      "Movistar KOI League of Legends": t("sections.lol"),
      "Movistar KOI Valorant": t("sections.valorant"),
      "Toronto Ultra": t("sections.torontoUltra"),
      "Movistar KOI VODS": t("sections.vods"),
    }

    const latestVideo = videos
      .filter((video) => video.channelName === "Movistar KOI")
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]

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
        <Suspense fallback={<LoadingState />}>
          <ChannelSidebar streams={streams} />
          <StoriesBar streams={streams} />
          <div className="md:ml-[80px]">
            <main>
              <HeroSection latestVideo={latestVideo} />
              <div className="space-y-8 pb-8 mt-40 md:mt-[150px]">
                {videosByChannel["Movistar KOI"]?.length > 0 && (
                  <Suspense fallback={<LoadingState />}>
                    <VideoCarousel
                      key="Movistar KOI"
                      title={t("sections.news")}
                      videosType="youtube"
                      channelName="Movistar KOI"
                      initialVideos={videosByChannel["Movistar KOI"]}
                    />
                  </Suspense>
                )}
                {liveStreams.length > 0 && (
                  <Suspense fallback={<LoadingState />}>
                    <VideoCarousel title={t("sections.liveNow")} videosType="twitch" initialVideos={liveStreams} />
                  </Suspense>
                )}
                {Object.entries(channels)
                  .filter(([channel]) => channel !== "Movistar KOI")
                  .map(
                    ([channel, title]) =>
                      videosByChannel[channel]?.length > 0 && (
                        <Suspense key={channel} fallback={<LoadingState />}>
                          <VideoCarousel
                            title={title}
                            videosType="youtube"
                            channelName={channel}
                            initialVideos={videosByChannel[channel]}
                          />
                        </Suspense>
                      ),
                  )}
              </div>
            </main>
          </div>
        </Suspense>
      </div>
    )
  } catch (err) {
    console.error("Error in Home page:", err)
    const error = err instanceof Error ? err : new Error("An unknown error occurred")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t("errors.generic.title")}</h1>
          <p className="text-muted-foreground">{t("errors.generic.message")}</p>
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

