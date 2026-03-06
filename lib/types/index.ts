import type { Database } from "./database";

// Table row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostImage = Database["public"]["Tables"]["post_images"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];

// Post with related data
export type PostWithDetails = Post & {
  category: Category;
  images: PostImage[];
  tags: Tag[];
};

// Post card (for listing)
export type PostCard = Post & {
  category: Pick<Category, "name" | "slug">;
};

export type { Database };
