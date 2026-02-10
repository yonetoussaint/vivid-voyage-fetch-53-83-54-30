import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockReviews, mockComments, Comment } from './mockReviewsData';
import { ArrowLeft, MessageCircle, Send, Star, MoreVertical, ThumbsUp, Flag, Smile, Search } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  // Find the selected review
  const selectedReview = reviewId 
    ? mockReviews.find(review => review.id === reviewId)
    : null;

  // Get comments for this review
  const reviewComments = reviewId
    ? comments.filter(comment => comment.reviewId === reviewId)
    : [];

  // If no reviewId in URL but we're coming from a specific review, extract from state
  useEffect(() => {
    if (!reviewId && location.state?.selectedReviewId) {
      navigate(`/reviews/${location.state.selectedReviewId}`, { replace: true });
    }
  }, [reviewId, location.state, navigate]);

  // Focus comment input on mount for better mobile UX
  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim() || !reviewId) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      reviewId,
      user_name: 'You',
      comment: newComment,
      created_at: new Date().toISOString()
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    commentInputRef.current?.focus();
  };

  const handleMediaClick = (url: string) => {
    window.open(url, '_blank');
  };

  if (!selectedReview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-xs">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Review Not Found</h1>
          <p className="text-gray-600 mb-4 text-sm">The review doesn't exist or was removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      {/* Header - Compact */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>

          <div className="flex-1 px-2 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate text-center">
              {selectedReview.user_name || 'Anonymous'}
            </h1>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-2.5 h-2.5 ${star <= (selectedReview.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>

          <button 
            className="p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-3 pb-20">
        {/* Review Card */}
        <div className="bg-white rounded-xl shadow-sm mt-3 p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full bg-gray-200">
              {selectedReview.user_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm truncate">
                  {selectedReview.user_name || 'Anonymous'}
                </span>
                {selectedReview.verified_purchase && (
                  <span className="text-[10px] px-1 py-0.5 bg-blue-50 text-blue-600 rounded">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>{new Date(selectedReview.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Review Content */}
          <p className="text-gray-900 text-sm leading-relaxed mb-3">{selectedReview.comment}</p>

          {/* Media Grid */}
          {selectedReview.media && selectedReview.media.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2">
                {selectedReview.media.slice(0, 4).map((item, index) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${selectedReview.media.length > 1 ? '' : 'col-span-2'}`}
                    onClick={() => handleMediaClick(item.url)}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 active:text-blue-700">
                <ThumbsUp className="w-4 h-4" />
                <span>{selectedReview.likeCount || 0}</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 active:text-blue-700">
                <MessageCircle className="w-4 h-4" />
                <span>{reviewComments.length}</span>
              </button>
            </div>
            <button className="text-gray-500 hover:text-gray-700 p-1">
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-3 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Comments ({reviewComments.length})
            </h2>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Most relevant
            </button>
          </div>

          {reviewComments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {reviewComments.map((comment) => (
                <div key={comment.id} className="px-4 py-3 hover:bg-gray-50 active:bg-gray-100">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 flex items-center justify-center text-xs font-medium rounded-full bg-gray-200 flex-shrink-0">
                      {comment.user_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 text-sm block truncate">
                            {comment.user_name}
                          </span>
                          <p className="text-gray-800 text-sm mt-1 break-words">
                            {comment.comment}
                          </p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-lg ml-2 flex-shrink-0">
                          <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>
                        <button className="text-xs text-gray-500 hover:text-blue-600">Like</button>
                        <button className="text-xs text-gray-500 hover:text-blue-600">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No comments yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
            </div>
          )}
        </div>
      </main>

      {/* Comment Input - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 safe-area-padding">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-2xl flex items-center pl-3">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 active:text-gray-900"
              aria-label="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-1 py-2.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              enterKeyHint="send"
            />
          </div>
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-2.5 rounded-full transition-colors ${
              newComment.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-200 text-gray-400'
            }`}
            aria-label="Send comment"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;