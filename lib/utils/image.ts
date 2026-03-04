const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

type ImageSize = "thumbnail" | "card" | "full";

const SIZE_CONFIG: Record<ImageSize, { width: number; quality: number }> = {
  thumbnail: { width: 400, quality: 75 },
  card: { width: 600, quality: 80 },
  full: { width: 1200, quality: 85 },
};

export function getStorageUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function getImageUrl(
  bucket: string,
  path: string,
  size: ImageSize = "full"
): string {
  const { width, quality } = SIZE_CONFIG[size];
  return `${SUPABASE_URL}/storage/v1/render/image/public/${bucket}/${path}?width=${width}&quality=${quality}`;
}
