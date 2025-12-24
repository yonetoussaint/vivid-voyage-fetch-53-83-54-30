import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, ScanLine, Mic } from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';
import VoiceSearchOverlay from './header/VoiceSearchOverlay';

interface AliExpressHeaderProps {
  activeTabId?: string;
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(activeTabId);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

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

  // Determine which tabs to show based on custom tabs or default categories
  const tabsToShow = customTabs || categories;

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

  // Update active tab when prop changes
  useEffect(() => {
    if (customTabs && customTabs.length > 0) {
      const matchingCustomTab = customTabs.find(tab => tab.id === activeTabId);
      if (matchingCustomTab) {
        setActiveTab(activeTabId);
      } else {
        setActiveTab(customTabs[0].id);
      }
    } else {
      setActiveTab(activeTabId);
    }
  }, [activeTabId, customTabs]);

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

  // Handle voice search toggle
  const handleVoiceSearch = () => setVoiceSearchActive(!voiceSearchActive);

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

  // Render search bar right icons - EXACT LOGIC FROM ReusableSearchBar
  const renderRightIcons = () => {
    // Clear button when there's text
    if (searchQuery.trim()) {
      return (
        <button
          type="button"
          onClick={handleClearSearch}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      );
    }
    // Settings button when specified
    else {
      return (
        <button
          type="button"
          onClick={handleSettingsClick}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Settings
        </button>
      );
    }
  };

  // Inline ReusableSearchBar component
  const InlineSearchBar = () => {
    const isTransparent = false;
    const isOverlayOpen = false;
    const showScanMic = false;
    const showSettingsButton = true;

    // Transparent state styles
    const transparentStyles = isTransparent
      ? 'bg-transparent border-white/30 text-white placeholder-white/70'
      : 'bg-white border-gray-800 text-gray-900 placeholder-gray-500';

    return (
      <div className="flex-1 relative max-w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              className={`w-full px-3 py-1 text-sm font-medium border-2 rounded-full transition-all duration-300 shadow-sm ${
                isTransparent ? 'pr-12 pl-10' : 'pr-16 pl-3'
              } ${transparentStyles}`}
              ref={searchRef}
            />

            {/* Search Icon on Left */}
            {!isTransparent && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
            )}

            {/* Right icons */}
            <div className={`absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 ${
              isTransparent ? 'pr-1' : ''
            }`}>
              {renderRightIcons()}
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <header 
      className="fixed top-0 w-full z-40 bg-white" 
      style={{ margin: 0, padding: 0, boxShadow: 'none' }}
    >
      {/* Search Bar - Inline Implementation */}
      <div 
        className="flex items-center justify-between px-2 transition-all duration-500 ease-in-out bg-white"
        style={{ height: '36px' }}
      >
        <InlineSearchBar />
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

      {/* Voice Search Overlay */}
      <VoiceSearchOverlay
        active={voiceSearchActive}
        onCancel={handleVoiceSearch}
      />
    </header>
  );
}