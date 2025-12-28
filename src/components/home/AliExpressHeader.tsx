// components/home/AliExpressHeader.tsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, Search, TrendingUp, TrendingDown, Flame, Zap, ChevronDown, 
  MapPin, Camera, Heart, Share, ChevronLeft, LucideIcon 
} from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';
import { VerificationBadge } from '@/components/shared/VerificationBadge';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;

  // New props for optional search list
  showSearchList?: boolean;
  searchListItems?: Array<{ term: string; trend?: 'hot' | 'trending-up' | 'trending-down' | 'popular' }> | string[];
  onSearchItemClick?: (searchTerm: string) => void;
  flatBorders?: boolean;

  // Filter bar props
  showFilterBar?: boolean;
  filterCategories?: Array<{ id: string; name: string }>;
  selectedFilters?: string[];
  onFilterSelect?: (filterId: string) => void;
  onFilterClear?: (filterId: string) => void;
  onClearAll?: () => void;
  onFilterButtonClick?: () => void;
  isFilterDisabled?: boolean;

  // Location dropdown props
  cityName?: string;
  locationOptions?: Array<{ id: string; name: string }>;
  onLocationChange?: (locationId: string) => void;

  // New prop for opening locations panel
  onOpenLocationsPanel?: () => void;

  // NEW: Product Detail Header Props
  mode?: 'home' | 'product-detail';
  scrollY?: number; // For product detail scroll progress
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
  isFavorite?: boolean;
  inPanel?: boolean;
  actionButtons?: Array<{
    Icon: LucideIcon;
    onClick?: () => void;
    active?: boolean;
    activeColor?: string;
    count?: number;
  }>;
  hideSearchBar?: boolean; // Hide search bar in product detail mode
  onSearchSubmit?: (query: string) => void; // Custom search handler for product detail
}

// Header Action Button Component (moved from ProductDetail)
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
  scrolled?: boolean; // New prop for scrolled state (no background)
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
  shareCount,
  scrolled = false // New: scrolled state removes background
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

  // When scrolled, show simple button without background
  if (scrolled) {
    return (
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
      >
        <Icon
          size={20}
          strokeWidth={2.5}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={{
            fill: active && fillWhenActive ? activeColor : 'transparent',
            color: `rgba(75, 85, 99, 0.9)`
          }}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center animate-scale-in">
            {badge}
          </span>
        )}
      </button>
    );
  }

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

  // Compact circular button state (for transition before scrolled)
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

