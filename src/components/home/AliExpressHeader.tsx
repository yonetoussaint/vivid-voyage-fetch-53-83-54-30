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
import SectionHeader from './SectionHeader';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProductFilterBar from './ProductFilterBar';
import LocationScreen from './header/LocationScreen';
import SearchOverlay from './SearchOverlay';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
import SettingsPanel from './header/SettingsPanel';
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";

interface AliExpressHeaderProps {
  activeTabId?: string;
  showFilterBar?: boolean;
  showCategoryTabs?: boolean;
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
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;
  showSectionHeader?: boolean;
  sectionHeaderTitle?: string;
  sectionHeaderViewAllLink?: string;
  sectionHeaderViewAllText?: string;
  sectionHeaderShowStackedProfiles?: boolean;
  sectionHeaderStackedProfiles?: Array<{ id: string; image: string; alt?: string }>;
  sectionHeaderStackedProfilesText?: string;
  sectionHeaderShowCountdown?: boolean;
  sectionHeaderCountdown?: string; // Added for countdown
  sectionHeaderShowSponsorCount?: boolean;
  sectionHeaderShowVerifiedSellers?: boolean;
  sectionHeaderVerifiedSellersText?: string;
  sectionHeaderIcon?: React.ComponentType<{ className?: string }>;
}

