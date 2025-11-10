import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BannerControlsProps {
  slidesCount: number;
  activeIndex: number;
  previousIndex: number | null;
  setActiveIndex: (index: number) => void;
  setPreviousIndex: (index: number | null) => void;
  progress: number;
  position?: 'top' | 'bottom'; // New prop for positioning
}

export default function BannerControls({
  slidesCount,
  activeIndex,
  previousIndex,
  setActiveIndex,
  setPreviousIndex,
  progress,
  position = 'bottom' // Default to bottom for backward compatibility
}: BannerControlsProps) {
  const isMobile = useIsMobile();

  const handleDotClick = (index: number) => {
    setPreviousIndex(activeIndex);
    setActiveIndex(index);
  };

  // Position styles
  const positionStyles = {
    top: "top-1", // Minimal padding at top
    bottom: "bottom-4" // Original bottom positioning
  };

  return (
    <>
      {/* Navigation Controls */}
      {!isMobile && (
        <>
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white hidden md:flex items-center justify-center z-20"
            onClick={() => {
              setPreviousIndex(activeIndex);
              setActiveIndex((activeIndex - 1 + slidesCount) % slidesCount);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white hidden md:flex items-center justify-center z-20"
            onClick={() => {
              setPreviousIndex(activeIndex);
              setActiveIndex((activeIndex + 1) % slidesCount);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* WhatsApp-style Progress Bars - Position optional */}
      <div 
        className={`absolute left-4 right-4 flex justify-between gap-2 z-20 ${positionStyles[position]}`}
      >
        {Array.from({ length: slidesCount }).map((_, index) => (
          <button
            key={index}
            className="flex-1 relative rounded-full bg-white/30 overflow-hidden backdrop-blur-sm transition-all duration-200 hover:bg-white/40"
            style={{ 
              height: position === 'top' ? '2px' : 'clamp(3px, 0.6vh, 4px)',
              minWidth: '0'
            }}
            onClick={() => handleDotClick(index)}
          >
            {/* Background track - fully transparent */}
            <div className="absolute inset-0 bg-transparent rounded-full"></div>
            
            {/* Progress fill - white with slight transparency */}
            {activeIndex === index ? (
              <div
                className="absolute inset-0 bg-white/90 rounded-full origin-left"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.05s linear'
                }}
              ></div>
            ) : activeIndex > index ? (
              /* Completed state - full white */
              <div className="absolute inset-0 bg-white/90 rounded-full"></div>
            ) : (
              /* Upcoming state - transparent */
              <div className="absolute inset-0 bg-transparent rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </>
  );
}