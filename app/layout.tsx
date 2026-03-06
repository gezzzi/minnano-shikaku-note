import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/app/components/layout/Header";
import { BottomNav } from "@/app/components/layout/BottomNav";
import type { Profile } from "@/lib/types";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "みんなの資格ノート",
    template: "%s | みんなの資格ノート",
  },
  description:
    "資格試験の勉強に役立つ学習コンテンツを閲覧・共有できるプラットフォーム",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  other: {
    "theme-color": "#111827",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let headerUser = null;
  let unreadCount = 0;

  if (user) {
    const [{ data: profile }, { count }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false),
    ]);

    const p = profile as Profile | null;
    headerUser = {
      displayName: p?.display_name || "ユーザー",
      avatarUrl: p?.avatar_url || null,
      email: user.email || "",
    };
    unreadCount = count ?? 0;
  }

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen font-sans text-gray-900 pb-20`}
      >
        <Header user={headerUser} unreadCount={unreadCount} />
        <main>{children}</main>
        <BottomNav />
      </body>
      <GoogleAnalytics gaId="G-ECC0RPM9MG" />
    </html>
  );
}
