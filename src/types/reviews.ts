// src/types/reviews.ts
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface Reply {
  id: string;
  user_id?: string;
  user_name?: string;
  comment?: string;
  created_at: string;
  like_count: number;  // Changed from likeCount to match database
  isLiked?: boolean;
  reply_count?: number;  // Changed from replyCount
  replies?: Reply[];
}

export interface Review {
  id: string;
  user_id?: string;
  user_name?: string;
  rating: number;  // Made required since it's NOT NULL in database
  comment: string;  // Made required
  title?: string;
  created_at: string;
  verified_purchase: boolean;  // Made required with default false
  media?: MediaItem[];
  like_count: number;  // Changed from likeCount
  comment_count: number;  // Changed from commentCount
  share_count: number;  // Added to match database
  helpful_count: number;  // Added to match database
  product_id?: string;
  seller_id?: string;
  updated_at?: string;
  isLiked?: boolean;
}