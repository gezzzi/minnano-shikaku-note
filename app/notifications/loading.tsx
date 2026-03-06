import { Skeleton } from "@/app/components/ui/Skeleton";

export default function NotificationsLoading() {
  return (
    <div className="max-w-md mx-auto">
      <div className="px-4 py-4 border-b border-gray-100">
        <Skeleton className="h-7 w-16" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
