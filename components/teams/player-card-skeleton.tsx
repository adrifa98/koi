import { Skeleton } from "@/components/ui/skeleton"

export function PlayerCardSkeleton() {
  return (
    <div className="group relative h-[220px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-900/20 to-black/80">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/chevron-pattern.svg')] bg-cover opacity-10" />

      {/* Content Container */}
      <div className="relative flex h-full items-center justify-between p-8">
        {/* Left Side - Text & Social */}
        <div className="z-10 flex flex-col">
          {/* Player Info Skeleton */}
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-9 w-24 mb-4" />

          {/* Social Links Skeleton */}
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-full" />
            ))}
          </div>
        </div>

        {/* Right Side - Player Image Skeleton */}
        <div className="absolute bottom-0 right-0 h-full w-[320px]">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}

