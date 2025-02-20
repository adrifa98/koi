export function FeaturedProductsSkeleton() {
  return (
    <section className="container mx-auto grid gap-4 pb-20 pt-4">
      {/* Section Title Skeleton */}
      <div className="h-8 w-48 bg-muted rounded mb-6" />

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* First Featured Product */}
        <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-muted">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="space-y-2">
              <div className="h-6 w-2/3 bg-muted-foreground/20 rounded" />
              <div className="h-5 w-1/3 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </div>

        {/* Second Featured Product */}
        <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-muted">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="space-y-2">
              <div className="h-6 w-2/3 bg-muted-foreground/20 rounded" />
              <div className="h-5 w-1/3 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Other Products Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[16/9] relative overflow-hidden rounded-lg bg-muted">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="space-y-2">
                <div className="h-6 w-2/3 bg-muted-foreground/20 rounded" />
                <div className="h-5 w-1/3 bg-muted-foreground/20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

