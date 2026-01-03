import React from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';

interface EngagementStatsProps {
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  className?: string;
  showIcon?: boolean;
}

export const EngagementStats: React.FC<EngagementStatsProps> = ({
  likeCount,
  commentCount,
  shareCount,
  className = '',
  showIcon = true
}) => {
  return (
    <div className={`flex items-center justify-between px-2 py-1 gap-3 ${className}`}>
      {/* Like count */}
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 rounded-full h-8">
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span className="text-xs text-gray-600 font-medium">
            {likeCount}
          </span>
        </div>
      </div>

      {/* Comment count */}
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 rounded-full h-8">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-gray-600 font-medium">
            {commentCount}
          </span>
        </div>
      </div>

      {/* Share count - only shown if provided */}
      {shareCount !== undefined && (
        <div className="flex-1">
          <div className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 rounded-full h-8">
            <Send className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">
              {shareCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};