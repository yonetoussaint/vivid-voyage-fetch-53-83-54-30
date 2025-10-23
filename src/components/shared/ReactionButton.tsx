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
  const [lottieLoaded, setLottieLoaded] = useState(false);

  const reactions: Reaction[] = [
    { 
      id: 'like', 
      icon: <ThumbsUp className="h-5 w-5 text-white fill-white" />, 
      bg: 'bg-blue-500', 
      label: 'Like' 
    },
    { 
      id: 'love', 
      icon: <Heart className="h-5 w-5 text-white fill-white" />, 
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
    // Check if Lottie is already loaded
    if (typeof window !== 'undefined' && (window as any).lottie) {
      setLottieLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    script.async = true;
    script.onload = () => setLottieLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (showReactions) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      const body = document.body;

      // Prevent scrolling
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.overflow = 'hidden';

      return () => {
        // Restore scrolling
        const scrollY = parseInt(body.style.top || '0') * -1;
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showReactions]);

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

    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      // Find all reaction container elements
      const reactionContainers = document.querySelectorAll('[data-reaction-container]');
      let foundReaction: string | null = null;

      reactionContainers.forEach((container) => {
        const rect = container.getBoundingClientRect();

        // Create a larger invisible hit area below the emoji container
        // This allows dragging below the emojis without finger blocking the view
        const paddingX = 20;
        const paddingTop = 10;
        const paddingBottom = 80; // Large padding below for finger clearance

        if (
          clientX >= rect.left - paddingX &&
          clientX <= rect.right + paddingX &&
          clientY >= rect.top - paddingTop &&
          clientY <= rect.bottom + paddingBottom
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
    });
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
        // Defer the close check to allow backdrop drag handlers to set isDragging first
        requestAnimationFrame(() => {
          if (!isDragging.current) {
            setShowReactions(false);
            isLongPress.current = false;
            setHoveredReaction(null);
            setAnimatedReaction(null);
          }
        });
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleGlobalDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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

  // Render Lottie player for emoji reactions
  const renderLottieAnimation = (reaction: Reaction) => {
    if (!lottieLoaded || !reaction.emojiUnicode) {
      // Fallback to static emoji while Lottie loads
      return (
        <span 
          className="text-3xl leading-none" 
          data-reaction-id={reaction.id}
          style={{ pointerEvents: 'none' }}
        >
          {reaction.emoji}
        </span>
      );
    }

    return (
      <lottie-player
        autoplay
        loop
        mode="normal"
        src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${reaction.emojiUnicode}/lottie.json`}
        style={{ width: '48px', height: '48px', pointerEvents: 'none' }}
        data-reaction-id={reaction.id}
      />
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Glassmorphic Backdrop */}
      {showReactions && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          style={{ margin: 0 }}
          onMouseDown={(e) => {
            e.preventDefault();
            isDragging.current = true;
            dragStartPosition.current = { x: e.clientX, y: e.clientY };
            startGlobalDrag();
            // Immediately start tracking for reactions
            handleGlobalDragMove(e.nativeEvent);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            isDragging.current = true;
            const touch = e.touches[0];
            dragStartPosition.current = { x: touch.clientX, y: touch.clientY };
            startGlobalDrag();
            // Immediately start tracking for reactions
            handleGlobalDragMove(e.nativeEvent);
          }}
        />
      )}

      {/* Reactions Overlay with invisible extended hit area */}
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          {/* Invisible extended hit area below the emojis */}
          <div 
            className="absolute -bottom-20 left-0 right-0 h-20 bg-transparent"
            style={{ pointerEvents: 'none' }}
          />

          {/* Visible emoji container with ultra-smooth animation */}
          <div
            ref={reactionsRef}
            className="bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex gap-3"
            style={{
              animation: 'slideUpFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
              transformOrigin: 'bottom center'
            }}
            onMouseLeave={() => {
              setHoveredReaction(null);
              setAnimatedReaction(null);
            }}
          >
            {reactions.map((reaction, index) => {
              const isHovered = hoveredReaction === reaction.id;
              const isIconReaction = !!reaction.icon;

              return (
                <div 
                  key={reaction.id} 
                  className="relative flex flex-col items-center"
                  data-reaction-container={reaction.id}
                  style={{
                    animation: `emojiSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.05}s both`,
                    transformOrigin: 'bottom center'
                  }}
                >
                  {/* Tooltip outside scaled element */}
                  {isHovered && (
                    <div className="absolute left-1/2 bg-gray-900 text-white text-xs font-medium 
py-1 px-2 rounded-md shadow-md whitespace-nowrap z-[60] pointer-events-none"
                      style={{
                        animation: 'fadeInUp 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                        bottom: 'calc(100% + 90px)',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {reaction.label}
                    </div>
                  )}

                  {/* Scaled wrapper holds emoji only */}
                  <div
                    data-reaction-id={reaction.id}
                    className="relative flex flex-col items-center cursor-pointer"
                    onMouseEnter={() => handleReactionMouseEnter(reaction.id)}
                    onMouseLeave={handleReactionMouseLeave}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactionSelect(reaction);
                    }}
                    style={{
                      transform: isHovered ? 'scale(2.2) translateY(-25px)' : 'scale(1) translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease-out',
                      zIndex: isHovered ? 50 : 1,
                      filter: isHovered ? 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.15))' : 'none'
                    }}
                  >
                    {/* Emoji/icon content */}
                    <div 
                      className={`${currentSize.overlay} flex items-center justify-center relative`}
                      data-reaction-id={reaction.id}
                    >
                      {isHovered && reaction.emojiUnicode ? (
                        renderLottieAnimation(reaction)
                      ) : reaction.icon ? (
                        <div 
                          className={`
                            ${reaction.bg} 
                            rounded-full 
                            ${currentSize.overlay} 
                            flex 
                            items-center 
                            justify-center 
                            ${isHovered ? 'animate-bounce' : ''}
                          `}
                          style={{ 
                            animationDuration: '0.6s',
                            animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                        >
                          {React.cloneElement(reaction.icon as React.ReactElement, { 
                            className: `h-5 w-5 text-white fill-white transition-transform duration-300 ease-out`
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

      {/* Ultra-smooth CSS animations */}
      <style>{`
        @keyframes slideUpFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes emojiSlideIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          60% {
            opacity: 1;
            transform: translateY(-8px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default ReactionButton;