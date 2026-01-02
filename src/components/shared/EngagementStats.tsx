import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

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
    <div className={`px-3 py-1.5 flex items-center gap-6 text-sm text-gray-600 ${className}`}>
      {/* Heart button with like count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Heart 
            className="w-4 h-4 text-red-500 fill-current cursor-pointer hover:scale-110 transition-transform" 
            aria-label="Like"
          />
          <span className="font-medium">{likeCount}</span>
        </div>
      </div>
      
      {/* Comments count with icon */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <MessageCircle 
            className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110 transition-transform" 
            aria-label="Comments"
          />
          <span className="font-medium">{commentCount}</span>
          <span>comments</span>
        </div>
      </div>
      
      {/* Optional shares count */}
      {shareCount !== undefined && (
        <div className="flex items-center gap-1">
          <span className="font-medium">{shareCount}</span>
          <span>shares</span>
        </div>
      )}
    </div>
  );
};