import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="mt-4 text-lg font-medium text-gray-900">
        ページが見つかりません
      </p>
      <p className="mt-1 text-sm text-gray-500">
        お探しのページは存在しないか、移動した可能性があります
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
