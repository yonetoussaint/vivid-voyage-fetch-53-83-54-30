import React from 'react';
import { cn } from "@/lib/utils";

interface AutoScrollIndicatorProps {
  totalItems: number;
  currentIndex: number;
  autoScrollEnabled: boolean;
  autoScrollProgress: number;
  onDotClick: (index: number) => void;
  className?: string;
}

export const AutoScrollIndicator: React.FC<AutoScrollIndicatorProps> = ({
  totalItems,
  currentIndex,
  autoScrollEnabled,
  autoScrollProgress,
  onDotClick,
  className
}) => {
  if (totalItems <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1.5 py-2", className)}>
      {Array.from({ length: totalItems }).map((_, index) => {
        const isActive = index === currentIndex;
        const progress = isActive && autoScrollEnabled ? autoScrollProgress : 0;

        return (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={cn(
              "relative flex-1 max-w-16 h-1.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden",
              isActive 
                ? "bg-primary/30" 
                : "bg-gray-300/60 hover:bg-gray-400/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Progress bar animation for active dot when auto-scroll is enabled */}
            {isActive && autoScrollEnabled && (
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-50 ease-linear"
                style={{ 
                  width: `${progress}%`,
                }}
              />
            )}

            {/* Static fill for active dot when not auto-scrolling */}
            {isActive && !autoScrollEnabled && (
              <div className="absolute top-0 left-0 h-full w-full bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};