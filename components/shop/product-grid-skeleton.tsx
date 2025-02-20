export function ProductGridSkeleton() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="group relative">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="space-y-2">
                  <div className="h-5 w-2/3 bg-muted-foreground/20 rounded" />
                  <div className="h-4 w-1/3 bg-muted-foreground/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  