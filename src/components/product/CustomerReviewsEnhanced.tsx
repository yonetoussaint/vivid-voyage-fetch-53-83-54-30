import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Pen,
  Play,
  Send
} from 'lucide-react';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import { EngagementSection } from '@/components/shared/EngagementSection';

// Mock Button component
const Button = ({ children, variant, className, onClick }) => (
  <button 
    className={`px-4 py-2 rounded border ${variant === 'outline' ? 'border-gray-300 bg-white hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Mock WriteReviewDialog component
const WriteReviewDialog = ({ children, productId }) => (
  <div onClick={() => alert(`Opening review dialog for product ${productId}`)}>
    {children}
  </div>
);

// Mock data and utility functions
const mockReviews = [
  {
    id: 1,
    user_name: "John Smith",
    rating: 5,
    title: "Excellent product!",
    comment: "This product exceeded my expectations. The quality is outstanding and it arrived quickly. I would definitely recommend this to anyone looking for a reliable solution. The customer service was also very helpful when I had questions about the setup process.",
    created_at: "2024-08-15T10:30:00Z",
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
        created_at: "2024-08-16T09:15:00Z",
        is_seller: true
      },
      {
        id: 102,
        user_name: "Lisa Wong",
        comment: "I had the same experience! Really happy with this purchase.",
        created_at: "2024-08-17T14:30:00Z",
        is_seller: false
      },
      {
        id: 103,
        user_name: "David Kim",
        comment: "Thanks for the detailed review! This helped me make my decision.",
        created_at: "2024-08-18T11:20:00Z",
        is_seller: false
      },
      {
        id: 104,
        user_name: "Rachel Green",
        comment: "Same here! Great quality and fast shipping.",
        created_at: "2024-08-19T16:45:00Z",
        is_seller: false
      }
    ]
  },
  {
    id: 2,
    user_name: "Sarah Johnson",
    rating: 4,
    title: "Good value for money",
    comment: "Works as expected. Minor issues with setup but overall satisfied with the purchase.",
    created_at: "2024-08-10T14:20:00Z",
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
        created_at: "2024-08-11T10:45:00Z",
        is_seller: true
      }
    ]
  },
  {
    id: 3,
    user_name: "Mike Chen",
    rating: 3,
    title: "Average product",
    comment: "It's okay, nothing special but does the job.",
    created_at: "2024-08-05T09:15:00Z",
    verified_purchase: false,
    helpful_count: 3,
    reply_count: 0,
    likeCount: 2,
    commentCount: 0,
    shareCount: 0,
    media: [],
    replies: []
  },
  {
    id: 4,
    user_name: "Emma Davis",
    rating: 5,
    title: "Love it!",
    comment: "Perfect for my needs. Highly recommend!",
    created_at: "2024-08-01T16:45:00Z",
    verified_purchase: true,
    helpful_count: 15,
    reply_count: 1,
    likeCount: 12,
    commentCount: 1,
    shareCount: 3,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', alt: 'Product close-up' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', alt: 'Product comparison' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', alt: 'Product features' }
    ],
    replies: [
      {
        id: 401,
        user_name: "Customer Support",
        comment: "We're so happy to hear you love the product! Thank you for recommending us!",
        created_at: "2024-08-02T08:20:00Z",
        is_seller: true
      }
    ]
  },
  {
    id: 5,
    user_name: "Tom Wilson",
    rating: 2,
    title: "Disappointed",
    comment: "Not what I expected based on the description. Quality could be better and the shipping took longer than promised.",
    created_at: "2024-07-28T11:30:00Z",
    verified_purchase: true,
    helpful_count: 5,
    reply_count: 1,
    likeCount: 3,
    commentCount: 1,
    shareCount: 0,
    media: [],
    replies: [
      {
        id: 501,
        user_name: "Customer Support",
        comment: "We're sorry to hear about your experience. We've sent you a direct message to resolve this issue and improve our service. Thank you for your feedback.",
        created_at: "2024-07-29T13:15:00Z",
        is_seller: true
      }
    ]
  }
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

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
  const [reviewText, setReviewText] = useState('');
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const openAuthOverlay = () => {
    alert('Please sign in to write a review');
  };

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

  const handleSubmitReview = () => {
    if (reviewText.trim()) {
      setShowRatingPopup(true);
    }
  };

  const handleRatingSubmit = () => {
    // Here you would normally submit the review with rating
    alert(`Review submitted: "${reviewText}" with ${selectedRating} stars`);
    setReviewText('');
    setSelectedRating(0);
    setShowRatingPopup(false);
  };

  const handleRatingCancel = () => {
    setShowRatingPopup(false);
    setSelectedRating(0);
  };

  const handleCommentClick = (reviewId: number) => {
    console.log('Comment button clicked for review:', reviewId);
    // You could implement logic to focus on the comment input or expand replies
    const newExpanded = new Set(expandedReplies);
    if (!newExpanded.has(reviewId)) {
      newExpanded.add(reviewId);
      setExpandedReplies(newExpanded);
    }
  };

  const handleShareClick = (reviewId: number) => {
    console.log('Share button clicked for review:', reviewId);
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Product Review',
        text: 'Check out this product review!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Review link copied to clipboard!');
    }
  };

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    const count = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = count > 0 ? totalRating / count : 0;

    return { count, averageRating };
  }, [reviews]);

  // Calculate rating distribution
  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // 5-star, 4-star, 3-star, 2-star, 1-star
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[5 - review.rating]++;
      }
    });
    return counts;
  }, [reviews]);

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
  };

  const filterCategories = React.useMemo(() => [
    {
      id: 'rating',
      label: 'Rating',
      options: ['All Ratings', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']
    },
    {
      id: 'verified',
      label: 'Purchase',
      options: ['All Purchases', 'Verified Purchase', 'Unverified']
    },
    {
      id: 'media',
      label: 'Media',
      options: ['All Media', 'With Photos', 'With Videos', 'No Media']
    },
    {
      id: 'time',
      label: 'Time Period',
      options: ['All Time', 'Last 30 Days', 'Last 6 Months', 'Last Year']
    },
    {
      id: 'sort',
      label: 'Sort By',
      options: ['All Sorts', 'Most Recent', 'Most Helpful', 'Highest Rating']
    }
  ], []);

  // Initialize filters with "All" options on mount only
  React.useEffect(() => {
    const initialFilters: Record<string, string> = {};
    filterCategories.forEach((filter) => {
      initialFilters[filter.id] = filter.options[0];
    });
    setSelectedFilters(initialFilters);
  }, []); // Empty dependency array - only run once on mount

  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));

    if (filterId === 'sort') {
      // Reset to default if "All" option selected
      if (isAllOption(option)) {
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
      // Reset to 0 if "All" option selected
      if (isAllOption(option)) {
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
    // Reset to first "All" option for each filter
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
    let filtered = reviews;

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
  }, [reviews, sortBy, filterRating, limit]);

  const summaryStats = [
    { value: reviewStats.averageRating.toFixed(1), label: 'Average', color: 'text-yellow-600' },
    { value: reviewStats.count, label: 'Total', color: 'text-blue-600' },
    { value: `${Math.round((ratingCounts[0] / reviewStats.count) * 100)}%`, label: 'Positivity', color: 'text-green-600' },
    { value: ratingCounts[0], label: '5 Star', color: 'text-purple-600' }
  ];

  return (
    <div className="w-full bg-white pb-20">
      <SellerSummaryHeader
        title="Customer Reviews"
        subtitle={`${reviewStats.count} review${reviewStats.count !== 1 ? 's' : ''} from verified customers`}
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
                        {review.verified_purchase && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
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

                {review.title && (
                  <div className="font-medium text-sm mb-1 px-2">{review.title}</div>
                )}

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
                  <div className=" px-2">
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

                {/* Facebook-style Engagement Section (Reused from VendorProductCarousel) */}
                <EngagementSection
                  likeCount={review.likeCount || 0}
                  commentCount={review.commentCount || 0}
                  shareCount={review.shareCount || 0}
                  onComment={() => handleCommentClick(review.id)}
                  onShare={() => handleShareClick(review.id)}
                />

                {/* Replies Section */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-3">
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
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Seller
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground" style={{color: '#666'}}>
                                {formatDate(reply.created_at)}
                              </span>
                            </div>
                            <div className="text-sm text-foreground mt-1">
                              {reply.comment}
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

      {limit && reviews.length > limit && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => window.location.href = `/product/${productId}/reviews`}
        >
          View All {reviews.length} Reviews
        </Button>
      )}

      {/* Sticky Review Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
            ?
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitReview()}
            />
            <button 
              onClick={handleSubmitReview}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Rate this product</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className={`w-8 h-8 cursor-pointer transition-colors ${
                    star <= selectedRating 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-4 text-center">
              "{reviewText}"
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRatingCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;