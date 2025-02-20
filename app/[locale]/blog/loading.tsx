import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container space-y-8 px-4 py-8 md:px-6">
        {/* Featured Posts Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
              <Skeleton className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Categories Skeleton */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-full sm:w-[400px]" />
          </div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border bg-card">
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-1 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}

