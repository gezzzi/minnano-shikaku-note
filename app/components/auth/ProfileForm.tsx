"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";

export function ProfileForm({
  initialDisplayName,
}: {
  initialDisplayName: string;
  initialAvatarUrl: string;
}) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    const result = await updateProfile(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "プロフィールを更新しました" });
    }
  };

  return (
    <form action={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label
          htmlFor="displayName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          表示名
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={initialDisplayName}
          required
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
      >
        保存
      </button>
    </form>
  );
}
