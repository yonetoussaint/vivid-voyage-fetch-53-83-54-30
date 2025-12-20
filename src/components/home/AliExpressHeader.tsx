import { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import CategoryTabs from './header/CategoryTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import ReusableSearchBar from '@/components/shared/ReusableSearchBar';

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
  const { currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [placeholder] = useState('Search for products');

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

  // Custom Location Button Component
  const LocationButton = () => (
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

  return (
    <header 
      id="ali-header" 
      className="fixed top-0 w-full z-40 bg-white" 
      style={{ margin: 0, padding: 0, boxShadow: 'none' }}
    >
      {/* Top Bar - Using ReusableSearchBar like original */}
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
          onSearchFocus={() => {/* Handle focus if needed */}}
          // Custom right button rendering
          renderRightButton={LocationButton}
          // Enable settings button (which will show our LocationButton)
          showSettingsButton={true}
          onSettingsClick={() => navigate('/location')}
          // Disable overlay features
          isOverlayOpen={false}
          onCloseOverlay={() => {}}
          showScanMic={true}
        />
      </div>

      {/* Category Tabs */}
      {showCategoryTabs && (
        <div className="relative overflow-hidden">
          <CategoryTabs 
            key={tabsToShow.map(tab => tab.id).join('-')}
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