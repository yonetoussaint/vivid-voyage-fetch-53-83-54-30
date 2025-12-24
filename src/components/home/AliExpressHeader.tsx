import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';
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
        <ReusableSearchBar
          placeholder={placeholder}
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={(query) => {
            if (query.trim()) {
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          showScanMic={true}
          onVoiceClick={handleVoiceSearch}
        />
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