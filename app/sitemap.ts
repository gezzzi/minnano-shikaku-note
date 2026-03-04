import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

// Force dynamic rendering (don't generate at build time)
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return staticPages;
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  const [{ data: posts }, { data: categories }, { data: tags }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("slug, updated_at")
        .eq("is_published", true)
        .order("updated_at", { ascending: false }),
      supabase.from("categories").select("slug"),
      supabase.from("tags").select("slug"),
    ]);

  const postPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map(
    (cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const tagPages: MetadataRoute.Sitemap = (tags ?? []).map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
