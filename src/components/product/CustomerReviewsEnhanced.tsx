import React, { useState, useMemo, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded m-4">
          <h2 className="text-red-800 font-semibold">Something went wrong with the reviews.</h2>
          <p className="text-red-600 text-sm mt-1">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mock Button component
const Button = ({ children, variant, className, onClick }) => (
  <button 
    className={`px-4 py-2 rounded border ${variant === 'outline' ? 'border-gray-300 bg-white hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const CustomerReviews = ({ 
  productId, 
  limit = null 
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [localReviews, setLocalReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Enhanced state for reply functionality
  const [replyingTo, setReplyingTo] = useState<{ type: 'review' | 'reply'; reviewId: string; replyId?: string; userName: string; isSeller?: boolean; verifiedSeller?: boolean } | null>(null);
  const [replyText, setReplyText] = useState('');

  // Debug useEffect
  useEffect(() => {
    console.log('Current replyingTo state:', replyingTo);
    console.log('Current localReviews count:', localReviews.length);
  }, [replyingTo, localReviews]);

  // Fetch reviews from Supabase
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching reviews for product:', productId);

      if (!productId) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        throw reviewsError;
      }

      console.log('Reviews found:', reviewsData?.length || 0);

      // If no reviews found, set empty array and return
      if (!reviewsData || reviewsData.length === 0) {
        console.log('No reviews found for this product');
        setLocalReviews([]);
        setIsLoading(false);
        return;
      }

      // Fetch all data in parallel for better performance
      const reviewsWithDetails = await Promise.all(
        reviewsData.map(async (review) => {
          try {
            // Fetch media for this review
            const { data: mediaData, error: mediaError } = await supabase
              .from('review_media')
              .select('*')
              .eq('review_id', review.id);

            if (mediaError) {
              console.error('Error fetching media for review', review.id, mediaError);
            }

            // Fetch replies for this review
            const { data: repliesData, error: repliesError } = await supabase
              .from('reviews_replies')
              .select('*')
              .eq('review_id', review.id)
              .order('created_at', { ascending: true });

            if (repliesError) {
              console.error('Error fetching replies for review', review.id, repliesError);
            }

            // Format media
            const media = (mediaData || []).map(mediaItem => ({
              type: mediaItem.media_type || 'image',
              url: mediaItem.url || '',
              thumbnail: mediaItem.thumbnail_url,
              alt: mediaItem.alt_text || 'Review media'
            }));

            // Format replies
            const replies = (repliesData || []).map(reply => ({
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
              media: media,
              replies: replies
            };
          } catch (err) {
            console.error('Error processing review', review.id, err);
            // Return basic review data even if media/replies fail
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

      console.log('Processed reviews:', reviewsWithDetails.length);
      setLocalReviews(reviewsWithDetails);
    } catch (err) {
      console.error('Error in fetchReviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    } else {
      setIsLoading(false);
      setError('Product ID is required');
    }
  }, [productId]);

  // Function to handle liking a reply
  const handleLikeReply = async (reviewId: string, replyId: string) => {
    try {
      // Find the current reply to get like count
      const review = localReviews.find(r => r.id === reviewId);
      const reply = review?.replies?.find(r => r.id === replyId);
      
      if (!reply) {
        console.error('Reply not found for liking:', replyId);
        return;
      }

      const newLikeCount = reply.liked ? (reply.likeCount || 0) - 1 : (reply.likeCount || 0) + 1;
      const newLikedStatus = !reply.liked;

      // Update local state optimistically
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

      // Update in database
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
      // Revert optimistic update
      fetchReviews();
    }
  };

  // Get the item being replied to
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

  const toggleReadMore = (reviewId) => {
    try {
      const newExpanded = new Set(expandedReviews);
      if (newExpanded.has(reviewId)) {
        newExpanded.delete(reviewId);
      } else {
        newExpanded.add(reviewId);
      }
      setExpandedReviews(newExpanded);
    } catch (error) {
      console.error('Error in toggleReadMore:', error);
    }
  };

  const toggleShowMoreReplies = (reviewId) => {
    try {
      const newExpanded = new Set(expandedReplies);
      if (newExpanded.has(reviewId)) {
        newExpanded.delete(reviewId);
      } else {
        newExpanded.add(reviewId);
      }
      setExpandedReplies(newExpanded);
    } catch (error) {
      console.error('Error in toggleShowMoreReplies:', error);
    }
  };

  const handleCommentClick = (reviewId: string) => {
    try {
      console.log('Comment button clicked for review:', reviewId);

      const review = localReviews.find(r => r.id === reviewId);
      if (!review) {
        console.error('Review not found:', reviewId);
        return;
      }

      // Set the review we're replying to with safe property access
      setReplyingTo({
        type: 'review',
        reviewId: reviewId,
        userName: review.user_name || 'User',
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
    } catch (error) {
      console.error('Error in handleCommentClick:', error);
    }
  };

  const handleReplyToReply = (reviewId: string, replyId: string, userName: string) => {
    try {
      console.log('Reply button clicked for reply:', replyId, 'in review:', reviewId);

      const review = localReviews.find(r => r.id === reviewId);
      if (!review) {
        console.error('Review not found:', reviewId);
        return;
      }

      const reply = (review.replies || []).find(r => r.id === replyId);
      if (!reply) {
        console.error('Reply not found:', replyId);
        return;
      }

      setReplyingTo({
        type: 'reply',
        reviewId: reviewId,
        replyId: replyId,
        userName: userName || reply.user_name || 'User',
        isSeller: reply.is_seller || false,
        verifiedSeller: reply.verified_seller || false
      });
      setReplyText('');
    } catch (error) {
      console.error('Error in handleReplyToReply:', error);
    }
  };

  const handleShareClick = (reviewId: string) => {
    try {
      console.log('Share button clicked for review:', reviewId);
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
    } catch (error) {
      console.error('Error in handleShareClick:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      console.log(`Submitting reply to ${replyingTo.type} ${replyingTo.type === 'review' ? replyingTo.reviewId : replyingTo.replyId}: "${replyText}"`);

      // Get user profile data to display proper name
      let userName = 'User'; // fallback
      
      if (user) {
        // Try to get user's full name from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData) {
          // Use full_name if available, otherwise username, otherwise fallback
          userName = profileData.full_name || profileData.username || user.email?.split('@')[0] || 'User';
        } else {
          // Fallback to email username if profile not found
          userName = user.email?.split('@')[0] || 'User';
        }
      }

      // Create new reply object for database
      const newReplyData = {
        review_id: replyingTo.reviewId,
        user_id: user?.id || null,
        user_name: userName, // Use the properly fetched name
        comment: replyText.trim(),
        is_seller: replyingTo.isSeller || false,
        verified_seller: replyingTo.verifiedSeller || false,
        parent_reply_id: replyingTo.type === 'reply' ? replyingTo.replyId : null,
        replying_to: replyingTo.type === 'reply' ? replyingTo.userName : null
      };

      // Insert into database
      const { data: insertedReply, error } = await supabase
        .from('reviews_replies')
        .insert([newReplyData])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setLocalReviews(prevReviews => 
        prevReviews.map(review => {
          if (review.id === replyingTo.reviewId) {
            const newReply = {
              id: insertedReply.id,
              user_name: insertedReply.user_name || userName, // Use the same name here
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

      console.log('Reply submitted successfully:', insertedReply);

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

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    const count = localReviews.length;
    const totalRating = localReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = count > 0 ? totalRating / count : 0;
    return { count, averageRating };
  }, [localReviews]);

  // Calculate rating distribution
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
      options: ['All Sorts', 'Most Recent', 'Oldest First', 'Most Liked']
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

    // Also reset the corresponding state
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

  const summaryStats = [
    { value: reviewStats.averageRating.toFixed(1), label: 'Average', color: 'text-yellow-600' },
    { value: reviewStats.count, label: 'Total', color: 'text-blue-600' },
    { value: `${Math.round((ratingCounts[0] / Math.max(reviewStats.count, 1)) * 100)}%`, label: 'Positivity', color: 'text-green-600' },
    { value: ratingCounts[0], label: '5 Star', color: 'text-purple-600' }
  ];

  if (isLoading) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-8">
          <p className="text-muted-foreground" style={{color: '#666'}}>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchReviews}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-white">
        

          <SellerSummaryHeader 
  mode="reviews"
  reviewsSummary={{
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
  }}
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
                <p className="text-muted-foreground" style={{color: '#666'}}>No reviews found for this product.</p>
                <p className="text-sm text-muted-foreground mt-1" style={{color: '#666'}}>Be the first to leave a review!</p>
              </div>
            ) : (
              finalReviews.map((review) => (
                <div key={review.id} className="border-b pb-4" style={{borderBottom: '1px solid #e5e5e5'}}>
                  <div className="flex items-start justify-between mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                        {review.user_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user_name || 'Anonymous'}</span>
                          {review.verified_purchase && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground" style={{color: '#666'}}>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-3 h-3 ${star <= (review.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
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
                      {expandedReviews.has(review.id) ? (review.comment || '') : truncateText(review.comment || '')}
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
                              {reply.user_name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{reply.user_name || 'Anonymous'}</span>
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
                                  onClick={() => handleReplyToReply(review.id, reply.id, reply.user_name || 'User')}
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
                      {replyingTo.userName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium">{replyingTo.userName || 'User'}</span>
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
    </ErrorBoundary>
  );
};

export default CustomerReviews;