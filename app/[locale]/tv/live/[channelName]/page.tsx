import { notFound } from "next/navigation"

import { ChannelSidebar } from "@/components/tv/channel-sidebar"
import { LiveContent } from "@/components/tv/live-content"
import { getTwitchStreams } from "@/lib/twitch"

interface LivePageProps {
  params: {
    channelName: string
    locale: string
  }
}

export default async function LivePage({ params }: LivePageProps) {
  const streams = await getTwitchStreams()
  const stream = streams.find((s) => s.user_login === params.channelName)

  if (!stream) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-2 md:pt-4">
      <ChannelSidebar streams={streams} />
      <LiveContent stream={stream} />
    </div>
  )
}

