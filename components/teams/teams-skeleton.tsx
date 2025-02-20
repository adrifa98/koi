import { Skeleton } from "@/components/ui/skeleton"

export function TeamsSkeleton() {
  return (
    <div className="container py-12">
      {/* Header Skeleton */}
      <div className="mb-12">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative group">
            <Skeleton className="aspect-[16/9] w-full rounded-lg" />
            <div className="absolute inset-0 flex items-end p-6">
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

