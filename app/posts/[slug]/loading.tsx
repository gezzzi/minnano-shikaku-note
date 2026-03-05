import { Skeleton } from "@/app/components/ui/Skeleton";

export default function PostDetailLoading() {
  return (
    <div className="max-w-md mx-auto">
      {/* Image carousel skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Actions skeleton */}
      <div className="px-4 py-3 flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-6 h-6 rounded" />
        </div>
        <Skeleton className="w-6 h-6 rounded" />
      </div>

      {/* Content skeleton */}
      <div className="px-4 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
