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

  // Toggle like for a review or reply - FIXED VERSION
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

      // REMOVED: await fetchReviews(updatedLikes);
      // The optimistic update already handled the UI, no need to refetch

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
    reviews,
    isLoading,
    error,
    totalCount,
    expandedReviews,
    expandedReplies,
    replyingTo,
    replyText,
    itemBeingReplied,
    repliesMap,
    userLikes,
    setReplyText,
    setReplyingTo,
    toggleLike,
    addReply,
    deleteReply,
    editReply,
    toggleReviewExpansion,
    toggleReplyExpansion,
    fetchReviews,
    fetchUserLikes,
  };
};

// Helper functions
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

// ReviewItem Component (keeping the rest of your component code)
import { memo, useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewItemProps {
  review: Review;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onLike?: (reviewId: string) => void;
  onReply?: (reviewId: string, userName: string) => void;
  onShare?: (reviewId: string) => void;
  onEdit?: (reviewId: string, title: string, comment: string, rating: number) => void;
  onDelete?: (reviewId: string) => void;
  onReport?: (reviewId: string, reason: string) => void;
  currentUserId?: string;
  replies?: ReviewReply[];
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
  onEditReply?: (replyId: string, reviewId: string, comment: string) => void;
  onDeleteReply?: (replyId: string, reviewId: string) => void;
  onReportReply?: (replyId: string, reviewId: string, reason: string) => void;
  onToggleShowMoreReplies?: () => void;
  isRepliesExpanded?: boolean;
  maxVisibleReplies?: number;
}

export const ReviewItem = memo(({
  review,
  isExpanded = false,
  onToggleExpand,
  onLike,
  onReply,
  onShare,
  onEdit,
  onDelete,
  onReport,
  currentUserId,
  replies = [],
  onLikeReply,
  onReplyToReply,
  onEditReply,
  onDeleteReply,
  onReportReply,
  onToggleShowMoreReplies,
  isRepliesExpanded = false,
  maxVisibleReplies = 3,
}: ReviewItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    id,
    user_name,
    rating,
    title,
    comment,
    created_at,
    verified_purchase,
    like_count = 0,
    comment_count = 0,
    share_count = 0,
    isLiked = false,
  } = review;

  const isOwner = currentUserId === review.user_id;
  const hasReplies = replies && replies.length > 0;
  const visibleReplies = isRepliesExpanded ? replies : replies.slice(0, maxVisibleReplies);
  const hasMoreReplies = replies.length > maxVisibleReplies;

  const handleLikeClick = useCallback(() => {
    onLike?.(id);
  }, [id, onLike]);

  const handleReplyClick = useCallback(() => {
    onReply?.(id, user_name);
  }, [id, user_name, onReply]);

  const handleShareClick = useCallback(() => {
    onShare?.(id);
  }, [id, onShare]);

  const handleEditClick = useCallback(() => {
    onEdit?.(id, title || '', comment, rating);
    setShowMenu(false);
  }, [id, title, comment, rating, onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.(id);
    setShowMenu(false);
  }, [id, onDelete]);

  const handleReportClick = useCallback(() => {
    onReport?.(id, 'inappropriate');
    setShowMenu(false);
  }, [id, onReport]);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const handleShowRepliesClick = useCallback(() => {
    onToggleShowMoreReplies?.();
  }, [onToggleShowMoreReplies]);

  const handleLoadMoreReplies = useCallback(() => {
    onToggleShowMoreReplies?.();
  }, [onToggleShowMoreReplies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);
  const avatarColor = useMemo(() => getAvatarColor(user_name), [user_name]);
  const initials = useMemo(() => getInitials(user_name), [user_name]);

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  }, []);

  const renderedReplies = useMemo(() => {
    return visibleReplies.map(reply => (
      <MemoizedReplyItem
        key={reply.id}
        reply={{
          id: reply.id,
          user_id: reply.user_id,
          user_name: reply.user_name,
          comment: reply.reply_text,
          created_at: reply.created_at,
          like_count: reply.like_count,
          isLiked: reply.isLiked,
        }}
        reviewId={id}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
        onLikeReply={onLikeReply}
        onReplyToReply={onReplyToReply}
        onEditReply={onEditReply}
        onDeleteReply={onDeleteReply}
        onReportReply={onReportReply}
        currentUserId={currentUserId}
        isOwner={currentUserId === reply.user_id}
      />
    ));
  }, [visibleReplies, id, onLikeReply, onReplyToReply, onEditReply, onDeleteReply, onReportReply, currentUserId]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div 
            className={`w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                {user_name}
              </span>
              {verified_purchase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {renderStars(rating)}
              <span>•</span>
              <time dateTime={created_at}>{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Review options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {isOwner ? (
                <>
                  <button
                    onClick={handleEditClick}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit review
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete review
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReportClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Report review
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      {title && (
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      )}

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{comment}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <button
          onClick={handleLikeClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors group"
          aria-label={`${isLiked ? 'Unlike' : 'Like'} this review. ${like_count} likes`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isLiked 
                ? 'fill-red-500 stroke-red-500 scale-110' 
                : 'fill-none stroke-current group-hover:scale-110'
            }`}
            strokeWidth={isLiked ? "2" : "2"}
          />
          {like_count > 0 && (
            <span className={isLiked ? 'text-red-500 font-semibold' : ''}>
              {like_count}
            </span>
          )}
        </button>

        <button
          onClick={handleReplyClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
          aria-label={`Reply to this review. ${comment_count} comments`}
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {comment_count > 0 && <span>{comment_count}</span>}
        </button>

        <button
          onClick={handleShareClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors group"
          aria-label="Share this review"
        >
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowMoreReplies && (
            <button
              onClick={handleShowRepliesClick}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium mb-2 transition-colors"
              aria-expanded={isRepliesExpanded}
            >
              {isRepliesExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {isRepliesExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {isRepliesExpanded && renderedReplies && (
            <div className="space-y-3">
              {renderedReplies}
              {hasMoreReplies && (
                <button
                  onClick={handleLoadMoreReplies}
                  className="ml-12 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Load more replies
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

interface ReplyItemProps {
  reply: Reply;
  reviewId: string;
  getAvatarColor: (name?: string) => string;
  getInitials: (name?: string) => string;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
  onEditReply?: (replyId: string, reviewId: string, comment: string) => void;
  onDeleteReply?: (replyId: string, reviewId: string) => void;
  onReportReply?: (replyId: string, reviewId: string, reason: string) => void;
  currentUserId?: string;
  isOwner?: boolean;
}

const ReplyItem = memo(({
  reply,
  reviewId,
  getAvatarColor,
  getInitials,
  onLikeReply,
  onReplyToReply,
  onEditReply,
  onDeleteReply,
  onReportReply,
  currentUserId,
  isOwner = false,
}: ReplyItemProps) => {
  const [showReplyMenu, setShowReplyMenu] = useState(false);
  const replyMenuRef = useRef<HTMLDivElement>(null);

  const {
    id,
    user_name,
    comment,
    created_at,
    like_count = 0,
    isLiked = false,
  } = reply;

  const handleLikeClick = useCallback(() => {
    onLikeReply?.(id, reviewId);
  }, [id, reviewId, onLikeReply]);

  const handleReplyClick = useCallback(() => {
    onReplyToReply?.(id, reviewId, user_name || '');
  }, [id, reviewId, user_name, onReplyToReply]);

  const handleEditClick = useCallback(() => {
    onEditReply?.(id, reviewId, comment || '');
    setShowReplyMenu(false);
  }, [id, reviewId, comment, onEditReply]);

  const handleDeleteClick = useCallback(() => {
    onDeleteReply?.(id, reviewId);
    setShowReplyMenu(false);
  }, [id, reviewId, onDeleteReply]);

  const handleReportClick = useCallback(() => {
    onReportReply?.(id, reviewId, 'inappropriate');
    setShowReplyMenu(false);
  }, [id, reviewId, onReportReply]);

  const toggleReplyMenu = useCallback(() => {
    setShowReplyMenu(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replyMenuRef.current && !replyMenuRef.current.contains(event.target as Node)) {
        setShowReplyMenu(false);
      }
    };

    if (showReplyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReplyMenu]);

  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);
  const avatarColor = useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = useMemo(() => getInitials(user_name), [user_name, getInitials]);

  return (
    <div className="ml-12 mt-3 pl-3 border-l-2 border-gray-200">
      <div className="flex items-start gap-2 mb-1">
        <div 
          className={`w-8 h-8 flex items-center justify-center text-white text-xs font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                {user_name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Reply Like Button */}
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors group"
                aria-label={`Like this reply. ${like_count} likes`}
              >
                <Heart
                  className={`w-4 h-4 transition-all ${
                    isLiked 
                      ? 'fill-red-500 stroke-red-500 scale-110' 
                      : 'fill-none stroke-current group-hover:scale-110'
                  }`}
                  strokeWidth={isLiked ? "2" : "2"}
                />
                {like_count > 0 && (
                  <span className={isLiked ? 'text-red-500 font-semibold' : ''}>
                    {like_count}
                  </span>
                )}
              </button>

              {/* Reply Button */}
              <button
                onClick={handleReplyClick}
                className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                aria-label={`Reply to ${user_name || 'this user'}`}
              >
                Reply
              </button>

              {/* Reply Menu */}
              <div className="relative" ref={replyMenuRef}>
                <button
                  onClick={toggleReplyMenu}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Reply options"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {showReplyMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {isOwner && (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit reply
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete reply
                        </button>
                      </>
                    )}

                    {!isOwner && (
                      <button
                        onClick={handleReportClick}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Report reply
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mt-1">{comment}</p>
        </div>
      </div>
    </div>
  );
});

ReplyItem.displayName = 'ReplyItem';
const MemoizedReplyItem = memo(ReplyItem);
ReviewItem.displayName = 'ReviewItem';

export { ReviewItem };
export default ReviewItem;
