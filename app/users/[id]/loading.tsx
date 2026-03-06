import { Skeleton } from "@/app/components/ui/Skeleton";

export default function UserProfileLoading() {
  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="flex items-center gap-6 mb-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex gap-8">
          <div className="text-center space-y-1">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="text-center space-y-1">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>

      <Skeleton className="h-9 w-24 rounded-lg mb-6" />
    </div>
  );
}
