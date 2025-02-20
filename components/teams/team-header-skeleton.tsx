export function TeamHeaderSkeleton() {
    return (
      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="h-full w-full animate-pulse bg-muted" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-6 w-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    )
  }
  
  