"use server";

import { createClient } from "@/lib/supabase/server";
import type { PostCard } from "@/lib/types";

const PAGE_SIZE = 10;

export type FeedFilter =
  | { type: "home"; categorySlug?: string }
  | { type: "search"; query: string }
  | { type: "category"; categoryId: string }
  | { type: "tag"; postIds: string[] }
  | { type: "bookmarks"; userId: string }
  | { type: "likes"; userId: string };

export async function fetchPosts(
  filter: FeedFilter,
  page: number
): Promise<{ posts: PostCard[]; hasMore: boolean }> {
  const supabase = await createClient();
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  if (filter.type === "tag") {
    if (filter.postIds.length === 0) {
      return { posts: [], hasMore: false };
    }
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(name, slug)")
      .in("id", filter.postIds)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    const posts = (data || []) as PostCard[];
    return { posts, hasMore: posts.length === PAGE_SIZE };
  }

  if (filter.type === "bookmarks" || filter.type === "likes") {
    const table = filter.type === "bookmarks" ? "bookmarks" : "likes";
    const { data: interactions } = await supabase
      .from(table)
      .select("post_id")
      .eq("user_id", filter.userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    const postIds = (interactions ?? []).map((i) => i.post_id);
    if (postIds.length === 0) {
      return { posts: [], hasMore: false };
    }

    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(name, slug)")
      .in("id", postIds)
      .eq("is_published", true);

    const postMap = new Map(
      ((data || []) as PostCard[]).map((post) => [post.id, post])
    );
    const posts = postIds
      .map((id) => postMap.get(id))
      .filter((post): post is PostCard => !!post);

    return { posts, hasMore: interactions!.length === PAGE_SIZE };
  }

  let query = supabase
    .from("posts")
    .select("*, category:categories(name, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filter.type === "home" && filter.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filter.categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  } else if (filter.type === "search") {
    query = query.or(
      `title.ilike.%${filter.query}%,description.ilike.%${filter.query}%`
    );
  } else if (filter.type === "category") {
    query = query.eq("category_id", filter.categoryId);
  }

  const { data } = await query.range(from, to);
  const posts = (data || []) as PostCard[];
  return { posts, hasMore: posts.length === PAGE_SIZE };
}
