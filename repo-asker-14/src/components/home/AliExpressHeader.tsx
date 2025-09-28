import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Home, Search, ShoppingBag, Tv, Sofa, ShoppingCart, Car, Gamepad2, Settings, X, Globe, User, Book, Languages, Check, Pin, MapPin, Edit, ScanLine, Mic } from 'lucide-react';
import HeaderSearchBar from './header/HeaderSearchBar';
import CategoryTabs from './header/CategoryTabs';
import CategoryPanel from './header/CategoryPanel';
import VoiceSearchOverlay from './header/VoiceSearchOverlay';
import NotificationBadge from './header/NotificationBadge';
import HeaderLogoToggle from './header/HeaderLogoToggle';
import HomepageDropdown from './header/HomepageDropdown';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProductFilterBar from './ProductFilterBar';
import LocationScreen from './header/LocationScreen';
import SearchOverlay from './SearchOverlay';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showFilterBar?: boolean;
  filterCategories?: Array<{
    id: string;
    label: string;
    options: string[];
  }>;
  selectedFilters?: Record<string, string>;
  onFilterSelect?: (filterId: string, option: string) => void;
  onFilterClear?: (filterId: string) => void;
  onClearAll?: () => void;
  onFilterButtonClick?: (filterId: string) => void;
  isFilterDisabled?: (filterId: string) => boolean;
}

