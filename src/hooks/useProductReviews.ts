import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/RedirectAuthContext';

// Types
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
  like_count: number;
  isLiked?: boolean;
  reply_count?: number;
  replies?: Reply[];
}

export interface Review {
  id: string;
  product_id: string;
  seller_id?: string;
  user_id?: string;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  verified_purchase: boolean;
  media?: MediaItem[];
  like_count: number;
  comment_count: number;
  share_count: number;
  helpful_count: number;
  isLiked?: boolean;
}

export interface ReviewReply {
  id: string;
  review_id: string;
  user_id?: string;
  user_name: string;
  reply_text: string;
  created_at: string;
  like_count: number;
  parent_reply_id?: string;
  isLiked?: boolean;
}

export interface UseProductReviewsProps {
  productId?: string;
  limit?: number;
  filters?: any[];
}

export const useProductReviews = ({ productId, limit = 10, filters = [] }: UseProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<{ type: 'review' | 'reply'; id: string; userName?: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [itemBeingReplied, setItemBeingReplied] = useState<string | null>(null);
  const [repliesMap, setRepliesMap] = useState<Map<string, ReviewReply[]>>(new Map());
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's liked items
  const fetchUserLikes = useCallback(async () => {
    if (!user) {
      setUserLikes(new Set());
      return new Set();
    }

    try {
      const { data, error } = await supabase
        .from('user_likes')
        .select('item_id, item_type')
        .eq('user_id', user.id);

      if (error) throw error;

      const likedSet = new Set(data?.map(like => like.item_id) || []);
      setUserLikes(likedSet);
      return likedSet;
    } catch (err) {
      console.error('Error fetching user likes:', err);
      return new Set();
    }
  }, [user]);

  // Fetch replies for a review
  const fetchReplies = useCallback(async (reviewId: string): Promise<ReviewReply[]> => {
    try {
      const { data, error } = await supabase
        .from('review_replies')
        .select('*')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching replies:', err);
      return [];
    }
  }, []);

  // Fetch all replies for multiple reviews
  const fetchAllReplies = useCallback(async (reviewIds: string[], likes?: Set<string>) => {
    if (reviewIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('review_replies')
        .select('*')
        .in('review_id', reviewIds)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const currentLikes = likes || userLikes;
      const newRepliesMap = new Map();
      reviewIds.forEach(id => newRepliesMap.set(id, []));

      (data || []).forEach(reply => {
        const replies = newRepliesMap.get(reply.review_id) || [];
        replies.push({
          ...reply,
          like_count: reply.like_count || 0,
          isLiked: currentLikes.has(reply.id)
        });
        newRepliesMap.set(reply.review_id, replies);
      });

      setRepliesMap(newRepliesMap);
    } catch (err) {
      console.error('Error fetching replies:', err);
    }
  }, [userLikes]);

  // Fetch reviews from database
  const fetchReviews = useCallback(async (likes?: Set<string>) => {
    if (!productId) {
      setReviews([]);
      setIsLoading(false);
      setInitialLoadComplete(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, get total count
      const { count, error: countError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Build query with filters
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId);

      // Apply filters
      filters.forEach(filter => {
        switch(filter.id) {
          case 'rating':
            if (filter.value) {
              query = query.eq('rating', filter.value);
            }
            break;
          case 'verifiedPurchase':
            if (filter.value) {
              query = query.eq('verified_purchase', true);
            }
            break;
          case 'sortBy':
            switch(filter.value) {
              case 'mostRecent':
                query = query.order('created_at', { ascending: false });
                break;
              case 'highestRated':
                query = query.order('rating', { ascending: false });
                break;
              case 'lowestRated':
                query = query.order('rating', { ascending: true });
                break;
              default:
                query = query.order('created_at', { ascending: false });
            }
            break;
        }
      });

      // Add default sorting if no sort filter applied
      if (!filters.find(f => f.id === 'sortBy')) {
        query = query.order('created_at', { ascending: false });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Get current user likes
      const currentLikes = likes || userLikes;

      // Mark reviews that the user has liked
      const reviewsWithLikes = (data || []).map(review => ({
        ...review,
        like_count: review.like_count || 0,
        comment_count: review.comment_count || 0,
        share_count: review.share_count || 0,
        helpful_count: review.helpful_count || 0,
        isLiked: currentLikes.has(review.id)
      }));

      setReviews(reviewsWithLikes);

      // Fetch replies for these reviews
      if (data && data.length > 0) {
        await fetchAllReplies(data.map(r => r.id), currentLikes);
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  }, [productId, limit, filters, userLikes, fetchAllReplies]);

  // Toggle like for a review or reply
  const toggleLike = useCallback(async (itemId: string, itemType: 'review' | 'reply', reviewId?: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like reviews',
        variant: 'destructive',
      });
      return;
    }

    try {
      const alreadyLiked = userLikes.has(itemId);
      const updatedLikes = new Set(userLikes);

      // Optimistic UI update
      if (itemType === 'review') {
        setReviews(prev => prev.map(review => 
          review.id === itemId
            ? {
                ...review,
                like_count: alreadyLiked ? review.like_count - 1 : review.like_count + 1,
                isLiked: !alreadyLiked
              }
            : review
        ));
      } else if (itemType === 'reply' && reviewId) {
        setRepliesMap(prev => {
          const newMap = new Map(prev);
          const replies = newMap.get(reviewId);
          if (replies) {
            const updatedReplies = replies.map(reply =>
              reply.id === itemId
                ? {
                    ...reply,
                    like_count: alreadyLiked ? reply.like_count - 1 : reply.like_count + 1,
                    isLiked: !alreadyLiked
                  }
                : reply
            );
            newMap.set(reviewId, updatedReplies);
          }
          return newMap;
        });
      }

      // Update userLikes state
      if (alreadyLiked) {
        updatedLikes.delete(itemId);
      } else {
        updatedLikes.add(itemId);
      }
      setUserLikes(updatedLikes);

      // Perform database operation
      if (alreadyLiked) {
        // Unlike
        const { error: deleteError } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (deleteError) throw deleteError;

        // Decrement like count in the database
        const tableName = itemType === 'review' ? 'reviews' : 'review_replies';
        const { error: updateError } = await supabase.rpc('decrement_like_count', {
          table_name: tableName,
          row_id: itemId
        });

        if (updateError) {
          // If RPC doesn't exist, use direct update
          const { data: currentData } = await supabase
            .from(tableName)
            .select('like_count')
            .eq('id', itemId)
            .single();

          if (currentData) {
            await supabase
              .from(tableName)
              .update({ like_count: Math.max(0, (currentData.like_count || 0) - 1) })
              .eq('id', itemId);
          }
        }
      } else {
        // Like
        const { error: insertError } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            item_id: itemId,
            item_type: itemType
          });

        if (insertError) throw insertError;

        // Increment like count in the database
        const tableName = itemType === 'review' ? 'reviews' : 'review_replies';
        const { error: updateError } = await supabase.rpc('increment_like_count', {
          table_name: tableName,
          row_id: itemId
        });

        if (updateError) {
          // If RPC doesn't exist, use direct update
          const { data: currentData } = await supabase
            .from(tableName)
            .select('like_count')
            .eq('id', itemId)
            .single();

          if (currentData) {
            await supabase
              .from(tableName)
              .update({ like_count: (currentData.like_count || 0) + 1 })
              .eq('id', itemId);
          }
        }
      }

    } catch (err: any) {
      console.error('Error toggling like:', err);

      // Revert optimistic update on error
      if (itemType === 'review') {
        setReviews(prev => prev.map(review => 
          review.id === itemId
            ? {
                ...review,
                like_count: userLikes.has(itemId) ? review.like_count + 1 : review.like_count - 1,
                isLiked: userLikes.has(itemId)
              }
            : review
        ));
      } else if (itemType === 'reply' && reviewId) {
        setRepliesMap(prev => {
          const newMap = new Map(prev);
          const replies = newMap.get(reviewId);
          if (replies) {
            const revertedReplies = replies.map(reply =>
              reply.id === itemId
                ? {
                    ...reply,
                    like_count: userLikes.has(itemId) ? reply.like_count + 1 : reply.like_count - 1,
                    isLiked: userLikes.has(itemId)
                  }
                : reply
            );
            newMap.set(reviewId, revertedReplies);
          }
          return newMap;
        });
      }

      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    }
  }, [user, userLikes, toast]);

  // Add a reply to a review
  const addReply = useCallback(async (reviewId: string, replyText: string, parentReplyId?: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to reply',
        variant: 'destructive',
      });
      return;
    }

    if (!replyText.trim()) {
      toast({
        title: 'Invalid Reply',
        description: 'Reply cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      setItemBeingReplied(reviewId);

      const { data, error } = await supabase
        .from('review_replies')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          reply_text: replyText,
          parent_reply_id: parentReplyId || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update the replies map
      setRepliesMap(prev => {
        const newMap = new Map(prev);
        const replies = newMap.get(reviewId) || [];
        newMap.set(reviewId, [...replies, { ...data, like_count: 0, isLiked: false }]);
        return newMap;
      });

      // Update review comment count
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { ...review, comment_count: review.comment_count + 1 }
          : review
      ));

      setReplyText('');
      setReplyingTo(null);

      toast({
        title: 'Success',
        description: 'Reply posted successfully',
      });
    } catch (err: any) {
      console.error('Error adding reply:', err);
      toast({
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setItemBeingReplied(null);
    }
  }, [user, toast]);

  // Delete a reply
  const deleteReply = useCallback(async (replyId: string, reviewId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to delete replies',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('review_replies')
        .delete()
        .eq('id', replyId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update the replies map
      setRepliesMap(prev => {
        const newMap = new Map(prev);
        const replies = newMap.get(reviewId) || [];
        newMap.set(reviewId, replies.filter(reply => reply.id !== replyId));
        return newMap;
      });

      // Update review comment count
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? { ...review, comment_count: Math.max(0, review.comment_count - 1) }
          : review
      ));

      toast({
        title: 'Success',
        description: 'Reply deleted successfully',
      });
    } catch (err: any) {
      console.error('Error deleting reply:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete reply. Please try again.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  // Edit a reply
  const editReply = useCallback(async (replyId: string, reviewId: string, newText: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to edit replies',
        variant: 'destructive',
      });
      return;
    }

    if (!newText.trim()) {
      toast({
        title: 'Invalid Reply',
        description: 'Reply cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('review_replies')
        .update({ reply_text: newText })
        .eq('id', replyId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update the replies map
      setRepliesMap(prev => {
        const newMap = new Map(prev);
        const replies = newMap.get(reviewId) || [];
        newMap.set(reviewId, replies.map(reply =>
          reply.id === replyId ? { ...reply, reply_text: newText } : reply
        ));
        return newMap;
      });

      toast({
        title: 'Success',
        description: 'Reply updated successfully',
      });
    } catch (err: any) {
      console.error('Error editing reply:', err);
      toast({
        title: 'Error',
        description: 'Failed to update reply. Please try again.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  // Toggle expansion of review replies
  const toggleReviewExpansion = useCallback((reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  }, []);

  // Toggle expansion of nested replies
  const toggleReplyExpansion = useCallback((replyId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  }, []);

  // Get replies for a review
  const getRepliesForReview = useCallback((reviewId: string): ReviewReply[] => {
    return repliesMap.get(reviewId) || [];
  }, [repliesMap]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      const likes = await fetchUserLikes();
      await fetchReviews(likes);
    };

    initialize();
  }, [productId, filters]);

  // Refresh user likes when user changes
  useEffect(() => {
    if (initialLoadComplete) {
      fetchUserLikes();
    }
  }, [user, initialLoadComplete]);

  return {
    // Data
    reviews,
    isLoading,
    error,
    totalCount,
    
    // UI State
    expandedReviews,
    expandedReplies,
    replyingTo,
    replyText,
    itemBeingReplied,
    repliesMap,
    userLikes,
    
    // Setters
    setReplyText,
    setReplyingTo,
    
    // Actions
    fetchReviews,
    fetchUserLikes,
    toggleLike,
    addReply,
    deleteReply,
    editReply,
    toggleReviewExpansion,
    toggleReplyExpansion,
    getRepliesForReview,
  };
};

// Helper functions (pure functions, no hooks, no components)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getAvatarColor = (name?: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];

  if (!name) return colors[0];

  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (name?: string): string => {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};