export default function AliExpressHeader({ 
  activeTabId = 'recommendations', 
  showFilterBar = false,
  showCategoryTabs = true,
  filterCategories = [],
  selectedFilters = {},
  onFilterSelect = () => {},
  onFilterClear = () => {},
  onClearAll = () => {},
  onFilterButtonClick = () => {},
  isFilterDisabled = () => false,
  customTabs,
  onCustomTabChange,
  showSectionHeader = false,
  sectionHeaderTitle = '',
  sectionHeaderViewAllLink,
  sectionHeaderViewAllText = 'View All',
  sectionHeaderShowStackedProfiles = false,
  sectionHeaderStackedProfiles = [],
  sectionHeaderStackedProfilesText = "Handpicked by",
  sectionHeaderShowCountdown = false, // Added for countdown
  sectionHeaderCountdown, // Added for countdown
  sectionHeaderShowSponsorCount = false,
  sectionHeaderShowVerifiedSellers = false,
  sectionHeaderVerifiedSellersText = 'Verified Sellers',
  sectionHeaderIcon,
}: AliExpressHeaderProps) {
  const { progress } = useScrollProgress();
  const { currentLanguage, setLanguage, supportedLanguages, currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const homepageType = 'marketplace';

  // Add this line to get headerMode from context
  const { headerMode } = useHeaderFilter();

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
  { id: 'mall', name: t('mall', { ns: 'categories' }), path: '/mall' }, // CHANGED: electronics to mall
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

  // Determine which tabs to show based on search overlay state or custom tabs
  const tabsToShow = customTabs || (showSearchOverlay ? searchTabs : categories);

  // Generate a unique key for CategoryTabs based on the actual tabs being displayed
  const categoryTabsKey = tabsToShow.map(tab => tab.id).join('-');

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
    // Make sure we're calling setLanguage correctly
    setLanguage(language.code); // This should change the language
    setLanguageQuery('');
    // You might want to close the panel after selection
    // setShowSettingsPanel(false);
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
    // If custom tabs are provided, ensure activeTab matches one of them
    if (customTabs && customTabs.length > 0) {
      // Check if activeTabId prop matches a custom tab
      const matchingCustomTab = customTabs.find(tab => tab.id === activeTabId);
      if (matchingCustomTab) {
        setActiveTab(activeTabId);
      } else {
        // Default to first custom tab if activeTabId doesn't match
        setActiveTab(customTabs[0].id);
      }
    } else {
      // Handle regular categories
      const currentCategory = categories.find(cat => location.pathname === cat.path);
      if (currentCategory) {
        setActiveTab(currentCategory.id);
      } else if (location.pathname === '/' || location.pathname === '/for-you') {
        setActiveTab('recommendations');
      }
    }
  }, [activeTabId, location.pathname, categories, customTabs]);

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

    // Handle custom tabs
    if (customTabs && onCustomTabChange) {
      onCustomTabChange(tabId);
    }
    // Handle navigation for regular categories
    else if (!showSearchOverlay) {
      const category = categories.find(cat => cat.id === tabId);
      if (category && category.path) {
        navigate(category.path);
      }
    } else {
      // Handle search tabs (no navigation, just filtering)
      handleSearchTabClick(tabId);
    }
  }, [showSearchOverlay, categories, navigate, customTabs, onCustomTabChange]);

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

  // Render the right icons based on state
  const renderSearchIcons = () => {
    if (showSearchOverlay && !searchQuery.trim()) {
      // Close button when overlay is open and search is empty
      return (
        <button
          type="button"
          onClick={handleCloseSearchOverlay}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Close
        </button>
      );
    } else if (searchQuery.trim()) {
      // Clear button when there's text
      return (
        <button
          type="button"
          onClick={handleClearSearch}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      );
    } else if (showSearchBar) {
      // Scan + Mic icons in scrolled state
      return (
        <>
          <ScanLine className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
          <Mic 
            className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" 
            onClick={handleVoiceSearch}
          />
        </>
      );
    } else {
      // Settings text button in normal state (clean like Close button)
      return (
        <button
          type="button"
          onClick={toggleSettingsPanel}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Settings
        </button>
      );
    }
  };

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
      <div 
        className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
        style={{ height: '36px' }}
      >
        {/* Always show the full-width search bar */}
        <ReusableSearchBar
          placeholder={placeholder}
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={(query) => {
            if (query.trim()) {
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              setShowSearchOverlay(false);
            }
          }}
          onSearchFocus={handleSearchFocus}
          // Pass the overlay state and close handler
          isOverlayOpen={showSearchOverlay}
          onCloseOverlay={handleCloseSearchOverlay}
          // Conditional icon display
          showScanMic={showSearchBar && !showSearchOverlay}
          showSettingsButton={!showSearchBar && !showSearchOverlay}
          onSettingsClick={toggleSettingsPanel}
        />
      </div>

      <SettingsPanel
        isOpen={showSettingsPanel}
        onClose={toggleSettingsPanel}
        currentLanguage={currentLanguage}
        currentLocation={currentLocation}
        supportedLanguages={supportedLanguages}
        onLanguageChange={(language) => {
          // This should trigger the language change
          setLanguage(language.code);
          setLanguageQuery('');
        }}
        onOpenLocationScreen={handleOpenLocationScreen}
        // Pass the missing props
        languageQuery={languageQuery}
        onLanguageQueryChange={setLanguageQuery}
        pinnedLanguages={pinnedLanguages}
        onToggleLanguagePin={toggleLanguagePin}
      />

      {/* Conditional rendering: SectionHeader, ProductFilterBar or CategoryTabs */}
      {showSectionHeader ? (
<div className="py-1">
          <SectionHeader
            title={sectionHeaderTitle}
            titleSize="sm"
            icon={sectionHeaderIcon}
            viewAllLink={sectionHeaderViewAllLink}
            viewAllText={sectionHeaderViewAllText}
            showStackedProfiles={sectionHeaderShowStackedProfiles}
            stackedProfiles={sectionHeaderStackedProfiles}
            stackedProfilesText={sectionHeaderStackedProfilesText}
            showCountdown={sectionHeaderShowCountdown} // Pass countdown visibility
            countdown={sectionHeaderCountdown} // Pass countdown value
            showSponsorCount={sectionHeaderShowSponsorCount}
            showVerifiedSellers={sectionHeaderShowVerifiedSellers}
            verifiedSellersText={sectionHeaderVerifiedSellersText}
            paddingBottom={false}
            onProfileClick={(profileId) => {
              console.log('Profile clicked:', profileId);
            }}
          />

      </div>

      ) : showCategoryTabs && (
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
              key={categoryTabsKey}
              progress={1}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              categories={tabsToShow}
              isSearchOverlayActive={showSearchOverlay}
            />
          )}
        </div>
      )}
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