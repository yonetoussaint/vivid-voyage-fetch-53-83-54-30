
import { supabase } from './client';

export interface SellerPost {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  product_ids: string[];
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  updated_at?: string;
}

export async function fetchSellerPosts(sellerId?: string): Promise<SellerPost[]> {
  let query = supabase
    .from('seller_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (sellerId) {
    query = query.eq('seller_id', sellerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching seller posts:', error);
    throw error;
  }

  return data || [];
}

export async function fetchSellerPostById(postId: string): Promise<SellerPost | null> {
  const { data, error } = await supabase
    .from('seller_posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching seller post:', error);
    throw error;
  }

  return data;
}
