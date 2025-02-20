import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {/* Matches Column */}
            <div className="w-full lg:w-[65%] space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    {/* Date/Time Section */}
                    <div className="hidden sm:block">
                      <div className="text-center">
                        <Skeleton className="h-6 w-12 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>

                    {/* Teams and Score Section */}
                    <div className="flex-1 grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-center">
                      {/* Team 1 */}
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-center">
                        <Skeleton className="h-4 w-8" />
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center justify-between gap-3 sm:justify-start">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    {/* Category and Format */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>

                  {/* Mobile Date/Category/Format */}
                  <div className="flex items-center justify-between mt-2 sm:hidden">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:w-[35%]">
              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Categories */}
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg p-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

