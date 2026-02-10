import React from 'react';
import { Play, Heart, MessageCircle, CheckCircle, MoreHorizontal, Star } from 'lucide-react';
import { formatDate } from './DateUtils';
import { truncateText } from "@/hooks/customer-reviews.hooks";
import { useNavigate } from 'react-router-dom';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
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
  onToggleReadMore,
  onCommentClick,
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
            className="w-3.5 h-3.5"
            fill={star <= rating ? '#FBBF24' : 'none'}
            stroke={star <= rating ? '#FBBF24' : '#D1D5DB'}
            strokeWidth="1.5"
          />
        ))}
      </div>
    );
  };

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
    navigate(`/reviews/${reviewId}`);
    onCommentClick?.(reviewId);
  };

  return (
    <div className="bg-white border-b border-gray-100 px-3 py-3 transition-colors">
      {/* Compact Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className={`w-9 h-9 flex items-center justify-center text-white text-xs font-semibold rounded-full flex-shrink-0 ${getAvatarColor(user_name)}`}
          >
            {getInitials(user_name)}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 text-sm truncate block">
                {user_name || 'Anonymous'}
              </span>
              {verified_purchase && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="text-xs text-gray-500">
                {formatDate(created_at)}
              </div>
              {rating && (
                <div className="flex items-center gap-0.5">
                  {renderStars(rating)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap">
            Follow
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4.5 h-4.5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => handleMenuAction('share')}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Share review
                </button>
                <button
                  onClick={() => handleMenuAction('edit')}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit review
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleMenuAction('report')}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Report review
                </button>
                <button
                  onClick={() => handleMenuAction('delete')}
                  className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Comment - More compact */}
      <div className="text-gray-800 leading-relaxed mb-3 text-sm">
        <span>
          {expandedReviews.has(id) ? comment : truncateText(comment)}
          {comment.length > 100 && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-gray-500 hover:text-gray-700 font-medium ml-1.5 transition-colors text-sm"
            >
              {expandedReviews.has(id) ? 'less' : 'more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Section - Mobile optimized */}
      {media.length > 0 && (
        <div className="mb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-hide">
            {media.map((item, index) => (
              <div key={index} className="flex-shrink-0 relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-28 h-28 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                    onClick={() => window.open(item.url, '_blank')}
                  />
                ) : item.type === 'video' ? (
                  <div
                    className="w-28 h-28 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
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
                      <div className="bg-white rounded-full p-1.5">
                        <Play className="w-4 h-4 text-gray-900 fill-gray-900" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Section - Simplified */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button
            onClick={() => console.log('Like clicked for review:', id)}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 font-medium"
          >
            <Heart
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button
            onClick={() => handleCommentClick(id)}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>
        </div>

        {/* Optional: Show rating again if not shown in header for very compact view */}
        {!rating && (
          <div className="text-xs text-gray-500">
            {formatDate(created_at)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;