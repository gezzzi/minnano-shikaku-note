"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold text-gray-200">Error</h1>
      <p className="mt-4 text-lg font-medium text-gray-900">
        問題が発生しました
      </p>
      <p className="mt-1 text-sm text-gray-500">
        しばらくしてからもう一度お試しください
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
      >
        もう一度試す
      </button>
    </div>
  );
}
