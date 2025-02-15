"use client"

import { FusionSection } from "@/components/about/fusion-section"
import { MapSection } from "@/components/about/map-section"
import { ValuesSection } from "@/components/about/values-section"

export default function AboutPage() {
  return (
    <div className="min-h-[500vh] relative">
      <div className="h-[100vh]" />
      <FusionSection />
      <div className="pt-28">
        <ValuesSection />
      </div>
      <MapSection />
      <div className="h-[200vh]" />
    </div>
  )
}

