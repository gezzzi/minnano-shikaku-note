"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addComment(postId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "ログインが必要です" };
  if (!content?.trim()) return { error: "コメントを入力してください" };

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content: content.trim(),
  });

  if (error) return { error: "コメントの投稿に失敗しました" };

  // Get post slug for revalidation
  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", postId)
    .single();

  if (post) revalidatePath(`/posts/${post.slug}`);

  return { success: true };
}

export async function deleteComment(commentId: string, postSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "ログインが必要です" };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: "削除に失敗しました" };

  revalidatePath(`/posts/${postSlug}`);
  return { success: true };
}
