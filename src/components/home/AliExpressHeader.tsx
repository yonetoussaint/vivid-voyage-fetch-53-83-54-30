import { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, X, ScanLine, Mic } from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
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
}: AliExpressHeaderProps) {
  const { currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [activeTab, setActiveTab] = useState(activeTabId);

  const searchRef = useRef<HTMLInputElement>(null);
  const showSearchBarRef = useRef(showSearchBar);

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
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleVoiceSearch = () => setVoiceSearchActive(!voiceSearchActive);

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

  const renderSearchIcons = () => {
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
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      );
    } else if (showSearchBar) {
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
      return (
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200 min-w-[100px]"
          onClick={() => navigate('/location')}
        >
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate flex-1 text-left">
            {currentLocation?.city || currentLocation?.country || 'Select'}
          </span>
          <svg 
            className="h-3 w-3 text-gray-500 flex-shrink-0" 
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
      {/* Top Bar */}
      <div 
        className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
        style={{ height: '36px' }}
      >
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              className="w-full px-4 py-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          <div className="flex items-center gap-2">
            {renderSearchIcons()}
          </div>
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