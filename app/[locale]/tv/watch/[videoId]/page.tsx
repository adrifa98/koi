"use client"

import { YouTubePlayer } from "@/components/tv/youtube-player"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Share2, ThumbsUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface VideoMetadata {
  title: string
  views: string
  likes: string
  date: string
}

export default function WatchPage({ params }: { params: { videoId: string } }) {
  const router = useRouter()
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: "Video Title",
    views: "1M views",
    likes: "100K",
    date: "Oct 1, 2023",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Video Section */}
      <div className="w-full bg-black aspect-video relative">
        <YouTubePlayer videoId={params.videoId} className="w-full h-full" controls={true} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Video Info */}
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{metadata.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{metadata.views}</span>
                <span>{metadata.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  {metadata.likes}
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
          </div>

          {/* Description */}
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

