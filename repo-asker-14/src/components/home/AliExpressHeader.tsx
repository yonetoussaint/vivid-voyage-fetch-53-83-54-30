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
import ProductFilterBar from './ProductFilterBar'; // Import ProductFilterBar
import LocationScreen from './header/LocationScreen';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showFilterBar?: boolean; // Add this prop
}

  export default function AliExpressHeader({ 
    activeTabId = 'recommendations', 
    showFilterBar = false 
  }: AliExpressHeaderProps) {
  const { progress } = useScrollProgress();
  const { currentLanguage, setLanguage, supportedLanguages, currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const homepageType = 'marketplace'; // Fixed to marketplace

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
  const scrollY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // Popular searches data (using useRef to prevent recreation on re-renders)
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

  // Fallback languages in case useLanguageSwitcher returns undefined
  const languages = useMemo(() => {
    if (supportedLanguages && Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
      return supportedLanguages;
    }

    // Fallback languages
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    ];
  }, [supportedLanguages]);

  // Filter and sort languages based on search query and pinned status
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

  // Handle body scroll locking when settings panel is open
  useEffect(() => {
    if (showSettingsPanel) {
      // Prevent background scrolling - more comprehensive approach
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
    } else {
      // Restore scrolling
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

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showSettingsPanel]);

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
    setShowSettingsPanel(false); // Close settings panel when opening location screen
  };

  const handleCloseLocationScreen = () => {
    setShowLocationScreen(false);
  };

  // Stable scroll handler for header behavior
  const handleScroll = useCallback(() => {
    // Don't update header scroll behavior when settings panel is open
    if (showSettingsPanel) return;

    const currentScrollY = window.scrollY;
    scrollY.current = currentScrollY;

    // Only update state if the threshold is crossed
    if (currentScrollY > 100 && !showSearchBarRef.current) {
      setShowSearchBar(true);
      showSearchBarRef.current = true;
    } else if (currentScrollY <= 100 && showSearchBarRef.current) {
      setShowSearchBar(false);
      showSearchBarRef.current = false;
    }
  }, [showSettingsPanel]);

  // Track scroll position - but disable when panel is open
  useEffect(() => {
    if (showSettingsPanel) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, showSettingsPanel]);

  // Prevent any background scrolling when panel is open
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showSettingsPanel && !settingsPanelRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (showSettingsPanel && !settingsPanelRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (showSettingsPanel && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'PageDown' || e.key === 'PageUp')) {
        e.preventDefault();
      }
    };

    if (showSettingsPanel) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [showSettingsPanel]);

  // Determine if we should show the top bar based on current route
  const isForYouPage = location.pathname === '/for-you' || location.pathname === '/';

  // Determine if we should show icons only in the tabs
  const showIconsOnly = !isForYouPage;

  const categories = useMemo(() => [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), icon: <Home className="h-3 w-3" />, path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), icon: <Tv className="h-3 w-3" />, path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), icon: <Sofa className="h-3 w-3" />, path: '/categories/home-living' },
    { id: 'fashion', name: t('fashion', { ns: 'categories' }), icon: <ShoppingBag className="h-3 w-3" />, path: '/categories/fashion' },
    { id: 'entertainment', name: t('entertainment', { ns: 'categories' }), icon: <Gamepad2 className="h-3 w-3" />, path: '/categories/entertainment' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), icon: <ShoppingCart className="h-3 w-3" />, path: '/categories/kids-hobbies' },
    { id: 'sports', name: t('sports', { ns: 'categories' }), icon: <ShoppingBag className="h-3 w-3" />, path: '/categories/sports-outdoors' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), icon: <Car className="h-3 w-3" />, path: '/categories/automotive' },
    { id: 'women', name: t('women', { ns: 'categories' }), icon: <User className="h-3 w-3" />, path: '/categories/women' },
    { id: 'men', name: t('men', { ns: 'categories' }), icon: <User className="h-3 w-3" />, path: '/categories/men' },
    { id: 'books', name: t('books', { ns: 'categories' }), icon: <Book className="h-3 w-3" />, path: '/categories/books' },
  ], [t]);

  const currentCategories = categories;

  // Update active tab when prop changes or route changes
  useEffect(() => {
    const currentCategory = currentCategories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  }, [activeTabId, location.pathname, currentCategories]);

  // Cycle through popular searches
  useEffect(() => {
    if (isSearchFocused) {
      setPlaceholder('Search for products');
      return;
    }

    const interval = setInterval(() => {
      setCurrentPopularSearch((prev) => (prev + 1) % popularSearches.length);
      setPlaceholder(popularSearches[currentPopularSearch]);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isSearchFocused, currentPopularSearch, popularSearches]);

  // Stable tab change handler
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const togglePanel = () => setIsOpen(!isOpen);
  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleClearSearch = () => setSearchQuery('');
  const handleVoiceSearch = () => setVoiceSearchActive(!voiceSearchActive);

  // Settings panel handlers
  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
    setLanguageQuery('');
  };

  // Close settings panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For search bar
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }

      // For settings panel - only close if clicking outside both panel and overlay
      if (settingsPanelRef.current && 
          !settingsPanelRef.current.contains(event.target as Node) &&
          showSettingsPanel) {
        // Check if clicking on the overlay background
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
    <header id="ali-header" className="fixed top-0 w-full z-40 bg-white m-0 p-0" style={{ boxShadow: 'none' }}>
      {/* Location Screen Overlay */}
      {showLocationScreen && <LocationScreen onClose={handleCloseLocationScreen} />}

      {/* Top Bar - Profile pic on left, search bar middle, settings on right */}
      <div 
        className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
        style={{ 
          height: '36px',
        }}
      >
        {showSearchBar ? (
          // Scrolled state: Search bar takes full width with scan and mic icons
          <div className="flex-1 relative max-w-md mx-auto" key="search-bar">
            <input
              type="text"
              placeholder="Search or Ask Questions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                handleSearchFocus();
                setPlaceholder('Search or Ask Questions');
              }}
              onBlur={() => {
                setIsSearchFocused(false);
              }}
              className="w-full px-3 py-1 pr-16 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
              ref={searchRef}
            />
            {/* Right icons container */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <ScanLine className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Mic 
                className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" 
                onClick={handleVoiceSearch}
              />
            </div>
          </div>
        ) : (
          // First state: Profile pic left, search bar middle, settings right
          <>
            {/* Left: Profile Picture - Match search bar height */}
            <div className="flex items-center">
              {user ? (
                <button
                  onClick={() => navigate('/seller-dashboard/overview')}
                  className="hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all duration-200 rounded-full"
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

            {/* Middle: Search Bar */}
            <div className="flex-1 max-w-md mx-2 relative">
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  handleSearchFocus();
                  setPlaceholder('Search for products');
                }}
                onBlur={() => {
                  setIsSearchFocused(false);
                  setPlaceholder(popularSearches[currentPopularSearch]);
                }}
                className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
                ref={searchRef}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
            </div>

            {/* Right: Settings Icon - Match search bar height */}
            <Settings 
              onClick={toggleSettingsPanel}
              className={`h-[20px] w-[20px] text-gray-600 cursor-pointer transition-colors ${
                showSettingsPanel ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
            />
          </>
        )}
      </div>

      {/* Settings Panel - Slides up from bottom */}
      {showSettingsPanel && !showLocationScreen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-300"
            onClick={toggleSettingsPanel}
          />

          {/* Settings Panel */}
          <div
            ref={settingsPanelRef}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg z-40 animate-in slide-in-from-bottom duration-300"
            style={{
              maxHeight: '90vh',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to overlay
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">{t('settings', 'Settings')}</h3>
              <button
                onClick={toggleSettingsPanel}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-4 space-y-6">
              {/* Language Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{t('language', 'Language')}</span>
                </div>

                {/* Current Language Display */}
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

                {/* Quick Language Options */}
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

              {/* Location Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{t('location', 'Location')}</span>
                </div>

                {/* Current Location Display with Edit Button */}
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

            {/* Safe area for mobile devices */}
            <div className="h-4 bg-white" />
          </div>
        </>
      )}

      {/* Conditional rendering with smooth transition: ProductFilterBar or CategoryTabs */}
      <div className="relative overflow-hidden min-h-[40px]">
        {/* ProductFilterBar - slides in from top when showFilterBar is true */}
        <div 
          className={`absolute inset-x-0 transition-all duration-500 ease-in-out ${
            showFilterBar 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform -translate-y-full'
          }`}
        >
          <ProductFilterBar />
        </div>

        {/* CategoryTabs - slides out to top when showFilterBar is true */}
        <div 
          className={`absolute inset-x-0 transition-all duration-500 ease-in-out ${
            !showFilterBar 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform -translate-y-full'
          }`}
        >
          <CategoryTabs 
            progress={1}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            categories={currentCategories}
          />
        </div>
      </div>

      {/* Category Panel - Always show */}
      <CategoryPanel 
        progress={1}
        isOpen={isOpen}
        activeTab={activeTab}
        categories={currentCategories.map(cat => cat.id)}
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