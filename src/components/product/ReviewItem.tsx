import { memo } from 'react';

export const ReviewItem = memo(({
  review,
  isExpanded = false,
  onToggleExpand,
  onLike,
  onReply,
  onShare,
  onEdit,
  onDelete,
  onReport,
  currentUserId,
  replies = [],
  onLikeReply,
  onReplyToReply,
  onEditReply,
  onDeleteReply,
  onReportReply,
  onToggleShowMoreReplies,
  isRepliesExpanded = false,
  maxVisibleReplies = 3,
  getAvatarColor,
  getInitials,
  formatDate,
  renderStars,
  ReplyItemComponent,
}) => {
  const {
    id,
    user_name,
    rating,
    title,
    comment,
    created_at,
    verified_purchase,
    like_count = 0,
    comment_count = 0,
    isLiked = false,
    user_id,
  } = review;

  const isOwner = currentUserId === user_id;
  const hasReplies = replies && replies.length > 0;
  const visibleReplies = isRepliesExpanded ? replies : replies.slice(0, maxVisibleReplies);
  const hasMoreReplies = replies.length > maxVisibleReplies;

  const formattedDate = formatDate(created_at);
  const avatarColor = getAvatarColor(user_name);
  const initials = getInitials(user_name);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div 
            className={`w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full flex-shrink-0 ${avatarColor}`}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                {user_name}
              </span>
              {verified_purchase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {renderStars(rating)}
              <span>•</span>
              <time dateTime={created_at}>{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => onToggleExpand?.()}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Review options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      {title && (
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      )}

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{comment}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <button
          onClick={() => onLike?.(id)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors group"
          aria-label={`${isLiked ? 'Unlike' : 'Like'} this review. ${like_count} likes`}
        >
          <svg
            className={`w-5 h-5 transition-all ${
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

        <button
          onClick={() => onReply?.(id, user_name)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
          aria-label={`Reply to this review. ${comment_count} comments`}
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {comment_count > 0 && <span>{comment_count}</span>}
        </button>

        <button
          onClick={() => onShare?.(id)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors group"
          aria-label="Share this review"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* Replies Section */}
      {hasReplies && (
        <div className="mt-3">
          {onToggleShowMoreReplies && (
            <button
              onClick={onToggleShowMoreReplies}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium mb-2 transition-colors"
              aria-expanded={isRepliesExpanded}
            >
              {isRepliesExpanded ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {isRepliesExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {isRepliesExpanded && (
            <div className="space-y-3">
              {visibleReplies.map(reply => (
                <ReplyItemComponent
                  key={reply.id}
                  reply={{
                    id: reply.id,
                    user_id: reply.user_id,
                    user_name: reply.user_name,
                    comment: reply.reply_text,
                    created_at: reply.created_at,
                    like_count: reply.like_count,
                    isLiked: reply.isLiked,
                  }}
                  reviewId={id}
                  getAvatarColor={getAvatarColor}
                  getInitials={getInitials}
                  onLikeReply={onLikeReply}
                  onReplyToReply={onReplyToReply}
                  onEditReply={onEditReply}
                  onDeleteReply={onDeleteReply}
                  onReportReply={onReportReply}
                  currentUserId={currentUserId}
                  isOwner={currentUserId === reply.user_id}
                />
              ))}
              {hasMoreReplies && (
                <button
                  onClick={onToggleShowMoreReplies}
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

ReviewItem.displayName = 'ReviewItem';
export default ReviewItem;