"use client"

import { FusionSection } from "@/components/about/fusion-section"
import { IntroSection } from "@/components/about/intro-section"
import { MapSection } from "@/components/about/map-section"
import { TeamSection } from "@/components/about/team-section"
import { ValuesSection } from "@/components/about/values-section"
import { VideoSection } from "@/components/about/video-section"

export default function AboutPage() {
  return (
    <div className="relative">
      <IntroSection />
      <FusionSection />
      <div className="pt-28">
        <ValuesSection />
      </div>
      <MapSection />
      <VideoSection />
      <TeamSection />
    </div>
  )
}

