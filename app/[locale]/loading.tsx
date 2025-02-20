import { Skeleton } from "@/components/ui/skeleton"

export default function LatestPostsLoading() {
  return (
    <>
      {/* Hero Section Loading */}
      <div className="relative w-full h-screen">
        <Skeleton className="absolute inset-0" />
      </div>

      {/* Featured Grid Loading */}
      <section className="w-full bg-background pb-20 -mt-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="aspect-[2/1] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Fish Section Loading */}
      <section className="min-h-screen bg-background py-20 -mt-14">
        <div className="container">
          <div className="space-y-20">
            <div className="w-full">
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Carousel Loading */}
      <div className="container pb-40 -mt-40">
        <Skeleton className="h-10 w-60 mx-auto mb-8" /> {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border bg-card min-h-[400px]">
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" /> {/* Extra space for content */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

