import React from 'react';
import { Heart } from 'lucide-react';

interface EngagementStatsProps {
  likeCount: number;
  commentCount: number;
  className?: string;
}

export const EngagementStats: React.FC<EngagementStatsProps> = ({
  likeCount,
  commentCount,
  className = ''
}) => {
  return (
    <div className={`px-3 py-1.5 flex items-center gap-4 text-sm text-gray-600 ${className}`}>
      {/* Heart button with like count */}
      <div className="flex items-center gap-1">
        <Heart 
          className="w-4 h-4 text-red-500 fill-current cursor-pointer hover:scale-110 transition-transform" 
          aria-label="Like"
        />
        <span className="font-medium">{likeCount}</span>
      </div>
      
      {/* Comments count */}
      <div className="flex items-center gap-1">
        <span className="font-medium">{commentCount}</span>
        <span>comments</span>
      </div>
    </div>
  );
};