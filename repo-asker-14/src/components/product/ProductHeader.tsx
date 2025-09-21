import React, { useState } from "react";
import { Heart, Share, Package, BadgeInfo, Star, HelpCircle, Truck, Lightbulb, Search, ChevronRight, ScanLine } from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import LiveBadge from "./header/LiveBadge";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import AliExpressSearchBar from "@/components/shared/AliExpressSearchBar";
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import { useProduct } from '@/hooks/useProduct';
import CategoryTabs from "../home/header/CategoryTabs";
import { Separator } from "@/components/ui/separator";
import PriceInfo, { CurrencySwitcher } from "./PriceInfo";
import SearchSuggestions from "../search/SearchSuggestions";


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
  forceScrolledState?: boolean;
  actionButtons?: ActionButton[];
  inPanel?: boolean;
  customScrollProgress?: number;
  showCloseIcon?: boolean;
  onCloseClick?: () => void;
  sellerMode?: boolean;
  seller?: any; // Add seller prop
  isFollowing?: boolean; // Add isFollowing prop
  onFollow?: () => void; // Add onFollow prop
  onMessage?: () => void; // Add onMessage prop
  stickyMode?: boolean; // New prop to enable sticky positioning
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  onSearch?: (query: string) => void;
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
  forceScrolledState = false,
  actionButtons,
  inPanel = false,
  customScrollProgress,
  showCloseIcon = false,
  onCloseClick,
  sellerMode = false,
  seller,
  isFollowing = false,
  onFollow,
  onMessage,
  stickyMode = false, // New prop for sticky positioning
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSearchFocus,
  onSearchBlur,
  onSearch
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { progress: internalProgress } = useScrollProgress();
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  // Use custom progress if provided (for panels), otherwise use internal progress
  // In panel mode, we should always use customScrollProgress
  const progress = inPanel ? (customScrollProgress || 0) : internalProgress;

  // Use forced state, seller mode, or actual scroll progress
  const displayProgress = forceScrolledState || sellerMode ? 1 : progress;

  // Live search effect
  React.useEffect(() => {
    if (searchQuery.trim() && isSearchFocused) {
      setIsLiveSearching(true);
      setShowSuggestions(true);
      
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        // Mock live search results
        const mockResults = Array(6).fill(null).map((_, index) => ({
          id: `live-${index}`,
          name: `${searchQuery} Product ${index + 1}`,
          price: Math.floor(Math.random() * 200) + 19.99,
          originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 59.99 : undefined,
          image: `https://picsum.photos/150/150?random=${Date.now() + index}`,
          rating: Math.floor(Math.random() * 2) + 4,
          reviews: Math.floor(Math.random() * 1000) + 10,
          freeShipping: Math.random() > 0.3,
        }));
        
        setLiveSearchResults(mockResults);
        setIsLiveSearching(false);
      }, 300);
    } else if (!searchQuery.trim()) {
      setShowSuggestions(false);
      setLiveSearchResults([]);
      setIsLiveSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isSearchFocused]);

  // Debug logging for panel scroll behavior
  React.useEffect(() => {
    if (inPanel) {
      console.log('🎯 ProductHeader Panel Debug:', {
        customScrollProgress,
        internalProgress,
        progress,
        displayProgress,
        forceScrolledState,
        inPanel,
        usingCustomProgress: customScrollProgress !== undefined,
        shouldShowSearchBar: displayProgress >= 0.5,
        headerBackgroundOpacity: displayProgress * 0.95,
        blurAmount: displayProgress * 8
      });
    }
  }, [customScrollProgress, internalProgress, progress, displayProgress, forceScrolledState, inPanel]);

  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const productSections = [
    { id: "overview", name: "Overview", icon: <Package className="w-4 h-4" />, path: "#overview" },
    { id: "description", name: "Description", icon: <BadgeInfo className="w-4 h-4" />, path: "#description" },
    { id: "reviews", name: "Reviews", icon: <Star className="w-4 h-4" />, path: "#reviews" },
    { id: "qa", name: "Q&A", icon: <HelpCircle className="w-4 h-4" />, path: "#qa" },
    { id: "shipping", name: "Shipping", icon: <Truck className="w-4 h-4" />, path: "#shipping" },
    { id: "specifications", name: "Specs", icon: <Lightbulb className="w-4 h-4" />, path: "#specifications" }
  ];

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  // Determine the positioning class based on props
  const getPositioningClass = () => {
    if (stickyMode) return 'sticky top-0';
    if (inPanel) return 'relative';
    return 'fixed top-0 left-0 right-0';
  };

  

  return (
    <div
      className={`${getPositioningClass()} z-30 flex flex-col transition-all duration-300 ${
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
          {/* Left side - Back button and content based on mode */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <BackButton
              progress={displayProgress}
              showCloseIcon={showCloseIcon}
              onClick={onCloseClick}
            />

            {/* Seller Mode: Show seller info when scrolled */}
            {sellerMode && seller && displayProgress >= 0.5 && (
              <div className="flex items-center gap-2">
                <img
                  src={seller.logo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                  alt={seller.business_name}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-32">
                    {seller.business_name || seller.full_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {seller.followers_count ? `${seller.followers_count} followers` : 'Seller'}
                  </span>
                </div>
              </div>
            )}

            {/* Non-seller mode: CurrencySwitcher - only visible in non-scrolled state */}
            {!sellerMode && displayProgress < 0.5 && (
              <CurrencySwitcher showPrice={false} />
            )}
          </div>

          {/* Center - Search bar when scrolled */}
          <div className="flex-1 mx-4">
            {displayProgress >= 0.5 && (
              <div className="flex-1 relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder={sellerMode ? "Search seller products..." : "Search products..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowSuggestions(true);
                    onSearchFocus?.();
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking on them
                    setTimeout(() => {
                      setIsSearchFocused(false);
                      setShowSuggestions(false);
                      onSearchBlur?.();
                    }, 200);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      startLoading();
                      setShowSuggestions(false);
                      if (sellerMode && seller) {
                        navigate(`/seller/${seller.id}/search?q=${encodeURIComponent(searchQuery)}`);
                      } else {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                      }
                    }
                  }}
                  className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-hidden">
                    <SearchSuggestions
                      query={searchQuery}
                      onSelectSuggestion={(suggestion) => {
                        setSearchQuery(suggestion);
                        startLoading();
                        setShowSuggestions(false);
                        setIsSearchFocused(false);
                        if (sellerMode && seller) {
                          navigate(`/seller/${seller.id}/search?q=${encodeURIComponent(suggestion)}`);
                        } else {
                          navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        }
                      }}
                      onClose={() => {
                        setIsSearchFocused(false);
                        setShowSuggestions(false);
                      }}
                    />
                    
                    {/* Live Search Results */}
                    {(liveSearchResults.length > 0 || isLiveSearching) && (
                      <div className="border-t bg-gray-50 p-4">
                        <h4 className="text-sm font-medium mb-3 text-gray-700">Products</h4>
                        {isLiveSearching ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-sm text-gray-500">Searching...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {liveSearchResults.slice(0, 4).map((product) => (
                              <div
                                key={product.id}
                                className="bg-white rounded-lg p-2 border cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => {
                                  startLoading();
                                  setIsSearchFocused(false);
                                  setShowSuggestions(false);
                                  navigate(`/product/${product.id}`);
                                }}
                              >
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full aspect-square object-cover rounded mb-2"
                                />
                                <h5 className="text-xs font-medium line-clamp-2 mb-1">{product.name}</h5>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-semibold text-red-500">${product.price.toFixed(2)}</span>
                                  {product.originalPrice && (
                                    <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                  )}
                                </div>
                                {product.freeShipping && (
                                  <div className="text-xs text-green-600 mt-1">Free Shipping</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {liveSearchResults.length > 4 && !isLiveSearching && (
                          <button
                            className="w-full mt-3 py-2 text-sm text-blue-600 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => {
                              startLoading();
                              setIsSearchFocused(false);
                              setShowSuggestions(false);
                              if (sellerMode && seller) {
                                navigate(`/seller/${seller.id}/search?q=${encodeURIComponent(searchQuery)}`);
                              } else {
                                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                              }
                            }}
                          >
                            View all {liveSearchResults.length} results
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {actionButtons ? (
              actionButtons.map((button, index) => (
                <HeaderActionButton
                  key={index}
                  Icon={button.Icon}
                  active={button.active}
                  onClick={button.onClick}
                  progress={displayProgress}
                  activeColor={button.activeColor}
                  likeCount={button.count}
                  shareCount={button.count}
                />
              ))
            ) : (
              <>
                <HeaderActionButton
                  Icon={Heart}
                  active={isFavorite}
                  onClick={toggleFavorite}
                  progress={displayProgress}
                  activeColor="#f43f5e"
                  likeCount={147}
                />

                <HeaderActionButton
                  Icon={Share}
                  progress={displayProgress}
                  shareCount={23}
                  onClick={onShareClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;