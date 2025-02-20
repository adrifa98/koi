"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"

export function FeaturedGrid() {
  return (
    <section className="container py-20">
      <Link href="/shop/equipacion/jersey-2024" className="block">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
          <Image
            src="/shop/banner.webp"
            alt="Jersey 2024"
            className="object-cover transition-transform duration-300 hover:scale-105"
            fill
            sizes="100vw"
            priority
          />
        </div>
      </Link>
    </section>
  )
}

