"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

function generateSlug(title: string): string {
  const timestamp = Date.now().toString(36);
  const slug = title
    .toLowerCase()
    .replace(/[^\w\u3000-\u9fff\uf900-\ufaff]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${timestamp}`;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { error: "権限がありません" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const tagsInput = formData.get("tags") as string;
  const isPublished = formData.get("isPublished") === "true";
  const imageFiles = formData.getAll("images") as File[];

  if (!title?.trim() || !categoryId) {
    return { error: "タイトルとカテゴリは必須です" };
  }

  // Upload images to Supabase Storage
  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    if (!file.size) continue;

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(path, file);

    if (uploadError) {
      return { error: `画像のアップロードに失敗しました: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from("post-images")
      .getPublicUrl(path);

    imageUrls.push(urlData.publicUrl);
  }

  const slug = generateSlug(title);

  // Create post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      title: title.trim(),
      slug,
      description: description?.trim() || "",
      category_id: categoryId,
      thumbnail_url: imageUrls[0] || null,
      is_published: isPublished,
    })
    .select("id")
    .single();

  if (postError) {
    return { error: `投稿の作成に失敗しました: ${postError.message}` };
  }

  // Insert post_images
  if (imageUrls.length > 0) {
    const imageRecords = imageUrls.map((url, i) => ({
      post_id: post.id,
      image_url: url,
      sort_order: i,
    }));

    const { error: imgError } = await supabase
      .from("post_images")
      .insert(imageRecords);

    if (imgError) {
      return { error: `画像の保存に失敗しました: ${imgError.message}` };
    }
  }

  // Handle tags
  if (tagsInput?.trim()) {
    const tagNames = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    for (const tagName of tagNames) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");

      // Get or create tag
      let { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", tagSlug)
        .single();

      if (!tag) {
        const { data: newTag } = await supabase
          .from("tags")
          .insert({ name: tagName, slug: tagSlug })
          .select("id")
          .single();
        tag = newTag;
      }

      if (tag) {
        await supabase
          .from("post_tags")
          .insert({ post_id: post.id, tag_id: tag.id });
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/search");

  return { success: true, slug };
}
