export function SearchSkeleton() {
  return (
    <div className="grid min-h-screen w-full animate-pulse lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r lg:block">
        <div className="border-b p-4">
          <div className="h-10 w-full rounded-lg bg-muted" />
        </div>
        <div className="p-4">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-muted" />
                    <div className="h-4 w-32 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-muted" />
                    <div className="h-4 w-32 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex h-16 items-center gap-4 border-b px-6">
          <div className="h-8 w-8 rounded bg-muted lg:hidden" />
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

