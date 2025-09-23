export interface BannerType {
  id: string;
  image: string; // This can be an image or video URL
  type: "image" | "video"; // NEW: explicitly define the media type
  alt?: string;
  position: number;
  created_at?: string;
  updated_at?: string;
  duration?: number; // Optional: time in ms to show this slide before transitioning
  seller_id?: string | null;
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
}