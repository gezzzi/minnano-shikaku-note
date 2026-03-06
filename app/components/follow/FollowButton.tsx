"use client";

import { useState, useOptimistic } from "react";
import { followUser, unfollowUser } from "@/app/actions/follow";

interface Props {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(following);

  const handleToggle = async () => {
    setOptimisticFollowing(!optimisticFollowing);

    if (following) {
      const result = await unfollowUser(userId);
      if (!result.error) setFollowing(false);
    } else {
      const result = await followUser(userId);
      if (!result.error) setFollowing(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        optimisticFollowing
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
          : "bg-gray-900 text-white hover:bg-gray-800"
      }`}
    >
      {optimisticFollowing ? "フォロー中" : "フォロー"}
    </button>
  );
}
