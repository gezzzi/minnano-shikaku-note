import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/app/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "ログイン",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            みんなの資格ノート
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            資格学習に役立つコンテンツを
            <br />
            閲覧・保存できます
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            ログインに失敗しました。もう一度お試しください。
          </div>
        )}

        <GoogleSignInButton />

        <p className="text-xs text-gray-400">
          ログインすることで、いいねやブックマーク機能が
          <br />
          ご利用いただけます。
        </p>
      </div>
    </div>
  );
}
