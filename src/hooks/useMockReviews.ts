// hooks/useMockReviews.ts
import { useState, useEffect } from 'react';
import { mockReviews, mockComments } from '@/components/product/mockReviewsData';

export interface Review {
  id: string;
  user_name?: string;
  rating?: number;
  comment?: string;
  created_at: string;
  verified_purchase?: boolean;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    alt?: string;
  }>;
  likeCount?: number;
  commentCount?: number;
}

interface UseMockReviewsProps {
  productId?: string;
  limit?: number;
}

export const useMockReviews = ({ productId, limit }: UseMockReviewsProps = {}) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [itemBeingReplied, setItemBeingReplied] = useState<{
    type: 'review' | 'reply';
    id: string;
    userName?: string;
  } | null>(null);

  // Use mock reviews directly
  const finalReviews = mockReviews;

  // Calculate summary stats from mock data
  const summaryStats = {
    averageRating: parseFloat((mockReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / mockReviews.length).toFixed(1)),
    totalReviews: mockReviews.length,
    ratingDistribution: {
      5: mockReviews.filter(r => r.rating === 5).length,
      4: mockReviews.filter(r => r.rating === 4).length,
      3: mockReviews.filter(r => r.rating === 3).length,
      2: mockReviews.filter(r => r.rating === 2).length,
      1: mockReviews.filter(r => r.rating === 1).length,
    }
  };

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

  const handleCommentClick = (reviewId: string) => {
    console.log('Comment clicked for review:', reviewId);
  };

  const handleShareClick = (reviewId: string) => {
    console.log('Share clicked for review:', reviewId);
    // Share logic here
  };

  const handleLikeReply = (replyId: string, reviewId: string) => {
    console.log('Like reply:', replyId, 'for review:', reviewId);
  };

  const handleReplyToReply = (replyId: string, reviewId: string, userName: string) => {
    setReplyingTo(replyId);
    setItemBeingReplied({ type: 'reply', id: replyId, userName });
    setReplyText(`@${userName} `);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() || !replyingTo) return;
    
    console.log('Submitting reply:', replyText, 'to:', replyingTo);
    
    // Clear reply state
    setReplyText('');
    setReplyingTo(null);
    setItemBeingReplied(null);
  };

  const handleCancelReply = () => {
    setReplyText('');
    setReplyingTo(null);
    setItemBeingReplied(null);
  };

  const fetchReviews = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Simulate loading on mount
  useEffect(() => {
    if (mockReviews.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (mockReviews.length === 0) {
          setError('No reviews available');
        }
      }, 800);
    }
  }, []);

  return {
    expandedReviews,
    expandedReplies,
    isLoading,
    error,
    replyingTo,
    replyText,
    itemBeingReplied,
    
    setReplyText,
    handleLikeReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    
    finalReviews,
    summaryStats
  };
};