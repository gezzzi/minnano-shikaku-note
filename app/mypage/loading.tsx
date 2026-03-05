import { Skeleton } from "@/app/components/ui/Skeleton";
import { PostFeedSkeleton } from "@/app/components/posts/PostCardSkeleton";

export default function MypageLoading() {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Profile header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex border-b border-gray-200 mb-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>

      <PostFeedSkeleton />
    </div>
  );
}
