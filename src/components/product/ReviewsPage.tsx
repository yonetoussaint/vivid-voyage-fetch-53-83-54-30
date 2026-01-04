import React, { useState } from 'react';
import ReviewItem, { Review } from './ReviewItem';
import { mockReviews, mockComments, Comment } from './mockReviewsData';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handleToggleReadMore = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleCommentClick = (reviewId: string) => {
    setSelectedReviewId(selectedReviewId === reviewId ? null : reviewId);
  };

  const handleLikeClick = (reviewId: string) => {
    // In a real app, this would make an API call
    console.log('Liked review:', reviewId);
  };

  const handleMediaClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAddComment = (reviewId: string) => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      reviewId,
      user_name: 'You',
      comment: newComment,
      created_at: new Date().toISOString()
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const selectedReview = selectedReviewId 
    ? mockReviews.find(review => review.id === selectedReviewId)
    : null;

  const reviewComments = selectedReviewId
    ? comments.filter(comment => comment.reviewId === selectedReviewId)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
              <p className="text-gray-600 mt-1">
                {mockReviews.length} reviews • {mockComments.length} total comments
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white p-4 rounded-none border border-gray-200 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.2</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{mockReviews.length}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{mockComments.length}</div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Reviews List */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">All Reviews</h2>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="relative">
                    <ReviewItem
                      review={review}
                      expandedReviews={expandedReviews}
                      onToggleReadMore={handleToggleReadMore}
                      onCommentClick={handleCommentClick}
                      onLikeClick={handleLikeClick}
                      onMediaClick={handleMediaClick}
                    />
                    
                    {/* Highlight selected review */}
                    {selectedReviewId === review.id && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Comments Section */}
          <div className="lg:w-1/3">
            <div className="sticky top-4">
              <div className="bg-white border border-gray-200">
                {/* Comments Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">
                      {selectedReview 
                        ? `Comments (${reviewComments.length})`
                        : 'Select a review to view comments'
                      }
                    </h3>
                  </div>
                </div>

                {/* Selected Review Preview */}
                {selectedReview && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full bg-gray-200">
                        {selectedReview.user_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{selectedReview.user_name}</div>
                        <div className="text-xs text-gray-600">
                          {selectedReview.rating} stars • {new Date(selectedReview.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {selectedReview.comment}
                    </p>
                  </div>
                )}

                {/* Comments List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {selectedReview ? (
                    <>
                      {reviewComments.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {reviewComments.map((comment) => (
                            <div key={comment.id} className="p-4 hover:bg-gray-50">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full bg-gray-200">
                                  {comment.user_name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">{comment.user_name}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Click on "Comment" button to view and add comments</p>
                    </div>
                  )}
                </div>

                {/* Add Comment Form */}
                {selectedReview && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(selectedReview.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(selectedReview.id)}
                        disabled={!newComment.trim()}
                        className={`px-4 py-2 flex items-center gap-1.5 text-sm ${
                          newComment.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2">About Reviews & Comments</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All reviews are from verified customers</li>
                  <li>• You can like helpful reviews</li>
                  <li>• Comments allow discussion about specific reviews</li>
                  <li>• Click on media to view full size</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;