import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ScanLine, Mic, MapPin, Home } from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import HomepageDropdown from './header/HomepageDropdown';

interface AliExpressHeaderProps {
  activeTabId?: string;
  showFilterBar?: boolean;
  showCategoryTabs?: boolean;
  customTabs?: Array<{ id: string; name: string; path?: string }>;
  onCustomTabChange?: (tabId: string) => void;
}

export default function AliExpressHeader({ 
  activeTabId = 'recommendations', 
  showCategoryTabs = true,
  customTabs,
  onCustomTabChange,
}: AliExpressHeaderProps) {
  const { currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [placeholder, setPlaceholder] = useState('Search for products');

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

  const tabsToShow = customTabs || categories;
  const categoryTabsKey = tabsToShow.map(tab => tab.id).join('-');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

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

  const renderRightButton = () => {
    if (isSearchFocused && !searchQuery.trim()) {
      return (
        <button
          type="button"
          onClick={() => setIsSearchFocused(false)}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Close
        </button>
      );
    } else if (searchQuery.trim()) {
      return (
        <button
          type="button"
          onClick={handleClearSearch}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
          onClick={() => navigate('/location')}
        >
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-[80px]">
            {currentLocation?.city || currentLocation?.country || 'Select'}
          </span>
          <svg 
            className="h-3 w-3 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      );
    }
  };

  return (
    <header 
      id="ali-header" 
      className="fixed top-0 w-full z-40 bg-white" 
      style={{ margin: 0, padding: 0, boxShadow: 'none' }}
    >
      {/* Top Bar - EXACTLY like original */}
      <div 
        className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
        style={{ height: '36px' }}
      >
        {/* Left: Home/Logo */}
        <HomepageDropdown homepageType="marketplace" />

        {/* Middle: Search Bar */}
        <div className="relative flex-1 max-w-lg mx-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-1.5 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onFocus={handleSearchFocus}
            />
            {/* Scan and Mic icons inside search bar */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Mic className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
            </div>
          </form>
        </div>

        {/* Right: Location Button */}
        <div className="flex items-center">
          {renderRightButton()}
        </div>
      </div>

      {/* Category Tabs */}
      {showCategoryTabs && (
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
      )}
    </header>
  );
}