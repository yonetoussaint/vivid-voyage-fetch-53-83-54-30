import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Play, Users, Loader2 } from "lucide-react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  // Initialize video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reel.video_url) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      console.error('Video load error for:', reel.video_url);
      setIsLoading(false);
      setHasError(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Set video source - IMPORTANT: Same as MobileOptimizedReels
    if (video.src !== reel.video_url) {
      video.src = reel.video_url;
      video.load();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [reel.video_url]);

  return (
    <div 
      className="bg-black rounded overflow-hidden relative cursor-pointer mb-2"
      onClick={handleClick}
    >
      <div className="w-full aspect-[3/4] bg-gray-800 relative overflow-hidden">
        {/* Video element - EXACTLY like MobileOptimizedReels */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay // Auto-play muted video to show first frame
          style={{ 
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Error state - Show thumbnail if video fails */}
        {hasError && reel.thumbnail_url && (
          <div className="absolute inset-0">
            <img 
              src={reel.thumbnail_url}
              alt={reel.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Error state - No thumbnail available */}
        {hasError && !reel.thumbnail_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Duration badge */}
        {!reel.is_live && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            {formatDuration(reel.duration)}
          </div>
        )}

        {/* Live badge */}
        {reel.is_live && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>LIVE</span>
          </div>
        )}

        {/* Views at bottom - EXACTLY like MobileOptimizedReels */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="flex items-center text-white text-[10px] gap-1">
            <Play className="w-3 h-3" fill="white" />
            <span>{formatNumber(reel.views)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ReelCard };