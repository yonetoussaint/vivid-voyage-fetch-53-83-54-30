import React from "react";
import { Zap, Video, DollarSign, Crown } from "lucide-react";

const FavouriteChannels: React.FC = () => {
  const channels = [
    {
      name: 'LazCash',
      icon: 'RM',
      bgColor: 'bg-gradient-to-br from-orange-300 to-orange-400',
      textColor: 'text-pink-600',
      iconType: 'text' as const
    },
    {
      name: 'LazFlash',
      icon: <Zap className="w-8 h-8" fill="white" stroke="white" />,
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-500',
      textColor: 'text-white',
      iconType: 'component' as const
    },
    {
      name: 'Choice',
      icon: 'CHOICE',
      bgColor: 'bg-yellow-400',
      textColor: 'text-gray-800',
      iconType: 'text' as const
    },
    {
      name: 'LazLive',
      icon: <Video className="w-8 h-8" fill="white" stroke="none" />,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      textColor: 'text-white',
      iconType: 'component' as const
    },
    {
      name: 'LazAffiliates',
      icon: <DollarSign className="w-10 h-10" strokeWidth={3} />,
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      textColor: 'text-white',
      iconType: 'component' as const
    },
    {
      name: 'Best Sellers',
      icon: <Crown className="w-8 h-8" fill="white" stroke="none" />,
      bgColor: 'bg-gradient-to-br from-amber-600 to-amber-700',
      textColor: 'text-white',
      iconType: 'component' as const
    }
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-6 gap-1">
        {channels.map((channel, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className={`w-9 h-9 rounded-full ${channel.bgColor} flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform`}>
              {channel.iconType === 'text' ? (
                <span className={`font-bold ${channel.textColor} text-[8px]`}>
                  {channel.icon}
                </span>
              ) : (
                <div className={channel.textColor}>
                  {React.cloneElement(channel.icon, { 
                    className: channel.icon.props.className.replace(/w-\d+|h-\d+/g, '').trim() + ' w-3.5 h-3.5'
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