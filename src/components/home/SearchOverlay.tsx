// SearchOverlay.tsx
import { useNavigate } from 'react-router-dom';
import { Search, Loader, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  popularSearches: string[];
  headerHeight: number;
  activeTab: string;
  onSearchQueryChange?: (query: string) => void;
}

// Enhanced mock data with real image URLs and product gallery images (not variations)
const mockProducts = [
  { 
    id: 1, 
    name: "Wireless Bluetooth Earbuds", 
    price: "$29.99", 
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=300&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
    ]
  },
  { 
    id: 2, 
    name: "Smart Watch Series 5", 
    price: "$89.99", 
    category: "Electronics",
    stock: 8,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1434493654871-443ef3260f44?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1434493654871-443ef3260f44?w=400&h=400&fit=crop"
    ]
  },
  { 
    id: 3, 
    name: "Phone Case for iPhone 15", 
    price: "$12.99", 
    category: "Accessories",
    stock: 42,
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601593346210-82a2d6a69ba5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601593346210-82a2d6a69ba5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop"
    ]
  },
  { 
    id: 4, 
    name: "LED Strip Lights 10ft", 
    price: "$15.99", 
    category: "Home Decor",
    stock: 23,
    image: "https://images.unsplash.com/photo-1558618666-fcd25856cd52?w=300&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25856cd52?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25856cd52?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop"
    ]
  },
  { 
    id: 5, 
    name: "Fitness Tracker Band", 
    price: "$24.99", 
    category: "Sports",
    stock: 31,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop"
    ]
  },
];

const mockSellers = [
  { id: 1, name: "TechGadgets Store", rating: "4.8", products: "1.2K" },
  { id: 2, name: "FashionHub Official", rating: "4.9", products: "2.4K" },
  { id: 3, name: "HomeEssentials Pro", rating: "4.7", products: "856" },
  { id: 4, name: "SportsGear Direct", rating: "4.6", products: "923" },
];

const mockPosts = [
  { id: 1, title: "New iPhone 15 Review", author: "TechExpert", likes: "1.2K" },
  { id: 2, title: "Summer Fashion Trends 2024", author: "FashionBlogger", likes: "2.4K" },
  { id: 3, title: "Home Decor Ideas", author: "InteriorDesign", likes: "856" },
];

const mockShorts = [
  { id: 1, title: "Unboxing Latest Gadgets", views: "1.2M" },
  { id: 2, title: "DIY Home Projects", views: "856K" },
  { id: 3, title: "Fashion Tips & Tricks", views: "2.4M" },
];

const mockArticles = [
  { id: 1, title: "The Future of E-commerce", author: "Industry Expert", reads: "12K" },
  { id: 2, title: "Sustainable Fashion Guide", author: "Eco Warrior", reads: "8.5K" },
  { id: 3, title: "Tech Innovations 2024", author: "Tech Insider", reads: "15K" },
];

// Product Item Component with Expandable Gallery Section
interface ProductItemProps {
  product: any;
  onProductClick: (product: any) => void;
  isExpanded: boolean;
  onToggleExpand: (productId: number) => void;
}

