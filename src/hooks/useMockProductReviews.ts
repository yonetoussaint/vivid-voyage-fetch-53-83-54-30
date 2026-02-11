// hooks/useMockProductReviews.ts
import { useState, useCallback } from 'react';
import type { Review, Reply } from '@/types/reviews';

// Mock data directly in the file
const mockReplies: Reply[] = [
  {
    id: 'reply_1',
    user_id: 'user_2',
    user_name: 'Jane Smith',
    comment: 'Thanks for the detailed review! Very helpful.',
    created_at: '2024-01-16T14:23:00Z',
    likeCount: 3,
    isLiked: false,
  },
  {
    id: 'reply_2',
    user_id: 'user_3',
    user_name: 'Mike Johnson',
    comment: 'I had the same experience. Worth every penny.',
    created_at: '2024-01-17T09:45:00Z',
    likeCount: 1,
    isLiked: false,
  },
  {
    id: 'reply_3',
    user_id: 'user_4',
    user_name: 'Emily Davis',
    comment: 'How long did shipping take for you?',
    created_at: '2024-01-18T11:20:00Z',
    likeCount: 0,
    isLiked: false,
  },
];

const mockReviews: Review[] = [
  {
    id: '1',
    user_id: 'user_1',
    user_name: 'John Doe',
    rating: 5,
    comment: 'Excellent product! The quality is outstanding and it exceeded my expectations. I would definitely recommend this to anyone looking for a reliable solution. The customer service was also very helpful when I had questions about the features.',
    created_at: '2024-01-15T10:30:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        alt: 'Product in use'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
        thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200',
        alt: 'Product close-up'
      }
    ],
    likeCount: 24,
    commentCount: 2,
    replies: mockReplies.slice(0, 2)
  },
  {
    id: '2',
    user_id: 'user_2',
    user_name: 'Sarah Johnson',
    rating: 4,
    comment: 'Good product overall. The build quality is solid and it works as advertised. The only drawback is the battery life, which could be better. Aside from that, I\'m satisfied with my purchase.',
    created_at: '2024-01-10T14:20:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'video',
        url: 'https://example.com/video-review.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
        alt: 'Video review'
      }
    ],
    likeCount: 12,
    commentCount: 1,
    replies: [mockReplies[2]]
  },
  {
    id: '3',
    user_id: 'user_3',
    user_name: 'Michael Chen',
    rating: 3,
    comment: 'It\'s okay for the price. Does what it needs to do but nothing special. The instructions could be clearer for setup.',
    created_at: '2024-01-05T09:15:00Z',
    verified_purchase: false,
    likeCount: 5,
    commentCount: 0,
    replies: []
  },
  {
    id: '4',
    user_id: 'user_4',
    user_name: 'Emma Wilson',
    rating: 5,
    comment: 'Absolutely love this! The design is beautiful and it\'s very easy to use. I\'ve been using it daily for a month now and it still works perfectly. The color options are also fantastic.',
    created_at: '2024-01-02T16:45:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
        thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200',
        alt: 'Product setup'
      }
    ],
    likeCount: 42,
    commentCount: 0,
    replies: []
  },
  {
    id: '5',
    user_id: 'user_5',
    user_name: 'Robert Davis',
    rating: 2,
    comment: 'Not what I expected. The product arrived with scratches and one feature doesn\'t work properly. Customer service was slow to respond. I would suggest looking at other options before buying this.',
    created_at: '2023-12-28T11:10:00Z',
    verified_purchase: true,
    likeCount: 8,
    commentCount: 1,
    replies: [
      {
        id: 'reply_4',
        user_id: 'support_1',
        user_name: 'Customer Support',
        comment: 'We apologize for your experience. Please contact us at support@example.com with your order number and we\'ll make this right.',
        created_at: '2023-12-29T10:00:00Z',
        likeCount: 2,
        isLiked: false,
      }
    ]
  },
  {
    id: '6',
    user_id: 'user_6',
    user_name: 'Lisa Thompson',
    rating: 4,
    comment: 'Very good value for money. The product is durable and performs well. The only reason I\'m not giving 5 stars is because the shipping took longer than expected.',
    created_at: '2023-12-20T13:25:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
        thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200',
        alt: 'Product in natural light'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559056199-5a0e5b21f5bc',
        thumbnail: 'https://images.unsplash.com/photo-1559056199-5a0e5b21f5bc?w=200',
        alt: 'Packaging'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559056199-5a0e5b21f5bd',
        thumbnail: 'https://images.unsplash.com/photo-1559056199-5a0e5b21f5bd?w=200',
        alt: 'Accessories'
      }
    ],
    likeCount: 18,
    commentCount: 0,
    replies: []
  }
];

interface UseMockProductReviewsProps {
  productId?: string;
  limit?: number;
  currentUserId?: string;
}

export const useMockProductReviews = ({ productId, limit, currentUserId = 'user_1' }: UseMockProductReviewsProps = {}) => {
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
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set(['user_2']));
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [replyPagination, setReplyPagination] = useState<Record<string, { page: number; hasMore: boolean }>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = useCallback((pageNum: number = 1) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (pageNum === 1) {
        setReviews(mockReviews);
      } else {
        setReviews(prev => [...prev, ...mockReviews.slice(0, 2)]);
      }
      setHasMore(pageNum < 3);
    }, 800);
  }, []);

  const loadMoreReplies = useCallback((reviewId: string) => {
    setReplyPagination(prev => {
      const current = prev[reviewId] || { page: 1, hasMore: true };
      const newPage = current.page + 1;

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
          hasMore: newPage < 3
        }
      };
    });
  }, []);

  const handleLikeReview = useCallback((reviewId: string) => {
    setLikedReviews(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(reviewId)) {
        newLiked.delete(reviewId);
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, likeCount: (review.likeCount || 1) - 1 }
              : review
          )
        );
      } else {
        newLiked.add(reviewId);
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

  const handleEditReview = useCallback((reviewId: string, newComment: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, comment: newComment }
          : review
      )
    );
  }, []);

  const handleDeleteReview = useCallback((reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
  }, []);

  const handleReportReview = useCallback((reviewId: string, reason: string, details?: string) => {
    console.log('Reported review:', reviewId, 'Reason:', reason, 'Details:', details);
  }, []);

  const handleLikeReply = useCallback((replyId: string, reviewId: string) => {
    setLikedReplies(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(replyId)) {
        newLiked.delete(replyId);
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

  const handleReportReply = useCallback((replyId: string, reviewId: string, reason: string) => {
    console.log('Reported reply:', replyId, 'for review:', reviewId, 'Reason:', reason);
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

    setReplyText('');
    setReplyingTo(null);
    setItemBeingReplied(null);
  };

  const handleCancelReply = () => {
    setReplyText('');
    setReplyingTo(null);
    setItemBeingReplied(null);
  };

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

  let finalReviews = reviews;
  if (limit) {
    finalReviews = finalReviews.slice(0, limit);
  }

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
    summaryStats,
    followedUsers,
    likedReviews,
    helpfulReviews,
    likedReplies,
    replyPagination,
    page,
    hasMore,
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