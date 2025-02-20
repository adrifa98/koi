import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="relative">
      {/* Intro Section Skeleton */}
      <section className="flex items-center justify-center px-4 pt-40 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-16 w-2/3 mx-auto" />
        </div>
      </section>

      {/* Video Section Skeleton */}
      <section className="relative md:flex items-center justify-center mb-[-300px] md:mb-[-150px]">
        <div className="relative w-[95%] aspect-[21/9] mx-auto mb-20 mt-40">
          <Skeleton className="w-full h-full rounded-3xl" />
        </div>
      </section>

      {/* Fusion Section Skeleton */}
      <section className="min-h-screen relative flex items-center justify-center">
        <div className="flex justify-center items-center gap-8 w-full max-w-6xl px-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-[min(30vw,300px)] aspect-square rounded-full" />
          ))}
        </div>
      </section>

      {/* Values Section Skeleton */}
      <section className="relative min-h-screen py-32">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-16" />
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-[70vw]">
                <Skeleton className="h-8 w-24 mb-4" />
                <Skeleton className="h-16 w-full mb-8" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section Skeleton */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex flex-col justify-center">
        <div className="w-[98vw] mx-auto">
          <Skeleton className="w-full aspect-[2/1]" />
        </div>
        <div className="w-full text-center px-4 mt-12">
          <Skeleton className="h-12 w-64 mx-auto mb-8" />
          <Skeleton className="h-24 max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Gallery Section Skeleton */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Skeleton */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="aspect-square rounded-xl mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

