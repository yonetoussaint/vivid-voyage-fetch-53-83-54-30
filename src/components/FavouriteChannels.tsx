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
    <div className="bg-white pb-2">
      <div className="flex overflow-x-auto gap-3 px-4 py-2 scrollbar-hide">
        {channels.map((channel) => (
          <div 
            key={channel.id} 
            className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16"
            onClick={() => onChannelSelect?.(channel.id)}
          >
            <div 
              className={`
                w-14 h-14 rounded-full ${channel.bgColor} 
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
                >
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}
              
              {/* Channel name in the center */}
              <span className="relative z-10 text-white text-[10px] font-bold text-center px-1">
                {channel.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hide scrollbar utility
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default FavouriteChannels;