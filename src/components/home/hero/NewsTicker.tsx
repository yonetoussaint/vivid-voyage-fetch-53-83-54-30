import { useState, useEffect, useRef } from 'react';
import { AlertCircle, TrendingUp, Clock, Newspaper, ShoppingBag, Tag } from "lucide-react";

const newsItems = [
  { 
    id: 1, 
    icon: <AlertCircle className="w-3 h-3 text-white" />, 
    text: "EXTRA 10% OFF WITH CODE: SUMMER10",
    bgColor: "bg-gradient-to-r from-orange-500 to-red-500"
  },
  { 
    id: 2, 
    icon: <TrendingUp className="w-3 h-3 text-white" />, 
    text: "FREE SHIPPING ON ORDERS OVER ¥99",
    bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600"
  },
  { 
    id: 3, 
    icon: <Clock className="w-3 h-3 text-white" />, 
    text: "LIMITED TIME: BUY 2 GET 1 FREE",
    bgColor: "bg-gradient-to-r from-green-600 to-emerald-600"
  },
  { 
    id: 4, 
    icon: <Newspaper className="w-3 h-3 text-white" />, 
    text: "NEW SEASON ITEMS JUST ARRIVED",
    bgColor: "bg-gradient-to-r from-purple-600 to-pink-600"
  }
];

export default function NewsTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Create extended array for seamless loop
  const extendedItems = [...newsItems, ...newsItems];

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        // Reset to start seamlessly when reaching the duplicate section
        return next >= newsItems.length ? 0 : next;
      });
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div 
      className="news-ticker bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="relative overflow-hidden h-7 bg-black">
          {/* Slides Container */}
          <div 
            className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out`}
            style={{ 
              transform: `translateY(-${activeIndex * 28}px)`,
              height: `${extendedItems.length * 28}px`
            }}
          >
            {extendedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`h-7 flex items-center justify-center ${item.bgColor}`}
              >
                <div className="flex items-center gap-2 px-4">
                  <span>{item.icon}</span>
                  <span className="text-xs font-medium text-white whitespace-nowrap">
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
            <div 
              className="h-full bg-white/80 transition-all duration-3000"
              style={{ 
                width: isPaused ? '100%' : '0%',
                animation: isPaused ? 'none' : 'progress 3s linear forwards'
              }}
            />
          </div>

          {/* Slide Dots */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
            {newsItems.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `
      }} />
    </div>
  );
}