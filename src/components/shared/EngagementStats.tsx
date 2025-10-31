import React from 'react';
import StackedReactionIcons from './StackedReactionIcons';

interface EngagementStatsProps {
  likeCount: number;
  commentCount: number;
  shareCount: number;
  className?: string;
}

export const EngagementStats: React.FC<EngagementStatsProps> = ({
  likeCount,
  commentCount,
  shareCount,
  className = ''
}) => {
  return (
    <div className={`px-3 py-1.5 flex items-center justify-between ${className}`}>
      <StackedReactionIcons 
        count={likeCount} 
        size="md" 
        className="gap-1 text-xs text-gray-500" 
      />
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{commentCount} comments</span>
        <span>{shareCount} shares</span>
      </div>
    </div>
  );
};