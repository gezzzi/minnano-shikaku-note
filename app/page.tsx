import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FollowedUsersBar } from "@/app/components/follow/FollowedUsersBar";
import { PostFeedSkeleton } from "@/app/components/posts/PostCardSkeleton";
import { InfinitePostList } from "@/app/components/posts/InfinitePostList";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { fetchPosts, type FeedFilter } from "@/app/actions/posts";

async function FollowedUsers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: follows } = await supabase
    .from("follows")
    .select("following:profiles!follows_following_id_fkey(*)")
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false });

  if (!follows || follows.length === 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <FollowedUsersBar users={follows as any} />;
}

function FollowedUsersSkeleton() {
  return (
    <div className="px-4 py-4 flex gap-4 overflow-x-auto border-b border-gray-50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

async function PostList() {
  const filter: FeedFilter = { type: "home" };
  const { posts, hasMore } = await fetchPosts(filter, 0);

  return (
    <InfinitePostList
      initialPosts={posts}
      filter={filter}
      initialHasMore={hasMore}
    />
  );
}

export default async function Home() {
  return (
    <>
      <Suspense fallback={<FollowedUsersSkeleton />}>
        <FollowedUsers />
      </Suspense>

      <Suspense fallback={<PostFeedSkeleton />}>
        <PostList />
      </Suspense>
    </>
  );
}
