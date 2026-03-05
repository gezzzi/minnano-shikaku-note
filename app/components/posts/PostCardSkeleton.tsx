import { Skeleton } from "@/app/components/ui/Skeleton";

export function PostCardSkeleton() {
  return (
    <div className="mb-8 border-b border-gray-100 pb-4">
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
  );
}

export function PostFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="max-w-md mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
