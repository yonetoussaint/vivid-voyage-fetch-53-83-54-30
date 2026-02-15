// components/product/ReviewItem.tsx
import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import VerificationBadge from "@/components/shared/VerificationBadge";
import { Play, Heart, MessageCircle, MoreHorizontal, Star, ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/utils/textUtils";
import { useNavigate } from 'react-router-dom';
import type { MediaItem, Reply, Review } from '@/types/reviews';

interface ReviewItemProps {
  review: Review;
  expandedReviews: Set<string>;
  expandedReplies?: Set<string>;
  onToggleReadMore: (reviewId: string) => void;
  onToggleShowReplies?: (reviewId: string) => void;
  onCommentClick?: (reviewId: string) => void;
  onShareClick?: (reviewId: string) => void;
  onLikeReview?: (reviewId: string) => void;
  onFollowUser?: (userId: string, userName: string) => void;
  onUnfollowUser?: (userId: string, userName: string) => void;
  isFollowing?: boolean;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
  onMenuAction?: (reviewId: string, action: 'report' | 'edit' | 'delete' | 'share') => void;
  currentUserId?: string;
  isOwner?: boolean;
  onMediaClick?: (media: MediaItem[], index: number) => void;
  onReviewView?: (reviewId: string) => void;
  onMarkHelpful?: (reviewId: string) => void;
  onEditReply?: (replyId: string, reviewId: string, comment: string) => void;
  onDeleteReply?: (replyId: string, reviewId: string) => void;
  onReportReply?: (replyId: string, reviewId: string, reason: string) => void;
  loadMoreReplies?: (reviewId: string) => void;
  replyPagination?: { page: number; hasMore: boolean };
  isLast?: boolean;
  getRepliesForReview?: (reviewId: string) => Reply[];
}

const ReviewItem = memo(({
  review,
  expandedReviews,
  expandedReplies,
  onToggleReadMore,
  onToggleShowReplies,
  onCommentClick,
  onShareClick,
  onLikeReview,
  onFollowUser,
  onUnfollowUser,
  isFollowing = false,
  onLikeReply,
  onReplyToReply,
  onMenuAction,
  currentUserId,
  isOwner = false,
  onMediaClick,
  onReviewView,
  onMarkHelpful,
  onEditReply,
  onDeleteReply,
  onReportReply,
  loadMoreReplies,
  replyPagination,
  isLast = false,
  getRepliesForReview,
}: ReviewItemProps) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyMenu, setShowReplyMenu] = useState<string | null>(null);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const replyMenuRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  // Use the correct database column names
  const {
    id,
    user_id,
    user_name,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    like_count = 0,
    comment_count = 0,
    rating,
    isLiked = false,
  } = review;

  // Get replies for this review
  const replies = useMemo(() => {
    return getRepliesForReview ? getRepliesForReview(id) : [];
  }, [getRepliesForReview, id]);

  useEffect(() => {
    onReviewView?.(id);
  }, [id, onReviewView]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getAvatarColor = useCallback((name?: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }, []);

  const avatarColor = useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = useMemo(() => getInitials(user_name), [user_name, getInitials]);

  const renderStars = useCallback((ratingNum: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= ratingNum ? '#FBBF24' : 'none'}
          stroke={star <= ratingNum ? '#FBBF24' : '#D1D5DB'}
          strokeWidth="1.5"
        />
      ))}
    </div>
  ), []);

  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);
  const truncatedComment = useMemo(() => truncateText(comment), [comment]);
  const shouldShowReadMore = useMemo(() => comment.length > 120, [comment.length]);

  const handleMediaItemClick = useCallback((item: MediaItem, index: number) => {
    if (onMediaClick) {
      onMediaClick(media, index);
    } else {
      window.open(item.url, '_blank');
    }
  }, [media, onMediaClick]);

  const renderedMedia = useMemo(() => 
    media.map((item, index) => (
      <div key={`${id}-media-${index}`} className="flex-shrink-0 relative">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.alt || `Review media ${index + 1}`}
            className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={() => handleMediaItemClick(item, index)}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsMediaLoaded(true)}
            style={{ opacity: isMediaLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        ) : item.type === 'video' ? (
          <div
            className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
            onClick={() => handleMediaItemClick(item, index)}
          >
            <img
              src={item.thumbnail || item.url}
              alt={item.alt || `Video thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onLoad={() => setIsMediaLoaded(true)}
              style={{ opacity: isMediaLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
              <div className="bg-white rounded-full p-2">
                <Play className="w-5 h-5 text-gray-900 fill-gray-900" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )),
    [media, id, isMediaLoaded, handleMediaItemClick]
  );

  const renderedReplies = useMemo(() => {
    if (!replies.length || !expandedReplies?.has(id)) return null;

    return replies.map((reply) => (
      <MemoizedReplyItem
        key={reply.id}
        reply={reply}
        reviewId={id}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
        onLikeReply={onLikeReply}
        onReplyToReply={onReplyToReply}
        onEditReply={onEditReply}
        onDeleteReply={onDeleteReply}
        onReportReply={onReportReply}
        currentUserId={currentUserId}
        isOwner={reply.user_id === currentUserId}
      />
    ));
  }, [replies, expandedReplies, id, getAvatarColor, getInitials, onLikeReply, onReplyToReply, onEditReply, onDeleteReply, onReportReply, currentUserId]);

  const handleLikeClick = useCallback(() => {
    onLikeReview?.(id);
  }, [id, onLikeReview]);

  const handleFollowClick = useCallback(() => {
    if (isFollowing) {
      onUnfollowUser?.(user_id || id, user_name || '');
    } else {
      onFollowUser?.(user_id || id, user_name || '');
    }
  }, [id, user_id, user_name, isFollowing, onFollowUser, onUnfollowUser]);

  const handleHelpfulClick = useCallback(() => {
    onMarkHelpful?.(id);
  }, [id, onMarkHelpful]);

  const handleCommentClick = useCallback(() => {
    if (onToggleShowReplies) {
      onToggleShowReplies(id);
    } else {
      navigate(`/reviews/${id}`);
      onCommentClick?.(id);
    }
  }, [id, onToggleShowReplies, navigate, onCommentClick]);

  const handleShareClick = useCallback(() => {
    onShareClick?.(id);
  }, [id, onShareClick]);

  const handleMenuAction = useCallback((action: 'report' | 'edit' | 'delete' | 'share') => {
    onMenuAction?.(id, action);
    setShowMenu(false);
  }, [id, onMenuAction]);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const handleReadMoreClick = useCallback(() => {
    onToggleReadMore(id);
  }, [id, onToggleReadMore]);

  const handleShowRepliesClick = useCallback(() => {
    onToggleShowReplies?.(id);
  }, [id, onToggleShowReplies]);

  const handleLoadMoreReplies = useCallback(() => {
    loadMoreReplies?.(id);
  }, [id, loadMoreReplies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (replyMenuRef.current && !replyMenuRef.current.contains(event.target as Node)) {
        setShowReplyMenu(null);
      }
    };

    if (showMenu || showReplyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showReplyMenu]);

  const isRepliesExpanded = useMemo(() => expandedReplies?.has(id), [expandedReplies, id]);
  const hasReplies = useMemo(() => replies.length > 0, [replies.length]);
  const hasMedia = useMemo(() => media.length > 0, [media.length]);
  const hasMoreReplies = useMemo(() => replyPagination?.hasMore, [replyPagination?.hasMore]);

  return (
    <div 
      className={`bg-white py-2 transition-colors ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      {/* Review Header */}
      <div className="flex gap-2 mb-2">
        <div 
          className={`w-10 h-10 flex items-center justify-center text-white text-sm font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-[15px] truncate block">
                {user_name || 'Anonymous'}
              </span>
              {verified_purchase && (
                <VerificationBadge />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formattedDate}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button 
              onClick={handleFollowClick}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isFollowing 
                  ? 'text-gray-700 bg-gray-200 hover:bg-gray-300' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => handleMenuAction('share')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Share review
                  </button>

                  {isOwner && (
                    <button
                      onClick={() => handleMenuAction('edit')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit review
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  {!isOwner && (
                    <button
                      onClick={() => handleMenuAction('report')}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Report review
                    </button>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <div className="text-gray-800 leading-relaxed mb-2 text-[15px]">
        <span>
          {expandedReviews.has(id) ? comment : truncatedComment}
          {shouldShowReadMore && (
            <button
              onClick={handleReadMoreClick}
              className="text-gray-500 hover:text-gray-700 font-medium ml-1.5 transition-colors"
            >
              {expandedReviews.has(id) ? 'less' : 'more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section */}
      {hasMedia && (
        <div className="mb-2" ref={mediaContainerRef}>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {renderedMedia}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label={`Like this review. ${like_count} likes`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isLiked 
                  ? 'fill-red-500 stroke-red-500 scale-110' 
                  : 'fill-none stroke-current group-hover:scale-110'
              }`}
              strokeWidth={isLiked ? "2" : "2"}
            />
            {like_count > 0 && (
              <span className={isLiked ? 'text-red-500 font-semibold' : ''}>
                {like_count}
              </span>
            )}
          </button>

          {/* Comment Button */}
          <button
            onClick={handleCommentClick}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label={`Comment on this review. ${comment_count} comments`}
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {comment_count > 0 && <span>{comment_count}</span>}
          </button>

          {/* Helpful Button */}
          <button
            onClick={handleHelpfulClick}
            className="text-sm text-gray-500 hover:text-green-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label="Mark this review as helpful"
          >
            <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Helpful</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-2 font-medium group"
            aria-label="Share this review"
          >
            <svg 
              className="w-5 h-5 group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
              />
            </svg>
          </button>
        </div>

        {rating && renderStars(rating)}
      </div>

      {/* Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowReplies && (
            <button
              onClick={handleShowRepliesClick}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium mb-2 transition-colors"
              aria-expanded={isRepliesExpanded}
            >
              {isRepliesExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {isRepliesExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {isRepliesExpanded && renderedReplies && (
            <div className="space-y-3">
              {renderedReplies}
              {hasMoreReplies && (
                <button
                  onClick={handleLoadMoreReplies}
                  className="ml-12 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Load more replies
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

interface ReplyItemProps {
  reply: Reply;
  reviewId: string;
  getAvatarColor: (name?: string) => string;
  getInitials: (name?: string) => string;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
  onEditReply?: (replyId: string, reviewId: string, comment: string) => void;
  onDeleteReply?: (replyId: string, reviewId: string) => void;
  onReportReply?: (replyId: string, reviewId: string, reason: string) => void;
  currentUserId?: string;
  isOwner?: boolean;
}

const ReplyItem = memo(({
  reply,
  reviewId,
  getAvatarColor,
  getInitials,
  onLikeReply,
  onReplyToReply,
  onEditReply,
  onDeleteReply,
  onReportReply,
  currentUserId,
  isOwner = false,
}: ReplyItemProps) => {
  const [showReplyMenu, setShowReplyMenu] = useState(false);
  const replyMenuRef = useRef<HTMLDivElement>(null);

  const {
    id,
    user_name,
    comment,
    created_at,
    like_count = 0,
    isLiked = false,
  } = reply;

  const handleLikeClick = useCallback(() => {
    onLikeReply?.(id, reviewId);
  }, [id, reviewId, onLikeReply]);

  const handleReplyClick = useCallback(() => {
    onReplyToReply?.(id, reviewId, user_name || '');
  }, [id, reviewId, user_name, onReplyToReply]);

  const handleEditClick = useCallback(() => {
    onEditReply?.(id, reviewId, comment || '');
    setShowReplyMenu(false);
  }, [id, reviewId, comment, onEditReply]);

  const handleDeleteClick = useCallback(() => {
    onDeleteReply?.(id, reviewId);
    setShowReplyMenu(false);
  }, [id, reviewId, onDeleteReply]);

  const handleReportClick = useCallback(() => {
    onReportReply?.(id, reviewId, 'inappropriate');
    setShowReplyMenu(false);
  }, [id, reviewId, onReportReply]);

  const toggleReplyMenu = useCallback(() => {
    setShowReplyMenu(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replyMenuRef.current && !replyMenuRef.current.contains(event.target as Node)) {
        setShowReplyMenu(false);
      }
    };

    if (showReplyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReplyMenu]);

  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);
  const avatarColor = useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = useMemo(() => getInitials(user_name), [user_name, getInitials]);

  return (
    <div className="ml-12 mt-3 pl-3 border-l-2 border-gray-200">
      <div className="flex items-start gap-2 mb-1">
        <div 
          className={`w-8 h-8 flex items-center justify-center text-white text-xs font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                {user_name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Reply Like Button */}
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors group"
                aria-label={`Like this reply. ${like_count} likes`}
              >
                <Heart
                  className={`w-4 h-4 transition-all ${
                    isLiked 
                      ? 'fill-red-500 stroke-red-500 scale-110' 
                      : 'fill-none stroke-current group-hover:scale-110'
                  }`}
                  strokeWidth={isLiked ? "2" : "2"}
                />
                {like_count > 0 && (
                  <span className={isLiked ? 'text-red-500 font-semibold' : ''}>
                    {like_count}
                  </span>
                )}
              </button>

              {/* Reply Button */}
              <button
                onClick={handleReplyClick}
                className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                aria-label={`Reply to ${user_name || 'this user'}`}
              >
                Reply
              </button>

              {/* Reply Menu */}
              <div className="relative" ref={replyMenuRef}>
                <button
                  onClick={toggleReplyMenu}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Reply options"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {showReplyMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {isOwner && (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit reply
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete reply
                        </button>
                      </>
                    )}

                    {!isOwner && (
                      <button
                        onClick={handleReportClick}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Report reply
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mt-1">{comment}</p>
        </div>
      </div>
    </div>
  );
});

ReplyItem.displayName = 'ReplyItem';
const MemoizedReplyItem = memo(ReplyItem);
ReviewItem.displayName = 'ReviewItem';

export { ReviewItem };
export default ReviewItem;