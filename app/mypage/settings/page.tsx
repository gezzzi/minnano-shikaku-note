import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/app/components/auth/ProfileForm";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "プロフィール設定",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/mypage"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold">プロフィール設定</h1>
      </div>

      <ProfileForm
        initialDisplayName={profile?.display_name || ""}
        initialAvatarUrl={profile?.avatar_url || ""}
      />

      {/* Logout */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </form>
      </div>
    </div>
  );
}
