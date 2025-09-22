import { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Home, Search, ShoppingBag, Tv, Sofa, ShoppingCart, Car, Gamepad2 } from 'lucide-react';
import HeaderSearchBar from './header/HeaderSearchBar';
import CategoryTabs from './header/CategoryTabs';
import CategoryPanel from './header/CategoryPanel';
import VoiceSearchOverlay from './header/VoiceSearchOverlay';
import HeaderLanguage from './header/HeaderLanguage';
import NotificationBadge from './header/NotificationBadge';
import HeaderLogoToggle from './header/HeaderLogoToggle';
import HomepageDropdown from './header/HomepageDropdown';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AliExpressHeaderProps {
  activeTabId?: string;
}

export default function AliExpressHeader({ activeTabId = 'recommendations' }: AliExpressHeaderProps) {
  const { progress } = useScrollProgress();
  const { currentLanguage } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const homepageType = 'marketplace'; // Fixed to marketplace

  const HeaderLocation = () => (
    <select className="text-xs border rounded px-2 py-1 bg-white">
      <option>📍 New York</option>
      <option>📍 Los Angeles</option>
      <option>📍 Chicago</option>
      <option>📍 Miami</option>
    </select>
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [isSearchGlowing, setIsSearchGlowing] = useState(false);
  const scrollY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);

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

  // Stable scroll handler
  const handleScroll = useCallback(() => {
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
  }, []);

  // Track scroll position
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Determine if we should show the top bar based on current route
  const isForYouPage = location.pathname === '/for-you' || location.pathname === '/';

  // Determine if we should show icons only in the tabs
  const showIconsOnly = !isForYouPage;

  const categories = [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), icon: <Home className="h-3 w-3" />, path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), icon: <Tv className="h-3 w-3" />, path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), icon: <Sofa className="h-3 w-3" />, path: '/categories/home-living' },
    { id: 'fashion', name: t('fashion', { ns: 'categories' }), icon: <ShoppingBag className="h-3 w-3" />, path: '/categories/fashion' },
    { id: 'entertainment', name: t('entertainment', { ns: 'categories' }), icon: <Gamepad2 className="h-3 w-3" />, path: '/categories/entertainment' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), icon: <ShoppingCart className="h-3 w-3" />, path: '/categories/kids-hobbies' },
    { id: 'sports', name: t('sports', { ns: 'categories' }), icon: <ShoppingBag className="h-3 w-3" />, path: '/categories/sports-outdoors' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), icon: <Car className="h-3 w-3" />, path: '/categories/automotive' },
  ];

  const currentCategories = categories;

  // Update active tab when prop changes or route changes
  useEffect(() => {
    const currentCategory = currentCategories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab('recommendations');
    }
  }, [activeTabId, location.pathname, currentCategories, homepageType]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="ali-header" className="fixed top-0 w-full z-30 bg-white shadow-sm">
    {/* Top Bar - Replace with search bar when scrolled */}
<div 
  className="flex items-center pl-3 pr-3 transition-all duration-500 ease-in-out bg-white"
  style={{ 
    height: '36px',
  }}
>
  {showSearchBar ? (
    <div className="flex-1 relative max-w-md mx-auto" key="search-bar">
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
        ) : (
          <>
            {/* Left: Language */}
            <HeaderLanguage />

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Right: Profile Picture */}
            <div className="flex items-center">
              {user ? (
                <button
                  onClick={() => navigate('/seller-dashboard/overview')}
                  className="hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all duration-200 rounded-full"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="Profile" />
                    <AvatarFallback className="text-xs font-medium bg-gray-200 text-gray-700">
                      {user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <span className="text-xs font-medium text-gray-600">?</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Category Tabs - Always show */}
      <CategoryTabs 
        progress={1}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        categories={currentCategories}
      />

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