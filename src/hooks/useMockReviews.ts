// hooks/useMockReviews.ts
import { useState, useEffect, useCallback } from 'react';
import { mockReviews, mockComments, mockReplies } from '@/components/product/mockReviewsData';

export interface Review {
  id: string;
  user_id?: string;
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
  replies?: Reply[];
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

interface UseMockReviewsProps {
  productId?: string;
  limit?: number;
  currentUserId?: string;
}

export const useMockReviews = ({ productId, limit, currentUserId = 'user_1' }: UseMockReviewsProps = {}) => {
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

  // New state for added features
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set(['user_2'])); // Default following one user
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [replyPagination, setReplyPagination] = useState<Record<string, { page: number; hasMore: boolean }>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load more reviews (infinite scroll)
  const fetchReviews = useCallback((pageNum: number = 1) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      if (pageNum === 1) {
        setReviews(mockReviews);
      } else {
        // Simulate pagination - add more mock reviews
        setReviews(prev => [...prev, ...mockReviews.slice(0, 2)]);
      }
      setHasMore(pageNum < 3); // Only 3 pages of mock data
    }, 800);
  }, []);

  // Load more replies for a review
  const loadMoreReplies = useCallback((reviewId: string) => {
    setReplyPagination(prev => {
      const current = prev[reviewId] || { page: 1, hasMore: true };
      const newPage = current.page + 1;
      
      // Simulate loading more replies
      setTimeout(() => {
        setReviews(prevReviews => 
          prevReviews.map(review => {
            if (review.id === reviewId) {
              const moreReplies = mockReplies.slice(0, 2).map(r => ({
                ...r,
                id: `${r.id}_${newPage}`,
                user_name: `User ${newPage}`
              }));
              return {
                ...review,
                replies: [...(review.replies || []), ...moreReplies]
              };
            }
            return review;
          })
        );
      }, 500);

      return {
        ...prev,
        [reviewId]: {
          page: newPage,
          hasMore: newPage < 3 // Only 3 pages of replies
        }
      };
    });
  }, []);

  // Like/unlike review
  const handleLikeReview = useCallback((reviewId: string) => {
    setLikedReviews(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(reviewId)) {
        newLiked.delete(reviewId);
        // Decrement like count
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, likeCount: (review.likeCount || 1) - 1 }
              : review
          )
        );
      } else {
        newLiked.add(reviewId);
        // Increment like count
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, likeCount: (review.likeCount || 0) + 1 }
              : review
          )
        );
      }
      return newLiked;
    });
  }, []);

  // Mark as helpful
  const handleMarkHelpful = useCallback((reviewId: string) => {
    setHelpfulReviews(prev => {
      const newHelpful = new Set(prev);
      if (newHelpful.has(reviewId)) {
        newHelpful.delete(reviewId);
      } else {
        newHelpful.add(reviewId);
      }
      return newHelpful;
    });
  }, []);

  // Follow/unfollow user
  const handleFollowUser = useCallback((userId: string) => {
    setFollowedUsers(prev => {
      const newFollowed = new Set(prev);
      newFollowed.add(userId);
      return newFollowed;
    });
  }, []);

  const handleUnfollowUser = useCallback((userId: string) => {
    setFollowedUsers(prev => {
      const newFollowed = new Set(prev);
      newFollowed.delete(userId);
      return newFollowed;
    });
  }, []);

  // Edit review
  const handleEditReview = useCallback((reviewId: string, newComment: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, comment: newComment }
          : review
      )
    );
  }, []);

  // Delete review
  const handleDeleteReview = useCallback((reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
  }, []);

  // Report review
  const handleReportReview = useCallback((reviewId: string, reason: string, details?: string) => {
    console.log('Reported review:', reviewId, 'Reason:', reason, 'Details:', details);
    // In real app, send to API
  }, []);

  // Like reply
  const handleLikeReply = useCallback((replyId: string, reviewId: string) => {
    setLikedReplies(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(replyId)) {
        newLiked.delete(replyId);
        // Decrement reply like count
        setReviews(prevReviews =>
          prevReviews.map(review => {
            if (review.id === reviewId) {
              return {
                ...review,
                replies: review.replies?.map(reply =>
                  reply.id === replyId
                    ? { ...reply, likeCount: (reply.likeCount || 1) - 1 }
                    : reply
                )
              };
            }
            return review;
          })
        );
      } else {
        newLiked.add(replyId);
        // Increment reply like count
        setReviews(prevReviews =>
          prevReviews.map(review => {
            if (review.id === reviewId) {
              return {
                ...review,
                replies: review.replies?.map(reply =>
                  reply.id === replyId
                    ? { ...reply, likeCount: (reply.likeCount || 0) + 1 }
                    : reply
                )
              };
            }
            return review;
          })
        );
      }
      return newLiked;
    });
  }, []);

  // Edit reply
  const handleEditReply = useCallback((replyId: string, reviewId: string, newComment: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            replies: review.replies?.map(reply =>
              reply.id === replyId
                ? { ...reply, comment: newComment }
                : reply
            )
          };
        }
        return review;
      })
    );
  }, []);

  // Delete reply
  const handleDeleteReply = useCallback((replyId: string, reviewId: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            replies: review.replies?.filter(reply => reply.id !== replyId)
          };
        }
        return review;
      })
    );
  }, []);

  // Report reply
  const handleReportReply = useCallback((replyId: string, reviewId: string, reason: string) => {
    console.log('Reported reply:', replyId, 'for review:', reviewId, 'Reason:', reason);
    // In real app, send to API
  }, []);

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
    setReplyingTo(reviewId);
    setItemBeingReplied({ type: 'review', id: reviewId, userName: undefined });
  };

  const handleShareClick = (reviewId: string) => {
    console.log('Share clicked for review:', reviewId);
  };

  const handleReplyToReply = (replyId: string, reviewId: string, userName: string) => {
    setReplyingTo(replyId);
    setItemBeingReplied({ type: 'reply', id: replyId, userName });
    setReplyText(`@${userName} `);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() || !replyingTo) return;

    // Add reply to review
    if (itemBeingReplied?.type === 'review') {
      setReviews(prevReviews =>
        prevReviews.map(review => {
          if (review.id === replyingTo) {
            const newReply: Reply = {
              id: `reply_${Date.now()}`,
              user_id: currentUserId,
              user_name: 'Current User',
              comment: replyText,
              created_at: new Date().toISOString(),
              likeCount: 0,
              isLiked: false,
            };
            return {
              ...review,
              replies: [...(review.replies || []), newReply],
              commentCount: (review.commentCount || 0) + 1
            };
          }
          return review;
        })
      );
    }

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

  // Calculate summary stats from current reviews
  const summaryStats = {
    averageRating: parseFloat((reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)) || 0,
    totalReviews: reviews.length,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  };

  // Filter reviews by product ID (mock)
  const finalReviews = productId 
    ? reviews // In real app, filter by productId
    : reviews;

  // Apply limit if provided
  const limitedReviews = limit ? finalReviews.slice(0, limit) : finalReviews;

  // Simulate loading on mount
  useEffect(() => {
    if (reviews.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (reviews.length === 0) {
          setError('No reviews available');
        }
      }, 800);
    }
  }, [reviews.length]);

  return {
    // Existing state
    expandedReviews,
    expandedReplies,
    isLoading,
    error,
    replyingTo,
    replyText,
    itemBeingReplied,
    setReplyText,
    
    // Existing handlers
    handleLikeReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    
    // Data
    finalReviews: limitedReviews,
    summaryStats,
    
    // New state
    followedUsers: followedUsers || new Set(),
    likedReviews,
    helpfulReviews,
    likedReplies,
    replyPagination: replyPagination || {},
    page,
    hasMore,
    
    // New handlers
    handleLikeReview,
    handleMarkHelpful,
    handleFollowUser,
    handleUnfollowUser,
    handleEditReview,
    handleDeleteReview,
    handleReportReview,
    handleEditReply,
    handleDeleteReply,
    handleReportReply,
    loadMoreReplies,
  };
};