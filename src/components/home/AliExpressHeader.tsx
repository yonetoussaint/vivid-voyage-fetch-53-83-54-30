import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Search } from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;

  // New props for optional search list
  showSearchList?: boolean;
  searchListItems?: string[];
  onSearchItemClick?: (searchTerm: string) => void;
  flatBorders?: boolean;
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
}: AliExpressHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(activeTabId);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const searchListRef = useRef<HTMLDivElement>(null);

  // Popular searches data
  const popularSearches = useMemo(() => [
    "Wireless earbuds",
    "Smart watches",
    "Summer dresses",
    "Phone cases",
    "Home decor",
    "Fitness trackers",
    "LED strip lights"
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

  // Use provided search list items or default popular searches
  const searchItemsToShow = searchListItems || popularSearches;

  // Generate a unique key for CategoryTabs based on the actual tabs being displayed
  const categoryTabsKey = tabsToShow.map(tab => tab.id).join('-');

  // Cycle through popular searches for placeholder
  useEffect(() => {
    let currentIndex = 0;
    const updatePlaceholder = () => {
      setPlaceholder(popularSearches[currentIndex]);
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

  // Handle settings button click
  const handleSettingsClick = () => {
    console.log('Settings button clicked');
    // You can add your settings panel logic here
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

  return (
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
                className="w-full px-3 py-1 pr-16 text-sm font-medium text-gray-900 bg-white border-2 border-gray-800 rounded-full transition-all duration-300 shadow-sm placeholder-gray-500"
                ref={searchRef}
              />

              {/* Right icons */}
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {/* Clear button when there's text */}
                {searchQuery.trim() ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                ) : (
                  // Settings button when no text
                  <button
                    type="button"
                    onClick={handleSettingsClick}
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
                  >
                    Settings
                  </button>
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
          {/* Scrollable search list - border top removed */}
          <div 
            ref={searchListRef}
            className="relative overflow-x-auto scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex px-2 py-2 space-x-2 min-w-max">
              {searchItemsToShow.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchItemClick(item)}
                  className={`
                    flex items-center justify-center
                    px-3 py-1.5
                    text-xs font-medium
                    whitespace-nowrap
                    transition-all duration-200
                    ${flatBorders ? 'rounded-none' : 'rounded-full'}
                    bg-gray-50
                    text-gray-700
                    border border-gray-200
                    hover:bg-gray-100
                    hover:text-gray-900
                    hover:border-gray-300
                    active:bg-gray-200
                    focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1
                  `}
                >
                  <Search className="h-3 w-3 mr-1.5 text-gray-500" />
                  {item}
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