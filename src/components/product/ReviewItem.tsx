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
  onToggleReadMore: (reviewId: string) => void;
  onCommentClick?: (reviewId: string) => void;
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

  const handleCommentClick = () => {
    navigate(`/reviews/${id}`);
    onCommentClick?.(id);
  };

  return (
    <div className="bg-white border-b border-gray-100 p-3 sm:p-4">
      {/* Compact Header */}
      <div className="flex gap-3 mb-3">
        {/* Avatar */}
        <div 
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0 ${getAvatarColor(user_name)}`}
        >
          {getInitials(user_name)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Top Row: Name, Verification, Date, Menu */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="font-semibold text-gray-900 text-sm sm:text-[15px] truncate">
                {user_name || 'Anonymous'}
              </span>
              {verified_purchase && (
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDate(created_at)}
              </span>
            </div>
            
            {/* Rating & Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {rating && (
                <div className="hidden xs:block">
                  {renderStars(rating)}
                </div>
              )}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 text-xs sm:text-sm">
                    <button
                      onClick={() => handleMenuAction('share')}
                      className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleMenuAction('edit')}
                      className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => handleMenuAction('report')}
                      className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      Report
                    </button>
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rating (mobile only) */}
          {rating && (
            <div className="xs:hidden mb-2">
              {renderStars(rating)}
            </div>
          )}
        </div>
      </div>

      {/* Review Comment */}
      <div className="text-gray-800 leading-relaxed mb-3 text-sm sm:text-[15px]">
        <span>
          {expandedReviews.has(id) ? comment : truncateText(comment, 100)}
          {comment.length > 100 && (
            <button
              onClick={() => onToggleReadMore(id)}
              className="text-blue-600 hover:text-blue-800 font-medium ml-1.5 transition-colors"
            >
              {expandedReviews.has(id) ? 'Show less' : 'Read more'}
            </button>
          )}
        </span>
      </div>

      {/* Media Grid - Responsive */}
      {media.length > 0 && (
        <div className="mb-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {media.slice(0, 4).map((item, index) => (
              <div 
                key={index} 
                className={`aspect-square ${media.length === 1 ? 'col-span-3 sm:col-span-2' : ''}`}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity rounded"
                    onClick={() => window.open(item.url, '_blank')}
                  />
                ) : (
                  <div
                    className="w-full h-full relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded bg-black"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.alt}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5 sm:p-2">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {media.length > 4 && (
              <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-600 text-sm font-medium">
                +{media.length - 4}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engagement Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button
            onClick={() => console.log('Like clicked for review:', id)}
            className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 text-sm"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button
            onClick={handleCommentClick}
            className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>
        </div>

        {/* Follow Button */}
        <button className="px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          Follow
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;