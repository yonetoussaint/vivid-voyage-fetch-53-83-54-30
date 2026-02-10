import React from 'react';
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
  rating?: number; // Optional rating from 1-5
  replies?: Reply[]; // Added replies to the Review interface
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

const ReviewItem = ({
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

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name?: string) => {
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
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4"
            fill={star <= rating ? '#FBBF24' : 'none'}
            stroke={star <= rating ? '#FBBF24' : '#D1D5DB'}
            strokeWidth="1.5"
          />
        ))}
      </div>
    );
  };

  const renderReplyItem = (reply: Reply) => {
    return (
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
    );
  };

  // Close menu when clicking outside
  React.useEffect(() => {
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

  const handleMenuAction = (action: 'report' | 'edit' | 'delete' | 'share') => {
    onMenuAction?.(id, action);
    setShowMenu(false);
  };

  const handleCommentClick = (reviewId: string) => {
    // Toggle replies visibility when clicking comment button
    if (onToggleShowReplies) {
      onToggleShowReplies(reviewId);
    } else {
      navigate(`/reviews/${reviewId}`);
      onCommentClick?.(reviewId);
    }
  };

  const isRepliesExpanded = expandedReplies?.has(id);
  const hasReplies = replies && replies.length > 0;

  return (
    <div className="bg-white border-b border-gray-100 p-2 transition-colors">
      {/* Review Header */}
      <div className="flex gap-2 mb-2">
        <div 
          className={`w-10 h-10 flex items-center justify-center text-white text-sm font-semibold rounded-full flex-shrink-0 ${getAvatarColor(user_name)}`}
        >
          {getInitials(user_name)}
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
              {formatDate(created_at)}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Follow
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
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
          {expandedReviews.has(id) ? comment : truncateText(comment)}
          {comment.length > 120 && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-gray-500 hover:text-gray-700 font-medium ml-1.5 transition-colors"
            >
              {expandedReviews.has(id) ? 'less' : 'more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section */}
      {media.length > 0 && (
        <div className="mb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.map((item, index) => (
              <div key={index} className="flex-shrink-0 relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-32 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                    onClick={() => window.open(item.url, '_blank')}
                  />
                ) : item.type === 'video' ? (
                  <div
                    className="w-32 h-32 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.alt}
                      className="w-full h-full object-cover"
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
            ))}
          </div>
        </div>
      )}

      {/* Engagement Section */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-8">
          <button
            onClick={() => console.log('Like clicked for review:', id)}
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
            onClick={() => handleCommentClick(id)}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>
        </div>

        {/* Rating on the right */}
        {rating && (
          <div className="flex-shrink-0">
            {renderStars(rating)}
          </div>
        )}
      </div>

      {/* Replies Section */}
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
              {replies.map((reply) => renderReplyItem(reply))}
            </div>
          )}
        </div>
      )}

      {/* Add Reply Input (Optional) */}
      {isRepliesExpanded && (
        <div className="mt-4 ml-12 pl-3">
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 flex items-center justify-center text-white text-xs font-semibold rounded-full flex-shrink-0 bg-gray-300`}
            >
              Y
            </div>
            <input
              type="text"
              placeholder="Add a reply..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Handle adding a reply
                  console.log('Add reply:', id);
                }
              }}
            />
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2">
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;