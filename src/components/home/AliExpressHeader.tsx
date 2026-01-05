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
  isScrolled
}: {
  onShareClick?: () => void;
  onReportClick?: () => void;
  isScrolled?: boolean;
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
        style={{
          backgroundColor: isScrolled ? 'transparent' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <MoreHorizontal
          size={20}
          className="transition-all duration-700"
          style={{
            color: isScrolled ? 'rgba(75, 85, 99, 0.9)' : 'rgba(255, 255, 255, 0.9)'
          }}
        />
      </button>

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
  count,
  isScrolled
}: {
  isFavorite: boolean;
  onClick?: () => void;
  count?: number;
  isScrolled?: boolean;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick?.();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const buttonStyle = {
    backgroundColor: isScrolled ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
    color: isScrolled ? 'rgba(75, 85, 99, 0.9)' : 'rgba(255, 255, 255, 0.9)'
  };

  const iconStyle = {
    color: isFavorite ? '#f97316' : buttonStyle.color,
    fill: isFavorite ? '#f97316' : 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="rounded-full transition-all duration-700 hover-scale">
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700"
        style={buttonStyle}
      >
        <Heart
          size={20}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={iconStyle}
        />
        {!isScrolled && count !== undefined && (
          <span className="text-xs font-medium" style={{ color: buttonStyle.color }}>
            {count}
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

  // Render Home Mode Header
  if (mode === 'home' && !hideSearchBar) {
    return (
      <header className="fixed top-0 w-full z-40 bg-white">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex-1 relative max-w-full mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search on AliExpress"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {/* Search icon would go here */}
                </div>
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {searchQuery.trim() ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  ) : (
                    <>
                      <button type="button" className="p-1">
                        <Camera className="h-6 w-6 text-gray-900" />
                      </button>
                      <button type="button" className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm max-w-[80px] truncate">{selectedCity}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {showCategoryTabs && (
          <div className="relative overflow-hidden">
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
            />
          </div>
        )}
      </header>
    );
  }

  // Render Product Detail Mode Header
  if (mode === 'product-detail') {
    const isScrolled = showSearchBarInProductDetail;

    return (
      <header className="fixed top-0 w-full z-40" style={getHeaderStyle()}>
        <div className="py-2 px-3 w-full">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Left Section - Back Button + Seller Info */}
            <div className="flex items-center flex-shrink-0">
              <button 
                onClick={onBackClick}
                className="h-8 w-8 rounded-full flex items-center justify-center p-1 hover:bg-gray-100 transition-all duration-700"
                style={{
                  backgroundColor: isScrolled ? 'transparent' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                {inPanel ? (
                  <X size={24} className="transition-all duration-700" />
                ) : (
                  <ChevronLeft size={24} className="transition-all duration-700" />
                )}
              </button>

              {!isScrolled && productData?.sellers && (
                <button className="ml-2 rounded-full bg-black/10 hover-scale">
                  <div className="flex items-center gap-1.5 px-2.5 h-8 rounded-full">
                    <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden">
                      <img 
                        src={productData.sellers.image_url || "https://picsum.photos/100/100?random=1"}
                        alt={productData.sellers.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/100/100?random=1";
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white">
                      {productData.sellers.name}
                    </span>
                    {productData.sellers.verified && <VerificationBadge />}
                    <span className="text-xs font-medium text-white/80">
                      {productData.sellers.followers_count 
                        ? productData.sellers.followers_count > 1000 
                          ? `${(productData.sellers.followers_count / 1000).toFixed(1)}k` 
                          : productData.sellers.followers_count
                        : ''}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Middle Section - Search Bar when scrolled */}
            {isScrolled && (
              <div className="flex-1 px-2">
                <div className="relative max-w-full">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search on AliExpress"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {searchQuery.trim() && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
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
                count={productData?.favorite_count}
                isScrolled={isScrolled}
              />
              
              <ThreeDotsMenu
                onShareClick={onShareClick}
                onReportClick={onReportClick}
                isScrolled={isScrolled}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return null;
}