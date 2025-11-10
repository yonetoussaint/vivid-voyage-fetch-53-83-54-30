import React, { useState } from "react"; // Add useState import here
import { 
  Heart, 
  Search
} from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import SellerInfoOverlay from "@/components/product/SellerInfoOverlay";

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
  // NEW PROPS:
  title?: string; // For showing a title in the center
  hideSearch?: boolean; // For hiding search bar
  showSellerInfo?: boolean; // For controlling seller info display
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  activeSection = "overview",
  onTabChange,
  focusMode = false,
  showHeaderInFocus = false,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSearch,
  onSearchFocus,
  inPanel = false,
  showCloseIcon = false,
  onCloseClick,
  actionButtons = [],
  forceScrolledState = false,
  seller,
  onSellerClick,
  // NEW PROPS:
  title,
  hideSearch = false,
  showSellerInfo = true,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { progress: scrollProgress } = useScrollProgress();
  const displayProgress = forceScrolledState ? 1 : scrollProgress;
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      startLoading();
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        focusMode && !showHeaderInFocus ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Main Header - ONLY header elements, NO TABS */}
      <div
        className="py-2 px-3 w-full transition-all duration-700"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
          backdropFilter: `blur(${displayProgress * 8}px)`,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          {/* Left side - Back button and Seller Info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <BackButton
              progress={displayProgress}
              showCloseIcon={showCloseIcon}
              onClick={onCloseClick || (() => navigate(-1))}
            />

            {/* Show seller info when not scrolled AND showSellerInfo is true */}
            {displayProgress < 0.5 && seller && showSellerInfo && (
              <div className="transition-opacity duration-300">
                <button
                  onClick={() => {
                    if (onSellerClick) {
                      onSellerClick();
                    } else {
                      navigate(`/seller/${seller.id}`);
                    }
                  }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-white transition-colors shadow-sm"
                >
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
                  <span className="truncate max-w-[80px]">{seller.name}</span>
                  {seller.verified && <span className="text-blue-500">✓</span>}
                  <span className="text-xs opacity-70">
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

          {/* Center - Title or Search bar */}
          <div className="flex-1 mx-4">
            {title ? (
              // Show title when provided
              <div className="text-center">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h1>
              </div>
            ) : (
              // Show search bar when scrolled (unless hideSearch is true)
              !hideSearch && displayProgress >= 0.5 && (
                <div className="flex-1 relative max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (onSearchFocus) {
                        onSearchFocus();
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
                </div>
              )
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
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

      {/* NO TABS HERE - Tabs are managed in SellerLayout */}
    </div>
  );
};

export default ProductHeader;