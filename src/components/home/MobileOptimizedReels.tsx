// MobileOptimizedReels.tsx
import React, { useRef } from 'react';
import { Store, Users, Zap, ArrowRight, Play, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import { useVideos } from '@/hooks/useVideos';

interface MobileOptimizedReelsProps {
  title?: string;
  icon?: LucideIcon;
  viewAllLink?: string;
  viewAllText?: string;
  videoCount?: number;
  category?: string;
  showLiveCount?: boolean;
  customClass?: string;
  isLive?: boolean;
  // New props for custom button
  showCustomButton?: boolean;
  onCustomButtonClick?: () => void;
  layoutMode?: 'carousel' | 'grid';
  showSectionHeader?: boolean;
}

const MobileOptimizedReels: React.FC<MobileOptimizedReelsProps> = ({
  title = "SHORTS",
  icon = Zap,
  viewAllLink = "/reels",
  viewAllText = "View All",
  videoCount = 6,
  category = "",
  showLiveCount = false,
  customClass = "",
  isLive = false,
  // New props
  showCustomButton = false,
  onCustomButtonClick,
  layoutMode = 'carousel',
  showSectionHeader = true
}) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { data: videos, isLoading } = useVideos(videoCount, category);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/reels?video=${videoId}`);
  };

  // Default handler for custom button if not provided
  const handleCustomButtonClick = () => {
    // Navigate to reels page or implement auto-play all functionality
    navigate('/reels');
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden">
        {showSectionHeader && layoutMode !== 'grid' && (
          <SectionHeader
            title="SHORTS"
            icon={Zap}
            viewAllLink="/reels"
            viewAllText="View All"
            showCustomButton={showCustomButton}
            onCustomButtonClick={handleCustomButtonClick}
          />
        )}
        <div className={layoutMode === 'grid' ? 'grid grid-cols-3 gap-1' : 'flex overflow-x-auto pl-2 scrollbar-none w-full'}>
          {Array(layoutMode === 'grid' ? 12 : 6).fill(0).map((_, i) => (
            <div 
              key={i}
              className={`rounded-lg overflow-hidden shadow-lg bg-gray-200 relative animate-pulse ${
                layoutMode === 'grid' ? 'w-full aspect-[3/4]' : 'flex-shrink-0 mr-[3vw]'
              }`}
              style={layoutMode === 'carousel' ? { 
                width: '35vw', 
                maxWidth: '160px',
                height: '49vw', 
                maxHeight: '220px'
              } : {}}
            />
          ))}
        </div>
      </div>
    );
  }

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <Users className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">2M+ Watching</span>
    </div>
  );

  return (
    <div className={`w-full overflow-hidden ${customClass}`}>
      {showSectionHeader && layoutMode !== 'grid' && (
        <SectionHeader
          title={title}
          icon={icon}
          viewAllLink={showCustomButton ? undefined : viewAllLink}
          viewAllText={viewAllText}
          showCustomButton={showCustomButton}
          customButtonText="Tout regarder"
          customButtonIcon={Play}
          onCustomButtonClick={onCustomButtonClick || handleCustomButtonClick}
        />
      )}

      {layoutMode === 'grid' ? (
        // Grid layout - 3 columns
        <div className="grid grid-cols-3 gap-1">
          {videos?.map((video) => (
            <div 
              key={video.id} 
              className="relative cursor-pointer aspect-[3/4] overflow-hidden bg-black"
              onClick={() => handleVideoClick(video.id)}
            >
              <video 
                src={video.video_url} 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              {isLive && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span>LIVE</span>
                </div>
              )}

              {!isLive && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <div className="flex items-center text-gray-300 text-xs gap-1">
                  <Play className="w-3 h-3" />
                  <span>{formatViews(video.views)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Carousel layout
        <div 
          ref={scrollContainerRef}
          className="reels-container flex overflow-x-auto pl-2 scrollbar-none w-full"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
        >
          {videos?.map((video) => (
            <div 
              key={video.id} 
              className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-black relative mr-[3vw] cursor-pointer"
              style={{ 
                width: '35vw', 
                maxWidth: '160px',
                scrollSnapAlign: 'start'
              }}
              onClick={() => handleVideoClick(video.id)}
            >
              <div className="relative bg-gray-200" style={{ height: '49vw', maxHeight: '220px' }}>
                <video 
                  src={video.video_url} 
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />

                {isLive && (
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <div className="flex items-center gap-0.5">
                      <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span>LIVE</span>
                  </div>
                )}

                {!isLive && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="hidden"></h3>
                  <div className="flex items-center text-gray-300 text-xs gap-1">
                    <Play className="w-3 h-3" />
                    <span>{formatViews(video.views)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex-shrink-0 w-2"></div>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedReels;