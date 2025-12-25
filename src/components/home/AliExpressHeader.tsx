import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Search, TrendingUp, TrendingDown, Flame, Zap, ChevronDown, MapPin } from 'lucide-react';
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
  
  // New props for location dropdown
  cityName?: string;
  locationOptions?: Array<{ id: string; name: string }>;
  onLocationChange?: (locationId: string) => void;
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

  // Popular searches data with trend indicators - FIXED: Consistent trends
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

  // Process search list items to ensure they have the correct format - FIXED: Use deterministic trend assignment
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

  // Cycle through popular searches for placeholder - FIXED: Use string items
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

  // Handle location dropdown toggle
  const handleLocationClick = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  // Handle location selection
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

  // Get icon based on trend - FIXED: Use useMemo for consistent icons
  const getTrendIcon = useMemo(() => {
    const iconMap = {
      'hot': <Flame className="h-3 w-3 mr-1.5 text-orange-500" />,
      'trending-up': <TrendingUp className="h-3 w-3 mr-1.5 text-green-500" />,
      'trending-down': <TrendingDown className="h-3 w-3 mr-1.5 text-red-500" />,
      'popular': <Zap className="h-3 w-3 mr-1.5 text-blue-500" />,
    };

    return (trend: string) => iconMap[trend as keyof typeof iconMap] || <Search className="h-3 w-3 mr-1.5 text-gray-500" />;
  }, []);

  return (
    <header 
      className="fixed top-0 w-full z-40 bg-white" 
      style={{ margin: 0, padding: 0, boxShadow: 'none' }}
    >
      {/* Search Bar - Updated to show black border initially */}
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
                  // Location dropdown button when no text
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
                        ${isLocationDropdownOpen ? 'bg-gray-200' : ''}
                      `}
                    >
                      {/* Location icon */}
                      <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      
                      {/* City name - truncated if too long */}
                      <span className="max-w-[80px] truncate">{selectedCity}</span>
                      
                      {/* Chevron icon */}
                      <ChevronDown className={`h-3.5 w-3.5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {isLocationDropdownOpen && (
                      <div className="absolute right-0 mt-1 py-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                          Select Location
                        </div>
                        {locationOptions.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => handleLocationSelect(location.id, location.name)}
                            className={`
                              w-full text-left px-3 py-2 text-xs font-medium
                              hover:bg-gray-50 transition-colors
                              flex items-center gap-2
                              ${selectedCity === location.name ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}
                            `}
                          >
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {location.name}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Manage locations clicked');
                              setIsLocationDropdownOpen(false);
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            Manage locations
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

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
  );
}