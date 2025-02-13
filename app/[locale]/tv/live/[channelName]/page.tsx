import { ArrowLeft, Heart, Share2, Users } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { VIDEO_PROVIDERS } from "@/lib/constants"

interface LivePageProps {
  params: { channelName: string }
}

function LiveContent({ channelName }: { channelName: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="w-full bg-black aspect-video">
          <iframe
            src={VIDEO_PROVIDERS.twitch.embedFull(channelName)}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        <Link href="/" className="absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                Viewers
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

          <div className="bg-card rounded-lg">
            <iframe
              src={`https://www.twitch.tv/embed/${channelName}/chat?parent=${process.env.NEXT_PUBLIC_VERCEL_URL || "localhost"}`}
              className="w-full h-[600px]"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LivePage({ params }: LivePageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full aspect-video bg-card animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <LiveContent channelName={params.channelName} />
    </Suspense>
  )
}

