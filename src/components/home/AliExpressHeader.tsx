// components/home/AliExpressHeader.tsx
import { useState, useEffect, useRef } from 'react';
import CategoryTabs from './header/CategoryTabs';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { X, Camera, MapPin, ChevronDown, ChevronLeft, MoreHorizontal, Heart } from 'lucide-react';
import { useHeaderSearch, useHeaderScroll, useHeaderLocation } from '@/hooks/header.hooks';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;
  cityName?: string;
  locationOptions?: Array<{ id: string; name: string }>;
  onLocationChange?: (locationId: string) => void;
  onOpenLocationsPanel?: () => void;
  mode?: 'home' | 'product-detail';
  scrollY?: number;
  productData?: {
    sellers?: {
      id?: string;
      name?: string;
      image_url?: string;
      verified?: boolean;
      followers_count?: number;
    };
    favorite_count?: number;
  };
  onBackClick?: () => void;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
  isFavorite?: boolean;
  inPanel?: boolean;
  hideSearchBar?: boolean;
  onSearchSubmit?: (query: string) => void;
}

// Three Dots Menu Component
const ThreeDotsMenu = ({
  onShareClick,
  onReportClick,
  displayProgress,
  showSearchBarInProductDetail
}: {
  onShareClick?: () => void;
  onReportClick?: () => void;
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (callback?: () => void) => {
    setIsMenuOpen(false);
    callback?.();
  };

  const buttonStyle = {
    backgroundColor: showSearchBarInProductDetail ? 'transparent' : `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
  };

  const iconColor = showSearchBarInProductDetail
    ? 'rgba(75, 85, 99, 0.9)'
    : displayProgress > 0.5 
      ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
      : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`;

  return (
    <div className="relative" ref={menuRef}>
      <div style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700"
          style={buttonStyle}
        >
          <MoreHorizontal size={20} className="transition-all duration-700" style={{ color: iconColor }} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
          <button onClick={() => handleMenuItemClick(onShareClick)} className="menu-item">
            <span>Share</span>
          </button>
          <button onClick={() => handleMenuItemClick(onReportClick)} className="menu-item">
            <span>Report</span>
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => setIsMenuOpen(false)} className="menu-item">
            <span>Save</span>
          </button>
          <button onClick={() => setIsMenuOpen(false)} className="menu-item">
            <span>Follow</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Favorite Button Component
const FavoriteButton = ({ 
  isFavorite, 
  onClick, 
  displayProgress, 
  showSearchBarInProductDetail,
  favoriteCount = 0 
}: { 
  isFavorite: boolean; 
  onClick?: () => void;
  displayProgress: number;
  showSearchBarInProductDetail: boolean;
  favoriteCount?: number;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    setIsAnimating(true);
    onClick?.();
    setTimeout(() => setIsAnimating(false), 700);
  };

  const buttonStyle = {
    backgroundColor: showSearchBarInProductDetail ? 'transparent' : `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
  };

  const iconColor = showSearchBarInProductDetail
    ? 'rgba(75, 85, 99, 0.9)'
    : displayProgress > 0.5 
      ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
      : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`;

  const iconStyle = isFavorite ? { fill: '#f97316', color: '#f97316' } : { color: iconColor };

  return (
    <div style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}>
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
        style={buttonStyle}
      >
        <Heart
          size={20}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={iconStyle}
        />
      </button>
    </div>
  );
};

// Simplified Seller Info Component
const SellerInfo = ({ 
  seller, 
  displayProgress, 
  showSearchBarInProductDetail 
}: { 
  seller: any; 
  displayProgress: number; 
  showSearchBarInProductDetail: boolean;
}) => {
  const formatFollowerCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M followers`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K followers`;
    return `${count} followers`;
  };

  const containerStyle = {
    backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`,
    opacity: 1 - (displayProgress * 2)
  };

  const textColor = showSearchBarInProductDetail
    ? 'rgba(75, 85, 99, 0.9)'
    : displayProgress > 0.5 
      ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
      : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`;

  return (
    <div className="ml-2 rounded-full transition-all duration-700 flex-shrink-0" style={containerStyle}>
      <button className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700">
        <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={seller.image_url || "https://picsum.photos/100/100?random=1"}
            alt={`${seller.name} seller`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://picsum.photos/100/100?random=1";
            }}
          />
        </div>
        <span className="text-xs font-medium transition-all duration-700" style={{ color: textColor }}>
          {seller.name}
        </span>
        {seller.verified && <VerificationBadge />}
        <span className="text-xs font-medium transition-all duration-700" style={{ color: textColor }}>
          {formatFollowerCount(seller.followers_count)}
        </span>
      </button>
    </div>
  );
};

export default function AliExpressHeader({
  activeTabId = 'recommendations',
  showCategoryTabs = true,
  customTabs,
  onCustomTabChange,
  cityName = 'New York',
  mode = 'home',
  scrollY = 0,
  productData,
  onBackClick,
  onFavoriteClick,
  onShareClick,
  onReportClick,
  isFavorite = false,
  inPanel = false,
  hideSearchBar = false,
  onSearchSubmit,
}: AliExpressHeaderProps) {
  const { displayProgress, showSearchBarInProductDetail } = useHeaderScroll(mode, scrollY);
  const { searchQuery, placeholder, handleSubmit, handleClearSearch, handleInputChange } = useHeaderSearch('', onSearchSubmit);
  const { selectedCity, locationDropdownRef, handleLocationClick } = useHeaderLocation(cityName);

  const [activeTab, setActiveTab] = useState(activeTabId);
  const tabsToShow = customTabs || [
    { id: 'recommendations', name: 'Recommendations' },
    { id: 'best-selling', name: 'Best Selling' },
    { id: 'new-arrivals', name: 'New Arrivals' },
    { id: 'deals', name: 'Deals' },
    { id: 'trending', name: 'Trending' }
  ];

  const shouldShowSellerInfo = mode === 'product-detail' && productData?.sellers && displayProgress < 0.5;

  const getHeaderStyle = () => {
    if (mode === 'product-detail') {
      return {
        backgroundColor: `rgba(0, 0, 0, ${0.4 * (1 - displayProgress)})`,
        backdropFilter: `blur(${5 * (1 - displayProgress)}px)`
      };
    }
    return { backgroundColor: '#fff' };
  };

  const getInputClassName = () => `
    w-full h-8 px-3 pr-24
    border border-gray-300 rounded-full
    text-sm placeholder-gray-500
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
    transition-all duration-200
  `;

  const getLocationButtonClassName = () => `
    flex items-center space-x-1 px-2 py-1
    bg-gray-100 hover:bg-gray-200
    rounded-full text-xs text-gray-700
    transition-colors duration-200
    whitespace-nowrap
  `;

  const handleCameraClick = () => {
    // Camera functionality placeholder
    console.log('Camera clicked');
  };

  // Back button icon
  const BackIcon = inPanel ? X : ChevronLeft;

  return (
    <header className="fixed top-0 w-full z-40" style={getHeaderStyle()}>
      {mode === 'home' && !hideSearchBar && (
        <div className="flex items-center justify-between px-2 bg-white" style={{ height: '36px' }}>
          <div className="flex-1 relative max-w-full mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={handleInputChange}
                  className={getInputClassName()}
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {searchQuery.trim() ? (
                    <button type="button" onClick={handleClearSearch} className="p-1 hover:bg-gray-100">
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  ) : (
                    <>
                      <button type="button" className="p-1" onClick={handleCameraClick}>
                        <Camera className="h-6 w-6 text-gray-900 stroke-[1.5]" />
                      </button>
                      <div className="relative" ref={locationDropdownRef}>
                        <button type="button" onClick={handleLocationClick} className={getLocationButtonClassName()}>
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span className="max-w-[80px] truncate">{selectedCity}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {mode === 'product-detail' && (
        <div className="py-2 px-3 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            <div className="flex items-center flex-shrink-0">
              <button 
                className="h-8 w-8 rounded-full flex items-center justify-center p-1 hover:bg-gray-100"
                onClick={onBackClick}
                style={{
                  backgroundColor: showSearchBarInProductDetail ? 'transparent' : `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
                }}
              >
                <BackIcon
                  size={24}
                  strokeWidth={inPanel ? 2 : 1.5}
                  className="transition-all duration-700"
                  style={{
                    color: showSearchBarInProductDetail
                      ? 'rgba(75, 85, 99, 0.9)'
                      : displayProgress > 0.5 
                        ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                        : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
                  }}
                />
              </button>
              {shouldShowSellerInfo && productData?.sellers && (
                <SellerInfo 
                  seller={productData.sellers}
                  displayProgress={displayProgress}
                  showSearchBarInProductDetail={showSearchBarInProductDetail}
                />
              )}
            </div>

            {showSearchBarInProductDetail && (
              <div className="flex-1 px-2">
                <div className="relative max-w-full">
                  <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleInputChange}
                        className={getInputClassName()}
                      />
                      {searchQuery.trim() && (
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                          <button type="button" onClick={handleClearSearch} className="p-1 hover:bg-gray-100">
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="flex gap-1 flex-shrink-0">
              <FavoriteButton
                isFavorite={isFavorite}
                onClick={onFavoriteClick}
                displayProgress={displayProgress}
                showSearchBarInProductDetail={showSearchBarInProductDetail}
                favoriteCount={productData?.favorite_count}
              />
              <ThreeDotsMenu
                onShareClick={onShareClick}
                onReportClick={onReportClick}
                displayProgress={displayProgress}
                showSearchBarInProductDetail={showSearchBarInProductDetail}
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'home' && showCategoryTabs && (
        <div className="relative overflow-hidden">
          <CategoryTabs 
            activeTab={activeTab}
            setActiveTab={(tabId) => {
              setActiveTab(tabId);
              onCustomTabChange?.(tabId);
            }}
            categories={tabsToShow}
            isSearchOverlayActive={false}
          />
        </div>
      )}
    </header>
  );
}