export default function AliExpressHeader({ 
  activeTabId = 'recommendations', 
  showCategoryTabs = true,
  customTabs,
  onCustomTabChange,

  // New props with defaults
  showSearchList = false,
  searchListItems,
  onSearchItemClick,
  flatBorders = true,

  // Filter bar props
  showFilterBar = false,
  filterCategories = [],
  selectedFilters = [],
  onFilterSelect,
  onFilterClear,
  onClearAll,
  onFilterButtonClick,
  isFilterDisabled = false,

  // Location dropdown props
  cityName = 'New York',
  locationOptions = [
    { id: 'new-york', name: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'houston', name: 'Houston' },
    { id: 'miami', name: 'Miami' },
  ],
  onLocationChange,

  // New prop for locations panel
  onOpenLocationsPanel,

  // NEW: Product Detail Header Props
  mode = 'home',
  scrollY = 0,
  productData,
  onBackClick,
  onFavoriteClick,
  onShareClick,
  isFavorite = false,
  inPanel = false,
  actionButtons = [],
  hideSearchBar = false,
  onSearchSubmit,
}: AliExpressHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(activeTabId);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cityName);

  const searchRef = useRef<HTMLInputElement>(null);
  const searchListRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Calculate scroll progress for product detail mode
  const maxScroll = 120;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const displayProgress = mode === 'product-detail' ? scrollProgress : 0;
  
  // Threshold when search bar should appear in product detail mode
  const searchBarThreshold = 0.3;
  const showSearchBarInProductDetail = mode === 'product-detail' && displayProgress > searchBarThreshold;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected city when prop changes
  useEffect(() => {
    setSelectedCity(cityName);
  }, [cityName]);

  // Popular searches data with trend indicators
  const popularSearches = useMemo(() => [
    { term: "Wireless earbuds", trend: 'hot' as const },
    { term: "Smart watches", trend: 'trending-up' as const },
    { term: "Summer dresses", trend: 'hot' as const },
    { term: "Phone cases", trend: 'popular' as const },
    { term: "Home decor", trend: 'trending-down' as const },
    { term: "Fitness trackers", trend: 'trending-up' as const },
    { term: "LED strip lights", trend: 'popular' as const }
  ], []);

  const categories = useMemo(() => [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), path: '/categories/home-living' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), path: '/categories/kids-hobbies' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), path: '/categories/automotive' },
    { id: 'women', name: t('women', { ns: 'categories' }), path: '/categories/women' },
    { id: 'men', name: t('men', { ns: 'categories' }), path: '/categories/men' },
    { id: 'books', name: t('books', { ns: 'categories' }), path: '/categories/books' },
  ], [t]);

  // Determine which tabs to show
  const tabsToShow = customTabs || categories;

  // Process search list items to ensure they have the correct format
  const searchItemsToShow = useMemo(() => {
    if (!searchListItems) return popularSearches;

    // Convert all items to objects with deterministic trends
    const processedItems = searchListItems.map((item, index) => {
      if (typeof item === 'string') {
        // Deterministic trend assignment based on index to avoid flashing
        const trends: Array<'hot' | 'trending-up' | 'trending-down' | 'popular'> = 
          ['hot', 'trending-up', 'popular', 'trending-down'];
        const trendIndex = index % trends.length;
        return { term: item, trend: trends[trendIndex] };
      }
      // For object items, ensure they have a trend
      return { term: item.term, trend: item.trend || 'popular' };
    });

    return processedItems;
  }, [searchListItems, popularSearches]);

  // Generate a unique key for CategoryTabs based on the actual tabs being displayed
  const categoryTabsKey = tabsToShow.map(tab => tab.id).join('-');

  // Cycle through popular searches for placeholder
  useEffect(() => {
    let currentIndex = 0;
    const updatePlaceholder = () => {
      setPlaceholder(popularSearches[currentIndex].term);
      currentIndex = (currentIndex + 1) % popularSearches.length;
    };

    // Set initial placeholder
    updatePlaceholder();

    const interval = setInterval(updatePlaceholder, 3000);

    return () => clearInterval(interval);
  }, [popularSearches]);

  // Update active tab when prop changes or route changes
  useEffect(() => {
    setActiveTab(activeTabId);
  }, [activeTabId, location.pathname]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    if (customTabs && onCustomTabChange) {
      onCustomTabChange(tabId);
    } else if (!customTabs) {
      const category = categories.find(cat => cat.id === tabId);
      if (category && category.path) {
        navigate(category.path);
      }
    }
  };

  // Handle location button click - DIRECTLY OPEN THE PANEL
  const handleLocationClick = () => {
    // Open the locations panel directly
    if (onOpenLocationsPanel) {
      onOpenLocationsPanel();
    }
    // Don't show dropdown at all
    setIsLocationDropdownOpen(false);
  };

  // Handle location selection from dropdown (if we keep it as backup)
  const handleLocationSelect = (locationId: string, locationName: string) => {
    setSelectedCity(locationName);
    setIsLocationDropdownOpen(false);

    if (onLocationChange) {
      onLocationChange(locationId);
    }
  };

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchQuery(''); // Clear search after submit
    }
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  // Handle search focus
  const handleFocus = () => {
    // You can add any focus logic here if needed
  };

  // Handle search item click
  const handleSearchItemClick = (searchTerm: string) => {
    if (onSearchItemClick) {
      onSearchItemClick(searchTerm);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Get icon based on trend
  const getTrendIcon = useMemo(() => {
    const iconMap = {
      'hot': <Flame className="h-3 w-3 mr-1.5 text-orange-500" />,
      'trending-up': <TrendingUp className="h-3 w-3 mr-1.5 text-green-500" />,
      'trending-down': <TrendingDown className="h-3 w-3 mr-1.5 text-red-500" />,
      'popular': <Zap className="h-3 w-3 mr-1.5 text-blue-500" />,
    };

    return (trend: string) => iconMap[trend as keyof typeof iconMap] || <Search className="h-3 w-3 mr-1.5 text-gray-500" />;
  }, []);

  // Handle filter selection
  const handleFilterSelect = (filterId: string) => {
    if (onFilterSelect) {
      onFilterSelect(filterId);
    }
  };

  // Handle filter clear
  const handleFilterClear = (filterId: string) => {
    if (onFilterClear) {
      onFilterClear(filterId);
    }
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  // Handle filter button click
  const handleFilterButtonClick = () => {
    if (onFilterButtonClick) {
      onFilterButtonClick();
    }
  };

  // Default action buttons for product detail
  const defaultActionButtons = useMemo(() => {
    if (actionButtons.length > 0) return actionButtons;
    
    if (mode === 'product-detail') {
      return [
        {
          Icon: Heart,
          onClick: onFavoriteClick,
          active: isFavorite,
          activeColor: "#f43f5e",
          count: productData?.favorite_count || 0
        },
        {
          Icon: Share,
          onClick: onShareClick,
          active: false
        }
      ];
    }
    
    return [];
  }, [actionButtons, mode, onFavoriteClick, onShareClick, isFavorite, productData?.favorite_count]);

  // Back/Close icon component
  const IconComponent = inPanel ? X : ChevronLeft;

  return (
    <header 
      className="fixed top-0 w-full z-40" 
      style={{ 
        margin: 0, 
        padding: 0, 
        boxShadow: 'none',
        backgroundColor: mode === 'product-detail' 
          ? `rgba(255, 255, 255, ${displayProgress * 0.95})` 
          : 'white',
        backdropFilter: mode === 'product-detail' && displayProgress > 0 ? `blur(${displayProgress * 8}px)` : 'none',
        boxShadow: mode === 'product-detail' && displayProgress > 0.1 ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      {/* Header content based on mode */}
      {mode === 'home' && !hideSearchBar ? (
        // HOME MODE: Original search bar design WITH camera and location buttons
        <div 
          className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
          style={{ height: '36px' }}
        >
          <div className="flex-1 relative max-w-full mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  className={`
                    w-full px-3 py-1 pr-16 text-sm font-medium text-gray-900 bg-white 
                    transition-all duration-300 shadow-sm placeholder-gray-500
                    ${flatBorders ? 'rounded-none border-2 border-gray-900' : 'rounded-full border-2 border-gray-800'}
                  `}
                  ref={searchRef}
                />

                {/* Right icons - ORIGINAL DESIGN WITH CAMERA AND LOCATION */}
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {/* Clear button when there's text */}
                  {searchQuery.trim() ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  ) : (
                    <>
                      {/* Camera icon button - NO HOVER BACKGROUND */}
                      <button
                        type="button"
                        className="p-1 transition-colors"
                        onClick={() => {
                          // Add camera functionality here
                          console.log('Camera button clicked');
                        }}
                      >
                        <Camera className="h-6 w-6 text-gray-900 font-bold stroke-[1.5]" />
                      </button>

                      {/* Location button - ORIGINAL DESIGN */}
                      <div className="relative" ref={locationDropdownRef}>
                        <button
                          type="button"
                          onClick={handleLocationClick}
                          className={`
                            flex items-center justify-between gap-1.5
                            px-2.5 py-1
                            text-xs font-medium text-gray-600 
                            bg-gray-100 hover:bg-gray-200
                            transition-all duration-200
                            ${flatBorders ? 'rounded-none' : 'rounded-full'}
                          `}
                        >
                          {/* Location icon - ORIGINAL SIZE */}
                          <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />

                          {/* City name - ORIGINAL TRUNCATION */}
                          <span className="max-w-[80px] truncate">{selectedCity}</span>

                          {/* Chevron icon - ORIGINAL SIZE */}
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
      ) : mode === 'product-detail' ? (
        // PRODUCT DETAIL MODE: Dynamic header based on scroll
        <div className="py-2 px-3 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto gap-2">
            {/* Left side: Back button */}
            <div className="flex items-center flex-shrink-0">
              <button 
                className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 hover:bg-gray-100"
                onClick={onBackClick}
                style={{
                  backgroundColor: showSearchBarInProductDetail 
                    ? 'transparent' 
                    : `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})`
                }}
              >
                <IconComponent
                  size={24}
                  strokeWidth={2.5}
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

              {/* Seller info when not scrolled much */}
              {displayProgress < 0.3 && productData?.sellers && !showSearchBarInProductDetail && (
                <div 
                  className="ml-2 rounded-full transition-all duration-700 flex-shrink-0"
                  style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
                >
                  <button
                    onClick={() => {
                      if (productData?.sellers?.id) {
                        navigate(`/seller/${productData.sellers.id}`);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={productData.sellers.image_url || "https://picsum.photos/100/100?random=1"}
                        alt={`${productData.sellers.name} seller`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://picsum.photos/100/100?random=1";
                          target.onerror = null;
                        }}
                      />
                    </div>
                    
                    <span 
                      className="text-xs font-medium transition-all duration-700"
                      style={{
                        color: `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
                      }}
                    >
                      {productData.sellers.name}
                    </span>
                    
                    {productData.sellers.verified && <VerificationBadge />}
                    
                    <span 
                      className="text-xs font-medium transition-all duration-700"
                      style={{
                        color: `rgba(255, 255, 255, ${0.7 - (displayProgress * 0.2)})`
                      }}
                    >
                      {productData.sellers.followers_count && productData.sellers.followers_count >= 1000000 
                        ? `${(productData.sellers.followers_count / 1000000).toFixed(1)}M`
                        : productData.sellers.followers_count && productData.sellers.followers_count >= 1000
                        ? `${(productData.sellers.followers_count / 1000).toFixed(1)}K`
                        : productData.sellers.followers_count?.toString() || '0'
                      }
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Middle: Clean search bar appears when scrolled - NO CAMERA/LOCATION BUTTONS */}
            {showSearchBarInProductDetail && (
              <div className="flex-1 mx-2">
                <div className="relative max-w-full">
                  <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        className={`
                          w-full px-3 py-1 pr-10 text-sm font-medium text-gray-900 bg-white 
                          transition-all duration-300 shadow-sm placeholder-gray-500
                          ${flatBorders ? 'rounded-none border-2 border-gray-900' : 'rounded-full border-2 border-gray-800'}
                        `}
                        ref={searchRef}
                      />

                      {/* Right side - ONLY CLEAR BUTTON (NO CAMERA/LOCATION) */}
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        {/* Clear button when there's text */}
                        {searchQuery.trim() && (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                        {/* NO CAMERA OR LOCATION BUTTONS IN PRODUCT DETAIL MODE */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Right side: Action buttons - NO BACKGROUND WHEN SCROLLED */}
            <div className="flex gap-2 flex-shrink-0">
              {defaultActionButtons.map((button, index) => (
                <HeaderActionButton
                  key={index}
                  Icon={button.Icon}
                  active={button.active}
                  onClick={button.onClick}
                  progress={displayProgress}
                  activeColor={button.activeColor}
                  likeCount={button.count}
                  scrolled={showSearchBarInProductDetail} // Pass scrolled state
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Filter Bar (only in home mode) - ORIGINAL DESIGN */}
      {mode === 'home' && showFilterBar && filterCategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-2 py-1 min-w-max">
                {filterCategories.map((category) => {
                  const isSelected = selectedFilters.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleFilterSelect(category.id)}
                      disabled={isFilterDisabled}
                      className={`
                        flex items-center justify-center px-3 py-1 text-xs font-medium
                        whitespace-nowrap transition-all duration-200
                        ${flatBorders ? 'rounded-none' : 'rounded-full'}
                        ${isSelected 
                          ? 'bg-blue-600 text-white border border-blue-600' 
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }
                        ${isFilterDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {category.name}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterClear(category.id);
                          }}
                          className="ml-1.5 text-current hover:text-white/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedFilters.length > 0 && (
              <button
                onClick={handleClearAllFilters}
                disabled={isFilterDisabled}
                className="ml-2 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Optional Element Below Header */}
      {mode === 'home' && showCategoryTabs ? (
        // Category Tabs
        <div className="relative overflow-hidden">
          <CategoryTabs 
            key={categoryTabsKey}
            progress={1}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            categories={tabsToShow}
            isSearchOverlayActive={false}
          />
        </div>
      ) : mode === 'home' && showSearchList ? (
        // Horizontally Scrollable Search List
        <div className="bg-white">
          <div 
            ref={searchListRef}
            className="relative overflow-x-auto scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex px-2 py-1 space-x-2 min-w-max">
              {searchItemsToShow.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchItemClick(item.term)}
                  className={`
                    flex items-center justify-center
                    px-3 py-1
                    text-xs font-medium
                    whitespace-nowrap
                    transition-all duration-200
                    ${flatBorders ? 'rounded-none' : 'rounded-full'}
                    bg-gray-100
                    text-gray-700
                    hover:bg-gray-200
                    hover:text-gray-900
                    active:bg-gray-300
                    focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1
                  `}
                >
                  {getTrendIcon(item.trend)}
                  {item.term}
                </button>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        </div>
      ) : null}
    </header>
  );
}