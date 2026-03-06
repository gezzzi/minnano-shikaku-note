export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon_url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category_id: string;
          author_id: string | null;
          thumbnail_url: string | null;
          is_published: boolean;
          likes_count: number;
          bookmarks_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          category_id: string;
          author_id?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
          likes_count?: number;
          bookmarks_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          category_id?: string;
          author_id?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
          likes_count?: number;
          bookmarks_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string;
          type: string;
          post_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          actor_id: string;
          type: string;
          post_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_images: {
        Row: {
          id: string;
          post_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_images_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string | null;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
