import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, Heart } from 'lucide-react';

interface Reaction {
  id: string;
  icon?: React.ReactNode;
  emoji?: string;
  emojiUnicode?: string;
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
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [animatedReaction, setAnimatedReaction] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const reactionsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);

  const reactions: Reaction[] = [
    { 
      id: 'like', 
      icon: <ThumbsUp className="h-5 w-5 text-white fill-white" />, 
      emojiUnicode: '1f44d',
      bg: 'bg-blue-500', 
      label: 'Like' 
    },
    { 
      id: 'love', 
      icon: <Heart className="h-5 w-5 text-white fill-white" />, 
      emojiUnicode: '1f60d',
      bg: 'bg-red-500', 
      label: 'Love' 
    },
    { 
      id: 'care', 
      emoji: '🥰',
      emojiUnicode: '1f970',
      label: 'Care' 
    },
    { 
      id: 'haha', 
      emoji: '😆',
      emojiUnicode: '1f606',
      label: 'Haha' 
    },
    { 
      id: 'wow', 
      emoji: '😮',
      emojiUnicode: '1f62e',
      label: 'Wow' 
    },
    { 
      id: 'sad', 
      emoji: '😢',
      emojiUnicode: '1f622',
      label: 'Sad' 
    },
    { 
      id: 'angry', 
      emoji: '😠',
      emojiUnicode: '1f620',
      label: 'Angry' 
    }
  ];

  // Load Lottie player script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handlePressStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    isLongPress.current = false;
    isDragging.current = false;

    // Store the starting position for drag detection
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    dragStartPosition.current = { x: clientX, y: clientY };

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowReactions(true);
      isDragging.current = true;
      startGlobalDrag();
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Only handle drag end if we're actually in drag mode
    if (isDragging.current) {
      handleDragEnd();
    } else if (isLongPress.current) {
      // If long press was triggered but not dragging yet, keep overlay open
      isLongPress.current = false;
    }

    dragStartPosition.current = null;
  };

  const handleGlobalDragMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    // Find all reaction container elements (the parent divs with data-reaction-id)
    const reactionContainers = document.querySelectorAll('[data-reaction-container]');
    let foundReaction: string | null = null;

    reactionContainers.forEach((container) => {
      const rect = container.getBoundingClientRect();

      // Add some padding to make it easier to select
      const padding = 10;
      if (
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding
      ) {
        foundReaction = container.getAttribute('data-reaction-container');
      }
    });

    if (foundReaction && foundReaction !== hoveredReaction) {
      setHoveredReaction(foundReaction);
      setAnimatedReaction(foundReaction);
    } else if (!foundReaction && hoveredReaction) {
      setHoveredReaction(null);
      setAnimatedReaction(null);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;

    if (hoveredReaction) {
      const reaction = reactions.find(r => r.id === hoveredReaction);
      if (reaction) {
        handleReactionSelect(reaction);
      }
    } else {
      // If released outside reactions, just close the overlay
      setShowReactions(false);
    }

    isDragging.current = false;
    setHoveredReaction(null);
    setAnimatedReaction(null);

    // Clean up global event listeners
    document.removeEventListener('mousemove', handleGlobalDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleGlobalDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  };

  const startGlobalDrag = () => {
    isDragging.current = true;

    // Add global event listeners for smooth dragging
    document.addEventListener('mousemove', handleGlobalDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd, { passive: false });
    document.addEventListener('touchmove', handleGlobalDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd, { passive: false });
  };

  const handleReactionMouseEnter = (reactionId: string) => {
    setHoveredReaction(reactionId);
    setAnimatedReaction(reactionId);
  };

  const handleReactionMouseLeave = () => {
    setHoveredReaction(null);
    setAnimatedReaction(null);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }

    if (selectedReaction) {
      const newReaction = null;
      setSelectedReaction(newReaction);
      onReactionChange?.(newReaction);
    } else {
      const newReaction = 'like';
      setSelectedReaction(newReaction);
      onReactionChange?.(newReaction);
    }
  };

  const handleReactionSelect = (reaction: Reaction) => {
    if (selectedReaction === reaction.id) {
      const newReaction = null;
      setSelectedReaction(newReaction);
      onReactionChange?.(newReaction);
    } else {
      setSelectedReaction(reaction.id);
      onReactionChange?.(reaction.id);
    }
    setShowReactions(false);
    isLongPress.current = false;
    isDragging.current = false;
    setHoveredReaction(null);
    setAnimatedReaction(null);
  };

  // Handle clicks outside reactions overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        if (!isDragging.current) {
          setShowReactions(false);
          isLongPress.current = false;
          setHoveredReaction(null);
          setAnimatedReaction(null);
        }
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);

      // Clean up any remaining global drag listeners
      document.removeEventListener('mousemove', handleGlobalDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleGlobalDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [showReactions]);

  // Update internal state when initialReaction changes
  useEffect(() => {
    setSelectedReaction(initialReaction);
  }, [initialReaction]);

  const sizeClasses = {
    sm: { icon: 'h-3 w-3', text: 'text-xs', emoji: 'text-base', overlay: 'w-6 h-6', lottie: 'w-12 h-12' },
    md: { icon: 'h-4 w-4', text: 'text-xs', emoji: 'text-lg', overlay: 'w-8 h-8', lottie: 'w-16 h-16' },
    lg: { icon: 'h-5 w-5', text: 'text-sm', emoji: 'text-xl', overlay: 'w-10 h-10', lottie: 'w-20 h-20' }
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
               selectedReaction === 'care' ? 'text-pink-500' :
               selectedReaction === 'wow' ? 'text-yellow-500' : 
               selectedReaction === 'sad' ? 'text-yellow-600' : 'text-orange-500'
      };
    }

    if (selectedReaction === 'love') {
      return {
        icon: <Heart className={`${currentSize.icon} text-red-500 fill-red-500`} />,
        label: reaction.label,
        color: 'text-red-500'
      };
    }

    return {
      icon: <ThumbsUp className={`${currentSize.icon} text-blue-500 fill-blue-500`} />,
      label: reaction.label,
      color: 'text-blue-500'
    };
  };

  const display = getReactionDisplay();

  return (
    <div className={`relative ${className}`}>
      {/* Glassmorphic Backdrop */}
      {showReactions && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          style={{ margin: 0 }}
          onMouseMove={(e) => {
            if (isDragging.current) {
              handleGlobalDragMove(e.nativeEvent);
            }
          }}
          onTouchMove={(e) => {
            if (isDragging.current) {
              handleGlobalDragMove(e.nativeEvent);
            }
          }}
        />
      )}

      {/* Reactions Overlay */}
      {showReactions && (
        <div
          ref={reactionsRef}
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex gap-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onMouseLeave={() => {
            setHoveredReaction(null);
            setAnimatedReaction(null);
          }}
        >
          {reactions.map((reaction) => {
            const isHovered = hoveredReaction === reaction.id;
            const scale = isHovered ? 'scale-150' : 'scale-100';
            const transition = 'transition-all duration-150 ease-out';

            return (
              <div 
                key={reaction.id} 
                className="relative flex flex-col items-center"
                data-reaction-container={reaction.id}
              >
                {/* Floating label */}
                {isHovered && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-1 z-50 whitespace-nowrap">
                    <div className="text-xs text-gray-700 font-medium text-center">
                      {reaction.label}
                    </div>
                  </div>
                )}

                {/* Main emoji/icon */}
                <div
                  data-reaction-id={reaction.id}
                  className={`flex flex-col items-center cursor-pointer ${transition} ${scale}`}
                  onMouseEnter={() => handleReactionMouseEnter(reaction.id)}
                  onMouseLeave={handleReactionMouseLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactionSelect(reaction);
                  }}
                >
                  <div 
                    className={`${currentSize.overlay} flex items-center justify-center`}
                    data-reaction-id={reaction.id}
                  >
                    {isHovered && reaction.emojiUnicode ? (
                      <lottie-player
                        autoplay
                        loop
                        mode="normal"
                        src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${reaction.emojiUnicode}/lottie.json`}
                        style={{ width: '48px', height: '48px', pointerEvents: 'none' }}
                        data-reaction-id={reaction.id}
                      />
                    ) : reaction.icon ? (
                      <div 
                        className={`${reaction.bg} rounded-full ${currentSize.overlay} flex items-center justify-center`}
                        data-reaction-id={reaction.id}
                      >
                        {React.cloneElement(reaction.icon as React.ReactElement, { 
                          'data-reaction-id': reaction.id 
                        })}
                      </div>
                    ) : (
                      <span 
                        className="text-3xl leading-none" 
                        data-reaction-id={reaction.id}
                        style={{ pointerEvents: 'none' }}
                      >
                        {reaction.emoji}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onClick={handleClick}
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