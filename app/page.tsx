import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CategoryFilter } from "@/app/components/categories/CategoryFilter";
import { PostCardGrid } from "@/app/components/posts/PostCardGrid";
import { Skeleton } from "@/app/components/ui/Skeleton";
import type { PostCard } from "@/lib/types";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

function PostFeedSkeleton() {
  return (
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
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function PostList({ categorySlug }: { categorySlug?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*, category:categories(name, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  const { data: posts } = await query;

  return <PostCardGrid posts={(posts || []) as PostCard[]} />;
}

export default async function Home({ searchParams }: Props) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <>
      <Suspense fallback={null}>
        <CategoryFilter categories={categories || []} />
      </Suspense>

      <Suspense fallback={<PostFeedSkeleton />}>
        <PostList categorySlug={category} />
      </Suspense>
    </>
  );
}
