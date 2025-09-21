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
  const [headerHeight, setHeaderHeight] = useState(60); // Start with fallback height
  const [adaptiveFallback, setAdaptiveFallback] = useState(60); // Dynamic fallback that adapts
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

  // Dynamic header height calculation with adaptive fallback for SearchPage
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        console.log('Header height dynamically calculated:', height);
        
        // Update adaptive fallback when we get a valid measurement
        if (height > 0) {
          setAdaptiveFallback(height);
          setHeaderHeight(height);
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        } else {
          // Use current adaptive fallback when measurement fails
          console.log('Using adaptive fallback:', adaptiveFallback);
          setHeaderHeight(adaptiveFallback);
          document.documentElement.style.setProperty('--header-height', `${adaptiveFallback}px`);
        }
      }
    };

    // Use a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateHeight, 50);

    // Use ResizeObserver for real-time updates
    if (headerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          console.log('Header height updated via ResizeObserver:', height);
          
          if (height > 0) {
            // Update both current height and adaptive fallback
            setAdaptiveFallback(height);
            setHeaderHeight(height);
            document.documentElement.style.setProperty('--header-height', `${height}px`);
          } else {
            // Use current adaptive fallback
            setHeaderHeight(adaptiveFallback);
            document.documentElement.style.setProperty('--header-height', `${adaptiveFallback}px`);
          }
        }
      });
      resizeObserverRef.current.observe(headerRef.current);
    }

    // Also listen for window resize as backup
    window.addEventListener('resize', updateHeight);

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', updateHeight);
    };
  }, [adaptiveFallback]); // Include adaptiveFallback in dependencies


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
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30">
        <ProductHeader 
          forceScrolledState={true} 
          actionButtons={searchActionButtons}
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

      {/* Search Suggestions Overlay */}
      {showSuggestions && isSearchFocused && (
        <div 
          className="fixed left-0 right-0 bg-white shadow-lg border-t z-20"
          style={{ top: `${headerHeight}px` }}
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

      {/* Content with proper top spacing to account for fixed header */}
      <div 
        style={{ 
          paddingTop: `${headerHeight}px`,
          minHeight: `calc(100vh - ${headerHeight}px)`
        }} 
        className="relative transition-all duration-300 ease-in-out"
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
              <SpaceSavingCategories
                onCategorySelect={handleCategorySelect}
                showHeader={true}
                headerTitle="Shop by Category"
                headerSubtitle="Browse popular categories"
                headerIcon={Grid}
                headerViewAllLink="/categories"
                headerViewAllText="View All"
                headerTitleTransform="uppercase"
              />

              <RecentlyViewed 
                showHeader={true}
                headerTitle="Recently Viewed"
                headerIcon={Clock}
                headerViewAllLink="/recently-viewed"
                headerViewAllText="View All"
                headerTitleTransform="uppercase"
                showClearButton={true}
                clearButtonText="× Clear"
                onClearClick={() => toast({ title: "Cleared", description: "Recently viewed items cleared" })}
              />

              <TopVendorsCompact/>

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