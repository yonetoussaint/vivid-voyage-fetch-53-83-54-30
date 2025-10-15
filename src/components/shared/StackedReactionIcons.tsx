import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface StackedReactionIconsProps {
  count?: number | string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  reactions?: {
    like?: number;
    love?: number;
    haha?: number;
  };
}

const StackedReactionIcons: React.FC<StackedReactionIconsProps> = ({ 
  count, 
  showCount = true,
  size = 'md',
  className = '',
  reactions
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-[18px] h-[18px]',
      icon: 'h-2.5 w-2.5',
      emoji: 'text-base leading-none',
      text: 'text-[10px]'
    },
    md: {
      container: 'w-5 h-5',
      icon: 'h-3 w-3',
      emoji: 'text-lg leading-none',
      text: 'text-xs'
    },
    lg: {
      container: 'w-6 h-6',
      icon: 'h-4 w-4',
      emoji: 'text-xl leading-none',
      text: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size];

  // Determine which icons to show
  const showLike = reactions ? (reactions.like || 0) > 0 : true;
  const showLove = reactions ? (reactions.love || 0) > 0 : true;
  const showHaha = reactions ? (reactions.haha || 0) > 0 : true;

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center -space-x-1">
        {showLike && (
          <div className={`bg-blue-500 rounded-full ${currentSize.container} flex items-center justify-center border border-white z-30`}>
            <ThumbsUp className={`${currentSize.icon} text-white fill-white`} />
          </div>
        )}
        {showLove && (
          <div className={`bg-red-500 rounded-full ${currentSize.container} flex items-center justify-center border border-white z-20`}>
            <i className={`fa-solid fa-heart text-white ${currentSize.icon}`}></i>
          </div>
        )}
        {showHaha && (
          <div
            className={`bg-yellow-400 rounded-full ${currentSize.container} flex items-center justify-center border border-white z-10`}
          >
            <span className={`${currentSize.emoji}`}>😆</span>
          </div>
        )}
      </div>
      {showCount && count !== undefined && (
        <span className={`${currentSize.text} ml-1 text-gray-500`}>{count}</span>
      )}
    </div>
  );
};

export default StackedReactionIcons;