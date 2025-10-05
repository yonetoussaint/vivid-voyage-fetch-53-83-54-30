
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BannerControlsProps {
  slidesCount: number;
  activeIndex: number;
  previousIndex: number | null;
  setActiveIndex: (index: number) => void;
  setPreviousIndex: (index: number | null) => void;
  progress: number;
}

export default function BannerControls({
  slidesCount,
  activeIndex,
  previousIndex,
  setActiveIndex,
  setPreviousIndex,
  progress
}: BannerControlsProps) {
  const isMobile = useIsMobile();

  const handleDotClick = (index: number) => {
    setPreviousIndex(activeIndex);
    setActiveIndex(index);
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

      {/* Animated Dots - Responsive positioning */}
      <div className="absolute left-0 right-0 flex justify-center gap-1.5 z-20" style={{ bottom: 'clamp(8px, 2%, 16px)' }}>
        {Array.from({ length: slidesCount }).map((_, index) => (
          <button
            key={index}
            className="relative rounded-full bg-gray-300 overflow-hidden"
            style={{ 
              height: 'clamp(3px, 0.8vh, 6px)',
              width: 'clamp(16px, 3vw, 24px)'
            }}
            onClick={() => handleDotClick(index)}
          >
            <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
            {activeIndex === index && (
              <div
                className="absolute inset-0 bg-orange-500 rounded-full origin-left"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.05s linear'
                }}
              ></div>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
