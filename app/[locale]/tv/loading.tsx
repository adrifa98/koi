import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Sidebar Skeleton */}
      <div className="h-screen fixed left-0 top-0 bg-card border-r z-40 flex-col transition-all hidden md:flex w-[72px]">
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      </div>

      {/* Mobile Stories Bar Skeleton */}
      <div className="md:hidden w-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-b sticky top-0 z-40">
        <div className="w-full py-4 px-4 overflow-x-auto">
          <div className="flex space-x-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:ml-[80px]">
        {/* Hero Section Skeleton */}
        <div className="relative h-[50vh] md:h-[80vh] w-full">
          <Skeleton className="absolute inset-0" />
          <div className="relative container mx-4 md:mx-auto h-full flex items-center px-4">
            <div className="max-w-2xl space-y-4 pt-0">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Carousels Skeleton */}
        <div className="space-y-8 pb-8 mt-40 md:mt-[150px]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-[200px] ml-2 md:ml-0" />
              <div className="ml-2 md:ml-0 relative overflow-visible">
                <div className="flex gap-2 overflow-x-hidden">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="flex-none"
                      style={{
                        width: "var(--dynamic-card-width)",
                      }}
                    >
                      <div className="w-full">
                        <div className="aspect-video">
                          <Skeleton className="h-full w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

