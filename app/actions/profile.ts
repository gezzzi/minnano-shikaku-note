"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const displayName = formData.get("displayName") as string;

  if (!displayName?.trim()) {
    return { error: "表示名を入力してください" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName.trim() })
    .eq("id", user.id);

  if (error) {
    return { error: "更新に失敗しました" };
  }

  revalidatePath("/mypage/settings");
  revalidatePath("/mypage");
  revalidatePath("/", "layout");

  return { success: true };
}
