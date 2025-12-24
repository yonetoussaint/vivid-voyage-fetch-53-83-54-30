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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Handle video load events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
      // Hide poster after a short delay to ensure video is ready
      setTimeout(() => setShowPoster(false), 300);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setShowPoster(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Set video source
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
        {/* Video element */}
        <video 
          ref={videoRef}
          className={`w-full h-full object-cover ${showPoster ? 'invisible' : 'visible'}`}
          muted
          loop
          playsInline
          preload="metadata"
          poster={reel.thumbnail_url || ''}
          onLoadedData={() => {
            setIsLoading(false);
            setShowPoster(false);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />

        {/* Poster/Thumbnail fallback */}
        {showPoster && reel.thumbnail_url && (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={reel.thumbnail_url}
              alt={reel.title || 'Reel thumbnail'}
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
            />
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Error fallback */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <Play className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-xs text-center">Could not load video</p>
            <p className="text-[10px] text-gray-400 mt-1">Tap to try again</p>
          </div>
        )}

        {/* Duration badge (only show if not loading/error) */}
        {!isLoading && !hasError && !reel.is_live && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            {formatDuration(reel.duration)}
          </div>
        )}

        {/* Views at the bottom of the video */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-10">
          <div className="flex items-center text-white text-[10px] gap-1">
            <Play className="w-3 h-3" fill="white" />
            <span>{formatNumber(reel.views)}</span>
          </div>
        </div>
      </div>

      {/* Live status section */}
      {reel.is_live && (
        <div className="p-2">
          <div className="flex items-center gap-1 text-[10px] text-pink-300">
            <Users className="w-3 h-3" />
            <span>Live now • {formatNumber(reel.views)} watching</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { ReelCard };