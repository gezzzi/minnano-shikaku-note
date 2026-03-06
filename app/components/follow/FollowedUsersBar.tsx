import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/types";

interface FollowedUser {
  following: Profile;
}

export function FollowedUsersBar({ users }: { users: FollowedUser[] }) {
  if (users.length === 0) return null;

  return (
    <div className="px-4 py-4 flex gap-4 overflow-x-auto border-b border-gray-50 scrollbar-hide">
      {users.map(({ following }) => (
        <Link
          key={following.id}
          href={`/users/${following.id}`}
          className="flex flex-col items-center gap-1 min-w-[70px]"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                {following.avatar_url ? (
                  <Image
                    src={following.avatar_url}
                    alt={following.display_name || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
                    {(following.display_name || "U")[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-gray-700 truncate max-w-[70px]">
            {following.display_name || "ユーザー"}
          </span>
        </Link>
      ))}
    </div>
  );
}
