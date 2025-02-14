import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ChannelSidebar } from "@/components/tv/channel-sidebar"
import { VideoActions } from "@/components/tv/video-actions"
import { VideoCard } from "@/components/tv/video-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getVideo, getVideos } from "@/lib/sanity"
import { getTwitchStreams } from "@/lib/twitch"
import { formatDate } from "@/lib/utils"
import { getTranslations } from 'next-intl/server'


interface WatchPageProps {
  params: {
    videoId: string
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const [video, streams] = await Promise.all([getVideo(params.videoId), getTwitchStreams()])

  if (!video) {
    notFound()
  }
  const t = await getTranslations('video');
  // Get channel URL based on channel name
  const getChannelUrl = (channelName: string) => {
    switch (channelName) {
      case "Movistar KOI":
        return `/${t('idioma')}/club`
      case "Movistar KOI League of Legends":
        return `/${t('idioma')}/teams/lol`
      case "Movistar KOI Valorant":
        return `/${t('idioma')}/teams/valorant`
      case "Toronto Ultra":
        return `/${t('idioma')}/teams/cod`
      case "Movistar KOI VODS":
        return `/${t('idioma')}/club"`
      default:
        return `/${t('idioma')}/club"`
    }
  }

  // Get recommended videos from the same channel
  const recommendedVideos = (await getVideos())
    .filter((v) => v.channelName === video.channelName && v._id !== video._id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <ChannelSidebar streams={streams} />
        <div className="flex flex-col lg:flex-row lg:gap-6 max-w-[1800px] mx-auto md:ml-[80px]">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Player Section */}
            <div className="relative w-full bg-black aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <Link href="/" className="absolute top-4 left-4 lg:hidden bg-background/80 backdrop-blur-sm rounded-full">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
            </div>

            {/* Video Info Section */}
            <div className="p-4 lg:p-6">
              <h1 className="text-xl lg:text-2xl font-bold mb-4">{video.title}</h1>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Link href={getChannelUrl(video.channelName)} className="flex items-center gap-4 hover:opacity-80">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/channels/${video.channelName.toLowerCase().replace(/ /g, "-")}.jpg`} />
                    <AvatarFallback>{video.channelName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{video.channelName}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(video.publishedAt)}</span>
                  </div>
                </Link>

                <VideoActions videoId={video.videoId} title={video.title} channelName={video.channelName} />
              </div>

              <Separator className="mb-6" />
            </div>
          </div>

          {/* Sidebar with recommended videos */}
          <div className="lg:w-[400px] p-4 lg:p-6 lg:pt-0">
            <h2 className="text-lg font-semibold mb-4">{t('watch.more')} {video.channelName}</h2>
            <div className="grid gap-4">
              {recommendedVideos.map((recommendedVideo) => (
                <div key={recommendedVideo._id} className="w-full">
                  <VideoCard video={recommendedVideo} type="youtube" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

