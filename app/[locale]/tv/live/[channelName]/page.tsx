"use client"

import { Button } from "@/components/ui/button"
import { VIDEO_PROVIDERS } from "@/lib/constants"
import { ArrowLeft, Heart, Share2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface StreamMetadata {
  title: string
  viewers: string
  streamer: string
}

export default function LivePage({ params }: { params: { channelName: string } }) {
  const router = useRouter()
  const [metadata, setMetadata] = useState<StreamMetadata>({
    title: "Live Stream",
    viewers: "0",
    streamer: params.channelName,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Stream Section */}
      <div className="w-full bg-black aspect-video relative">
        <iframe src={VIDEO_PROVIDERS.twitch.embedFull(params.channelName)} className="w-full h-full" allowFullScreen />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Stream Info */}
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{metadata.title}</h1>
                <p className="text-muted-foreground">{metadata.streamer}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  {metadata.viewers}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Follow
                </Button>
              </div>
            </div>
          </div>

          {/* Chat (opcional) */}
          <div className="bg-card rounded-lg p-4 h-[400px]">
            <iframe
              src={`https://www.twitch.tv/embed/${params.channelName}/chat?parent=${window.location.hostname}`}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

