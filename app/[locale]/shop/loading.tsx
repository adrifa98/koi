import { FeaturedProductsSkeleton } from "@/components/shop/featured-products-skeleton"

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Featured Grid Skeleton */}
      <div className="h-[400px] bg-muted" />

      {/* Featured Products Skeleton */}
      <FeaturedProductsSkeleton />

      {/* Category Products Skeleton */}
      <div className="space-y-20 py-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="container mx-auto">
            {/* Category Title Skeleton */}
            <div className="h-8 w-48 bg-muted rounded mb-8" />

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="aspect-square bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Team Section Skeleton */}
      <div className="h-[300px] bg-muted" />
    </div>
  )
}

