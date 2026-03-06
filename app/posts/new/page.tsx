import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { PostForm } from "@/app/components/posts/PostForm";

export const metadata: Metadata = {
  title: "新規投稿",
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">新規投稿</h1>
      <PostForm categories={categories || []} />
    </div>
  );
}
