"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function followUser(followingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "ログインが必要です" };
  if (user.id === followingId) return { error: "自分をフォローできません" };

  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, following_id: followingId });

  if (error) {
    if (error.code === "23505") return { error: "既にフォロー済みです" };
    return { error: "フォローに失敗しました" };
  }

  revalidatePath("/");
  revalidatePath(`/users/${followingId}`);
  return { success: true };
}

export async function unfollowUser(followingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "ログインが必要です" };

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) return { error: "フォロー解除に失敗しました" };

  revalidatePath("/");
  revalidatePath(`/users/${followingId}`);
  return { success: true };
}
