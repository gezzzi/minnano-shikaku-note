"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

export function CategoryFilter({
  categories,
}: {
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const allItems = [
    { slug: "", name: "すべて" },
    ...categories.map((cat) => ({ slug: cat.slug, name: cat.name })),
  ];

  return (
    <div className="px-4 py-4 flex gap-4 overflow-x-auto scrollbar-hide border-b border-gray-50">
      {allItems.map((item) => {
        const isActive = item.slug === ""
          ? !activeCategory
          : activeCategory === item.slug;

        return (
          <Link
            key={item.slug}
            href={item.slug ? `/?category=${item.slug}` : "/"}
            className="flex flex-col items-center gap-1 min-w-[70px]"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2px] ${
                isActive
                  ? "bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
                  : "bg-gray-200"
              }`}
            >
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {item.name.slice(0, 3)}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 truncate w-16 text-center">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
