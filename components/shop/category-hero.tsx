import type { Collection } from "@/lib/shopify/types"
import Image from "next/image"

interface CategoryHeroProps {
  collection: Collection
}

export function CategoryHero({ collection }: CategoryHeroProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {collection.image ? (
        <Image
          src={collection.image.url || "/placeholder.svg"}
          alt={collection.image.altText || collection.title}
          className="object-cover object-center"
          priority
          fill
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800" />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">{collection.title}</h1>
        {collection.description && <p className="mt-4 max-w-2xl text-lg text-gray-200">{collection.description}</p>}
      </div>
    </div>
  )
}

