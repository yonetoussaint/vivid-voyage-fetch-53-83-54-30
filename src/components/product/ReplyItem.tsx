import { memo } from 'react';

export const ReplyItem = memo(({
  reply,
  reviewId,
  getAvatarColor,
  getInitials,
  formatDate,
  onLikeReply,
  onReplyToReply,
  onEditReply,
  onDeleteReply,
  onReportReply,
  currentUserId,
  isOwner = false,
}) => {
  const {
    id,
    user_name,
    comment,
    created_at,
    like_count = 0,
    isLiked = false,
  } = reply;

  const formattedDate = formatDate(created_at);
  const avatarColor = getAvatarColor(user_name);
  const initials = getInitials(user_name);

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
                onClick={() => onLikeReply?.(id, reviewId)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors group"
                aria-label={`Like this reply. ${like_count} likes`}
              >
                <svg
                  className={`w-4 h-4 transition-all ${
                    isLiked 
                      ? 'fill-red-500 stroke-red-500 scale-110' 
                      : 'fill-none stroke-current group-hover:scale-110'
                  }`}
                  strokeWidth={isLiked ? "2" : "2"}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {like_count > 0 && (
                  <span className={isLiked ? 'text-red-500 font-semibold' : ''}>
                    {like_count}
                  </span>
                )}
              </button>

              {/* Reply Button */}
              <button
                onClick={() => onReplyToReply?.(id, reviewId, user_name || '')}
                className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                aria-label={`Reply to ${user_name || 'this user'}`}
              >
                Reply
              </button>

              {/* Reply Menu */}
              <div className="relative">
                <button
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Reply options"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
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
export default ReplyItem;