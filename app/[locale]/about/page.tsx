import { FusionSection } from "@/components/about/fusion-section"
import { GallerySection } from "@/components/about/gallery-section"
import { IntroSection } from "@/components/about/intro-section"
import { MapSection } from "@/components/about/map-section"
import { TeamSection } from "@/components/about/team-section"
import { ValuesSection } from "@/components/about/values-section"
import { VideoSection } from "@/components/about/video-section"
import { Suspense } from "react"
import Loading from "./loading"

export default function AboutPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <IntroSection />
        <VideoSection />
        <FusionSection />
        <div className="pt-28">
          <ValuesSection />
        </div>
        <MapSection />
        <GallerySection />
        <TeamSection />
      </div>
    </Suspense>
  )
}

