
import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

interface Reaction {
  id: string;
  icon?: React.ReactNode;
  emoji?: string;
  bg?: string;
  label: string;
}

interface ReactionButtonProps {
  onReactionChange?: (reactionId: string | null) => void;
  initialReaction?: string | null;
  className?: string;
  buttonClassName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  onReactionChange,
  initialReaction = null,
  className = '',
  buttonClassName = '',
  showLabel = true,
  size = 'md'
}) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(initialReaction);
  const [showReactions, setShowReactions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const reactionsRef = useRef<HTMLDivElement>(null);

  const reactions: Reaction[] = [
    { 
      id: 'like', 
      icon: <ThumbsUp className="h-5 w-5 text-white fill-white" />, 
      bg: 'bg-blue-500', 
      label: 'Like' 
    },
    { 
      id: 'love', 
      icon: <i className="fa-solid fa-heart text-white text-base"></i>, 
      bg: 'bg-red-500', 
      label: 'Love' 
    },
    { 
      id: 'haha', 
      emoji: '😆', 
      label: 'Haha' 
    },
    { 
      id: 'wow', 
      emoji: '😮', 
      label: 'Wow' 
    },
    { 
      id: 'sad', 
      emoji: '😢', 
      label: 'Sad' 
    },
    { 
      id: 'angry', 
      emoji: '😠', 
      label: 'Angry' 
    }
  ];

  const handlePressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowReactions(true);
    }, 500); // 500ms for long press
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // Only toggle like if it wasn't a long press
    if (!isLongPress.current && !showReactions) {
      const newReaction = selectedReaction ? null : 'like';
      setSelectedReaction(newReaction);
      onReactionChange?.(newReaction);
    }
  };

  const handleReactionSelect = (reaction: Reaction) => {
    setSelectedReaction(reaction.id);
    setShowReactions(false);
    onReactionChange?.(reaction.id);
  };

  // Handle clicks outside reactions overlay to dismiss it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showReactions]);

  const sizeClasses = {
    sm: { icon: 'h-3 w-3', text: 'text-xs', emoji: 'text-base', overlay: 'w-6 h-6' },
    md: { icon: 'h-4 w-4', text: 'text-xs', emoji: 'text-lg', overlay: 'w-8 h-8' },
    lg: { icon: 'h-5 w-5', text: 'text-sm', emoji: 'text-xl', overlay: 'w-10 h-10' }
  };

  const currentSize = sizeClasses[size];

  const getReactionDisplay = () => {
    if (!selectedReaction) {
      return {
        icon: <ThumbsUp className={`${currentSize.icon} text-gray-600 group-hover:text-gray-800`} />,
        label: 'Like',
        color: 'text-gray-600 group-hover:text-gray-800'
      };
    }

    const reaction = reactions.find(r => r.id === selectedReaction);
    if (!reaction) return null;

    if (reaction.emoji) {
      return {
        icon: <span className={currentSize.emoji}>{reaction.emoji}</span>,
        label: reaction.label,
        color: selectedReaction === 'love' ? 'text-red-500' : 
               selectedReaction === 'wow' ? 'text-yellow-500' : 
               selectedReaction === 'sad' ? 'text-yellow-600' : 'text-orange-500'
      };
    }

    if (selectedReaction === 'love') {
      return {
        icon: <i className={`fa-solid fa-heart ${currentSize.icon} text-red-500`}></i>,
        label: reaction.label,
        color: 'text-red-500'
      };
    }

    return {
      icon: <ThumbsUp className={`${currentSize.icon} text-blue-500`} />,
      label: reaction.label,
      color: 'text-blue-500'
    };
  };

  const display = getReactionDisplay();

  return (
    <div className={`relative ${className}`}>
      {/* Reactions Overlay */}
      {showReactions && (
        <div 
          ref={reactionsRef}
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex gap-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => handleReactionSelect(reaction)}
              className="hover:scale-125 transition-transform duration-200 flex flex-col items-center"
            >
              {reaction.icon ? (
                <div className={`${reaction.bg} rounded-full ${currentSize.overlay} flex items-center justify-center`}>
                  {reaction.icon}
                </div>
              ) : (
                <div className={`${currentSize.overlay} flex items-center justify-center`}>
                  <span className="text-3xl leading-none">{reaction.emoji}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className={`flex items-center justify-center gap-2 group transition-colors ${buttonClassName}`}
      >
        {display?.icon}
        {showLabel && display && (
          <span className={`${currentSize.text} font-medium ${display.color}`}>
            {display.label}
          </span>
        )}
      </button>
    </div>
  );
};

export default ReactionButton;
