import { ArrowLeft, Plus, Share2, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { YouTubePlayer } from "@/components/tv/youtube-player"
import { Button } from "@/components/ui/button"
import { getVideo } from "@/lib/sanity"

interface WatchPageProps {
  params: { videoId: string }
}

async function VideoContent({ videoId }: { videoId: string }) {
  const video = await getVideo(videoId)

  if (!video) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="w-full bg-black aspect-video">
          <YouTubePlayer videoId={video.videoId} className="w-full h-full" controls={true} />
        </div>
        <Link href="/" className="absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WatchPage({ params }: WatchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full aspect-video bg-card animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <VideoContent videoId={params.videoId} />
    </Suspense>
  )
}

