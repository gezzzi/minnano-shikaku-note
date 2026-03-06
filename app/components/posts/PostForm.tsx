"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ImagePlus } from "lucide-react";
import { createPost } from "@/app/actions/create-post";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

export function PostForm({ categories }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Remove default file input and add our ordered files
    formData.delete("images");
    for (const { file } of previews) {
      formData.append("images", file);
    }

    const result = await createPost(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setSubmitting(false);
    } else {
      setMessage({ type: "success", text: "投稿を作成しました" });
      setTimeout(() => {
        router.push(`/posts/${result.slug}`);
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1.5">
          カテゴリ *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
        >
          <option value="">選択してください</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
          タイトル *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          説明文
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 resize-y"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          画像
        </label>
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, i) => (
            <div key={preview.url} className="relative w-24 h-24">
              <Image
                src={preview.url}
                alt={`プレビュー ${i + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                  サムネ
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-[10px] mt-1">追加</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageAdd}
          className="hidden"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1.5">
          タグ（カンマ区切り）
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="TOEIC, 英単語, リスニング"
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3">
        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
          公開する
        </label>
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          value="true"
          defaultChecked
          className="h-4 w-4 accent-gray-900"
        />
      </div>

      {/* Message */}
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {submitting ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
