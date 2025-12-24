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
  const [showThumbnail, setShowThumbnail] = useState(true);

  // DEBUG: Log when component mounts
  useEffect(() => {
    console.log(`🎬 ReelCard MOUNTED: ${reel.id}`, {
      video_url: reel.video_url,
      thumbnail_url: reel.thumbnail_url,
      hasThumbnail: !!reel.thumbnail_url,
      time: new Date().toLocaleTimeString()
    });
  }, [reel]);

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

  // Load video IMMEDIATELY when component mounts (not waiting for scroll)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reel.video_url) {
      console.log(`❌ No video element or URL for reel ${reel.id}`);
      setIsLoading(false);
      setHasError(true);
      return;
    }

    console.log(`📹 Starting video load for reel ${reel.id}: ${reel.video_url}`);

    const handleLoadedData = () => {
      console.log(`✅ Video loaded for reel ${reel.id}`);
      setIsVideoLoaded(true);
      setIsLoading(false);
      setHasError(false);
      setShowThumbnail(false); // Hide thumbnail when video loads
      
      // Try to play the video (muted)
      video.play().catch(e => {
        console.log(`⚠️ Auto-play prevented for reel ${reel.id}:`, e.message);
      });
    };

    const handleError = (e: Event) => {
      console.error(`❌ Video error for reel ${reel.id}:`, e);
      setIsLoading(false);
      setHasError(true);
    };

    const handleCanPlay = () => {
      console.log(`🎥 Video can play for reel ${reel.id}`);
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Set video source and LOAD IMMEDIATELY
    video.src = reel.video_url;
    video.load(); // This is CRITICAL - forces immediate loading
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto"; // Changed from "metadata" to "auto"

    // Set a timeout to show thumbnail if video takes too long
    const loadTimeout = setTimeout(() => {
      if (!isVideoLoaded && !hasError) {
        console.log(`⏰ Video load timeout for reel ${reel.id}, showing thumbnail`);
        setIsLoading(false);
      }
    }, 3000); // 3 second timeout

    return () => {
      clearTimeout(loadTimeout);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [reel.video_url, reel.id]);

  return (
    <div 
      className="bg-black rounded overflow-hidden relative cursor-pointer mb-2"
      onClick={handleClick}
    >
      <div className="w-full aspect-[3/4] bg-gray-800 relative overflow-hidden">
        {/* Video element - Loads immediately */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ 
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />

        {/* Thumbnail image - Shows while video loads */}
        {showThumbnail && reel.thumbnail_url && (
          <div className="absolute inset-0">
            <img 
              src={reel.thumbnail_url}
              alt={reel.title}
              className="w-full h-full object-cover"
              onError={() => {
                console.error(`❌ Thumbnail failed to load for reel ${reel.id}`);
                setShowThumbnail(false);
              }}
              onLoad={() => {
                console.log(`✅ Thumbnail loaded for reel ${reel.id}`);
              }}
            />
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && !showThumbnail && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Play className="w-12 h-12 text-gray-400" />
            <span className="sr-only">Video failed to load</span>
          </div>
        )}

        {/* Debug overlay - Shows reel ID and status */}
        <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded opacity-70">
          #{reel.id.slice(0, 4)}
        </div>

        {/* Duration badge */}
        {!reel.is_live && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            {formatDuration(reel.duration)}
          </div>
        )}

        {/* Views at bottom */}
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