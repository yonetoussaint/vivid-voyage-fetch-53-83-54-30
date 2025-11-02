// ProductHeader.tsx
import React, { useState } from "react";
import { 
  Heart, 
  Share2, 
  Search
} from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import TabsNavigation from '@/components/home/TabsNavigation'; // NEW

interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

interface ProductHeaderProps {
  activeSection?: string;
  onTabChange?: (section: string) => void;
  focusMode?: boolean;
  showHeaderInFocus?: boolean;
  onProductDetailsClick?: () => void;
  currentImageIndex?: number;
  totalImages?: number;
  onShareClick?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: (query: string) => void;
  onSearchFocus?: () => void;
  inPanel?: boolean;
  // NEW PROPS FOR TABS
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  showTabs?: boolean;
  isTabsSticky?: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  activeSection = "overview",
  onTabChange,
  focusMode = false,
  showHeaderInFocus = false,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSearch,
  onSearchFocus,
  inPanel = false,
  // NEW PROPS
  tabs = [],
  activeTab = '',
  showTabs = false,
  isTabsSticky = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { progress: displayProgress } = useScrollProgress();
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      startLoading();
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-30 flex flex-col transition-all duration-300 ${
        focusMode && !showHeaderInFocus ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Main Header */}
      <div
        className="py-2 px-3 w-full transition-all duration-700"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
          backdropFilter: `blur(${displayProgress * 8}px)`,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          {/* Left side - Back button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <BackButton
              progress={displayProgress}
              showCloseIcon={false}
              onClick={() => navigate(-1)}
            />
          </div>

          {/* Center - Search bar when scrolled */}
          <div className="flex-1 mx-4">
            {displayProgress >= 0.5 && (
              <div className="flex-1 relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (onSearchFocus) {
                      onSearchFocus();
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <HeaderActionButton
              Icon={Heart}
              active={isFavorite}
              onClick={toggleFavorite}
              progress={displayProgress}
              activeColor="#f43f5e"
              likeCount={147}
            />

            <HeaderActionButton
              Icon={Share2}
              progress={displayProgress}
              shareCount={23}
              onClick={onShareClick}
            />
          </div>
        </div>
      </div>

      {/* Sticky Tabs - Shows when original tabs touch header */}
      {isTabsSticky && tabs.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <TabsNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            edgeToEdge={true}
            style={{ 
              backgroundColor: 'white',
              margin: 0,
              padding: 0
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductHeader;