import { useState } from 'react';

// News items with only black background
const newsItems = [
  { 
    id: 1, 
    text: "EXTRA 10% OFF WITH CODE: SUMMER10"
  },
  { 
    id: 2, 
    text: "FREE SHIPPING ON ORDERS OVER ¥99"
  },
  { 
    id: 3, 
    text: "LIMITED TIME: BUY 2 GET 1 FREE"
  },
  { 
    id: 4, 
    text: "NEW SEASON ITEMS JUST ARRIVED"
  },
  { 
    id: 5, 
    text: "FLASH SALE: 50% OFF SELECTED ITEMS"
  },
  { 
    id: 6, 
    text: "EXCLUSIVE APP-ONLY DEALS"
  },
  { 
    id: 7, 
    text: "VIP MEMBERS GET EXTRA 15% OFF"
  },
  { 
    id: 8, 
    text: "FREE RETURNS WITHIN 30 DAYS"
  }
];

export default function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false);

  // Create multiple copies for truly endless scrolling
  const newsRepeats = Array(5).fill(newsItems).flat();

  return (
    <div className="news-ticker bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div 
          className="relative overflow-hidden h-7 bg-black"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex items-center h-7 whitespace-nowrap ${
              isPaused ? '' : 'animate-scroll'
            }`}
            style={{ width: 'max-content' }}
          >
            {newsRepeats.map((item, index) => (
              <div key={`item-${index}`} className="flex items-center flex-shrink-0">
                {/* Item with black background */}
                <div className="flex items-center px-6 h-7 bg-black">
                  <span className="text-xs font-medium text-white">
                    {item.text}
                  </span>
                </div>
                
                {/* Full-height vertical separator bar */}
                <div className="w-px h-full bg-white/30 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-25%);
            }
          }
          
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .animate-scroll {
              animation: none;
            }
          }
        `
      }} />
    </div>
  );
}