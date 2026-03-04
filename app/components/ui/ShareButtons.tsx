"use client";

import { Send } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="cursor-pointer"
      aria-label="共有"
    >
      <Send className="w-6 h-6" />
    </button>
  );
}
