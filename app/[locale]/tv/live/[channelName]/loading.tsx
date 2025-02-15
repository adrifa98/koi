import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-2 md:pt-4">
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

      <div className="md:ml-[80px] w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto gap-4">
          {/* Main Content */}
          <div className="flex-1">
            <div className="relative">
              <div className="w-full bg-black aspect-video rounded-xl overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            </div>

            <div className="py-4">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:w-[400px] h-[calc(100vh-180px)]">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

