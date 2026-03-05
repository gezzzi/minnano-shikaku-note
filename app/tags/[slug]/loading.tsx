import { Skeleton } from "@/app/components/ui/Skeleton";
import { PostFeedSkeleton } from "@/app/components/posts/PostCardSkeleton";

export default function TagLoading() {
  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>
      <PostFeedSkeleton />
    </div>
  );
}
