import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Star, AlertCircle } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { useProductReviews } from "@/hooks/useProductReviews";
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewItem from '@/components/product/ReviewItem';
import ReplyBar from '@/components/product/ReplyBar';
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

import type { Review } from '@/hooks/useProductReviews';

interface CustomerReviewsProps {
  productId?: string;
  limit?: number;
  productName?: string;
}

const CustomerReviews = React.memo(({ 
  productId, 
  limit = 5,
  productName = "This Product" 
}: CustomerReviewsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const [activeFilters, setActiveFilters] = useState<any[]>([]);

  const {
    reviews,
    isLoading,
    error,
    totalCount,
    expandedReviews,
    expandedReplies,
    replyingTo,
    replyText,
    itemBeingReplied,
    setReplyText,
    handleLike,
    toggleReadMore,
    toggleShowMoreReplies,
    handleCommentClick,
    handleReplyToReply,
    handleShareClick,
    handleSubmitReply,
    handleCancelReply,
    fetchReviews,
    summaryStats,
    getRepliesForReview,
  } = useProductReviews({ 
    productId, 
    limit,
    filters: activeFilters
  });

  // Memoize the displayed reviews
  const displayedReviews = useMemo(() => 
    reviews.slice(0, 2), 
    [reviews]
  );

  // Memoize event handlers
  const memoizedHandleLike = useCallback((replyId: string, reviewId: string) => {
    handleLike(replyId, 'reply');
  }, [handleLike]);

  const memoizedHandleLikeReview = useCallback((reviewId: string) => {
    handleLike(reviewId, 'review');
  }, [handleLike]);

  const memoizedToggleReadMore = useCallback((reviewId: string) => {
    toggleReadMore(reviewId);
  }, [toggleReadMore]);

  const memoizedToggleShowMoreReplies = useCallback((reviewId: string) => {
    toggleShowMoreReplies(reviewId);
  }, [toggleShowMoreReplies]);

  const memoizedHandleCommentClick = useCallback((reviewId: string) => {
    handleCommentClick(reviewId);
  }, [handleCommentClick]);

  const memoizedHandleReplyToReply = useCallback((replyId: string, reviewId: string, userName: string) => {
    handleReplyToReply(replyId, reviewId, userName);
  }, [handleReplyToReply]);

  const handleViewAllReviews = useCallback(() => {
    navigate(`/product/${productId}/reviews`, { 
      state: { filters: activeFilters } 
    });
  }, [productId, navigate, activeFilters]);

  const handleAddReviewClick = useCallback(() => {
    if (!user) {
      openAuthOverlay();
      return;
    }
    navigate(`/product/${productId}/add-review`, { 
      state: { productName } 
    });
  }, [productId, user, navigate, openAuthOverlay, productName]);

  const handleFilterChange = useCallback((filters: any[]) => {
    setActiveFilters(filters);
  }, []);

  // Show loading state
  if (isLoading && reviews.length === 0) {
    return (
      <div className="w-full bg-white">
        <div className="animate-pulse">
          {/* Summary Section Skeleton */}
          <div className="p-4 border-b">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Button Skeleton */}
          <div className="px-4 py-4">
            <div className="w-full h-16 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Reviews List Skeleton */}
          <div className="px-4 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border-b border-gray-100 pb-4">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-12 px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-2">Failed to load reviews</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button
            variant="outline"
            className="mx-auto"
            onClick={fetchReviews}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-white">
        {/* Reviews Summary Section */}
        <ReviewsSummary 
          productId={productId}
          summaryStats={summaryStats}
          reviews={reviews}
          onFilterChange={handleFilterChange}
        />

        {/* Add Review Button */}
        <div className="px-4 py-4">
          <button
            onClick={handleAddReviewClick}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-4 px-6 flex items-center justify-between shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block font-semibold text-lg">Write a Review</span>
                <span className="block text-sm text-blue-100">
                  Share your experience with {productName}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 text-white fill-white"
                />
              ))}
            </div>
          </button>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Active filters:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                >
                  {filter.label}: {filter.displayValue}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="py-2">
          <div className="space-y-2">
            {reviews.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">
                  {activeFilters.length > 0 ? 'No reviews match your filters' : 'No reviews yet'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {activeFilters.length > 0 
                    ? 'Try adjusting your filters' 
                    : `Be the first to share your experience with ${productName}`}
                </p>
                {activeFilters.length > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => setActiveFilters([])}
                    className="mx-auto"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddReviewClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            ) : (
              displayedReviews.map((review: Review, index: number) => (
                <div key={review.id} className="px-4">
                  <ReviewItem
                    review={review}
                    expandedReviews={expandedReviews}
                    expandedReplies={expandedReplies}
                    onToggleReadMore={memoizedToggleReadMore}
                    onToggleShowMoreReplies={memoizedToggleShowMoreReplies}
                    onCommentClick={memoizedHandleCommentClick}
                    onShareClick={() => handleShareClick(review.id)}
                    onLikeReview={memoizedHandleLikeReview}
                    onLikeReply={memoizedHandleLike}
                    onReplyToReply={memoizedHandleReplyToReply}
                    isLast={index === displayedReviews.length - 1}
                    getRepliesForReview={getRepliesForReview}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* View All Reviews Button */}
        {totalCount > 2 && reviews.length > 0 && (
          <div className="px-4 pb-4">
            <Button
              variant="outline"
              className="w-full py-3 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              onClick={handleViewAllReviews}
            >
              View All {totalCount} Reviews
            </Button>
          </div>
        )}

        {/* Reply Bar Component */}
        <ReplyBar
          replyingTo={replyingTo}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          onSubmitReply={handleSubmitReply}
          onCancelReply={handleCancelReply}
        />

        {/* Quick Stats Footer */}
        {reviews.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Average Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {summaryStats.averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4"
                        fill={star <= Math.round(summaryStats.averageRating) ? '#FBBF24' : '#E5E7EB'}
                        stroke={star <= Math.round(summaryStats.averageRating) ? '#FBBF24' : '#E5E7EB'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-gray-500">
                Based on {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

CustomerReviews.displayName = 'CustomerReviews';

export default CustomerReviews;