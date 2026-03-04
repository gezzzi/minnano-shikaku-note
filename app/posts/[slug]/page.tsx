import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ImageCarousel } from "@/app/components/posts/ImageCarousel";
import { LikeButton } from "@/app/components/posts/LikeButton";
import { BookmarkButton } from "@/app/components/posts/BookmarkButton";
import { ShareButtons } from "@/app/components/ui/ShareButtons";
import { PostCardGrid } from "@/app/components/posts/PostCardGrid";
import { formatRelativeDate } from "@/lib/utils/format";
import type { Post, PostImage, Tag, Category, PostCard } from "@/lib/types";

interface PostWithDetails extends Post {
  category: Category;
  images: PostImage[];
  tags: Tag[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PostWithDetails | null> {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = post as any;

  const [{ data: images }, { data: postTags }] = await Promise.all([
    supabase
      .from("post_images")
      .select("*")
      .eq("post_id", p.id)
      .order("sort_order"),
    supabase
      .from("post_tags")
      .select("tag:tags(*)")
      .eq("post_id", p.id),
  ]);

  return {
    ...p,
    category: p.category as Category,
    images: (images || []) as PostImage[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: (postTags ?? []).map((pt: any) => pt.tag as Tag),
  };
}

async function getRelatedPosts(
  categoryId: string,
  currentPostId: string
): Promise<PostCard[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("*, category:categories(name, slug)")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .neq("id", currentPostId)
    .order("created_at", { ascending: false })
    .limit(3);

  return (data || []) as PostCard[];
}

async function getUserInteractions(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { liked: false, bookmarked: false };

  const [{ data: like }, { data: bookmark }] = await Promise.all([
    supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .maybeSingle(),
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .maybeSingle(),
  ]);

  return { liked: !!like, bookmarked: !!bookmark };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "記事が見つかりません" };

  return {
    title: post.title,
    description: post.description.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.description.slice(0, 160),
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [{ liked, bookmarked }, relatedPosts] = await Promise.all([
    getUserInteractions(post.id),
    getRelatedPosts(post.category_id, post.id),
  ]);

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/posts/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description.slice(0, 160),
    image: post.thumbnail_url || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    url: postUrl,
    publisher: {
      "@type": "Organization",
      name: "みんなの資格ノート",
    },
  };

  return (
    <div className="max-w-md mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Post header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500">
                {post.category.name.slice(0, 1)}
              </span>
            </div>
            <Link
              href={`/categories/${post.category.slug}`}
              className="font-semibold text-sm"
            >
              {post.category.name}
            </Link>
          </div>
        </div>
        <span className="text-xs text-gray-400 uppercase">
          {formatRelativeDate(post.created_at)}
        </span>
      </div>

      {/* Image Carousel */}
      <ImageCarousel images={post.images} />

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-1">
            <LikeButton
              postId={post.id}
              initialLiked={liked}
              initialCount={post.likes_count}
            />
            <ShareButtons url={postUrl} title={post.title} />
          </div>
          <BookmarkButton postId={post.id} initialBookmarked={bookmarked} />
        </div>

        {/* Title */}
        <h1 className="font-bold text-base leading-tight">{post.title}</h1>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map((tag: Tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="text-sm text-blue-500 hover:underline"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
          {post.description}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-4 border-t border-gray-100 pt-4">
          <h2 className="px-4 mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
            関連コンテンツ
          </h2>
          <PostCardGrid posts={relatedPosts} />
        </section>
      )}
    </div>
  );
}
