// loading.tsx

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1000px] min-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      {/* Contenido Principal */}
      <div className="w-[65%] flex flex-col gap-y-5">
        {/* Skeleton para CreatePostCard */}
        <Card className="p-4 rounded-lg">
          <Skeleton className="h-10 w-full" />
        </Card>

        {/* Skeleton para Tabs */}
        <div className="flex gap-x-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Skeletons para lista de PostCards */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 rounded-lg">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-5 w-full" />
          </Card>
        ))}

        {/* Skeleton para Pagination */}
        <div className="flex justify-center gap-x-2 mt-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Sidebar Derecho */}
      <div className="w-[35%] flex flex-col gap-y-3">
        {/* Skeleton para Sidebar Games */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}

        {/* Skeleton para TwitterTimeline */}
        <Card className="p-4 rounded-lg">
          <Skeleton className="h-48 w-full" />
        </Card>
      </div>
    </div>
  );
}
