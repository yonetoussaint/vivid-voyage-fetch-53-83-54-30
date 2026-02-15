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

  // Update isLiked status for all reviews and replies when userLikes changes
  const updateLikeStatus = useCallback((likes: Set<string>) => {
    // Update reviews
    setReviews(prevReviews => 
      prevReviews.map(review => ({
        ...review,
        isLiked: likes.has(review.id)
      }))
    );

    // Update replies
    setRepliesMap(prevMap => {
      const newMap = new Map(prevMap);
      for (const [reviewId, replies] of newMap.entries()) {
        const updatedReplies = replies.map(reply => ({
          ...reply,
          isLiked: likes.has(reply.id)
        }));
        newMap.set(reviewId, updatedReplies);
      }
      return newMap;
    });
  }, []);

  // Load user likes on mount and when user changes
  useEffect(() => {
    const loadUserLikes = async () => {
      const likes = await fetchUserLikes();
      
      // If we already have reviews loaded, update their like status
      if (reviews.length > 0) {
        updateLikeStatus(likes);
      }
      
      // If this is the initial load and we haven't fetched reviews yet,
      // fetch them with the new likes
      if (!initialLoadComplete && productId) {
        await fetchReviews(likes);
      }
    };

    loadUserLikes();
  }, [user]); // Only depend on user changes

  // Load reviews when productId or filters change
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, filters]); // Remove fetchReviews from dependencies

  // Like/unlike a review or reply
  const handleLike = useCallback(async (itemId: string, type: 'review' | 'reply') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like',
        variant: 'destructive',
      });
      return;
    }

    const isLiked = userLikes.has(itemId);
    
    // Optimistically update UI
    if (type === 'review') {
      setReviews(prev =>
        prev.map(review =>
          review.id === itemId
            ? { 
                ...review, 
                like_count: isLiked ? Math.max(0, review.like_count - 1) : review.like_count + 1,
                isLiked: !isLiked 
              }
            : review
        )
      );
    } else {
      setRepliesMap(prev => {
        const newMap = new Map(prev);
        for (const [reviewId, replies] of newMap.entries()) {
          const updatedReplies = replies.map(reply =>
            reply.id === itemId
              ? { 
                  ...reply, 
                  like_count: isLiked ? Math.max(0, reply.like_count - 1) : reply.like_count + 1,
                  isLiked: !isLiked 
                }
              : reply
          );
          newMap.set(reviewId, updatedReplies);
        }
        return newMap;
      });
    }

    // Update user likes set
    setUserLikes(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });

    try {
      if (isLiked) {
        // Unlike
        // Delete from user_likes
        const { error: deleteError } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (deleteError) throw deleteError;

        // Decrement like count in database
        if (type === 'review') {
          // First get current count
          const { data: currentReview } = await supabase
            .from('reviews')
            .select('like_count')
            .eq('id', itemId)
            .single();
          
          const newCount = Math.max(0, (currentReview?.like_count || 1) - 1);
          
          const { error: updateError } = await supabase
            .from('reviews')
            .update({ like_count: newCount })
            .eq('id', itemId);

          if (updateError) throw updateError;
        } else {
          // For replies
          const { data: currentReply } = await supabase
            .from('review_replies')
            .select('like_count')
            .eq('id', itemId)
            .single();
          
          const newCount = Math.max(0, (currentReply?.like_count || 1) - 1);
          
          const { error: updateError } = await supabase
            .from('review_replies')
            .update({ like_count: newCount })
            .eq('id', itemId);

          if (updateError) throw updateError;
        }
      } else {
        // Like
        // Insert into user_likes
        const { error: insertError } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            item_id: itemId,
            item_type: type
          });

        if (insertError) throw insertError;

        // Increment like count in database
        if (type === 'review') {
          // First get current count
          const { data: currentReview } = await supabase
            .from('reviews')
            .select('like_count')
            .eq('id', itemId)
            .single();
          
          const newCount = (currentReview?.like_count || 0) + 1;
          
          const { error: updateError } = await supabase
            .from('reviews')
            .update({ like_count: newCount })
            .eq('id', itemId);

          if (updateError) throw updateError;
        } else {
          // For replies
          const { data: currentReply } = await supabase
            .from('review_replies')
            .select('like_count')
            .eq('id', itemId)
            .single();
          
          const newCount = (currentReply?.like_count || 0) + 1;
          
          const { error: updateError } = await supabase
            .from('review_replies')
            .update({ like_count: newCount })
            .eq('id', itemId);

          if (updateError) throw updateError;
        }
      }
    } catch (err: any) {
      // Revert optimistic updates on error
      console.error('Error liking item:', err);
      
      // Revert UI
      if (type === 'review') {
        setReviews(prev =>
          prev.map(review =>
            review.id === itemId
              ? { 
                  ...review, 
                  like_count: isLiked ? review.like_count + 1 : Math.max(0, review.like_count - 1),
                  isLiked: isLiked 
                }
              : review
          )
        );
      } else {
        setRepliesMap(prev => {
          const newMap = new Map(prev);
          for (const [reviewId, replies] of newMap.entries()) {
            const updatedReplies = replies.map(reply =>
              reply.id === itemId
                ? { 
                    ...reply, 
                    like_count: isLiked ? reply.like_count + 1 : Math.max(0, reply.like_count - 1),
                    isLiked: isLiked 
                  }
                : reply
            );
            newMap.set(reviewId, updatedReplies);
          }
          return newMap;
        });
      }

      // Revert user likes
      setUserLikes(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });

      toast({
        title: 'Failed to like',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
    }
  }, [user, userLikes, toast]);

  // Get replies for a review
  const getRepliesForReview = useCallback((reviewId: string): ReviewReply[] => {
    return repliesMap.get(reviewId) || [];
  }, [repliesMap]);

  // Load more replies (pagination)
  const loadMoreReplies = useCallback(async (reviewId: string) => {
    // Implement pagination logic here if needed
    const currentReplies = repliesMap.get(reviewId) || [];
    // Fetch next page of replies
  }, [repliesMap]);

  // Submit a new review
  const submitReview = useCallback(async (reviewData: {
    rating: number;
    title?: string;
    comment: string;
    images?: File[];
  }) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return false;
    }

    if (!productId) {
      toast({
        title: 'Error',
        description: 'Product ID is missing',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Anonymous',
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          verified_purchase: false,
          helpful_count: 0,
          like_count: 0,
          comment_count: 0,
          share_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new review to the list
      setReviews(prev => [{
        ...data,
        like_count: 0,
        comment_count: 0,
        share_count: 0,
        helpful_count: 0,
        isLiked: false
      }, ...prev]);
      setTotalCount(prev => prev + 1);

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });

      return true;
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast({
        title: 'Failed to submit review',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
      return false;
    }
  }, [productId, user, toast]);

  // Submit a reply to a review
  const submitReply = useCallback(async (reviewId: string, replyText: string, parentReplyId?: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to reply',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('review_replies')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Anonymous',
          reply_text: replyText,
          parent_reply_id: parentReplyId,
          like_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Increment comment count on the review
      const { data: currentReview } = await supabase
        .from('reviews')
        .select('comment_count')
        .eq('id', reviewId)
        .single();

      const newCommentCount = (currentReview?.comment_count || 0) + 1;

      await supabase
        .from('reviews')
        .update({ comment_count: newCommentCount })
        .eq('id', reviewId);

      // Add reply to local state
      setRepliesMap(prev => {
        const newMap = new Map(prev);
        const currentReplies = newMap.get(reviewId) || [];
        newMap.set(reviewId, [...currentReplies, { 
          ...data, 
          like_count: 0, 
          isLiked: false 
        }]);
        return newMap;
      });

      // Update review comment count
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? { ...review, comment_count: newCommentCount }
            : review
        )
      );

      toast({
        title: 'Reply posted',
        description: 'Your reply has been added',
      });

      return true;
    } catch (err: any) {
      console.error('Error submitting reply:', err);
      toast({
        title: 'Failed to post reply',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        totalRatings: 0
      };
    }

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach(review => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating as keyof typeof ratingCounts]++;
        totalRating += rating;
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalRating / totalReviews;

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingCounts,
      totalRatings: totalRating
    };
  }, [reviews]);

  // Toggle functions
  const toggleReadMore = useCallback((reviewId: string) => {
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

  const toggleShowMoreReplies = useCallback((reviewId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  }, []);

  const handleCommentClick = useCallback((reviewId: string) => {
    setReplyingTo({ type: 'review', id: reviewId });
    setItemBeingReplied(reviewId);
  }, []);

  const handleReplyToReply = useCallback((replyId: string, reviewId: string, userName: string) => {
    setReplyingTo({ type: 'reply', id: replyId, userName });
    setItemBeingReplied(reviewId);
    setReplyText(`@${userName} `);
  }, []);

  const handleShareClick = useCallback(async (reviewId: string) => {
    try {
      // Increment share count
      const { data: currentReview } = await supabase
        .from('reviews')
        .select('share_count')
        .eq('id', reviewId)
        .single();

      const newCount = (currentReview?.share_count || 0) + 1;

      await supabase
        .from('reviews')
        .update({ share_count: newCount })
        .eq('id', reviewId);

      // Share logic
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this review',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Review link copied to clipboard',
        });
      }

      // Update local state
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? { ...review, share_count: newCount }
            : review
        )
      );
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }, [toast]);

  const handleSubmitReply = useCallback(async () => {
    if (!replyingTo || !replyText.trim() || !itemBeingReplied) return;

    const success = await submitReply(
      itemBeingReplied,
      replyText,
      replyingTo.type === 'reply' ? replyingTo.id : undefined
    );

    if (success) {
      setReplyText('');
      setReplyingTo(null);
      setItemBeingReplied(null);
    }
  }, [replyingTo, replyText, itemBeingReplied, submitReply]);

  const handleCancelReply = useCallback(() => {
    setReplyText('');
    setReplyingTo(null);
    setItemBeingReplied(null);
  }, []);

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

    // Setters
    setReplyText,

    // Actions
    fetchReviews,
    submitReview,
    submitReply,
    handleLike,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    getRepliesForReview,
    loadMoreReplies,

    // Computed
    summaryStats,

    // User
    user,
    userLikes
  };
};