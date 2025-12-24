import { useState, useEffect, useRef } from 'react';
import { AlertCircle, TrendingUp, Clock, Newspaper, ShoppingBag, Tag, Percent, Award } from "lucide-react";

// News items with different backgrounds and colors
const newsItems = [
  { 
    id: 1, 
    icon: <AlertCircle className="w-4 h-4" />, 
    text: "EXTRA 10% OFF WITH CODE: SUMMER10", 
    bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 2, 
    icon: <TrendingUp className="w-4 h-4" />, 
    text: "FREE SHIPPING ON ORDERS OVER ¥99", 
    bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 3, 
    icon: <Clock className="w-4 h-4" />, 
    text: "LIMITED TIME: BUY 2 GET 1 FREE", 
    bgColor: "bg-gradient-to-r from-green-600 to-emerald-600",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 4, 
    icon: <Newspaper className="w-4 h-4" />, 
    text: "NEW SEASON ITEMS JUST ARRIVED", 
    bgColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 5, 
    icon: <ShoppingBag className="w-4 h-4" />, 
    text: "FLASH SALE: 50% OFF SELECTED ITEMS", 
    bgColor: "bg-gradient-to-r from-red-600 to-orange-600",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 6, 
    icon: <Tag className="w-4 h-4" />, 
    text: "EXCLUSIVE APP-ONLY DEALS", 
    bgColor: "bg-gradient-to-r from-indigo-600 to-blue-600",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 7, 
    icon: <Percent className="w-4 h-4" />, 
    text: "DAILY DEALS UPDATED EVERY HOUR", 
    bgColor: "bg-gradient-to-r from-teal-600 to-cyan-600",
    textColor: "text-white",
    iconColor: "text-white"
  },
  { 
    id: 8, 
    icon: <Award className="w-4 h-4" />, 
    text: "VIP MEMBERS GET EXTRA 15% OFF", 
    bgColor: "bg-gradient-to-r from-amber-600 to-yellow-600",
    textColor: "text-white",
    iconColor: "text-white"
  }
];

export default function NewsTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const slideDuration = 3000; // 3 seconds per slide
  const transitionDuration = 500; // 0.5 seconds transition

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % newsItems.length);
      setProgress(0);
      setIsTransitioning(false);
    }, transitionDuration);
  };

  useEffect(() => {
    if (isPaused || isTransitioning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    // Progress bar animation
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (slideDuration / 50));
      });
    }, 50);

    // Slide transition
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, slideDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeIndex, isPaused, isTransitioning]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setProgress(0);
      setIsTransitioning(false);
    }, transitionDuration);
  };

  const currentItem = newsItems[activeIndex];
  const nextItem = newsItems[(activeIndex + 1) % newsItems.length];

  return (
    <div 
      className="relative overflow-hidden h-14 bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Current Slide */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isTransitioning ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        } ${currentItem.bgColor}`}
      >
        <div className="flex items-center gap-3 px-4">
          <div className={`${currentItem.iconColor}`}>
            {currentItem.icon}
          </div>
          <span className={`text-sm font-bold ${currentItem.textColor}`}>
            {currentItem.text}
          </span>
        </div>
      </div>

      {/* Next Slide (coming up) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isTransitioning ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } ${nextItem.bgColor}`}
      >
        <div className="flex items-center gap-3 px-4">
          <div className={`${nextItem.iconColor}`}>
            {nextItem.icon}
          </div>
          <span className={`text-sm font-bold ${nextItem.textColor}`}>
            {nextItem.text}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-white/80 transition-all duration-50"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-white scale-125' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause/Play Indicator */}
      <div className="absolute top-1 right-1">
        <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-green-400' : 'bg-white/60'}`} />
      </div>
    </div>
  );
}