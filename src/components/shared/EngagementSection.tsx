import React, { useState } from 'react';
import { EngagementStats } from './EngagementStats';
import { SocialButtons } from './SocialButtons';

interface EngagementSectionProps {
  likeCount: number;
  commentCount: number;
  shareCount: number;
  onComment: () => void;
  onShare: () => void;
}

export const EngagementSection: React.FC<EngagementSectionProps> = ({
  likeCount,
  commentCount,
  shareCount,
  onComment,
  onShare
}) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [hasReacted, setHasReacted] = useState(false);

  const handleReactionChange = (reactionId: string | null) => {
    const hadReaction = hasReacted;
    setHasReacted(reactionId !== null);

    if (!hadReaction && reactionId) {
      setCurrentLikeCount(prev => prev + 1);
    } else if (hadReaction && !reactionId) {
      setCurrentLikeCount(prev => prev - 1);
    }
  };

  return (
    <div className="w-full">
      <EngagementStats
        likeCount={currentLikeCount}
        commentCount={commentCount}
        shareCount={shareCount}
      />
      
      <SocialButtons
        onReactionChange={handleReactionChange}
        onComment={onComment}
        onShare={onShare}
      />
    </div>
  );
};