-- ============================================================
-- みんなの四角ノート - Database Schema
-- Run this in Supabase SQL Editor to set up the database
-- ============================================================

-- ============================================================
-- 1. Tables
-- ============================================================

-- profiles: User profiles linked to Supabase Auth
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- categories: Content categories (英検, TOEIC, etc.)
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- posts: Main content posts
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  category_id uuid REFERENCES public.categories(id) NOT NULL,
  thumbnail_url text,
  is_published boolean NOT NULL DEFAULT false,
  likes_count integer NOT NULL DEFAULT 0,
  bookmarks_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- post_images: Images for each post (carousel)
CREATE TABLE public.post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- tags: Content tags
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- post_tags: Many-to-many relationship between posts and tags
CREATE TABLE public.post_tags (
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- likes: User likes on posts
CREATE TABLE public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- bookmarks: User bookmarks on posts
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- ============================================================
-- 2. Indexes
-- ============================================================

CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_category_id ON public.posts(category_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_published ON public.posts(is_published) WHERE is_published = true;

CREATE INDEX idx_post_images_post_id ON public.post_images(post_id, sort_order);

CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON public.bookmarks(post_id);

CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);

-- ============================================================
-- 3. Triggers & Functions
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'ユーザー'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update likes_count on posts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_changed
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

-- Auto-update bookmarks_count on posts
CREATE OR REPLACE FUNCTION public.update_post_bookmarks_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET bookmarks_count = bookmarks_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET bookmarks_count = bookmarks_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_bookmark_changed
  AFTER INSERT OR DELETE ON public.bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_bookmarks_count();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 4. Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- categories policies (read-only for public)
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);

-- posts policies (only published posts visible)
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (is_published = true);

-- post_images policies (visible if parent post is published)
CREATE POLICY "post_images_select" ON public.post_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.posts WHERE posts.id = post_images.post_id AND posts.is_published = true
  ));

-- tags policies
CREATE POLICY "tags_select" ON public.tags FOR SELECT USING (true);

-- post_tags policies
CREATE POLICY "post_tags_select" ON public.post_tags FOR SELECT USING (true);

-- likes policies
CREATE POLICY "likes_select" ON public.likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "likes_insert" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- bookmarks policies
CREATE POLICY "bookmarks_select" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 5. Initial Data (MVP Categories)
-- ============================================================

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('英検', 'eiken', '実用英語技能検定の学習コンテンツ', 1),
  ('TOEIC', 'toeic', 'TOEIC Listening & Reading テストの学習コンテンツ', 2),
  ('TOEFL', 'toefl', 'TOEFL iBTテストの学習コンテンツ', 3),
  ('IELTS', 'ielts', 'IELTS試験の学習コンテンツ', 4),
  ('英語一般', 'english-general', '英語学習全般のコンテンツ', 5);

-- ============================================================
-- 6. Storage Buckets (run separately in Supabase Dashboard)
-- ============================================================
-- Create buckets:
--   - post-images (public)
--   - avatars (public)
--
-- Storage policies for post-images:
--   SELECT: true (everyone can download)
--   INSERT/UPDATE/DELETE: service_role only (admin)
--
-- Storage policies for avatars:
--   SELECT: true (everyone can download)
--   INSERT/UPDATE: auth.uid()::text = (storage.foldername(name))[1]
--   DELETE: auth.uid()::text = (storage.foldername(name))[1]
