import React from "react";

export interface ChannelItem {
  id: string;
  name: string;
  icon: React.ReactNode | string;
  bgColor: string;
  textColor: string;
  iconType: 'text' | 'component';
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
      <div className="grid grid-cols-6 gap-1">
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
                ${activeChannel === channel.id ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
              `}
            >
              {channel.iconType === 'text' ? (
                <span className={`font-bold ${channel.textColor} text-[8px]`}>
                  {channel.icon as string}
                </span>
              ) : (
                <div className={channel.textColor}>
                  {React.isValidElement(channel.icon) && 
                    React.cloneElement(channel.icon as React.ReactElement, { 
                      className: 'w-3.5 h-3.5'
                    })}
                </div>
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