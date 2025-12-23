import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface ChannelItem {
  id: string;
  name: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
}

interface FavouriteChannelsProps {
  channels: ChannelItem[];
  activeChannel?: string;
  onChannelSelect?: (channelId: string) => void;
}

const FavouriteChannels: React.FC<FavouriteChannelsProps> = ({ 
  channels, 
  activeChannel,
  onChannelSelect 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if content overflows (more than 5.5 items on mobile)
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Check if we have more items than can fit in one view (5.5 items)
      const hasOverflow = channels.length > 5.5;
      setIsOverflowing(hasOverflow);
    }
  }, [channels.length]);

  return (
    <div className="bg-white relative">
      {/* Horizontally scrollable container */}
      <div className="relative">
        <div 
          ref={containerRef}
          className="flex gap-1 py-2 overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollPadding: '0 16px',
          }}
        >
          {channels.map((channel, index) => (
            <div 
              key={channel.id} 
              className="flex flex-col items-center gap-1 flex-shrink-0"
              style={{
                width: 'calc((100vw - 32px) / 5.5)',
                minWidth: 'calc((100vw - 32px) / 5.5)',
                scrollSnapAlign: 'start'
              }}
              onClick={() => {
                onChannelSelect?.(channel.id);
              }}
            >
              <div 
                className={`
                  w-9 h-9 rounded-full ${channel.bgColor} 
                  flex items-center justify-center shadow-md 
                  cursor-pointer hover:scale-105 transition-transform
                  relative overflow-hidden
                  ${activeChannel === channel.id ? 'ring-2 ring-red-500 ring-offset-1' : ''}
                `}
              >
                {/* Background image for the circle */}
                {channel.imageUrl && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${channel.imageUrl})` }}
                  />
                )}
              </div>
              <span className="text-[8px] font-medium text-gray-800 text-center max-w-[42px] overflow-hidden text-ellipsis leading-tight">
                {channel.name}
              </span>
            </div>
          ))}
        </div>

        {/* Gradient fade overlay for horizontal scroll edges */}
        <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Chevron Indicator - Only show if there are hidden channels in vertical mode */}
      {isOverflowing && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`
              bg-white border border-gray-200 rounded-full 
              shadow-md p-1 -mb-2 z-10 
              hover:bg-gray-50 active:scale-95 
              transition-all duration-200
              ${showAll ? 'rotate-180' : ''}
            `}
            aria-label={showAll ? "Show less" : "Show more"}
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Gradient fade overlay when collapsed (for vertical mode) */}
      {!showAll && isOverflowing && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default FavouriteChannels;