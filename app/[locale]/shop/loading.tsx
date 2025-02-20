import { Skeleton } from "@/components/ui/skeleton"

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Category Nav Skeleton */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>

      {/* Content Skeletons */}
      <div className="container space-y-24 py-8">
        {/* Featured Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div>
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Team Section Skeleton */}
        <Skeleton className="h-[400px] w-full rounded-xl" />

        {/* Newsletter Section Skeleton */}
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-12 w-80" />
        </div>
      </div>
    </div>
  )
}

