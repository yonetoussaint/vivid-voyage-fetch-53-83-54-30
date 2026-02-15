// src/hooks/useProductReviews.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/RedirectAuthContext';

export interface Review {
  id: string;
  product_id: string;
  seller_id?: string;
  user_name: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
  updated_at?: string;
  helpful_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  verified_purchase: boolean;
}

export interface ReviewReply {
  id: string;
  review_id: string;
  user_name: string;
  reply_text: string;
  created_at: string;
  like_count: number;
  parent_reply_id?: string;
}

export interface UseProductReviewsProps {
  productId?: string;
  limit?: number;
}

export const useProductReviews = ({ productId, limit = 10 }: UseProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<{ type: 'review' | 'reply'; id: string; userName?: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [itemBeingReplied, setItemBeingReplied] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch reviews from database
  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setIsLoading(false);
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

      // Then fetch the reviews with pagination
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setReviews(data || []);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [productId, limit]);

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

  // Submit a new review
  const submitReview = useCallback(async (reviewData: {
    rating: number;
    title?: string;
    comment: string;
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
          user_name: user.email?.split('@')[0] || 'Anonymous',
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          verified_purchase: false, // You can implement logic to check if user purchased
          helpful_count: 0,
          like_count: 0,
          comment_count: 0,
          share_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new review to the list
      setReviews(prev => [data, ...prev]);
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
          user_name: user.email?.split('@')[0] || 'Anonymous',
          reply_text: replyText,
          parent_reply_id: parentReplyId,
          like_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Increment comment count on the review
      await supabase
        .from('reviews')
        .update({ comment_count: supabase.rpc('increment', { amount: 1 }) })
        .eq('id', reviewId);

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

  // Like a review or reply
  const handleLike = useCallback(async (itemId: string, type: 'review' | 'reply') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (type === 'review') {
        const { error } = await supabase
          .from('reviews')
          .update({ like_count: supabase.rpc('increment', { amount: 1 }) })
          .eq('id', itemId);

        if (error) throw error;

        setReviews(prev =>
          prev.map(review =>
            review.id === itemId
              ? { ...review, like_count: (review.like_count || 0) + 1 }
              : review
          )
        );
      } else {
        // Handle reply like
        const { error } = await supabase
          .from('review_replies')
          .update({ like_count: supabase.rpc('increment', { amount: 1 }) })
          .eq('id', itemId);

        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Error liking item:', err);
      toast({
        title: 'Failed to like',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

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
      await supabase
        .from('reviews')
        .update({ share_count: supabase.rpc('increment', { amount: 1 }) })
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
            ? { ...review, share_count: (review.share_count || 0) + 1 }
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
      // Refresh reviews to show the new reply
      fetchReviews();
    }
  }, [replyingTo, replyText, itemBeingReplied, submitReply, fetchReviews]);

  const handleCancelReply = useCallback(() => {
    setReplyText('');
    setReplyingTo(null);
    setItemBeingReplied(null);
  }, []);

  // Calculate summary statistics
  const summaryStats = useCallback(() => {
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

  // Load reviews on mount and when productId changes
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
    
    // Computed
    summaryStats: summaryStats(),
    
    // User
    user
  };
};