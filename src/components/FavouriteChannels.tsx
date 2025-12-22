import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ChannelItem {
  id: string;
  name: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
}

interface FavouriteChannelsProps {
  channels?: ChannelItem[]; // Make it optional
  activeChannel?: string;
  onChannelSelect?: (channelId: string) => void;
}

const FavouriteChannels: React.FC<FavouriteChannelsProps> = ({ 
  channels = [], // Default to empty array
  activeChannel,
  onChannelSelect 
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Safely check if channels exists and has more than 6 items
  const isOverflowing = channels?.length > 6;
  
  // Safely get visible channels
  const visibleChannels = showAll ? channels : (channels || []).slice(0, 6);
  
  // Calculate rows needed
  const rows = Math.ceil((visibleChannels?.length || 0) / 6);

  // If no channels, return null or a placeholder
  if (!channels || channels.length === 0) {
    return null; // or return a loading/empty state
  }

  return (
    <div className="bg-white">
      {/* Channels Grid */}
      <div 
        className={`grid grid-cols-6 gap-1 px-2 py-2 transition-all duration-300 ${
          !showAll && isOverflowing ? 'max-h-[calc(9rem+8px)] overflow-hidden' : ''
        }`}
        style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
      >
        {visibleChannels.map((channel) => (
          <div 
            key={channel.id} 
            className="flex flex-col items-center gap-1"
            onClick={() => {
              onChannelSelect?.(channel.id);
              if (!showAll && channels.indexOf(channel) >= 6) {
                setShowAll(true);
              }
            }}
          >
            <div 
              className={`
                w-9 h-9 rounded-full ${channel.bgColor} 
                flex items-center justify-center shadow-sm 
                cursor-pointer hover:scale-105 transition-transform
                relative overflow-hidden
                ${activeChannel === channel.id ? 'ring-2 ring-blue-500' : ''}
              `}
            >
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

      {/* Simple Chevron Button - Only show if we have channels and more than 6 */}
      {channels.length > 0 && isOverflowing && (
        <div className="flex justify-center pt-1 pb-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={showAll ? "Show less" : "Show more"}
          >
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FavouriteChannels;