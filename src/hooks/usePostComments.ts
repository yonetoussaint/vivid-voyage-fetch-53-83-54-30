
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  image_url?: string;
  like_count: number;
  love_count: number;
  haha_count: number;
  created_at: string;
  profiles?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export function usePostComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
      setIsLoading(false);
    };

    fetchComments();

    // Subscribe to real-time updates for comments
    const commentsSubscription = supabase
      .channel(`post_comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    // Subscribe to reaction changes to update counts
    const reactionsSubscription = supabase
      .channel(`comment_reactions:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_reactions'
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      commentsSubscription.unsubscribe();
      reactionsSubscription.unsubscribe();
    };
  }, [postId, queryClient]);

  return { comments, isLoading };
}
