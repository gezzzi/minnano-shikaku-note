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
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "カテゴリが見つかりません" };

  return {
    title: `${category.name}の学習コンテンツ`,
    description:
      category.description ||
      `${category.name}に関する学習コンテンツ一覧`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, category:categories(name, slug)")
    .eq("category_id", category.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold">{category.name}</h1>
      </div>

      {category.description && (
        <p className="mb-4 text-sm text-gray-500">{category.description}</p>
      )}

      <PostCardGrid posts={(posts || []) as PostCard[]} />
    </div>
  );
}
