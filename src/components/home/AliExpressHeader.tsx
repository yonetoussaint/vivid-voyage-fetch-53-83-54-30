// components/home/AliExpressHeader.tsx
import { useState, useRef, useEffect } from 'react';
import CategoryTabs from './header/CategoryTabs';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { X, Camera, MapPin, ChevronDown, ChevronLeft, MoreHorizontal, Share2, Flag, Heart } from 'lucide-react';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;
  cityName?: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (callback?: () => void) => {
    setIsOpen(false);
    callback?.();
  };

  const menuItems = [
    { icon: Share2, label: 'Share', onClick: onShareClick },
    { icon: Flag, label: 'Report', onClick: onReportClick },
    { label: 'Save', onClick: () => {} },
    { label: 'Follow', onClick: () => {} },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <div 
        className="rounded-full transition-all duration-700 hover-scale"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 relative"
          style={{
            backgroundColor: showSearchBarInProductDetail ? 'transparent' : undefined
          }}
        >
          <MoreHorizontal
            size={20}
            className="transition-all duration-700"
            style={{
              color: showSearchBarInProductDetail
                ? `rgba(75, 85, 99, 0.9)`
                : displayProgress > 0.5 
                  ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                  : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
            }}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item.onClick)}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-3" />}
              <span className={item.icon ? '' : 'ml-7'}>{item.label}</span>
            </button>
          ))}
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
  likeCount,
  showSearchBarInProductDetail
}: {
  isFavorite: boolean;
  onClick?: () => void;
  displayProgress: number;
  likeCount?: number;
  showSearchBarInProductDetail: boolean;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick?.();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const buttonStyle = {
    backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`,
  };

  const iconStyle = {
    color: isFavorite ? '#f97316' : 
      showSearchBarInProductDetail 
        ? 'rgba(75, 85, 99, 0.9)' 
        : displayProgress > 0.5 
          ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
          : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`,
    fill: isFavorite ? '#f97316' : 'none',
    transition: 'all 0.3s ease'
  };

  const textStyle = {
    color: isFavorite ? '#f97316' : 
      displayProgress > 0.5 
        ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
        : `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`,
    opacity: showSearchBarInProductDetail ? 0 : 1 - (displayProgress / 0.7)
  };

  // When scrolled to search bar mode
  if (showSearchBarInProductDetail) {
    return (
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
      >
        <Heart
          size={20}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={iconStyle}
        />
      </button>
    );
  }

  // When showing with count (not scrolled)
  return (
    <div 
      className="rounded-full transition-all duration-700 hover-scale"
      style={buttonStyle}
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700"
      >
        <Heart
          size={20}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={iconStyle}
        />
        {likeCount !== undefined && (
          <span 
            className="text-xs font-medium transition-all duration-700 ease-out"
            style={textStyle}
          >
            {likeCount}
          </span>
        )}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity] = useState(cityName);
  const displayProgress = Math.min(scrollY / 100, 1);
  const showSearchBarInProductDetail = scrollY > 50;

  // Calculate header background based on mode and scroll
  const getHeaderStyle = () => {
    if (mode === 'home') return { backgroundColor: 'white' };
    
    if (displayProgress > 0.5) {
      return {
        backgroundColor: `rgba(255, 255, 255, ${displayProgress})`,
        backdropFilter: `blur(${displayProgress * 4}px)`
      };
    }
    
    return {
      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)'
    };
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
  };

  const handleClearSearch = () => setSearchQuery('');

  // Get seller text styles based on scroll progress
  const getSellerContainerStyle = () => ({
    backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`,
  });

  const getSellerTextStyle = () => ({
    color: displayProgress > 0.5 
      ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
      : `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
  });

  // Format follower count
  const formatFollowerCount = (count?: number) => {
    if (!count) return '';
    return count > 1000 
      ? `${(count / 1000).toFixed(1)}k` 
      : count.toString();
  };

  // Render Home Mode Header
  if (mode === 'home' && !hideSearchBar) {
    return (
      <header className="fixed top-0 w-full z-40 bg-white">
        {/* Search Bar */}
        <div className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white" style={{ height: '36px' }}>
          <div className="flex-1 relative max-w-full mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search on AliExpress"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-1.5 pl-4 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {searchQuery.trim() ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 hover:bg-gray-100 transition-colors rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        className="p-1 transition-colors hover:bg-gray-100 rounded-full"
                      >
                        <Camera className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
                      </button>
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center space-x-1 px-1.5 py-0.5 hover:bg-gray-100 transition-colors rounded-full"
                        >
                          <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                          <span className="text-xs max-w-[60px] truncate">{selectedCity}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Category Tabs */}
        {showCategoryTabs && (
          <div className="relative overflow-hidden bg-white">
            <CategoryTabs 
              activeTab={activeTabId}
              setActiveTab={onCustomTabChange}
              categories={customTabs || [
                { id: 'recommendations', name: 'Recommendations' },
                { id: 'new', name: 'New' },
                { id: 'hot', name: 'Hot' },
                { id: 'fashion', name: 'Fashion' },
                { id: 'electronics', name: 'Electronics' },
              ]}
              isSearchOverlayActive={false}
            />
          </div>
        )}
      </header>
    );
  }

  // Render Product Detail Mode Header
  if (mode === 'product-detail') {
    return (
      <header className="fixed top-0 w-full z-40" style={getHeaderStyle()}>
        <div className="py-2 px-3 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            {/* Left Section - Back Button + Seller Info */}
            <div className="flex items-center flex-shrink-0">
              <button 
                onClick={onBackClick}
                className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
                style={{
                  backgroundColor: showSearchBarInProductDetail 
                    ? 'transparent' 
                    : `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
                }}
              >
                {inPanel ? (
                  <X
                    size={24}
                    strokeWidth={2}
                    className="transition-all duration-700"
                    style={{
                      color: showSearchBarInProductDetail
                        ? 'rgba(75, 85, 99, 0.9)'
                        : displayProgress > 0.5 
                          ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                          : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
                    }}
                  />
                ) : (
                  <ChevronLeft
                    size={24}
                    strokeWidth={2}
                    className="transition-all duration-700"
                    style={{
                      color: showSearchBarInProductDetail
                        ? 'rgba(75, 85, 99, 0.9)'
                        : displayProgress > 0.5 
                          ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                          : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
                    }}
                  />
                )}
              </button>

              {/* Seller Info - Shows when not scrolled to search bar */}
              {!showSearchBarInProductDetail && productData?.sellers && (
                <div 
                  className="ml-2 rounded-full transition-all duration-700 flex-shrink-0 hover-scale"
                  style={getSellerContainerStyle()}
                >
                  <button className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700">
                    <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={productData.sellers.image_url || "https://picsum.photos/100/100?random=1"}
                        alt={productData.sellers.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/100/100?random=1";
                        }}
                      />
                    </div>
                    <span 
                      className="text-xs font-medium transition-all duration-700"
                      style={getSellerTextStyle()}
                    >
                      {productData.sellers.name}
                    </span>
                    {productData.sellers.verified && <VerificationBadge />}
                    <span 
                      className="text-xs font-medium transition-all duration-700"
                      style={getSellerTextStyle()}
                    >
                      {formatFollowerCount(productData.sellers.followers_count)}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Middle Section - Search Bar when scrolled */}
            {showSearchBarInProductDetail && (
              <div className="flex-1 px-2">
                <div className="relative max-w-full">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search on AliExpress"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-1.5 pl-4 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {searchQuery.trim() && (
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 hover:bg-gray-100 transition-colors rounded-full"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Right Section - Action Buttons */}
            <div className="flex gap-1 flex-shrink-0">
              <FavoriteButton
                isFavorite={isFavorite}
                onClick={onFavoriteClick}
                displayProgress={displayProgress}
                likeCount={productData?.favorite_count}
                showSearchBarInProductDetail={showSearchBarInProductDetail}
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
      </header>
    );
  }

  return null;
}