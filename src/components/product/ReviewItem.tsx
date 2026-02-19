import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import VerificationBadge from "@/components/shared/VerificationBadge";
import { Play, MoreHorizontal, Star, ChevronDown, ChevronUp, ThumbsUp, Link, MessageCircle, Send } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/utils/textUtils";
import { useNavigate } from 'react-router-dom';
import type { MediaItem, Reply, Review } from '@/hooks/useProductReviews';
import ReactionButton from '@/components/shared/ReactionButton';
import StackedReactionIcons from '@/components/shared/StackedReactionIcons';
import { Textarea } from '@/components/ui/textarea';

interface ReviewItemProps {
  review: Review;
  expandedReviews: Set<string>;
  expandedReplies?: Set<string>;
  onToggleReadMore: (reviewId: string) => void;
  onToggleShowMoreReplies?: (reviewId: string) => void;
  onCommentClick?: (reviewId: string) => void;
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
  onShareClick?: (reviewId: string) => void;
  onEditReply?: (replyId: string, reviewId: string, comment: string) => void;
  onDeleteReply?: (replyId: string, reviewId: string) => void;
  onReportReply?: (replyId: string, reviewId: string, reason: string) => void;
  loadMoreReplies?: (reviewId: string) => void;
  replyPagination?: { page: number; hasMore: boolean };
  isLast?: boolean;
  getRepliesForReview?: (reviewId: string) => Reply[];
  helpfulCount?: number;
  shareCount?: number;
  getAvatarColor?: (name?: string) => string;
  getInitials?: (name?: string) => string;
  formatDate?: (date: string) => string;
}

