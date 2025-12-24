import React, { useRef, useEffect } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Function to scroll to make the selected item visible on the left
  const scrollToItem = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const itemWidth = container.children[0]?.clientWidth || 0;
    const gap = 4; // gap-1 = 0.25rem = 4px
    const scrollPosition = index * (itemWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Handle channel selection with scroll behavior
  const handleChannelSelect = (channelId: string, index: number) => {
    onChannelSelect?.(channelId);
    scrollToItem(index);
  };

  // Auto-scroll to active channel on initial render
  useEffect(() => {
    if (activeChannel && containerRef.current) {
      const activeIndex = channels.findIndex(ch => ch.id === activeChannel);
      if (activeIndex > -1) {
        // Delay the initial scroll to ensure DOM is ready
        const timer = setTimeout(() => {
          scrollToItem(activeIndex);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [activeChannel, channels]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
            // Remove scroll padding to allow items to snap to left edge
            scrollPadding: '0px',
          }}
        >
          {channels.map((channel, index) => (
            <div 
              key={channel.id} 
              className="flex flex-col items-center gap-1 flex-shrink-0"
              style={{
                // Calculate width to show exactly 5.5 items edge-to-edge
                // 5.5 items means each item takes up 100% / 5.5 of the viewport width
                width: `calc(100vw / 5.5)`,
                minWidth: `calc(100vw / 5.5)`,
                // Snap to the left edge of container
                scrollSnapAlign: 'start'
              }}
              onClick={() => handleChannelSelect(channel.id, index)}
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
    </div>
  );
};

export default FavouriteChannels;