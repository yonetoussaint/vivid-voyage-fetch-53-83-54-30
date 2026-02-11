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
  likeCount?: number;
  isLiked?: boolean;
  replyCount?: number;
  replies?: Reply[];
}

export interface Review {
  id: string;
  user_id?: string;
  user_name?: string;
  rating?: number;
  comment?: string;
  created_at: string;
  verified_purchase?: boolean;
  media?: MediaItem[];
  likeCount?: number;
  commentCount?: number;
  replies?: Reply[];
}