export default function AliExpressHeader({ 
  activeTabId = 'recommendations', 
  showFilterBar = false,
  filterCategories = [],
  selectedFilters = {},
  onFilterSelect = () => {},
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled = () => false
}: AliExpressHeaderProps) {
  const { progress } = useScrollProgress();
  const { currentLanguage, setLanguage, supportedLanguages, currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const homepageType = 'marketplace';

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [isSearchGlowing, setIsSearchGlowing] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showLocationScreen, setShowLocationScreen] = useState(false);
  const [languageQuery, setLanguageQuery] = useState('');
  const [pinnedLanguages, setPinnedLanguages] = useState(new Set(['en', 'es']));
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);

  // Popular searches data
  const popularSearches = useRef([
    "Wireless earbuds",
    "Smart watches",
    "Summer dresses",
    "Phone cases",
    "Home decor",
    "Fitness trackers",
    "LED strip lights"
  ]).current;

  const [currentPopularSearch, setCurrentPopularSearch] = useState(0);
  const [placeholder, setPlaceholder] = useState(popularSearches[0]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const showSearchBarRef = useRef(showSearchBar);

  // Define search-specific tabs
  const searchTabs = useMemo(() => [
    { id: 'products', name: 'Products' },
    { id: 'sellers', name: 'Sellers' },
    { id: 'posts', name: 'Posts' },
    { id: 'shorts', name: 'Shorts' },
    { id: 'articles', name: 'Articles' },
  ], []);

  const categories = useMemo(() => [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), path: '/categories/home-living' },
    { id: 'fashion', name: t('fashion', { ns: 'categories' }), path: '/categories/fashion' },
    { id: 'entertainment', name: t('entertainment', { ns: 'categories' }), path: '/categories/entertainment' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), path: '/categories/kids-hobbies' },
    { id: 'sports', name: t('sports', { ns: 'categories' }), path: '/categories/sports-outdoors' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), path: '/categories/automotive' },
    { id: 'women', name: t('women', { ns: 'categories' }), path: '/categories/women' },
    { id: 'men', name: t('men', { ns: 'categories' }), path: '/categories/men' },
    { id: 'books', name: t('books', { ns: 'categories' }), path: '/categories/books' },
  ], [t]);

  // Determine which tabs to show based on search overlay state
  const tabsToShow = showSearchOverlay ? searchTabs : categories;

  // Add this function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // Fix: Set active tab to products when search overlay opens
  useEffect(() => {
    if (showSearchOverlay) {
      setActiveTab('products');
    }
  }, [showSearchOverlay]);

  // Calculate header height dynamically
  useEffect(() => {
    const calculateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    calculateHeaderHeight();

    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
    };
  }, [showSearchOverlay, showSettingsPanel, showFilterBar]);

  // Also recalculate when filter bar visibility changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showFilterBar, activeTab]);

  // Fallback languages
  const languages = useMemo(() => {
    if (supportedLanguages && Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
      return supportedLanguages;
    }

    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    ];
  }, [supportedLanguages]);

  // Filter and sort languages
  const filteredLanguages = useMemo(() => {
    const filtered = languages.filter((lang) =>
      lang.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aPinned = pinnedLanguages.has(a.code);
      const bPinned = pinnedLanguages.has(b.code);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [languageQuery, pinnedLanguages, languages]);

  // Handle body scroll locking
  useEffect(() => {
    if (showSettingsPanel || showSearchOverlay) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showSettingsPanel, showSearchOverlay]);

  // Language functionality
  const handleLanguageSelect = (language: any) => {
    setLanguage(language.code);
    setLanguageQuery('');
  };

  const toggleLanguagePin = (languageCode: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setPinnedLanguages((prev) => {
      const newSet = new Set(prev);
      newSet.has(languageCode) ? newSet.delete(languageCode) : newSet.add(languageCode);
      return newSet;
    });
  };

  const handleOpenLocationScreen = () => {
    setShowLocationScreen(true);
    setShowSettingsPanel(false);
  };

  const handleCloseLocationScreen = () => {
    setShowLocationScreen(false);
  };

  // Search functionality
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchOverlay(false);
    }
  };

  // Modified search focus handler - ensure products tab is active
  const handleSearchFocus = () => {
    setShowSearchOverlay(true);
    setIsSearchFocused(true);
    setActiveTab('products'); // Ensure products tab is active when search opens
  };

  const handleCloseSearchOverlay = () => {
    setShowSearchOverlay(false);
    setIsSearchFocused(false);

    // Reset to the original category tab when closing search overlay
    const currentCategory = categories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  };

  // Handle search tab click
  const handleSearchTabClick = (tabId: string) => {
    setActiveTab(tabId);
    console.log(`Search tab clicked: ${tabId}`);
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  // Stable scroll handler
  const handleScroll = useCallback(() => {
    if (showSettingsPanel || showSearchOverlay) return;

    const currentScrollY = window.scrollY;
    scrollY.current = currentScrollY;

    if (currentScrollY > 100 && !showSearchBarRef.current) {
      setShowSearchBar(true);
      showSearchBarRef.current = true;
    } else if (currentScrollY <= 100 && showSearchBarRef.current) {
      setShowSearchBar(false);
      showSearchBarRef.current = false;
    }
  }, [showSettingsPanel, showSearchOverlay]);

  // Track scroll position
  useEffect(() => {
    if (showSettingsPanel || showSearchOverlay) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, showSettingsPanel, showSearchOverlay]);

  // Prevent background scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((showSettingsPanel || showSearchOverlay) && 
          !settingsPanelRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if ((showSettingsPanel || showSearchOverlay) && 
          !settingsPanelRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    if (showSettingsPanel || showSearchOverlay) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showSettingsPanel, showSearchOverlay]);

  // Determine if we should show the top bar based on current route
  const isForYouPage = location.pathname === '/for-you' || location.pathname === '/';

  // Update active tab when prop changes or route changes
  useEffect(() => {
    const currentCategory = categories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  }, [activeTabId, location.pathname, categories]);

  // Cycle through popular searches
  useEffect(() => {
    if (isSearchFocused || showSearchOverlay) {
      setPlaceholder('Search for products');
      return;
    }

    const interval = setInterval(() => {
      setCurrentPopularSearch((prev) => (prev + 1) % popularSearches.length);
      setPlaceholder(popularSearches[currentPopularSearch]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isSearchFocused, currentPopularSearch, popularSearches, showSearchOverlay]);

  // Stable tab change handler
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);

    // Handle navigation for regular categories
    if (!showSearchOverlay) {
      const category = categories.find(cat => cat.id === tabId);
      if (category && category.path) {
        navigate(category.path);
      }
    } else {
      // Handle search tabs (no navigation, just filtering)
      handleSearchTabClick(tabId);
    }
  }, [showSearchOverlay, categories, navigate]);

  const togglePanel = () => setIsOpen(!isOpen);
  const handleVoiceSearch = () => setVoiceSearchActive(!voiceSearchActive);

  // Settings panel handlers
  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
    setLanguageQuery('');
  };

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For search bar
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }

      // For settings panel
      if (settingsPanelRef.current && 
          !settingsPanelRef.current.contains(event.target as Node) &&
          showSettingsPanel) {
        const target = event.target as Element;
        if (target.classList.contains('fixed') && target.classList.contains('inset-0')) {
          toggleSettingsPanel();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsPanel]);

  return (
    <header 
      id="ali-header" 
      ref={headerRef}
      className="fixed top-0 w-full z-40 bg-white" 
      style={{ margin: 0, padding: 0, boxShadow: 'none' }}
    >
      {/* Search Overlay */}
      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={handleCloseSearchOverlay}
        searchQuery={searchQuery}
        popularSearches={popularSearches}
        headerHeight={headerHeight}
        activeTab={activeTab}
        onSearchQueryChange={handleSearchQueryChange}
      />
      
      {/* Location Screen Overlay */}
      {showLocationScreen && <LocationScreen onClose={handleCloseLocationScreen} />}

            {/* Top Bar */}
    

            {/* Top Bar */}
            <div 
              className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
              style={{ height: '36px' }}
            >
              {showSearchBar ? (
                // Scrolled state
                <div className="flex-1 relative max-w-md mx-auto" key="search-bar">
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Search or Ask Questions"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      className="w-full px-3 py-1 pr-16 text-sm font-medium border-2 border-gray-800 rounded-full transition-all duration-300 bg-white shadow-sm"
                      ref={searchRef}
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      {showSearchOverlay && !searchQuery.trim() ? (
                        // Close button (text) when overlay is open and search is empty
                        <button
                          type="button"
                          onClick={handleCloseSearchOverlay}
                          className="px-3 py-1 text-xs font-medium text-gray-600 bg-text-gray-800 bg-gray-100 rounded-full transition-colors"
                        >
                          Close
                        </button>
                      ) : searchQuery.trim() ? (
                        // Clear button when there's text
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      ) : (
                        // Default icons when no text and overlay closed
                        <>
                          <ScanLine className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
                          <Mic 
                            className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" 
                            onClick={handleVoiceSearch}
                          />
                        </>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                // Normal state
                <>
                  <div className="flex items-center">
                    {user ? (
                      <button
                        onClick={() => navigate('/seller-dashboard/overview')}
                        className=" transition-all duration-200 rounded-full"
                      >
                        <Avatar className="w-[26px] h-[26px] min-w-[26px] min-h-[26px]" style={{ width: '26px', height: '26px' }}>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="Profile" />
                          <AvatarFallback className="text-xs font-medium bg-gray-200 text-gray-700 w-[26px] h-[26px]">
                            {user.email?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/auth')}
                        className="w-[32px] h-[32px] rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <span className="text-xs font-medium text-gray-600">?</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 max-w-md mx-2 relative">
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleSearchFocus}
                        className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none transition-all duration-300 bg-white shadow-sm"
                        ref={searchRef}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {showSearchOverlay && !searchQuery.trim() ? (
                          // Close button (text) when overlay is open and search is empty
                          <button
                            type="button"
                            onClick={handleCloseSearchOverlay}
                            className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                          >
                            Close
                          </button>
                        ) : searchQuery.trim() ? (
                          // Clear button when there's text
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        ) : (
                          // Search icon when no text and overlay closed
                          <Search className="h-4 w-4 text-gray-600 font-bold" />
                        )}
                      </div>
                    </form>
                  </div>

                  <Settings 
                    onClick={toggleSettingsPanel}
                    className={`h-[20px] w-[20px] text-gray-600 cursor-pointer transition-colors ${
                      showSettingsPanel ? 'bg-gray-100' : 'hover:bg-gray-100'
                    }`}
                  />
                </>
              )}
            </div>

      

      
      {/* Settings Panel */}
      {showSettingsPanel && !showLocationScreen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-300"
            onClick={toggleSettingsPanel}
          />

          <div
            ref={settingsPanelRef}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg z-40 animate-in slide-in-from-bottom duration-300"
            style={{
              maxHeight: '90vh',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">{t('settings', 'Settings')}</h3>
              <button
                onClick={toggleSettingsPanel}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{t('language', 'Language')}</span>
                </div>

                <div className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Languages className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {currentLanguage.nativeName || currentLanguage.name || 'English'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentLanguage.name || 'English'} • {currentLanguage.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {pinnedLanguages.has(currentLanguage.code) && (
                      <Pin className="h-4 w-4 text-orange-600 fill-current" />
                    )}
                    <Check className="h-4 w-4 text-orange-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {filteredLanguages.slice(0, 4).map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className={`p-2 text-sm rounded-lg border transition-all flex items-center justify-between ${
                        currentLanguage.code === language.code
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span>{language.nativeName}</span>
                      {pinnedLanguages.has(language.code) && (
                        <Pin className="h-3 w-3 text-orange-600 fill-current ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{t('location', 'Location')}</span>
                </div>

                <button
                  onClick={handleOpenLocationScreen}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {currentLocation.flag ? (
                      <img
                        src={`https://flagcdn.com/${currentLocation.flag.toLowerCase()}.svg`}
                        alt={currentLocation.name}
                        className="h-5 w-5 rounded object-cover"
                      />
                    ) : (
                      <MapPin className="h-5 w-5 text-orange-600" />
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {currentLocation.name.split(',')[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentLocation.name}
                      </div>
                    </div>
                  </div>
                  <Edit className="h-4 w-4 text-gray-400 hover:text-orange-600" />
                </button>
              </div>
            </div>

            <div className="h-4 bg-white" />
          </div>
        </>
      )}

      {/* Conditional rendering: ProductFilterBar or CategoryTabs */}
      <div className="relative overflow-hidden">
        {showFilterBar ? (
          <div data-header="true" className="product-filter-bar">
            <ProductFilterBar 
              filterCategories={filterCategories}
              selectedFilters={selectedFilters}
              onFilterSelect={onFilterSelect}
              onFilterClear={onFilterClear}
              onClearAll={onClearAll}
              onFilterButtonClick={onFilterButtonClick}
              isFilterDisabled={isFilterDisabled}
            />
          </div>
        ) : (
          <CategoryTabs 
            progress={1}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            categories={tabsToShow}
            isSearchOverlayActive={showSearchOverlay}
          />
        )}
      </div>

      {/* Category Panel */}
      <CategoryPanel 
        progress={1}
        isOpen={isOpen}
        activeTab={activeTab}
        categories={categories.map(cat => cat.id)}
        setActiveTab={setActiveTab}
        setIsOpen={setIsOpen}
      />

      {/* Voice Search Overlay */}
      <VoiceSearchOverlay
        active={voiceSearchActive}
        onCancel={handleVoiceSearch}
      />
    </header>
  );
}