const ReviewItem = memo(({
  review,
  expandedReviews,
  expandedReplies,
  onToggleReadMore,
  onToggleShowMoreReplies,
  onCommentClick,
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
  onShareClick,
  onEditReply,
  onDeleteReply,
  onReportReply,
  loadMoreReplies,
  replyPagination,
  isLast = false,
  getRepliesForReview,
  helpfulCount = 0,
  shareCount = 0,
  getAvatarColor: externalGetAvatarColor,
  getInitials: externalGetInitials,
  formatDate: externalFormatDate,
}: ReviewItemProps) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const {
    id,
    user_id,
    user_name,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    comment_count = 0,
    rating,
  } = review;

  // Get replies for this review
  const replies = useMemo(() => {
    return getRepliesForReview ? getRepliesForReview(id) : [];
  }, [getRepliesForReview, id]);

  useEffect(() => {
    onReviewView?.(id);
  }, [id, onReviewView]);

  // Focus reply input when replying
  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo]);

  const getInitials = useCallback((name?: string) => {
    if (externalGetInitials) return externalGetInitials(name);
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [externalGetInitials]);

  const getAvatarColor = useCallback((name?: string) => {
    if (externalGetAvatarColor) return externalGetAvatarColor(name);
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
  }, [externalGetAvatarColor]);

  const formatDateLocal = useCallback((dateString: string) => {
    if (externalFormatDate) return externalFormatDate(dateString);
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  }, [externalFormatDate]);

  const avatarColor = useMemo(() => getAvatarColor(user_name), [user_name, getAvatarColor]);
  const initials = useMemo(() => getInitials(user_name), [user_name, getInitials]);

  const renderStars = useCallback((ratingNum: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3 h-3"
          fill={star <= ratingNum ? '#FBBF24' : 'none'}
          stroke={star <= ratingNum ? '#FBBF24' : '#D1D5DB'}
          strokeWidth="1.5"
        />
      ))}
    </div>
  ), []);

  const formattedDate = useMemo(() => formatDateLocal(created_at), [created_at, formatDateLocal]);
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

  const handleReplyClick = useCallback((commentId: string) => {
    setReplyingTo(commentId);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyText('');
  }, []);

  const handleSubmitReply = useCallback(() => {
    if (!replyText.trim() || !replyingTo) return;
    
    if (onReplyToReply) {
      onReplyToReply(replyingTo, id, user_name || '');
    }
    
    // Clear the reply input
    setReplyText('');
    setReplyingTo(null);
  }, [replyText, replyingTo, id, user_name, onReplyToReply]);

  const handleReaction = useCallback((commentId: string, reactionId: string | null) => {
    // Find if this is a reply or main comment
    const isReply = replies.some(r => r.id === commentId);
    
    if (isReply && onLikeReply) {
      // It's a reply
      if (reactionId === null) {
        // Handle removing reaction if needed
      } else {
        onLikeReply(commentId, id);
      }
    }
  }, [replies, id, onLikeReply]);

  const getReplyingToName = useCallback(() => {
    if (!replyingTo) return null;
    
    // Check if replying to a reply
    const reply = replies.find(r => r.id === replyingTo);
    if (reply) return reply.user_name;
    
    // Otherwise replying to main comment
    return user_name;
  }, [replyingTo, replies, user_name]);

  const renderedReplies = useMemo(() => {
    if (!replies.length || !expandedReplies?.has(id)) return null;

    return replies.map((reply) => (
      <MemoizedReplyItem
        key={reply.id}
        reply={reply}
        reviewId={id}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
        formatDate={formatDateLocal}
        onLikeReply={onLikeReply}
        onReplyClick={handleReplyClick}
        onEditReply={onEditReply}
        onDeleteReply={onDeleteReply}
        onReportReply={onReportReply}
        currentUserId={currentUserId}
        isOwner={reply.user_id === currentUserId}
      />
    ));
  }, [replies, expandedReplies, id, getAvatarColor, getInitials, formatDateLocal, onLikeReply, handleReplyClick, onEditReply, onDeleteReply, onReportReply, currentUserId]);

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
    onToggleShowMoreReplies?.(id);
  }, [id, onToggleShowMoreReplies]);

  const handleLoadMoreReplies = useCallback(() => {
    loadMoreReplies?.(id);
  }, [id, loadMoreReplies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const isRepliesExpanded = useMemo(() => expandedReplies?.has(id), [expandedReplies, id]);
  const hasReplies = useMemo(() => replies.length > 0, [replies.length]);
  const hasMedia = useMemo(() => media.length > 0, [media.length]);
  const hasMoreReplies = useMemo(() => replyPagination?.hasMore, [replyPagination?.hasMore]);
  const totalReactions = useMemo(() => {
    return replies.reduce((acc, reply) => {
      return acc + (reply.like_count || 0);
    }, 0);
  }, [replies]);

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
            {/* Stars positioned here */}
            {rating && (
              <div className="text-xs text-gray-500 mt-0.5">
                {renderStars(rating)}
              </div>
            )}
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
          {/* Reaction Button - from VendorPostComments */}
          <div className="flex-shrink-0">
            <ReactionButton
              onReactionChange={(reactionId) => handleReaction(id, reactionId)}
              initialReaction={undefined} // You can add userReaction to Review type if needed
              buttonClassName="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded-full h-8 flex items-center justify-center"
              size="md"
            />
          </div>

          {/* Reply Button */}
          <button
            onClick={() => handleReplyClick(id)}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            Reply
          </button>

          {/* Timestamp */}
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        {/* Stacked Reactions - from VendorPostComments */}
        {totalReactions > 0 && (
          <StackedReactionIcons count={totalReactions} />
        )}
      </div>

      {/* Reply Input - from VendorPostComments */}
      {replyingTo && (
        <div className="mt-3 ml-12">
          <div className="flex items-center justify-between px-3 py-1.5 mb-1 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600">
              Replying to <span className="font-semibold text-gray-900">{getReplyingToName()}</span>
            </span>
            <button
              onClick={handleCancelReply}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative w-full">
            <Textarea
              ref={replyInputRef}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[36px] max-h-32 w-full text-sm resize-none bg-gray-100 border-none text-gray-900 placeholder:text-gray-400 rounded-full px-4 py-2 pr-10 focus:ring-1 focus:ring-blue-500 transition-all"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitReply();
                }
              }}
              rows={1}
            />
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className={`absolute right-2 bottom-2 p-1 rounded-full transition-colors ${
                replyText.trim() 
                  ? 'text-blue-500 hover:bg-blue-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowMoreReplies && (
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
  formatDate: (date: string) => string;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyClick?: (replyId: string) => void;
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
  formatDate,
  onLikeReply,
  onReplyClick,
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
    onReplyClick?.(id);
  }, [id, onReplyClick]);

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

  const formattedDate = useMemo(() => formatDate(created_at), [created_at, formatDate]);
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
          <div className="bg-gray-100 rounded-2xl px-3 py-2 w-full">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-semibold text-[13px] text-gray-900 break-words">
                {user_name || 'Anonymous'}
              </p>
            </div>
            <p className="text-[15px] text-gray-800 break-words">{comment}</p>
          </div>

          <div className="flex items-center gap-3 mt-1 text-[12px]">
            {/* Reaction Button for reply */}
            <div className="flex-shrink-0">
              <ReactionButton
                onReactionChange={(reactionId) => {
                  if (reactionId === 'like') {
                    handleLikeClick();
                  }
                }}
                initialReaction={isLiked ? 'like' : undefined}
                buttonClassName="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded-full h-8 flex items-center justify-center"
                size="sm"
              />
            </div>

            {/* Reply button */}
            <button
              onClick={handleReplyClick}
              className="font-semibold text-gray-600 hover:underline text-xs"
            >
              Reply
            </button>

            {/* Timestamp */}
            <span className="text-gray-500">{formattedDate}</span>

            {/* Reply Menu */}
            <div className="relative ml-auto" ref={replyMenuRef}>
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
      </div>
    </div>
  );
});

ReplyItem.displayName = 'ReplyItem';
const MemoizedReplyItem = memo(ReplyItem);
ReviewItem.displayName = 'ReviewItem';

export { ReviewItem };
export default ReviewItem;