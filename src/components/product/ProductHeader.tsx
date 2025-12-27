import React, { useState, useEffect } from "react";
import { 
  Heart,
  ChevronLeft,
  X,
  LucideIcon
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { VerificationBadge } from '@/components/shared/VerificationBadge';

interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

interface ProductHeaderProps {
  activeSection?: string;
  onTabChange?: (section: string) => void;
  focusMode?: boolean;
  showHeaderInFocus?: boolean;
  onProductDetailsClick?: () => void;
  currentImageIndex?: number;
  totalImages?: number;
  onShareClick?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: (query: string) => void;
  onSearchFocus?: () => void;
  inPanel?: boolean;
  showCloseIcon?: boolean;
  onCloseClick?: () => void;
  actionButtons?: ActionButton[];
  forceScrolledState?: boolean;
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  onSellerClick?: () => void;
  hideSearch?: boolean;
  showSellerInfo?: boolean;
}

// Header Action Button Component
interface HeaderActionButtonProps {
  Icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  progress: number;
  activeColor?: string;
  badge?: number;
  fillWhenActive?: boolean;
  transform?: string;
  likeCount?: number;
  shareCount?: number;
}

const HeaderActionButton = ({ 
  Icon, 
  active = false, 
  onClick, 
  progress, 
  activeColor = '#f97316',
  badge,
  fillWhenActive = true,
  transform = '',
  likeCount,
  shareCount
}: HeaderActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    // Only trigger animation for heart icon
    if (Icon.name === "Heart" || Icon.displayName === "Heart") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  // Determine which count to show
  const count = likeCount ?? shareCount;

  // Improved transition thresholds for smoother animation
  const expandedThreshold = 0.2;
  const fadingThreshold = 0.4;

  // Show horizontal layout with count in non-scroll state
  if (count !== undefined && progress < expandedThreshold) {
    return (
      <div 
        className="rounded-full transition-all duration-700 hover-scale"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-700 ease-out animate-fade-in"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.95 - (progress * 0.2)})`,
              opacity: 1 - (progress / expandedThreshold),
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Transitional state - fading count while shrinking
  if (count !== undefined && progress < fadingThreshold) {
    const transitionProgress = (progress - expandedThreshold) / (fadingThreshold - expandedThreshold);

    return (
      <div 
        className="rounded-full transition-all duration-700"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
      >
        <button
          onClick={handleClick}
          className="flex items-center h-8 px-3 rounded-full transition-all duration-700 relative"
          style={{
            gap: `${6 - (transitionProgress * 6)}px`,
          }}
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: progress > 0.5 
                ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
                : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-700"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`,
              opacity: 1 - transitionProgress,
              transform: `scaleX(${1 - transitionProgress})`,
              transformOrigin: 'left center',
              width: `${20 * (1 - transitionProgress)}px`,
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Compact circular button state
  return (
    <div 
      className="rounded-full transition-all duration-700"
      style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
    >
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 relative"
      >
        <Icon
          size={20}
          strokeWidth={2.5}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={{
            fill: active && fillWhenActive ? activeColor : 'transparent',
            color: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
          }}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center animate-scale-in">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
};

const ProductHeader: React.FC<ProductHeaderProps> = ({
  focusMode = false,
  showHeaderInFocus = false,
  showCloseIcon = false,
  onCloseClick,
  actionButtons = [],
  forceScrolledState = false,
  seller,
  onSellerClick,
  hideSearch = false,
  showSellerInfo = true,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Inline navigation loading logic
  useEffect(() => {
    setIsLoading(false);
  }, [location]);

  // Inline scroll progress tracking
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Calculate scroll progress
  const maxScroll = 120;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const displayProgress = forceScrolledState ? 1 : scrollProgress;

  const navigate = useNavigate();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Back/Close icon component
  const IconComponent = showCloseIcon ? X : ChevronLeft;

  // Return null if loading
  if (isLoading) {
    return null;
  }

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        focusMode && !showHeaderInFocus ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Main Header Container */}
      <div
        className="w-full transition-all duration-700"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
          backdropFilter: `blur(${displayProgress * 8}px)`,
        }}
      >
        {/* Main Header Content */}
        <div className="py-2 px-3 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto gap-4">
            {/* Left side - Back button and seller info */}
            <div className="flex items-center gap-3 flex-shrink-0 min-w-0 flex-1">
              {/* Back/Close Button */}
              <div 
                className="rounded-full transition-all duration-700"
                style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
              >
                <button 
                  className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700"
                  onClick={onCloseClick || (() => navigate(-1))}
                >
                  <IconComponent
                    size={24}
                    strokeWidth={2.5}
                    className="transition-all duration-700"
                    style={{
                      color: displayProgress > 0.5 
                        ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                        : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
                    }}
                  />
                </button>
              </div>

              {/* Seller info - shows when not scrolled AND seller exists AND showSellerInfo is true */}
              {displayProgress < 0.5 && seller && showSellerInfo && (
                <div 
                  className="rounded-full transition-all duration-700 flex-shrink-0"
                  style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
                >
                  <button
                    onClick={() => {
                      if (onSellerClick) {
                        onSellerClick();
                      } else {
                        navigate(`/seller/${seller.id}`);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
                  >
                    {/* Seller Avatar */}
                    <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={seller.image_url || "https://picsum.photos/100/100?random=1"}
                        alt={`${seller.name} seller`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://picsum.photos/100/100?random=1";
                          target.onerror = null;
                        }}
                      />
                    </div>
                    
                    {/* Seller Name */}
                    <span 
                      className="text-xs font-medium transition-all duration-700"
                      style={{
                        color: `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
                      }}
                    >
                      {seller.name}
                    </span>
                    
                    {/* Verification Badge */}
                    {seller.verified && <VerificationBadge />}
                    
                    {/* Follower Count */}
                    <span 
                      className="text-xs font-medium transition-all duration-700"
                      style={{
                        color: `rgba(255, 255, 255, ${0.7 - (displayProgress * 0.2)})`
                      }}
                    >
                      {seller.followers_count >= 1000000 
                        ? `${(seller.followers_count / 1000000).toFixed(1)}M`
                        : seller.followers_count >= 1000
                        ? `${(seller.followers_count / 1000).toFixed(1)}K`
                        : seller.followers_count.toString()
                      }
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Right side - Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {/* Custom action buttons OR default heart button */}
              {actionButtons.length > 0 ? (
                actionButtons.map((button, index) => (
                  <HeaderActionButton
                    key={index}
                    Icon={button.Icon}
                    active={button.active}
                    onClick={button.onClick}
                    progress={displayProgress}
                    activeColor={button.activeColor}
                    likeCount={button.count}
                  />
                ))
              ) : (
                <HeaderActionButton
                  Icon={Heart}
                  active={isFavorite}
                  onClick={toggleFavorite}
                  progress={displayProgress}
                  activeColor="#f43f5e"
                  likeCount={147}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;