import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Play,
  Send,
  Heart
} from 'lucide-react';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import { EngagementSection } from '@/components/shared/EngagementSection';
import { 
  formatDate, 
  formatDateForReply 
} from './DateUtils';
import VerificationBadge from '@/components/shared/VerificationBadge';

// Mock Button component
const Button = ({ children, variant, className, onClick }) => (
  <button 
    className={`px-4 py-2 rounded border ${variant === 'outline' ? 'border-gray-300 bg-white hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Mock data and utility functions
const mockReviews = [
  {
    id: 1,
    user_name: "John Smith",
    rating: 5,
    comment: "This product exceeded my expectations. The quality is outstanding and it arrived quickly. I would definitely recommend this to anyone looking for a reliable solution. The customer service was also very helpful when I had questions about the setup process.",
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    verified_purchase: true,
    helpful_count: 12,
    reply_count: 4,
    likeCount: 8,
    commentCount: 4,
    shareCount: 2,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', alt: 'Product in use' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', alt: 'Product packaging' }
    ],
    replies: [
      {
        id: 101,
        user_name: "Customer Support",
        comment: "Thank you for your wonderful review! We're thrilled to hear you had such a positive experience with our product and customer service team.",
        created_at: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
        is_seller: true,
        verified_seller: true,
        likeCount: 3,
        liked: false,
        parent_reply_id: null
      },
      {
        id: 102,
        user_name: "Lisa Wong",
        comment: "I had the same experience! Really happy with this purchase.",
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        is_seller: false,
        verified_seller: false,
        likeCount: 1,
        liked: false,
        parent_reply_id: null
      },
      {
        id: 103,
        user_name: "John Smith",
        comment: "Thanks for the quick response!",
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
        is_seller: false,
        verified_seller: false,
        likeCount: 0,
        liked: false,
        parent_reply_id: 101,
        replying_to: "Customer Support"
      },
      {
        id: 104,
        user_name: "Mike Chen",
        comment: "How long did shipping take for you?",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        is_seller: false,
        verified_seller: false,
        likeCount: 2,
        liked: false,
        parent_reply_id: 101,
        replying_to: "Customer Support"
      },
      {
        id: 105,
        user_name: "Alex Taylor",
        comment: "Great review! I'm convinced to buy this now.",
        created_at: "2024-01-15T10:30:00Z", // January 15, 2024 (current year)
        is_seller: false,
        verified_seller: false,
        likeCount: 1,
        liked: false,
        parent_reply_id: null
      },
      {
        id: 106,
        user_name: "Sarah Kim",
        comment: "I've had this for over a year and it's still working great!",
        created_at: "2023-08-20T14:20:00Z", // August 20, 2023 (previous year)
        is_seller: false,
        verified_seller: false,
        likeCount: 4,
        liked: false,
        parent_reply_id: null
      }
    ]
  },
  {
    id: 2,
    user_name: "Sarah Johnson",
    rating: 4,
    comment: "Works as expected. Minor issues with setup but overall satisfied with the purchase.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    verified_purchase: true,
    helpful_count: 8,
    reply_count: 1,
    likeCount: 5,
    commentCount: 1,
    shareCount: 0,
    media: [
      { type: 'video', url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', alt: 'Product demo video' }
    ],
    replies: [
      {
        id: 201,
        user_name: "Customer Support",
        comment: "Thanks for your feedback! If you need any help with setup, please don't hesitate to reach out to our support team.",
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        is_seller: true,
        verified_seller: true,
        likeCount: 0,
        liked: false,
        parent_reply_id: null
      }
    ]
  },
  {
    id: 3,
    user_name: "Michael Brown",
    rating: 5,
    comment: "Absolutely love this product! Worth every penny.",
    created_at: "2024-03-10T09:15:00Z", // March 10, 2024 (current year, older date)
    verified_purchase: true,
    helpful_count: 15,
    reply_count: 0,
    likeCount: 10,
    commentCount: 0,
    shareCount: 1,
    media: [],
    replies: []
  }
];

const truncateText = (text, maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const CustomerReviews = ({ 
  productId = "123", 
  user = null, 
  reviews = mockReviews,
  limit = null 
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [localReviews, setLocalReviews] = useState(reviews);

  // Enhanced state for reply functionality
  const [replyingTo, setReplyingTo] = useState<{ type: 'review' | 'reply'; reviewId: number; replyId?: number; userName: string; isSeller?: boolean; verifiedSeller?: boolean } | null>(null);
  const [replyText, setReplyText] = useState('');

  // Function to handle liking a reply
  const handleLikeReply = (reviewId: number, replyId: number) => {
    setLocalReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          const updatedReplies = review.replies.map(reply => {
            if (reply.id === replyId) {
              const newLikeCount = reply.liked ? reply.likeCount - 1 : reply.likeCount + 1;
              return {
                ...reply,
                liked: !reply.liked,
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
  };

  // Get the item being replied to
  const itemBeingReplied = useMemo(() => {
    if (!replyingTo) return null;

    const review = localReviews.find(r => r.id === replyingTo.reviewId);
    if (!review) return null;

    if (replyingTo.type === 'review') {
      return { type: 'review' as const, item: review };
    } else {
      const reply = review.replies.find(r => r.id === replyingTo.replyId);
      return reply ? { type: 'reply' as const, item: reply } : null;
    }
  }, [replyingTo, localReviews]);

  const toggleReadMore = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const toggleShowMoreReplies = (reviewId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReplies(newExpanded);
  };

  const handleCommentClick = (reviewId: number) => {
    console.log('Comment button clicked for review:', reviewId);

    const review = localReviews.find(r => r.id === reviewId);
    if (!review) return;

    // Set the review we're replying to
    setReplyingTo({
      type: 'review',
      reviewId: reviewId,
      userName: review.user_name,
      isSeller: false,
      verifiedSeller: false
    });
    setReplyText('');

    // Also expand replies for this review
    const newExpanded = new Set(expandedReplies);
    if (!newExpanded.has(reviewId)) {
      newExpanded.add(reviewId);
      setExpandedReplies(newExpanded);
    }
  };

  const handleReplyToReply = (reviewId: number, replyId: number, userName: string) => {
    console.log('Reply button clicked for reply:', replyId, 'in review:', reviewId);

    const review = localReviews.find(r => r.id === reviewId);
    if (!review) return;

    const reply = review.replies.find(r => r.id === replyId);
    if (!reply) return;

    setReplyingTo({
      type: 'reply',
      reviewId: reviewId,
      replyId: replyId,
      userName: userName,
      isSeller: reply.is_seller,
      verifiedSeller: reply.verified_seller
    });
    setReplyText('');
  };

  const handleShareClick = (reviewId: number) => {
    console.log('Share button clicked for review:', reviewId);
    if (navigator.share) {
      navigator.share({
        title: 'Product Review',
        text: 'Check out this product review!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Review link copied to clipboard!');
    }
  };

  const handleSubmitReply = () => {
    if (replyText.trim() && replyingTo) {
      console.log(`Submitting reply to ${replyingTo.type} ${replyingTo.type === 'review' ? replyingTo.reviewId : replyingTo.replyId}: "${replyText}"`);

      // Create new reply object
      const newReply = {
        id: Date.now(), // Temporary ID
        user_name: "Current User", // This would come from user context
        comment: replyText.trim(),
        created_at: new Date().toISOString(),
        is_seller: false, // This would depend on the user
        verified_seller: false,
        likeCount: 0,
        liked: false,
        parent_reply_id: replyingTo.type === 'reply' ? replyingTo.replyId : null,
        replying_to: replyingTo.type === 'reply' ? replyingTo.userName : null
      };

      // Add the reply to the local state
      setLocalReviews(prevReviews => 
        prevReviews.map(review => {
          if (review.id === replyingTo.reviewId) {
            return {
              ...review,
              replies: [...review.replies, newReply],
              reply_count: review.reply_count + 1
            };
          }
          return review;
        })
      );

      // Here you would also submit the reply to your backend
      console.log('Reply submitted:', newReply);

      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    const count = localReviews.length;
    const totalRating = localReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = count > 0 ? totalRating / count : 0;
    return { count, averageRating };
  }, [localReviews]);

  // Calculate rating distribution
  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    localReviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[5 - review.rating]++;
      }
    });
    return counts;
  }, [localReviews]);

  const filterCategories = React.useMemo(() => [
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
    options: ['Most Recent', 'Oldest First', 'Most Liked']
  }
], []);

  // Initialize filters with "All" options on mount only
  React.useEffect(() => {
    const initialFilters: Record<string, string> = {};
    filterCategories.forEach((filter) => {
      initialFilters[filter.id] = filter.options[0];
    });
    setSelectedFilters(initialFilters);
  }, []);

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
          'Most Helpful': 'helpful',
          'Highest Rating': 'rating'
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
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
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
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    // Sort reviews
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [localReviews, sortBy, filterRating, limit]);

  const summaryStats = [
    { value: reviewStats.averageRating.toFixed(1), label: 'Average', color: 'text-yellow-600' },
    { value: reviewStats.count, label: 'Total', color: 'text-blue-600' },
    { value: `${Math.round((ratingCounts[0] / reviewStats.count) * 100)}%`, label: 'Positivity', color: 'text-green-600' },
    { value: ratingCounts[0], label: '5 Star', color: 'text-purple-600' }
  ];

  return (
    <div className="w-full bg-white">
      <SellerSummaryHeader
        title="Customer Reviews"
        subtitle={`All ${reviewStats.count} review${reviewStats.count !== 1 ? 's' : ''} from verified purchases`}
        stats={summaryStats}
        showStats={reviewStats.count > 0}
      />

      <ProductFilterBar
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterClear={handleFilterClear}
        onClearAll={handleClearAll}
        onFilterButtonClick={handleFilterButtonClick}
      />

      <div className="py-4">
        {/* Reviews List */}
        <div className="space-y-4">
          {finalReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground" style={{color: '#666'}}>No reviews found.</p>
              <p className="text-sm text-muted-foreground mt-1" style={{color: '#666'}}>Try adjusting your filters.</p>
            </div>
          ) : (
            finalReviews.map((review) => (
              <div key={review.id} className="border-b pb-4" style={{borderBottom: '1px solid #e5e5e5'}}>
                <div className="flex items-start justify-between mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground" style={{color: '#666'}}>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Comment Only - No Title */}
                <div className="text-foreground text-sm mb-2 px-2">
                  <span>
                    {expandedReviews.has(review.id) ? review.comment : truncateText(review.comment || '')}
                    {(review.comment || '').length > 120 && (
                      <button
                        onClick={() => toggleReadMore(review.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
                      >
                        {expandedReviews.has(review.id) ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </span>
                </div>

                {/* Media Section */}
                {review.media && review.media.length > 0 && (
                  <div className="px-2">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {review.media.map((item, index) => (
                        <div key={index} className="flex-shrink-0 relative">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.alt}
                              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(item.url, '_blank')}
                            />
                          ) : item.type === 'video' ? (
                            <div 
                              className="w-24 h-24 relative cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
                              onClick={() => window.open(item.url, '_blank')}
                            >
                              <img
                                src={item.thumbnail}
                                alt={item.alt}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                <Play className="w-6 h-6 text-white fill-white" />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facebook-style Engagement Section */}
                <EngagementSection
                  likeCount={review.likeCount || 0}
                  commentCount={review.commentCount || 0}
                  shareCount={review.shareCount || 0}
                  onComment={() => handleCommentClick(review.id)}
                  onShare={() => handleShareClick(review.id)}
                />

                {/* Replies Section - Flat structure like TikTok */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-3 px-2">
                    {(expandedReplies.has(review.id) ? review.replies : review.replies.slice(0, 2)).map((reply) => (
                      <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: reply.is_seller ? '#3b82f6' : 'rgba(0,0,0,0.1)', color: reply.is_seller ? 'white' : 'black'}}>
                            {reply.user_name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{reply.user_name}</span>
                              {reply.is_seller && (
                                <div className="flex items-center gap-1">
                                  {reply.verified_seller && <VerificationBadge size="sm" />}
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="font-bold text-sm text-orange-500">Seller</span>
                                </div>
                              )}
                            </div>

                            {/* Show who this reply is replying to */}
                            {reply.replying_to && (
                              <div className="text-xs text-gray-500 mt-1">
                                Replying to <span className="font-medium">{reply.replying_to}</span>
                                {/* Check if the person being replied to is a seller */}
                                {(() => {
                                  const repliedToUser = review.replies.find(r => r.user_name === reply.replying_to);
                                  if (repliedToUser && repliedToUser.is_seller) {
                                    return (
                                      <div className="flex items-center gap-1 mt-1">
                                        {repliedToUser.verified_seller && <VerificationBadge size="xs" />}
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="font-bold text-xs text-orange-500">Seller</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}

                            <div className="text-sm text-foreground mt-1">
                              {reply.comment}
                            </div>

                            {/* TikTok-style Like and Reply Buttons with Date - PERFECT ALIGNMENT */}
                            <div className="flex items-center gap-4 mt-2">
                              {/* Heart Button with Counter */}
                              <button
                                onClick={() => handleLikeReply(review.id, reply.id)}
                                className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
                                style={{ 
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  font: 'inherit',
                                  lineHeight: '1'
                                }}
                              >
                                <Heart 
                                  className={`w-4 h-4 flex-shrink-0 ${reply.liked ? 'fill-red-600 text-red-600' : ''}`}
                                />
                                <span style={{ lineHeight: '1' }}>{reply.likeCount || 0}</span>
                              </button>

                              {/* Reply Button */}
                              <button
                                onClick={() => handleReplyToReply(review.id, reply.id, reply.user_name)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                style={{ 
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  font: 'inherit',
                                  lineHeight: '1'
                                }}
                              >
                                Reply
                              </button>

                              {/* Date */}
                              <span 
                                className="text-sm text-muted-foreground font-medium"
                                style={{ 
                                  color: '#666',
                                  lineHeight: '1'
                                }}
                              >
                                {formatDateForReply(reply.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {review.replies.length > 2 && (
                      <button
                        onClick={() => toggleShowMoreReplies(review.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4 transition-colors"
                      >
                        {expandedReplies.has(review.id) 
                          ? 'Show fewer replies' 
                          : `Show ${review.replies.length - 2} more replies`
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {limit && localReviews.length > limit && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => window.location.href = `/product/${productId}/reviews`}
        >
          View All {localReviews.length} Reviews
        </Button>
      )}

      {/* Enhanced Conditional Reply Bar - Shows who you're replying to */}
      {replyingTo && itemBeingReplied && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-lg z-40">
          <div className="max-w-4xl mx-auto">
            {/* User info header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Replying to</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                    {replyingTo.userName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{replyingTo.userName}</span>
                  {replyingTo.isSeller && (
                    <div className="flex items-center gap-1">
                      {replyingTo.verifiedSeller && <VerificationBadge size="sm" />}
                      <span className="text-xs text-gray-500">•</span>
                      <span className="font-bold text-sm text-orange-500">Seller</span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={handleCancelReply}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Reply input */}
            <div className="relative">
              <input
                ref={(el) => el && !replyText.trim() && el.focus()}
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
              />
              <button 
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;