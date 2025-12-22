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

  // Check if content overflows (more than 6 items = 1 row)
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Check if we have more than 6 items
      const hasMoreThanOneRow = channels.length > 6;
      setIsOverflowing(hasMoreThanOneRow);
      
      // If showAll is false and we have more than 6 items, only show first 6
      if (!showAll && hasMoreThanOneRow) {
        container.style.maxHeight = 'calc(9rem + 8px)'; // 1 row height (9rem for 2 rows + gaps)
      } else {
        container.style.maxHeight = 'none';
      }
    }
  }, [channels.length, showAll]);

  // Calculate number of rows to show
  const visibleChannels = showAll ? channels : channels.slice(0, 6);
  const hasHiddenChannels = channels.length > 6 && !showAll;

  return (
    <div className="bg-white relative">
      {/* Channels Grid */}
      <div 
        ref={containerRef}
        className="grid grid-cols-6 gap-1 px-2 py-2 overflow-hidden transition-all duration-300 ease-in-out"
      >
        {visibleChannels.map((channel) => (
          <div 
            key={channel.id} 
            className="flex flex-col items-center gap-1"
            onClick={() => {
              onChannelSelect?.(channel.id);
              // If selecting a hidden channel, auto-expand
              if (!showAll && channels.indexOf(channel) >= 6) {
                setShowAll(true);
              }
            }}
          >
            <div 
              className={`
                w-9 h-9 rounded-full ${channel.bgColor} 
                flex items-center justify-center shadow-md 
                cursor-pointer hover:scale-105 transition-transform
                relative overflow-hidden
                ${activeChannel === channel.id ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
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

      {/* Chevron Indicator - Only show if there are hidden channels */}
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

      {/* Gradient fade overlay when collapsed */}
      {hasHiddenChannels && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default FavouriteChannels;