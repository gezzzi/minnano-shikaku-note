import { Skeleton } from "@/app/components/ui/Skeleton";
import { PostFeedSkeleton } from "@/app/components/posts/PostCardSkeleton";

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

      <PostFeedSkeleton />
    </>
  );
}
