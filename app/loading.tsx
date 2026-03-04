import { Skeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      {/* Category stories skeleton */}
      <div className="px-4 py-4 flex gap-4 overflow-x-auto border-b border-gray-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Feed skeleton */}
      <div className="max-w-md mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-8 border-b border-gray-100 pb-4">
            <div className="px-4 py-3 flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="aspect-square w-full" />
            <div className="px-4 py-3 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
