import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, formatDateForReply } from './DateUtils';

// Types
export interface ReviewMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt: string;
}

export interface ReviewReply {
  id: string;
  user_name: string;
  comment: string;
  created_at: string;
  is_seller: boolean;
  verified_seller: boolean;
  likeCount: number;
  liked: boolean;
  parent_reply_id?: string;
  replying_to?: string;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  verified_purchase: boolean;
  helpful_count: number;
  reply_count: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  media: ReviewMedia[];
  replies: ReviewReply[];
}

export interface ReplyingTo {
  type: 'review' | 'reply';
  reviewId: string;
  replyId?: string;
  userName: string;
  isSeller?: boolean;
  verifiedSeller?: boolean;
}

interface ReviewStats {
  count: number;
  averageRating: number;
}

interface UseCustomerReviewsProps {
  productId: string;
  limit?: number;
}

export const useCustomerReviews = ({ productId, limit }: UseCustomerReviewsProps) => {
  // State
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);
  const [replyText, setReplyText] = useState('');

  const { user } = useAuth();

  // Filter categories
  const filterCategories = useMemo(() => [
    {
      id: 'rating',
      label: 'Rating',
      options: ['All Ratings', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']
    },
    {
      id: 'media',
      label: 'Media',
      options: ['All Media', 'With Photos', 'With Videos', 'No Media']
    },
    {
      id: 'sort',
      label: 'Sort By',
      options: ['All Sorts', 'Most Recent', 'Oldest First', 'Most Liked']
    }
  ], []);

  // Initialize filters
  useEffect(() => {
    const initialFilters: Record<string, string> = {};
    filterCategories.forEach((filter) => {
      initialFilters[filter.id] = filter.options[0];
    });
    setSelectedFilters(initialFilters);
  }, [filterCategories]);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!productId) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setLocalReviews([]);
        setIsLoading(false);
        return;
      }

      const reviewsWithDetails = await Promise.all(
        reviewsData.map(async (review) => {
          try {
            const [{ data: mediaData }, { data: repliesData }] = await Promise.all([
              supabase.from('review_media').select('*').eq('review_id', review.id),
              supabase.from('reviews_replies').select('*').eq('review_id', review.id).order('created_at', { ascending: true })
            ]);

            const media: ReviewMedia[] = (mediaData || []).map(mediaItem => ({
              type: (mediaItem.media_type as 'image' | 'video') || 'image',
              url: mediaItem.url || '',
              thumbnail: mediaItem.thumbnail_url,
              alt: mediaItem.alt_text || 'Review media'
            }));

            const replies: ReviewReply[] = (repliesData || []).map(reply => ({
              id: reply.id,
              user_name: reply.user_name || 'Anonymous',
              comment: reply.comment || '',
              created_at: reply.created_at,
              is_seller: reply.is_seller || false,
              verified_seller: reply.verified_seller || false,
              likeCount: reply.like_count || 0,
              liked: reply.liked || false,
              parent_reply_id: reply.parent_reply_id,
              replying_to: reply.replying_to
            }));

            return {
              id: review.id,
              user_name: review.user_name || 'Anonymous',
              rating: review.rating || 0,
              comment: review.comment || '',
              created_at: review.created_at,
              verified_purchase: review.verified_purchase || false,
              helpful_count: review.helpful_count || 0,
              reply_count: replies.length,
              likeCount: review.like_count || 0,
              commentCount: replies.length,
              shareCount: review.share_count || 0,
              media,
              replies
            };
          } catch (err) {
            console.error('Error processing review', review.id, err);
            return {
              id: review.id,
              user_name: review.user_name || 'Anonymous',
              rating: review.rating || 0,
              comment: review.comment || '',
              created_at: review.created_at,
              verified_purchase: review.verified_purchase || false,
              helpful_count: review.helpful_count || 0,
              reply_count: 0,
              likeCount: review.like_count || 0,
              commentCount: 0,
              shareCount: review.share_count || 0,
              media: [],
              replies: []
            };
          }
        })
      );

      setLocalReviews(reviewsWithDetails);
    } catch (err: any) {
      console.error('Error in fetchReviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Fetch reviews on mount
  useEffect(() => {
    if (productId) {
      fetchReviews();
    } else {
      setIsLoading(false);
      setError('Product ID is required');
    }
  }, [productId, fetchReviews]);

  // Handle liking a reply
  const handleLikeReply = async (reviewId: string, replyId: string) => {
    try {
      const review = localReviews.find(r => r.id === reviewId);
      const reply = review?.replies?.find(r => r.id === replyId);

      if (!reply) return;

      const newLikeCount = reply.liked ? (reply.likeCount || 0) - 1 : (reply.likeCount || 0) + 1;
      const newLikedStatus = !reply.liked;

      setLocalReviews(prevReviews => 
        prevReviews.map(review => {
          if (review.id === reviewId) {
            const updatedReplies = (review.replies || []).map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  liked: newLikedStatus,
                  likeCount: newLikeCount
                };
              }
              return reply;
            });
            return {
              ...review,
              replies: updatedReplies
            };
          }
          return review;
        })
      );

      const { error } = await supabase
        .from('reviews_replies')
        .update({ 
          like_count: newLikeCount,
          liked: newLikedStatus
        })
        .eq('id', replyId);

      if (error) throw error;
    } catch (error) {
      console.error('Error liking reply:', error);
      fetchReviews();
    }
  };

  // Get item being replied to
  const itemBeingReplied = useMemo(() => {
    if (!replyingTo) return null;

    try {
      const review = localReviews.find(r => r.id === replyingTo.reviewId);
      if (!review) return null;

      if (replyingTo.type === 'review') {
        return { type: 'review' as const, item: review };
      } else {
        const reply = (review.replies || []).find(r => r.id === replyingTo.replyId);
        return reply ? { type: 'reply' as const, item: reply } : null;
      }
    } catch (error) {
      console.error('Error in itemBeingReplied:', error);
      return null;
    }
  }, [replyingTo, localReviews]);

  // Toggle functions
  const toggleReadMore = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const toggleShowMoreReplies = (reviewId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReplies(newExpanded);
  };

  // Comment/Reply handlers
  const handleCommentClick = (reviewId: string) => {
    const review = localReviews.find(r => r.id === reviewId);
    if (!review) return;

    setReplyingTo({
      type: 'review',
      reviewId: reviewId,
      userName: review.user_name || 'User',
      isSeller: false,
      verifiedSeller: false
    });
    setReplyText('');

    const newExpanded = new Set(expandedReplies);
    if (!newExpanded.has(reviewId)) {
      newExpanded.add(reviewId);
      setExpandedReplies(newExpanded);
    }
  };

  const handleReplyToReply = (reviewId: string, replyId: string, userName: string) => {
    const review = localReviews.find(r => r.id === reviewId);
    if (!review) return;

    const reply = (review.replies || []).find(r => r.id === replyId);
    if (!reply) return;

    setReplyingTo({
      type: 'reply',
      reviewId: reviewId,
      replyId: replyId,
      userName: userName || reply.user_name || 'User',
      isSeller: reply.is_seller || false,
      verifiedSeller: reply.verified_seller || false
    });
    setReplyText('');
  };

  const handleShareClick = (reviewId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Product Review',
        text: 'Check out this product review!',
        url: `${window.location.origin}/product/${productId}?review=${reviewId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${productId}?review=${reviewId}`);
      alert('Review link copied to clipboard!');
    }
  };

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      let userName = 'User';
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id)
          .single();

        if (profileData) {
          userName = profileData.full_name || profileData.username || user.email?.split('@')[0] || 'User';
        } else {
          userName = user.email?.split('@')[0] || 'User';
        }
      }

      const newReplyData = {
        review_id: replyingTo.reviewId,
        user_id: user?.id || null,
        user_name: userName,
        comment: replyText.trim(),
        is_seller: replyingTo.isSeller || false,
        verified_seller: replyingTo.verifiedSeller || false,
        parent_reply_id: replyingTo.type === 'reply' ? replyingTo.replyId : null,
        replying_to: replyingTo.type === 'reply' ? replyingTo.userName : null
      };

      const { data: insertedReply, error } = await supabase
        .from('reviews_replies')
        .insert([newReplyData])
        .select()
        .single();

      if (error) throw error;

      setLocalReviews(prevReviews => 
        prevReviews.map(review => {
          if (review.id === replyingTo.reviewId) {
            const newReply: ReviewReply = {
              id: insertedReply.id,
              user_name: insertedReply.user_name || userName,
              comment: insertedReply.comment || '',
              created_at: insertedReply.created_at,
              is_seller: insertedReply.is_seller || false,
              verified_seller: insertedReply.verified_seller || false,
              likeCount: 0,
              liked: false,
              parent_reply_id: insertedReply.parent_reply_id,
              replying_to: insertedReply.replying_to
            };

            return {
              ...review,
              replies: [...(review.replies || []), newReply],
              reply_count: (review.reply_count || 0) + 1
            };
          }
          return review;
        })
      );

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // Review statistics
  const reviewStats = useMemo(() => {
    const count = localReviews.length;
    const totalRating = localReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = count > 0 ? totalRating / count : 0;
    return { count, averageRating };
  }, [localReviews]);

  // Rating distribution
  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    localReviews.forEach(review => {
      const rating = review.rating || 0;
      if (rating >= 1 && rating <= 5) {
        counts[5 - rating]++;
      }
    });
    return counts;
  }, [localReviews]);

  // Filter handlers
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));

    if (filterId === 'sort') {
      if (option.toLowerCase().startsWith('all')) {
        setSortBy('recent');
      } else {
        const sortMap: Record<string, string> = {
          'Most Recent': 'recent',
          'Oldest First': 'oldest',
          'Most Liked': 'helpful'
        };
        if (sortMap[option]) {
          setSortBy(sortMap[option]);
        }
      }
    } else if (filterId === 'rating') {
      if (option.toLowerCase().startsWith('all')) {
        setFilterRating(0);
      } else {
        const ratingMap: Record<string, number> = {
          '5 Stars': 5,
          '4 Stars': 4,
          '3 Stars': 3,
          '2 Stars': 2,
          '1 Star': 1
        };
        if (option in ratingMap) {
          setFilterRating(ratingMap[option]);
        }
      }
    }
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const defaultOption = filterCategories.find(cat => cat.id === filterId)?.options[0];
      if (defaultOption) {
        return {
          ...prev,
          [filterId]: defaultOption
        };
      }
      return prev;
    });

    if (filterId === 'rating') {
      setFilterRating(0);
    } else if (filterId === 'sort') {
      setSortBy('recent');
    }
  };

  const handleClearAll = () => {
    const resetFilters: Record<string, string> = {};
    filterCategories.forEach(category => {
      resetFilters[category.id] = category.options[0];
    });
    setSelectedFilters(resetFilters);
    setSortBy('recent');
    setFilterRating(0);
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  // Filter and sort reviews
  const finalReviews = useMemo(() => {
    let filtered = localReviews;

    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter(review => (review.rating || 0) === filterRating);
    }

    // Filter by media
    const mediaFilter = selectedFilters.media;
    if (mediaFilter && !mediaFilter.toLowerCase().startsWith('all')) {
      switch (mediaFilter) {
        case 'With Photos':
          filtered = filtered.filter(review => 
            review.media && review.media.some(item => item.type === 'image')
          );
          break;
        case 'With Videos':
          filtered = filtered.filter(review => 
            review.media && review.media.some(item => item.type === 'video')
          );
          break;
        case 'No Media':
          filtered = filtered.filter(review => 
            !review.media || review.media.length === 0
          );
          break;
      }
    }

    // Sort reviews
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'helpful':
          return (b.helpful_count || 0) - (a.helpful_count || 0);
        default:
          return 0;
      }
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [localReviews, sortBy, filterRating, selectedFilters.media, limit]);

  // Summary stats for header
  const summaryStats = useMemo(() => [
    { value: reviewStats.averageRating.toFixed(1), label: 'Average', color: 'text-yellow-600' },
    { value: reviewStats.count, label: 'Total', color: 'text-blue-600' },
    { value: `${Math.round((ratingCounts[0] / Math.max(reviewStats.count, 1)) * 100)}%`, label: 'Positivity', color: 'text-green-600' },
    { value: ratingCounts[0], label: '5 Star', color: 'text-purple-600' }
  ], [reviewStats, ratingCounts]);

  // Reviews summary for SellerSummaryHeader
  const reviewsSummary = useMemo(() => ({
    averageRating: reviewStats.averageRating,
    totalReviews: reviewStats.count,
    distribution: [
      { 
        stars: 5, 
        count: ratingCounts[0], 
        percentage: reviewStats.count > 0 ? Math.round((ratingCounts[0] / reviewStats.count) * 100) : 0 
      },
      { 
        stars: 4, 
        count: ratingCounts[1], 
        percentage: reviewStats.count > 0 ? Math.round((ratingCounts[1] / reviewStats.count) * 100) : 0 
      },
      { 
        stars: 3, 
        count: ratingCounts[2], 
        percentage: reviewStats.count > 0 ? Math.round((ratingCounts[2] / reviewStats.count) * 100) : 0 
      },
      { 
        stars: 2, 
        count: ratingCounts[3], 
        percentage: reviewStats.count > 0 ? Math.round((ratingCounts[3] / reviewStats.count) * 100) : 0 
      },
      { 
        stars: 1, 
        count: ratingCounts[4], 
        percentage: reviewStats.count > 0 ? Math.round((ratingCounts[4] / reviewStats.count) * 100) : 0 
      }
    ]
  }), [reviewStats, ratingCounts]);

  return {
    // State
    sortBy,
    filterRating,
    expandedReviews,
    expandedReplies,
    selectedFilters,
    localReviews,
    isLoading,
    error,
    replyingTo,
    replyText,
    
    // Handlers
    setReplyText,
    handleLikeReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    handleFilterSelect,
    handleFilterClear,
    handleClearAll,
    handleFilterButtonClick,
    fetchReviews,
    
    // Computed values
    filterCategories,
    finalReviews,
    reviewsSummary,
    itemBeingReplied,
    
    // Statistics
    reviewStats,
    summaryStats,
    ratingCounts
  };
};

// Helper function
export const truncateText = (text: string, maxLength: number = 120): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};