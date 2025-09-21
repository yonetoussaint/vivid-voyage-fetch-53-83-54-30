import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScanLine, Grid, Clock, Search, X } from 'lucide-react';
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
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    categories: [] as string[],
    ratings: [] as number[],
    freeShipping: false,
  });
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

  // Calculate header height with ResizeObserver for better accuracy
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateHeight = () => {
      // Debounce rapid updates
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (headerRef.current) {
          const height = headerRef.current.offsetHeight;
          console.log('Header height calculated:', height);
          // Only update if the height actually changed to prevent unnecessary re-renders
          setHeaderHeight(prevHeight => prevHeight !== height ? height : prevHeight);
        }
      }, 50);
    };

    // Initial measurement with a slight delay to ensure DOM is ready
    const initialTimeout = setTimeout(updateHeight, 100);

    // Use ResizeObserver to track changes in header size
    if (headerRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateHeight);
      resizeObserverRef.current.observe(headerRef.current);
    }

    // Also update on window resize to catch any layout changes
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHeight, 150);
    };
    
    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // Additional check after content loads
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        if (headerRef.current) {
          const height = headerRef.current.offsetHeight;
          setHeaderHeight(height);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Live search effect - triggers when typing
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsLiveSearching(true);
      
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for live search
      searchTimeoutRef.current = setTimeout(() => {
        performLiveSearch(searchQuery.trim());
      }, 300); // Debounce for 300ms

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    } else {
      setLiveSearchResults([]);
      setIsLiveSearching(false);
    }
  }, [searchQuery]);

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

  // Perform live search without navigation
  const performLiveSearch = async (query: string) => {
    try {
      // Mock live search results - in real app, this would be an API call
      const mockResults = [
        {
          id: 1,
          name: `${query} Wireless Earbuds`,
          price: 29.99,
          image: 'https://picsum.photos/100/100?random=1',
          type: 'product'
        },
        {
          id: 2,
          name: `${query} Smart Watch`,
          price: 199.99,
          image: 'https://picsum.photos/100/100?random=2',
          type: 'product'
        },
        {
          id: 3,
          name: `${query} Bluetooth Speaker`,
          price: 79.99,
          image: 'https://picsum.photos/100/100?random=3',
          type: 'product'
        },
      ].filter((_, index) => index < 3); // Show top 3 results

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setLiveSearchResults(mockResults);
      setIsLiveSearching(false);
    } catch (error) {
      console.error('Live search error:', error);
      setIsLiveSearching(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newSearch = query.trim();
      setRecentSearches(prev => [
        newSearch,
        ...prev.filter(s => s !== newSearch)
      ].slice(0, 5));

      // Hide suggestions
      setShowSuggestions(false);
      setIsSearchFocused(false);

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

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setLiveSearchResults([]);
    // Navigate back to empty search page
    navigate('/search');
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
        {/* Custom Search Header */}
        <div className="bg-white border-b border-gray-200 py-3 px-4">
          <div className="flex items-center gap-3 max-w-6xl mx-auto">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ←
            </button>
            
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearch(searchQuery.trim());
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 text-sm border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Live Search Suggestions Dropdown */}
              {showSuggestions && isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  {isLiveSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        Searching...
                      </div>
                    </div>
                  ) : (
                    <SearchSuggestions 
                      query={searchQuery}
                      onSelectSuggestion={handleSuggestionSelect}
                      onClose={() => setShowSuggestions(false)}
                      liveResults={liveSearchResults}
                    />
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={handleScanClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ScanLine className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content with proper top spacing to account for fixed header */}
      <div 
        style={{ 
          paddingTop: `${Math.max(headerHeight, 60)}px`,
          minHeight: `calc(100vh - ${Math.max(headerHeight, 60)}px)`
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