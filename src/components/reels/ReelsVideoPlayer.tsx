import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Package, // Replacing the save icon with package icon
  Music, 
  Plus,
  Share2,
  Bookmark,
  MessageCircleMore,
  Play,
  VolumeX,
  Volume2
} from 'lucide-react';
import { Video } from '@/hooks/useVideos';
import { ReelsActionButtons } from './ReelsActionButtons';
import PriceInfo from '@/components/product/PriceInfo';
import SellerInfoOverlay from '@/components/product/SellerInfoOverlay';
import ProductDetails from '@/components/product/ProductDetails';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight';

interface ReelsVideoPlayerProps {
  video: Video;
  index: number;
  videoRef: (el: HTMLVideoElement | null) => void;
  isPlaying: boolean;
  isMuted: boolean;
  onVideoClick: (index: number, event?: React.MouseEvent) => void;
  formatViews: (views: number) => string;
  isModalMode?: boolean;
  product?: {
    id: string;
    name: string;
    price: number;
    discount_price?: number | null;
  };
  onSellerClick?: () => void;
  onProductDetailsClick?: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  count?: string | number;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  count, 
  onClick, 
  isActive = false,
  className = "" 
}) => (
  <div className="flex flex-col items-center">
    <div 
      className={`
        transition-all duration-200 ease-out
        hover:scale-110
        active:scale-95
        cursor-pointer
        mt-2
        ${isActive ? 'text-red-400' : 'text-white'}
        ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e as any);
        }
      }}
    >
      {icon}
    </div>
    {(count !== undefined || label) && (
      <span className="text-white text-xs font-semibold mt-0.5 text-center">
        {count !== undefined ? count : label}
      </span>
    )}
  </div>
);


export const ReelsVideoPlayer: React.FC<ReelsVideoPlayerProps> = ({
  video,
  index,
  videoRef,
  isPlaying,
  isMuted,
  onVideoClick,
  formatViews,
  isModalMode = false,
  product,
  onSellerClick,
  onProductDetailsClick,
}) => {
  // Fetch real seller data from database
  const { data: seller } = useSellerByUserId(video.user_id || '');
  const { bottomNavHeight } = useBottomNavHeight();

  // Local state for button interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isPackaged, setIsPackaged] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  // Add these state variables
const [isSaved, setIsSaved] = useState(false);
const [isShared, setIsShared] = useState(false);

// Add these handler functions
const handleSave = () => {
  setIsSaved(!isSaved);
  // Add your save logic here
};

const handleShare = () => {
  setIsShared(true);
  // Add your share logic here
  // This could open a share dialog or copy link to clipboard
};

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add your like logic here
  };

  const handlePackage = () => {
    setIsPackaged(!isPackaged);
    // Add your package/cart logic here
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    // Add your follow logic here
  };

  const handleComment = () => {
    // Add your comment logic here
    console.log('Open comments');
  };

  // Function to format business name to simple name format
  const getSimpleName = () => {
    if (seller?.business_name) {
      // Take first word and capitalize first letter
      const firstName = seller.business_name.split(' ')[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }
    return `User${video.user_id?.slice(0, 4)}`;
  };

  return (
    <div 
      id={`reel-${index}`}
      data-reel-container
      className="w-full relative snap-start snap-always overflow-hidden bg-black"
      style={{ 
        height: isModalMode ? '100dvh' : `calc(100dvh - ${bottomNavHeight}px)`
      }}
    >
      {/* Full Screen Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={video.video_url}
          className="w-full h-full object-contain"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onClick={(e) => onVideoClick(index, e)}
        />
      </div>

      {/* TikTok-style UI Overlays */}
      <div className="absolute inset-0 flex">
        {/* Left side - Video content area (tap to pause/play) */}
        <div 
          className="flex-1 relative"
          onClick={(e) => onVideoClick(index, e)}
        >
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Bottom left content */}
          <div 
            className="absolute left-4 right-20 pointer-events-none"
            style={{ 
              bottom: isModalMode ? '16px' : '16px'
            }}
          >
            {/* Simple Name (without @) */}
            <div className="mb-3 pointer-events-auto">
              <p className="text-white font-semibold text-lg leading-tight">
                {getSimpleName()}
              </p>
            </div>

            {/* Product info (if available) */}
            {product && (
              <div 
                className="bg-black/50 backdrop-blur-sm rounded-xl p-3 mb-3 pointer-events-auto cursor-pointer border border-white/10 hover:bg-black/60 transition-colors duration-200"
                onClick={onProductDetailsClick}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{product.name}</p>
                    <div className="flex items-center space-x-2">
                      {product.discount_price ? (
                        <>
                          <span className="text-red-400 font-bold text-lg">
                            ${product.discount_price}
                          </span>
                          <span className="text-gray-300 line-through text-sm">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-white font-bold text-lg">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors">
                    Shop Now
                  </div>
                </div>
              </div>
            )}

            {/* Music/Audio info */}
            <div className="flex items-center pointer-events-auto">
              <Music size={16} className="text-white mr-2" />
              <p className="text-white text-sm opacity-80">
                Original sound - {seller?.business_name || 'Creator'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sticky action buttons at same level as music */}
      <div 
        className="absolute right-2 flex flex-col items-center space-y-4"
        style={{ 
          bottom: isModalMode ? '16px' : '16px'
        }}
      >
        {/* Like button - Enhanced with fill */}
        <ActionButton
          icon={<Heart size={32} fill={isLiked ? "currentColor" : "none"} />}
          count={formatViews((video.likes || 0) + (isLiked ? 1 : 0))}
          onClick={handleLike}
          isActive={isLiked}
        />

        {/* Comment button - Enhanced with fill */}
        <ActionButton
          icon={<MessageCircleMore size={28} />}
          count="0"
          onClick={handleComment}
        />

        {/* Save/Bookmark button */}
        <ActionButton
          icon={<Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />}
          count={formatViews(video.saves || 0)}
          onClick={handleSave}
          isActive={isSaved}
        />

        {/* Share button with custom SVG */}
        <ActionButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V3L23 11L13 19V14Z"></path>
            </svg>
          }
          count={formatViews(video.shares || 0)}
          onClick={handleShare}
        />

        {/* Package button - Replacing save/bookmark with filled package icon */}
        <ActionButton
          icon={<Package size={24} />}
          onClick={handlePackage}
          isActive={isPackaged}
        />
      </div>
    </div>
  );
};
