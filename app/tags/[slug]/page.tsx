import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PostCardGrid } from "@/app/components/posts/PostCardGrid";
import type { PostCard } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tag) return { title: "タグが見つかりません" };

  return {
    title: `#${tag.name} の学習コンテンツ`,
    description: `${tag.name}タグが付いた学習コンテンツ一覧`,
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tag) notFound();

  const { data: postTags } = await supabase
    .from("post_tags")
    .select("post_id")
    .eq("tag_id", tag.id);

  const postIds = (postTags ?? []).map((pt) => pt.post_id);

  let posts: PostCard[] = [];
  if (postIds.length > 0) {
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(name, slug)")
      .in("id", postIds)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    posts = (data || []) as PostCard[];
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold">#{tag.name}</h1>
      </div>

      <PostCardGrid posts={posts} />
    </div>
  );
}
