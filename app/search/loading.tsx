import { Skeleton } from "@/app/components/ui/Skeleton";
import { PostFeedSkeleton } from "@/app/components/posts/PostCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full rounded-lg mb-4" />
      <Skeleton className="h-4 w-32 mb-4" />
      <PostFeedSkeleton />
    </div>
  );
}
