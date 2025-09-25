import React from 'react';
import { Video } from '@/hooks/useVideos';
import { ReelsActionButtons } from './ReelsActionButtons';
import PriceInfo from '@/components/product/PriceInfo';
import SellerInfoOverlay from '@/components/product/SellerInfoOverlay';
import ProductDetails from '@/components/product/ProductDetails';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';

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

  return (
    <div 
      id={`reel-${index}`}
      data-reel-container
      className="w-full h-screen relative snap-start snap-always overflow-hidden bg-black"
    >
      {/* Full Screen Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={video.video_url}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
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
          <div className="absolute bottom-6 left-4 right-20 pointer-events-none">
            {/* User info */}
            <div className="flex items-center mb-3 pointer-events-auto">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                {seller?.profile_image ? (
                  <img 
                    src={seller.profile_image} 
                    alt={seller.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {seller?.business_name?.[0] || video.user_id?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-white font-semibold text-base mr-3">
                {seller?.business_name || `User ${video.user_id?.slice(0, 8)}`}
              </span>
              <button className="bg-red-500 text-white px-4 py-1 rounded-md text-sm font-semibold">
                Follow
              </button>
            </div>

            {/* Video description/title */}
            <div className="mb-3 pointer-events-auto">
              <p className="text-white text-base leading-tight max-w-xs">
                {video.title || 'Check out this amazing product! 🔥 #trending #shopping'}
              </p>
            </div>

            {/* Product info (if available) */}
            {product && (
              <div 
                className="bg-black/50 backdrop-blur-sm rounded-lg p-3 mb-3 pointer-events-auto cursor-pointer"
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
                  <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                    Shop Now
                  </div>
                </div>
              </div>
            )}

            {/* Music/Audio info */}
            <div className="flex items-center pointer-events-auto">
              <div className="w-4 h-4 mr-2">
                <svg fill="white" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <p className="text-white text-sm opacity-80">
                Original sound - {seller?.business_name || 'Creator'}
              </p>
            </div>
          </div>
        </div>

        {/* Right side - TikTok action buttons */}
        <div className="w-16 flex flex-col items-center justify-end pb-24 space-y-6">
          {/* Profile picture with plus */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
              {seller?.profile_image ? (
                <img 
                  src={seller.profile_image} 
                  alt={seller.business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {seller?.business_name?.[0] || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          {/* Like button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <span className="text-white text-xs font-semibold mt-1">
              {formatViews(video.likes || 0)}
            </span>
          </div>

          {/* Comment button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M21 6h-2l-1.27-1.27A2 2 0 0 0 16.32 4H15V2h-2v2H9V2H7v2H5.68a2 2 0 0 0-1.41.73L3 6H1l2 2h.68L5 6.73A.5.5 0 0 1 5.32 6H7v2h2V6h6v2h2V6h1.68a.5.5 0 0 1 .32.27L20.32 8H21l2-2zM12 15l-2 2H8l4-4 4 4h-2l-2-2z"/>
              </svg>
            </button>
            <span className="text-white text-xs font-semibold mt-1">0</span>
          </div>

          {/* Share button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
            <span className="text-white text-xs font-semibold mt-1">Share</span>
          </div>

          {/* Bookmark/Save button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <svg width="24" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
          </div>

          {/* Rotating music disc */}
          <div className="w-10 h-10 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center animate-spin" 
               style={{ animationDuration: '3s' }}>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mute indicator */}
      {isMuted && (
        <div className="absolute top-4 left-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Play/Pause indicator (appears briefly when tapped) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};