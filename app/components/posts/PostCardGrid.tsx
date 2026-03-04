import { PostCard } from "@/app/components/posts/PostCard";
import type { PostCard as PostCardType } from "@/lib/types";

export function PostCardGrid({ posts }: { posts: PostCardType[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">コンテンツが見つかりません</p>
        <p className="mt-1 text-sm">条件を変えて再度お試しください</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
