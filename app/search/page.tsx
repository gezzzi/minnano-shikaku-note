import type { Metadata } from "next";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PostCardGrid } from "@/app/components/posts/PostCardGrid";
import { SearchInput } from "@/app/components/search/SearchInput";
import type { PostCard } from "@/lib/types";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `「${q}」の検索結果` : "検索",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  let posts: PostCard[] = [];

  if (q) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(name, slug)")
      .eq("is_published", true)
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    posts = (data || []) as PostCard[];
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <SearchInput initialQuery={q || ""} />

      {q ? (
        <>
          <p className="mb-4 text-sm text-gray-500">
            「{q}」の検索結果: {posts.length}件
          </p>
          <PostCardGrid posts={posts} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Search className="mb-3 h-12 w-12" />
          <p className="text-lg font-medium">キーワードで検索</p>
          <p className="mt-1 text-sm">
            資格名やトピックを入力してください
          </p>
        </div>
      )}
    </div>
  );
}
