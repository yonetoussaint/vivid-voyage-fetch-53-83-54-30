import { memo } from 'react';
import { AlertCircle, Plus, Star } from 'lucide-react';

export const CustomerReviews = memo(({ 
  productId, 
  limit = 5,
  productName = "This Product" 
}) => {
  // All logic is in the parent component that uses this
  // This component receives everything as props
  
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
    repliesMap,
    setReplyText,
    handleLike,
    handleReply,
    handleShare,
    handleSubmitReply,
    handleCancelReply,
    toggleReadMore,
    toggleShowMoreReplies,
    handleReplyToReply,
    fetchReviews,
    summaryStats,
    handleCommentClick,
    user,
    openAuthOverlay,
    handleAddReview,
    handleViewAllReviews,
    handleFilterChange,
    activeFilters,
    setActiveFilters,
    getAvatarColor,
    getInitials,
    formatDate,
    renderStars,
    ReplyItemComponent,
    ReviewItemComponent,
    ReviewsSummaryComponent,
    ReplyBarComponent,
    displayedReviews,
    showSkeleton,
  } = props;

  if (showSkeleton) {
    return (
      <div className="w-full bg-white">
        <div className="animate-pulse">
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

          <div className="px-4 py-4">
            <div className="w-full h-16 bg-gray-200 rounded-xl"></div>
          </div>

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

  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-12 px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-2">Failed to load reviews</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mx-auto"
            onClick={fetchReviews}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <ReviewsSummaryComponent 
        productId={productId}
        summaryStats={summaryStats}
        reviews={reviews}
        onFilterChange={handleFilterChange}
      />

      {/* Add Review Button */}
      <div className="px-4 py-4">
        <button
          onClick={handleAddReview}
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
              <p className="text-gray-600 font-medium mb-2">No reviews yet</p>
              <p className="text-sm text-gray-500 mb-6">
                Be the first to share your experience with {productName}
              </p>
              <button
                onClick={handleAddReview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Write a Review
              </button>
            </div>
          ) : (
            displayedReviews.map((review, index) => (
              <div key={review.id} className="px-4">
                <ReviewItemComponent
                  review={review}
                  isExpanded={expandedReviews.has(review.id)}
                  onToggleExpand={() => toggleReadMore(review.id)}
                  onLike={handleLike}
                  onReply={handleCommentClick}
                  onShare={handleShare}
                  onEdit={(id, title, comment, rating) => console.log('Edit', id, title, comment, rating)}
                  onDelete={(id) => console.log('Delete', id)}
                  onReport={(id, reason) => console.log('Report', id, reason)}
                  currentUserId={user?.id}
                  replies={repliesMap.get(review.id) || []}
                  onLikeReply={handleLike}
                  onReplyToReply={handleReplyToReply}
                  onEditReply={(replyId, reviewId, comment) => console.log('Edit reply', replyId, reviewId, comment)}
                  onDeleteReply={(replyId, reviewId) => console.log('Delete reply', replyId, reviewId)}
                  onReportReply={(replyId, reviewId, reason) => console.log('Report reply', replyId, reviewId, reason)}
                  onToggleShowMoreReplies={() => toggleShowMoreReplies(review.id)}
                  isRepliesExpanded={expandedReplies.has(review.id)}
                  maxVisibleReplies={3}
                  getAvatarColor={getAvatarColor}
                  getInitials={getInitials}
                  formatDate={formatDate}
                  renderStars={renderStars}
                  ReplyItemComponent={ReplyItemComponent}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* View All Reviews Button */}
      {totalCount > 2 && reviews.length > 0 && (
        <div className="px-4 pb-4">
          <button
            className="w-full py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            onClick={handleViewAllReviews}
          >
            View All {totalCount} Reviews
          </button>
        </div>
      )}

      {/* Reply Bar Component */}
      <ReplyBarComponent
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
  );
});

CustomerReviews.displayName = 'CustomerReviews';
export default CustomerReviews;