function ProductItem({ product, onProductClick, isExpanded, onToggleExpand }: ProductItemProps) {
  return (
    <div className="w-full">
      {/* Main Product Info */}
      <div className="flex items-center py-4 justify-between hover:bg-gray-50 transition-colors w-full px-2">
        {/* Product Image with curved borders - Made bigger */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 md:w-20 md:h-20"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center md:w-20 md:h-20">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Name and Details */}
          <div className="min-w-0 flex-1">
            <div 
              className="text-gray-800 font-medium truncate cursor-pointer hover:text-orange-600 transition-colors text-base md:text-lg"
              onClick={() => onProductClick(product)}
            >
              {product.name}
            </div>
            <div className="flex items-center space-x-3 mt-1 flex-wrap">
              <span className="text-sm font-semibold text-orange-600 md:text-base">{product.price}</span>
              <span className="text-xs text-gray-500 md:text-sm">Stock: {product.stock}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full md:text-sm">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Chevron Button */}
        <button
          onClick={() => onToggleExpand(product.id)}
          className="flex-shrink-0 ml-3 p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label={isExpanded ? "Collapse gallery" : "Expand gallery"}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Expandable Section - Product Gallery */}
      {isExpanded && (
        <div className="pb-4 w-full bg-gray-50">
          <div className="text-xs text-gray-500 font-medium mb-3 px-4 pt-2 md:text-sm">Product Gallery</div>
          <div className="w-full relative">
            {/* Horizontal scrollable gallery container with enhanced scrolling */}
            <div 
              className="flex space-x-4 px-4 pb-2 overflow-x-scroll scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#f97316 #f3f4f6',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'auto'
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.stopPropagation();
                const container = e.currentTarget;
                container.scrollLeft += e.deltaY;
              }}
            >
              {product.gallery.map((image: string, index: number) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 relative group"
                  style={{ minWidth: 'fit-content' }}
                >
                  {image ? (
                    <div className="relative">
                      <img 
                        src={image} 
                        alt={`${product.name} gallery image ${index + 1}`}
                        className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 group-hover:border-orange-400 transition-all duration-200 cursor-pointer md:w-32 md:h-32 hover:shadow-lg hover:scale-105"
                        onClick={() => onProductClick(product)}
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-opacity"></div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center md:w-32 md:h-32">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="text-xs text-center mt-1 text-gray-600 whitespace-nowrap">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            {product.gallery.length > 3 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="bg-white bg-opacity-80 rounded-full p-1 shadow-sm">
                  <ChevronDown className="h-4 w-4 text-gray-400 transform rotate-[-90deg]" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchOverlay({ 
  isOpen, 
  onClose, 
  searchQuery,
  popularSearches,
  headerHeight,
  activeTab,
  onSearchQueryChange
}: SearchOverlayProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  // Quick fix: Ensure we always use a valid search tab when overlay is open
  const effectiveActiveTab = isOpen && !['products', 'sellers', 'posts', 'shorts', 'articles'].includes(activeTab) 
    ? 'products' 
    : activeTab;

  // Debounce the search query - 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter data based on effectiveActiveTab and DEBOUNCED search query
  const filteredData = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];

    const query = debouncedSearchQuery.toLowerCase();

    switch (effectiveActiveTab) {
      case 'products':
        return mockProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      case 'sellers':
        return mockSellers.filter(seller =>
          seller.name.toLowerCase().includes(query)
        );
      case 'posts':
        return mockPosts.filter(post =>
          post.title.toLowerCase().includes(query)
        );
      case 'shorts':
        return mockShorts.filter(short =>
          short.title.toLowerCase().includes(query)
        );
      case 'articles':
        return mockArticles.filter(article =>
          article.title.toLowerCase().includes(query)
        );
      default:
        return mockProducts.filter(product =>
          product.name.toLowerCase().includes(query)
        );
    }
  }, [debouncedSearchQuery, effectiveActiveTab]);

  // Simulate API call with proper debouncing
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      setExpandedProductId(null); // Collapse all when search is cleared
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setSearchResults(filteredData);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, filteredData]);

  // Show loading when user is typing (before debounce resolves)
  const showLoading = searchQuery.trim() && (isLoading || searchQuery !== debouncedSearchQuery);

  const handlePopularSearchClick = (search: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(search);
    }
    navigate(`/search?q=${encodeURIComponent(search)}`);
    onClose();
  };

  const handleCategorySearch = (category: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(category);
    }
    navigate(`/search?q=${encodeURIComponent(category)}&category=${encodeURIComponent(category)}`);
    onClose();
  };

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
    onClose();
  };

  const handleResultClick = (result: any) => {
    // Handle different result types based on effectiveActiveTab
    switch (effectiveActiveTab) {
      case 'products':
        navigate(`/product/${result.id}`);
        break;
      case 'sellers':
        navigate(`/seller/${result.id}`);
        break;
      case 'posts':
        navigate(`/post/${result.id}`);
        break;
      case 'shorts':
        navigate(`/short/${result.id}`);
        break;
      case 'articles':
        navigate(`/article/${result.id}`);
        break;
      default:
        navigate(`/search?q=${encodeURIComponent(result.name || result.title)}`);
    }
    onClose();
  };

  const toggleProductExpand = (productId: number) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // Render different result items based on effectiveActiveTab
  const renderResultItem = (result: any) => {
    switch (effectiveActiveTab) {
      case 'products':
        return (
          <ProductItem
            product={result}
            onProductClick={handleProductClick}
            isExpanded={expandedProductId === result.id}
            onToggleExpand={toggleProductExpand}
          />
        );

      case 'sellers':
        return (
          <button
            onClick={() => handleResultClick(result)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{result.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-gray-800 font-medium">{result.name}</div>
                <div className="text-xs text-gray-500">{result.products} products • ⭐ {result.rating}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
          </button>
        );

      case 'posts':
        return (
          <button
            onClick={() => handleResultClick(result)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <div>
                <div className="text-gray-800 font-medium">{result.title}</div>
                <div className="text-xs text-gray-500">by {result.author} • ❤️ {result.likes}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
          </button>
        );

      case 'shorts':
        return (
          <button
            onClick={() => handleResultClick(result)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <div>
                <div className="text-gray-800 font-medium">{result.title}</div>
                <div className="text-xs text-gray-500">👁️ {result.views} views</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
          </button>
        );

      case 'articles':
        return (
          <button
            onClick={() => handleResultClick(result)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div>
                <div className="text-gray-800 font-medium">{result.title}</div>
                <div className="text-xs text-gray-500">by {result.author} • 📖 {result.reads}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
          </button>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Search Overlay Content */}
      <div 
        className="fixed inset-0 bg-white z-40 animate-in fade-in duration-300 overflow-hidden"
        style={{ top: `${headerHeight}px` }}
      >
        {/* Scrollable content container */}
        <div className="h-full overflow-y-auto">
          <div className="w-full">
            {/* Show live results when typing */}
            {searchQuery.trim() && (
              <div className="w-full border-b border-gray-100">
                {showLoading ? (
                  <div className="flex justify-center items-center py-8 w-full">
                    <Loader className="h-6 w-6 animate-spin text-orange-500" />
                    <span className="ml-2 text-sm text-gray-600">Searching for "{searchQuery}"...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="w-full">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Found {searchResults.length} results for "{searchQuery}"
                      </span>
                    </div>

                    <div className="w-full border border-gray-200 overflow-hidden divide-y divide-gray-200">
                      {searchResults.map((result) => (
                        <div key={result.id} className="w-full">
                          {renderResultItem(result)}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-8 w-full">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                    <div className="text-base">No results found for "{searchQuery}"</div>
                    <div className="text-xs mt-1">Try different keywords or check spelling</div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Searches - Only show when no search query */}
            {!searchQuery.trim() && (
              <div className="px-0 py-4 border-b border-gray-100 w-full">
                <h3 className="text-sm font-medium text-gray-600 mb-3 px-4">Recent Searches</h3>
                <div className="text-center text-gray-400 text-sm py-4">
                  <Search className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  No recent searches
                </div>
              </div>
            )}

            {/* Popular Searches - Only show when no search query */}
            {!searchQuery.trim() && (
              <div className="px-0 py-4 border-b border-gray-100 w-full">
                <h3 className="text-sm font-medium text-gray-600 mb-3 px-4">Popular Searches</h3>
                <div className="space-y-1 w-full">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearchClick(search)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Search className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="text-gray-700 group-hover:text-orange-600 transition-colors text-base">{search}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search by Category - Only show when no search query */}
            {!searchQuery.trim() && (
              <div className="px-0 py-4 w-full">
                <h3 className="text-sm font-medium text-gray-600 mb-3 px-4">Search by Category</h3>
                <div className="grid grid-cols-2 gap-3 px-4">
                  {[
                    'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 
                    'Sports', 'Toys', 'Automotive', 'Books'
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySearch(category)}
                      className="p-3 text-left bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-transparent rounded-lg text-sm text-gray-700 transition-all duration-200 group"
                    >
                      <div className="font-medium group-hover:text-orange-600">{category}</div>
                      <div className="text-xs text-gray-400 group-hover:text-orange-400 mt-1">
                        {Math.floor(Math.random() * 1000) + 100} products
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop with close functionality */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30 animate-in fade-in duration-300"
        style={{ top: `${headerHeight}px` }}
        onClick={onClose}
      />
    </>
  );
}