// Update your ReviewItem.tsx with these optimizations
import React, { memo, useCallback, useMemo } from 'react';
import { Play, Heart, MessageCircle, CheckCircle, MoreHorizontal, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/hooks/customer-reviews.hooks";
import { useNavigate } from 'react-router-dom';

// ... rest of your interfaces remain the same ...

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
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

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

  // Memoize these functions
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

  const renderStars = useCallback((ratingNum: number) => {
    return (
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
    );
  }, []);

  // Memoize media items rendering
  const renderedMedia = useMemo(() => 
    media.map((item, index) => (
      <div key={index} className="flex-shrink-0 relative">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.alt || ''}
            className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={() => window.open(item.url, '_blank')}
            loading="lazy" // Add lazy loading
            decoding="async" // Add async decoding
          />
        ) : item.type === 'video' ? (
          <div
            className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
            onClick={() => window.open(item.url, '_blank')}
          >
            <img
              src={item.thumbnail || ''}
              alt={item.alt || ''}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
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
    [media]
  );

  // Memoize replies rendering
  const renderedReplies = useMemo(() => {
    if (!replies.length || !expandedReplies?.has(id)) return null;
    
    return replies.map((reply) => (
      <div key={reply.id} className="ml-12 mt-3 pl-3 border-l-2 border-gray-200">
        <div className="flex items-start gap-2 mb-1">
          <div 
            className={`w-8 h-8 flex items-center justify-center text-white text-xs font-semibold rounded-full flex-shrink-0 ${getAvatarColor(reply.user_name)}`}
          >
            {getInitials(reply.user_name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">
                  {reply.user_name || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(reply.created_at)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLikeReply?.(reply.id, id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={reply.isLiked ? '#ef4444' : 'none'}
                    stroke={reply.isLiked ? '#ef4444' : 'currentColor'}
                    strokeWidth="2"
                  />
                  {reply.likeCount > 0 && <span>{reply.likeCount}</span>}
                </button>
                
                <button
                  onClick={() => onReplyToReply?.(reply.id, id, reply.user_name || '')}
                  className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                >
                  Reply
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mt-1">{reply.comment}</p>
          </div>
        </div>
      </div>
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

  const isRepliesExpanded = expandedReplies?.has(id);
  const hasReplies = replies.length > 0;
  const showReadMore = comment.length > 120;

  return (
    <div className="bg-white border-b border-gray-100 p-2 transition-colors">
      {/* Review Header */}
      <div className="flex gap-2 mb-2">
        <div 
          className={`w-10 h-10 flex items-center justify-center text-white text-sm font-semibold rounded-full flex-shrink-0 ${getAvatarColor(user_name)}`}
        >
          {getInitials(user_name)}
        </div>

        {/* ... rest of your JSX ... */}
      </div>

      {/* Review Comment */}
      <div className="text-gray-800 leading-relaxed mb-2 text-[15px]">
        <span>
          {expandedReviews.has(id) ? comment : truncateText(comment)}
          {showReadMore && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-gray-500 hover:text-gray-700 font-medium ml-1.5 transition-colors"
            >
              {expandedReviews.has(id) ? 'less' : 'more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section - Use memoized media */}
      {media.length > 0 && (
        <div className="mb-2">
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
          >
            <MessageCircle className="w-5 h-5" />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>
        </div>

        {/* Rating on the right */}
        {rating && renderStars(rating)}
      </div>

      {/* Memoized Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowReplies && (
            <button
              onClick={() => onToggleShowReplies(id)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium mb-2"
            >
              {isRepliesExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {isRepliesExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
          
          {isRepliesExpanded && (
            <div className="space-y-3">
              {renderedReplies}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ReviewItem.displayName = 'ReviewItem';

export default ReviewItem;