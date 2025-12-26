// components/home/AliExpressHeader.tsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Search, TrendingUp, TrendingDown, Flame, Zap, ChevronDown, MapPin, Camera } from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';

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
}

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
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  return (
    <>
      <header 
        className="fixed top-0 w-full z-40 bg-white" 
        style={{ margin: 0, padding: 0, boxShadow: 'none' }}
      >
        {/* Search Bar */}
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

                {/* Right icons */}
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
                      {/* Camera icon button - larger and bold (not extra bold) */}
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 transition-colors rounded-full"
                        onClick={() => {
                          // Add camera functionality here
                          console.log('Camera button clicked');
                        }}
                      >
                        <Camera className="h-6 w-6 text-gray-900 font-bold stroke-[1.75]" />
                      </button>

                      {/* Location button - DIRECTLY OPENS PANEL */}
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
                          {/* Location icon */}
                          <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />

                          {/* City name - truncated if too long */}
                          <span className="max-w-[80px] truncate">{selectedCity}</span>

                          {/* Chevron icon */}
                          <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                        </button>

                        {/* REMOVED DROPDOWN MENU - Panel opens directly instead */}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilterBar && filterCategories.length > 0 && (
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
        {showCategoryTabs ? (
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
        ) : showSearchList ? (
          // Horizontally Scrollable Search List
          <div className="bg-white">
            {/* Scrollable search list */}
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

              {/* Fade effect on the right side to indicate scrollability */}
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}