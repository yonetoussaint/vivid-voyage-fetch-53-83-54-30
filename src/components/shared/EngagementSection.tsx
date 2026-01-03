import React, { useState } from 'react';
import { EngagementStats } from './EngagementStats';

interface EngagementSectionProps {
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

export const EngagementSection: React.FC<EngagementSectionProps> = ({
  likeCount,
  commentCount,
  shareCount,
}) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  return (
    <div className="w-full">
      <EngagementStats
        likeCount={currentLikeCount}
        commentCount={commentCount}
        shareCount={shareCount}
      />
    </div>
  );
};