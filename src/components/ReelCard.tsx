import React from "react";
import { useNavigate } from 'react-router-dom';
import { Play, Users } from "lucide-react";

interface Reel {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  views: number;
  duration: number;
  likes?: number;
  comments?: number;
  created_at?: string;
  is_live?: boolean;
  type: 'reel';
}

interface ReelCardProps {
  reel: Reel;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/reels?video=${reel.id}`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div 
      className="bg-black rounded overflow-hidden relative cursor-pointer mb-2"
      onClick={handleClick}
    >
      <div className="w-full aspect-[3/4] bg-gray-800 relative overflow-hidden">
        <video 
          src={reel.video_url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />

        {reel.is_live && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>LIVE</span>
          </div>
        )}

        {!reel.is_live && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded z-10">
            {formatDuration(reel.duration)}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-10">
          <div className="flex items-center text-white text-[10px] gap-1">
            <Play className="w-3 h-3" fill="white" />
            <span>{formatNumber(reel.views)} views</span>
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
        REEL
      </div>

      <div className="p-2">
        <p className="text-[11px] text-white font-medium line-clamp-2 mb-1">
          {reel.title}
        </p>
        {reel.is_live && (
          <div className="flex items-center gap-1 text-[10px] text-pink-300">
            <Users className="w-3 h-3" />
            <span>Live now • {formatNumber(reel.views)} watching</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { ReelCard };