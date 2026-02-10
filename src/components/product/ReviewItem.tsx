import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Play, Heart, MessageCircle, CheckCircle, MoreHorizontal, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/hooks/customer-reviews.hooks";
import { useNavigate } from 'react-router-dom';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface Reply {
  id: string;
  user_name?: string;
  comment?: string;
  created_at: string;
  likeCount?: number;
  isLiked?: boolean;
}

export interface Review {
  id: string;
  user_name?: string;
  comment?: string;
  created_at: string;
  verified_purchase?: boolean;
  media?: MediaItem[];
  likeCount?: number;
  commentCount?: number;
  rating?: number;
  replies?: Reply[];
}

interface ReviewItemProps {
  review: Review;
  expandedReviews: Set<string>;
  expandedReplies?: Set<string>;
  onToggleReadMore: (reviewId: string) => void;
  onToggleShowReplies?: (reviewId: string) => void;
  onCommentClick?: (reviewId: string) => void;
  onShareClick?: (reviewId: string) => void;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
  onMenuAction?: (reviewId: string, action: 'report' | 'edit' | 'delete' | 'share') => void;
}

const ReviewItem = memo(({
  review,
  expandedReviews,
  expandedReplies,
  onToggleReadMore,
  onToggleShowReplies,
  onCommentClick,
  onShareClick,
  onLikeReply,
  onReplyToReply,
  onMenuAction,
}: ReviewItemProps) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const {
    id,
    user_name,
    comment = '',
    created_at,
    verified_purchase,
    media = [],
    likeCount = 0,
    commentCount = 0,
    rating,
    replies = [],
  } = review;

  // Memoize avatar functions
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

  // Memoize stars rendering
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

  // Memoize date formatting
  const formattedDate = useMemo(() => formatDate(created_at), [created_at]);

  // Memoize truncated comment
  const truncatedComment = useMemo(() => truncateText(comment), [comment]);
  const shouldShowReadMore = useMemo(() => comment.length > 120, [comment.length]);

  // Memoize media rendering
  const renderedMedia = useMemo(() => 
    media.map((item, index) => (
      <div key={`${id}-media-${index}`} className="flex-shrink-0 relative">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.alt || `Review media ${index + 1}`}
            className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={() => window.open(item.url, '_blank')}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsMediaLoaded(true)}
            style={{ opacity: isMediaLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        ) : item.type === 'video' ? (
          <div
            className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
            onClick={() => window.open(item.url, '_blank')}
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
    [media, id, isMediaLoaded]
  );

  // Memoize replies rendering
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
      />
    ));
  }, [replies, expandedReplies, id, getAvatarColor, getInitials, onLikeReply, onReplyToReply]);

  // Event handlers
  const handleCommentClick = useCallback(() => {
    if (onToggleShowReplies) {
      onToggleShowReplies(id);
    } else {
      navigate(`/reviews/${id}`);
      onCommentClick?.(id);
    }
  }, [id, onToggleShowReplies, navigate, onCommentClick]);

  const handleMenuAction = useCallback((action: 'report' | 'edit' | 'delete' | 'share') => {
    onMenuAction?.(id, action);
    setShowMenu(false);
  }, [id, onMenuAction]);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const handleLikeClick = useCallback(() => {
    console.log('Like clicked for review:', id);
  }, [id]);

  const handleReadMoreClick = useCallback(() => {
    onToggleReadMore(id);
  }, [id, onToggleReadMore]);

  const handleShowRepliesClick = useCallback(() => {
    onToggleShowReplies?.(id);
  }, [id, onToggleShowReplies]);

  const handleFollowClick = useCallback(() => {
    console.log('Follow clicked for user:', user_name);
  }, [user_name]);

  // Close menu when clicking outside
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

  return (
    <div className="bg-white border-b border-gray-100 p-2 transition-colors">
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
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formattedDate}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button 
              onClick={handleFollowClick}
              className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Follow
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
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
                  <button
                    onClick={() => handleMenuAction('edit')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit review
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleMenuAction('report')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Report review
                  </button>
                  <button
                    onClick={() => handleMenuAction('delete')}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete review
                  </button>
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
          <div className="flex gap-2 overflow-x-auto pb-2">
            {renderedMedia}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-8">
          <button
            onClick={handleLikeClick}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 font-medium"
            aria-label={`Like this review. ${likeCount} likes`}
          >
            <Heart
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button
            onClick={handleCommentClick}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
            aria-label={`Comment on this review. ${commentCount} comments`}
          >
            <MessageCircle className="w-5 h-5" />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>
        </div>

        {/* Rating on the right */}
        {rating && renderStars(rating)}
      </div>

      {/* Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowReplies && (
            <button
              onClick={handleShowRepliesClick}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium mb-2"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Separate memoized component for replies to optimize rendering
interface ReplyItemProps {
  reply: Reply;
  reviewId: string;
  getAvatarColor: (name?: string) => string;
  getInitials: (name?: string) => string;
  onLikeReply?: (replyId: string, reviewId: string) => void;
  onReplyToReply?: (replyId: string, reviewId: string, userName: string) => void;
}

const ReplyItem = memo(({
  reply,
  reviewId,
  getAvatarColor,
  getInitials,
  onLikeReply,
  onReplyToReply,
}: ReplyItemProps) => {
  const handleLikeClick = useCallback(() => {
    onLikeReply?.(reply.id, reviewId);
  }, [reply.id, reviewId, onLikeReply]);

  const handleReplyClick = useCallback(() => {
    onReplyToReply?.(reply.id, reviewId, reply.user_name || '');
  }, [reply.id, reviewId, reply.user_name, onReplyToReply]);

  const formattedDate = useMemo(() => formatDate(reply.created_at), [reply.created_at]);
  const avatarColor = useMemo(() => getAvatarColor(reply.user_name), [reply.user_name, getAvatarColor]);
  const initials = useMemo(() => getInitials(reply.user_name), [reply.user_name, getInitials]);

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
                {reply.user_name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {formattedDate}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                aria-label={`Like this reply. ${reply.likeCount || 0} likes`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={reply.isLiked ? '#ef4444' : 'none'}
                  stroke={reply.isLiked ? '#ef4444' : 'currentColor'}
                  strokeWidth="2"
                />
                {(reply.likeCount || 0) > 0 && <span>{reply.likeCount}</span>}
              </button>
              
              <button
                onClick={handleReplyClick}
                className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                aria-label={`Reply to ${reply.user_name || 'this user'}`}
              >
                Reply
              </button>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm mt-1">{reply.comment}</p>
        </div>
      </div>
    </div>
  );
});

ReplyItem.displayName = 'ReplyItem';
const MemoizedReplyItem = memo(ReplyItem);

ReviewItem.displayName = 'ReviewItem';

export default ReviewItem;