import { Skeleton } from "@/components/ui/skeleton"

export function TeamCategorySkeleton() {
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-2" />
          <Skeleton className="h-5 w-[500px]" />
        </div>

        {/* Teams Sections Skeleton */}
        <div className="space-y-16">
          {/* Repeat for each potential team section */}
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-8">
              {/* Team Header Skeleton */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-8 w-48" />
              </div>

              {/* Players Grid Skeleton */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, playerIndex) => (
                  <Skeleton
                    key={playerIndex}
                    className="h-[220px] w-full rounded-lg bg-gradient-to-br from-blue-900/20 to-black/80"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

