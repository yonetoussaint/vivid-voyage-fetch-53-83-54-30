import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScanLine, Grid, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductHeader from '@/components/product/ProductHeader';
import SpaceSavingCategories from '@/components/home/SpaceSavingCategories';
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import SearchRecent from '@/components/search/SearchRecent';
import PopularSearches from '@/components/home/PopularSearches';
import SearchPopular from '@/components/search/SearchPopular';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import VoiceSearchOverlay from '@/components/search/VoiceSearchOverlay';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import SearchResults from '@/components/search/SearchResults';
import SearchSuggestions from '@/components/search/SearchSuggestions';

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    categories: [] as string[],
    ratings: [] as number[],
    freeShipping: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 15 Pro Max',
    'Wireless headphones',
    'Gaming laptop',
    'Smart watch',
    'Bluetooth speaker'
  ]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Header height calculation for positioning elements
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        console.log('🔍 Attempting to measure header height:', height);

        if (height > 0) {
          console.log('✅ Setting header height to:', height);
          setHeaderHeight(height);
        } else {
          console.log('❌ Header height is 0 or invalid');
        }
      } else {
        console.log('❌ Header ref not available');
      }
    };

    // Force multiple measurement attempts to ensure we catch it
    const measureMultipleTimes = () => {
      updateHeight();

      // Immediate next frame
      requestAnimationFrame(updateHeight);

      // Small delays to catch late renders
      setTimeout(updateHeight, 0);
      setTimeout(updateHeight, 10);
      setTimeout(updateHeight, 50);
      setTimeout(updateHeight, 100);
    };

    measureMultipleTimes();

    // Use ResizeObserver for ongoing updates
    if (headerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          console.log('📐 ResizeObserver detected height change:', height);

          if (height > 0 && height !== headerHeight) {
            console.log('🔄 Updating height via ResizeObserver:', height);
            setHeaderHeight(height);
          }
        }
      });
      resizeObserverRef.current.observe(headerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isLoading]); // Depend on loading state

  // Force recalculation after everything has loaded
  useLayoutEffect(() => {
    if (!isLoading && headerRef.current) {
      console.log('🚀 Post-loading height measurement attempt');
      const height = headerRef.current.offsetHeight;
      console.log('🚀 Post-loading height:', height);
      if (height > 0) {
        setHeaderHeight(height);
      }
    }
  }, [isLoading]);

  // Debug effect to track when headerHeight changes
  useEffect(() => {
    console.log('🎯 Header height state changed to:', headerHeight);
  }, [headerHeight]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setShowResults(true);
      setShowSuggestions(false);
    } else {
      setShowResults(false);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Live search effect
  useEffect(() => {
    if (searchQuery.trim() && isSearchFocused && !showResults) {
      setIsLiveSearching(true);

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
        setShowSuggestions(true);
      }, 300);
    } else if (!searchQuery.trim() || showResults) {
      setShowSuggestions(false);
      setLiveSearchResults([]);
      setIsLiveSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isSearchFocused, showResults]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newSearch = query.trim();
      setRecentSearches(prev => [
        newSearch,
        ...prev.filter(s => s !== newSearch)
      ].slice(0, 5));

      // Update URL with new search query
      const newUrl = `/search?q=${encodeURIComponent(newSearch)}`;
      if (window.location.pathname + window.location.search !== newUrl) {
        navigate(newUrl);
      }

      toast({
        title: "Searching...",
        description: `Looking for "${newSearch}"`,
      });
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    // Simulate voice search
    setTimeout(() => {
      setIsVoiceActive(false);
      // You can integrate real speech recognition here
    }, 3000);
  };

  const handleFilterSelect = (filterId: string) => {
    if (filterId === 'filters') {
      // Open advanced filters modal
      toast({
        title: "Filters",
        description: "Advanced filters panel would open here",
      });
      return;
    }

    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCategorySelect = (category: string) => {
    handleSearch(category);
  };

  const handleRecentSearchSelect = (search: string) => {
    handleSearch(search);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    toast({
      title: "Cleared",
      description: "All recent searches cleared",
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleProductLike = (productId: string) => {
    toast({
      title: "Added to favorites",
      description: "Product saved to your wishlist",
    });
  };

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product added to your shopping cart",
    });
  };

  const handleScanClick = () => {
    toast({
      title: "Scan",
      description: "Barcode scanner would open here",
    });
  };

  const searchActionButtons = [
    {
      Icon: ScanLine,
      onClick: handleScanClick
    }
  ];

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Fixed Header - back to fixed positioning for reliability */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm">
        <ProductHeader 
          forceScrolledState={true} 
          actionButtons={searchActionButtons}
          inPanel={true}  // Make header relative within fixed wrapper
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchFocus={() => setIsSearchFocused(true)}
          onSearchBlur={() => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => setIsSearchFocused(false), 200);
          }}
          onSearch={handleSearch}
        />
      </div>

      {/* Search Suggestions Overlay - positioned below sticky header */}
      {showSuggestions && isSearchFocused && (
        <div 
          className="absolute left-0 right-0 bg-white shadow-lg border-t z-20"
          style={{ 
            top: headerHeight !== null ? `${headerHeight}px` : '60px' // Use fallback only for overlay positioning
          }}
        >
          <div className="max-w-md mx-auto">
            <SearchSuggestions
              query={searchQuery}
              onSelectSuggestion={(suggestion) => {
                setSearchQuery(suggestion);
                handleSearch(suggestion);
                setIsSearchFocused(false);
                setShowSuggestions(false);
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
                          handleProductClick(product.id);
                          setIsSearchFocused(false);
                          setShowSuggestions(false);
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
                      handleSearch(searchQuery);
                      setIsSearchFocused(false);
                      setShowSuggestions(false);
                    }}
                  >
                    View all {liveSearchResults.length} results
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area - Dynamic padding based on actual header height */}
      <div 
        className="relative"
        style={{
          paddingTop: headerHeight !== null ? `${headerHeight}px` : '0px', // No padding until we have real height
          minHeight: '100vh' // Ensure content takes full height
        }}
        onLoad={() => console.log('📱 Content rendered with header height:', headerHeight)}
      >
        <div className="space-y-6">
          {showResults ? (
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">
                  Search results for "{searchQuery}"
                </h2>
                <div className="flex items-center gap-2">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-1 border rounded"
                  >
                    {viewMode === 'grid' ? '☰' : '⊞'}
                  </button>
                </div>
              </div>
              <SearchResults 
                viewMode={viewMode}
                sortBy={sortBy}
                filters={filters}
              />
            </div>
          ) : (
            <>
              
              

              

              <SearchRecent
                searches={recentSearches}
                onSearchSelect={handleRecentSearchSelect}
                onRemoveSearch={handleRemoveRecentSearch}
                onClearAll={handleClearAllRecent}
                headerTitleTransform="uppercase"
              />

              <PopularSearches />

              <BookGenreFlashDeals />
            </>
          )}
        </div>

        <VoiceSearchOverlay
          isActive={isVoiceActive}
          onClose={() => setIsVoiceActive(false)}
        />
      </div>
    </div>
  );
};

export default SearchPage;