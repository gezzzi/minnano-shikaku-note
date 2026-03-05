import type { Metadata } from "next";
import { Search } from "lucide-react";
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
