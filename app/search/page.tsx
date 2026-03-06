import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SearchInput } from "@/app/components/search/SearchInput";
import { InfinitePostList } from "@/app/components/posts/InfinitePostList";
import { fetchPosts, type FeedFilter } from "@/app/actions/posts";

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

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  let initialContent = null;
  if (q) {
    const filter: FeedFilter = { type: "search", query: q };
    const { posts, hasMore } = await fetchPosts(filter, 0);
    initialContent = (
      <>
        <p className="mb-4 text-sm text-gray-500">
          「{q}」の検索結果
        </p>
        <InfinitePostList
          initialPosts={posts}
          filter={filter}
          initialHasMore={hasMore}
        />
      </>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <SearchInput initialQuery={q || ""} />

      {q ? (
        initialContent
      ) : (
        <>
          {/* Category grid */}
          <div className="mt-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              カテゴリー
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(categories || []).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-gray-500">
                      {cat.name.slice(0, 1)}
                    </span>
                  </div>
                  <span className="text-sm font-medium truncate">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
