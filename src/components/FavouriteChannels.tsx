import React from "react";

export interface ChannelItem {
  id: string;
  name: string;
  imageUrl: string; // Changed from icon to imageUrl
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
  return (
    <div className="bg-white">
      <div className="grid grid-cols-6 gap-1 px-2">
        {channels.map((channel) => (
          <div 
            key={channel.id} 
            className="flex flex-col items-center gap-1"
            onClick={() => onChannelSelect?.(channel.id)}
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
    </div>
  );
};

export default FavouriteChannels;