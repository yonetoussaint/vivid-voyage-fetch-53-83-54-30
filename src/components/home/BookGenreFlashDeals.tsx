import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Timer, Plus, ChevronRight, Package, Eye, Star, TrendingUp, Truck, BookOpen, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import ProductFilterBar from "@/components/home/ProductFilterBar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  product_images?: Array<{ src: string }>;
  inventory?: number;
  flash_start_time?: string;
  seller_id?: string;
  category?: string;
  // Additional fields for marketing campaigns
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  expiry?: string;
  views?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  // New e-commerce fields
  rating?: number;
  total_orders?: number;
  free_shipping?: boolean;
  shipping_cost?: number;
  is_choice?: boolean;
  is_top_selling?: boolean;
  genre?: string;
  author?: string;
  page_count?: number;
  publisher?: string;
}

interface GenreFlashDealsProps {
  productType?: string;
  excludeTypes?: string[];
  className?: string;
  products?: Product[];
  sellerId?: string;
  onAddProduct?: () => void;
  title?: string;
  subtitle?: string;
  showSectionHeader?: boolean;
  showSummary?: boolean;
  showFilters?: boolean;
  icon?: React.ComponentType<any>;
  customCountdown?: string;
  showCountdown?: boolean;
  passCountdownToHeader?: boolean;
  showVerifiedSellers?: boolean;
  verifiedSellersText?: string;
  summaryMode?: 'inventory' | 'reviews' | 'products';
  // New custom render props
  customProductRender?: (product: Product) => React.ReactNode;
  customProductInfo?: (product: Product) => React.ReactNode;
  // Expiry timer props
  showExpiryTimer?: boolean;
  expiryField?: string;
  // Marketing specific props
  showMarketingMetrics?: boolean;
  showStatusBadge?: boolean;
  // Filter variant
  filterVariant?: 'default' | 'cards';
}

interface SummaryStats {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  onDiscount: number;
  totalValue: number;
  lowStock: number;
  categories: number;
}

export default function BookGenreFlashDeals({
  productType = undefined,
  excludeTypes = [],
  className = '',
  products: externalProducts,
  sellerId,
  onAddProduct,
  title = "Books",
  subtitle = "Discover books by genre",
  showSectionHeader = true,
  showSummary = true,
  showFilters = true,
  icon = BookOpen,
  customCountdown,
  showCountdown,
  showVerifiedSellers = false,
  verifiedSellersText = "Verified Book Sellers",
  summaryMode = 'products',
  customProductRender,
  customProductInfo,
  showExpiryTimer = false,
  expiryField = 'expiry',
  showMarketingMetrics = false,
  showStatusBadge = false,
  filterVariant = 'cards'
}: GenreFlashDealsProps) {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(8);

  // Define book-specific filter categories
  const filterCategories = React.useMemo(() => [
    {
      id: 'genre',
      label: 'Genre',
      options: ['All Genres', 'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'Self-Help', 'Business', 'Technology']
    },
    {
      id: 'price',
      label: 'Price',
      options: ['All Prices', 'Under $10', '$10-$20', '$20-$30', 'Over $30']
    },
    {
      id: 'format',
      label: 'Format',
      options: ['All Formats', 'Paperback', 'Hardcover', 'E-book', 'Audiobook']
    },
    {
      id: 'rating',
      label: 'Rating',
      options: ['All Ratings', '4+ Stars', '3+ Stars', 'Bestsellers']
    },
    {
      id: 'availability',
      label: 'Stock',
      options: ['All Stock', 'In Stock', 'Pre-order', 'Limited Stock']
    }
  ], []);

  // Add filter state with initial "All" options
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(() => ({
    genre: 'All Genres',
    price: 'All Prices',
    format: 'All Formats',
    rating: 'All Ratings',
    availability: 'All Stock'
  }));

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
  }

  // Filter handler functions
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Ended': return 'bg-gray-100 text-gray-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add this helper function to format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Default handler for adding new product
  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      navigate('/seller-dashboard/products/edit/new');
    }
  };

  // Default marketing product info renderer
  const renderMarketingProductInfo = (product: Product) => (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>Clicks: {product.clicks || 0}</span>
      </div>
      {product.clicks && product.clicks > 0 && (
        <div className="mt-1">
          <div className="flex justify-between text-xs mb-1">
            <span>CTR: {((product.clicks / (product.views || 1)) * 100).toFixed(1)}%</span>
          </div>
          <Progress
            value={product.clicks > 0 ? (product.clicks / (product.views || 1)) * 100 : 0}
            className="h-1.5"
          />
        </div>
      )}
    </div>
  );

  // Fetch ALL products only if no external products provided
  const { data: fetchedProducts = [], isLoading: allProductsLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => fetchAllProducts(),
    refetchInterval: 5 * 60 * 1000,
    enabled: !externalProducts,
  });

  // Debug logs to see what's happening
  console.log('🔍 BookGenreFlashDeals Debug:');
  console.log('External products provided:', externalProducts?.length || 0);
  console.log('Fetched products count:', fetchedProducts.length);

  // Determine which products to use
  let allProducts = externalProducts || fetchedProducts || [];

  // Filter to books if no external products
  if (!externalProducts) {
    allProducts = allProducts.filter(product => 
      product.category?.toLowerCase().includes('book') || 
      product.name?.toLowerCase().includes('book') ||
      product.genre
    );
  }

  console.log('Total books to display:', allProducts.length);

  const isLoading = allProductsLoading && !externalProducts;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate summary statistics
  const summaryStats: SummaryStats = React.useMemo(() => {
    const totalProducts = allProducts.length;
    const inStock = allProducts.filter(product => (product.inventory || 0) > 0).length;
    const outOfStock = allProducts.filter(product => (product.inventory || 0) === 0).length;
    const onDiscount = allProducts.filter(product => product.discount_price && product.discount_price < product.price).length;
    const totalValue = allProducts.reduce((sum, product) => sum + (product.discount_price || product.price), 0);
    const lowStock = allProducts.filter(product => (product.inventory || 0) > 0 && (product.inventory || 0) <= 10).length;

    // Calculate unique categories count
    const categories = new Set(allProducts.map(product => product.category).filter(Boolean)).size;

    return {
      totalProducts,
      inStock,
      outOfStock,
      onDiscount,
      totalValue,
      lowStock,
      categories
    };
  }, [allProducts]);

  // Calculate expiry time left for each product
  const [expiryTimes, setExpiryTimes] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number }>>({});

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!allProducts || allProducts.length === 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const latestFlashStart = allProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000);
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [allProducts]);

  // Calculate expiry times for each product
  useEffect(() => {
    const calculateExpiryTimes = () => {
      const newExpiryTimes: Record<string, { days: number; hours: number; minutes: number; seconds: number }> = {};

      allProducts.forEach(product => {
        const expiryDate = product[expiryField as keyof Product] as string;
        if (expiryDate) {
          const endTime = new Date(expiryDate).getTime();
          const now = Date.now();
          const difference = endTime - now;

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            newExpiryTimes[product.id] = { days, hours, minutes, seconds };
          } else {
            newExpiryTimes[product.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }
        }
      });

      return newExpiryTimes;
    };

    const timer = setInterval(() => {
      setExpiryTimes(calculateExpiryTimes());
    }, 1000);

    setExpiryTimes(calculateExpiryTimes());

    return () => clearInterval(timer);
  }, [allProducts, expiryField]);

  // Format countdown for SectionHeader
  const formattedCountdown = React.useMemo(() => {
    if (customCountdown) return customCountdown;

    const totalSeconds = timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
    if (totalSeconds <= 0) return "00:00:00:00";

    return `${timeLeft.days.toString().padStart(2, "0")}:${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`;
  }, [timeLeft, customCountdown]);

  // Process products with memoization to prevent infinite re-renders
  const processedProducts = React.useMemo(() => {
    let products = allProducts.map(product => {
      const discountPercentage = product.discount_price
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0;

      // Add book-specific fields if they don't exist
      if (!product.genre) {
        product.genre = product.category || 'General';
      }
      if (!product.author) {
        product.author = 'Unknown Author';
      }

      return {
        ...product,
        discountPercentage,
        image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=Book+Cover"
      };
    });

    // Apply filters only if showFilters is true
    if (showFilters) {
      if (selectedFilters.genre && !isAllOption(selectedFilters.genre)) {
        products = products.filter(p => 
          p.genre?.toLowerCase().includes(selectedFilters.genre.toLowerCase().replace(' ', '')) ||
          p.category?.toLowerCase().includes(selectedFilters.genre.toLowerCase())
        );
      }

      if (selectedFilters.price && !isAllOption(selectedFilters.price)) {
        products = products.filter(p => {
          const price = p.discount_price || p.price;
          switch (selectedFilters.price) {
            case 'Under $10': return price < 10;
            case '$10-$20': return price >= 10 && price <= 20;
            case '$20-$30': return price > 20 && price <= 30;
            case 'Over $30': return price > 30;
            default: return true;
          }
        });
      }

      if (selectedFilters.availability && !isAllOption(selectedFilters.availability)) {
        products = products.filter(p => {
          switch (selectedFilters.availability) {
            case 'In Stock': return (p.inventory ?? 0) > 0;
            case 'Pre-order': return p.status?.toLowerCase() === 'pre-order';
            case 'Limited Stock': return (p.inventory ?? 0) > 0 && (p.inventory ?? 0) <= 5;
            default: return true;
          }
        });
      }

      if (selectedFilters.rating && !isAllOption(selectedFilters.rating)) {
        products = products.filter(p => {
          const rating = p.rating || 0;
          switch (selectedFilters.rating) {
            case '4+ Stars': return rating >= 4;
            case '3+ Stars': return rating >= 3;
            case 'Bestsellers': return p.is_top_selling === true;
            default: return true;
          }
        });
      }
    }

    console.log('✅ Processed books count:', products.length);
    return products;
  }, [allProducts, selectedFilters, showFilters]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= processedProducts.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, processedProducts.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, processedProducts.length]);

  // Reset display count when products change
  useEffect(() => {
    setDisplayCount(8);
  }, [processedProducts.length]);

  return (
    <div className={`w-full bg-white relative ${className}`}>
      {/* Section Header */}
      {showSectionHeader && (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-white rounded-lg shadow-sm">
              {React.createElement(icon, { className: "w-5 h-5 text-blue-600" })}
            </div>}
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          {showCountdown && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
              <Timer className="w-4 h-4 text-red-500" />
              <span className="font-mono text-sm font-bold text-gray-900">
                {formattedCountdown}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filter Bar Section - Conditionally rendered */}
      {showFilters && (
        <div className="px-2 py-3">
          <ProductFilterBar
            filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            onFilterSelect={handleFilterSelect}
            onFilterClear={handleFilterClear}
            onClearAll={handleClearAll}
            onFilterButtonClick={handleFilterButtonClick}
            variant={filterVariant}
          />
        </div>
      )}

      {/* Summary Stats */}
      {showSummary && summaryMode === 'products' && processedProducts.length > 0 && (
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Found {processedProducts.length} books</span>
            <div className="flex items-center gap-4">
              <span className="text-green-600">{summaryStats.inStock} in stock</span>
              <span className="text-orange-600">{summaryStats.onDiscount} on sale</span>
              <span className="text-blue-600">{summaryStats.categories} genres</span>
            </div>
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className="px-1.5 pt-1.5 pb-20">
        {isLoading && !externalProducts ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-white overflow-hidden">
                <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-100 animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-100 animate-pulse"></div>
                  <div className="h-3 w-1/3 bg-gray-100 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {processedProducts.slice(0, displayCount).map((product) => {
                const productExpiryTime = expiryTimes[product.id];
                const hasExpiryTimer = showExpiryTimer && productExpiryTime && 
                  (productExpiryTime.days > 0 || productExpiryTime.hours > 0 || productExpiryTime.minutes > 0 || productExpiryTime.seconds > 0);

                return (
                  <div key={product.id} className="bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => trackProductView(product.id)}
                      className="block"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          style={{
                            objectFit: 'cover',
                            aspectRatio: '3/4'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/300x400?text=Book+Cover";
                          }}
                        />

                        {/* Book Badge - Top Left */}
                        <div className="absolute top-2 left-2 z-20">
                          <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 font-semibold">
                            Book
                          </Badge>
                        </div>

                        {/* Top Selling Badge */}
                        {product.is_top_selling && (
                          <div className="absolute top-2 right-2 z-20">
                            <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 font-semibold flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" />
                              Bestseller
                            </Badge>
                          </div>
                        )}

                        {/* Expiry Timer - Full width band at bottom */}
                        {hasExpiryTimer && (
                          <div className="absolute bottom-0 left-0 right-0 bg-red-50/90 text-red-700 text-xs flex items-center justify-center py-1.5 gap-1 z-10 border-t border-red-200">
                            <Timer className="w-3 h-3" />
                            <span className="font-medium">Ends in</span>
                            <span className="font-mono font-bold">
                              {productExpiryTime.days.toString().padStart(2, "0")}:
                              {productExpiryTime.hours.toString().padStart(2, "0")}:
                              {productExpiryTime.minutes.toString().padStart(2, "0")}
                            </span>
                          </div>
                        )}

                        {/* Timer for flash deals */}
                        {!hasExpiryTimer && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) ? (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs flex items-center justify-center py-2 gap-1 z-10">
                            <Timer className="w-3 h-3" />
                            <span className="font-mono">
                              {[timeLeft.days, timeLeft.hours, timeLeft.minutes].map((unit, i) => (
                                <span key={i}>
                                  {unit.toString().padStart(2, "0")}
                                  {i < 2 && <span className="mx-0.5">:</span>}
                                </span>
                              ))}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </Link>

                    <div className="p-3">
                      {/* Genre tag */}
                      <div className="mb-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                          {product.genre || 'General'}
                        </Badge>
                      </div>

                      {/* Book title */}
                      <h4 className="text-sm font-semibold line-clamp-2 text-gray-900 leading-tight mb-1.5">
                        {product.name}
                      </h4>

                      {/* Author */}
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        by {product.author || 'Unknown Author'}
                      </p>

                      {/* Custom price display */}
                      {product.price !== undefined && product.price !== null && product.price > 0 && (
                        <div className="leading-none">
                          {/* Current price */}
                          <div className="flex items-center gap-2 leading-none">
                            <span className="font-bold text-orange-500 text-base">
                              ${(
                                product.discount_price !== undefined && 
                                product.discount_price !== null && 
                                product.discount_price > 0 ? 
                                product.discount_price : 
                                product.price
                              ).toFixed(2)}
                            </span>
                          </div>

                          {/* Barred original price if discounted */}
                          {product.discount_price !== undefined && 
                           product.discount_price !== null && 
                           product.discount_price > 0 && 
                           product.discount_price < product.price && (
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              <span className="text-gray-400 line-through text-sm">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-green-600 font-medium text-xs bg-green-50 px-1.5 py-0.5 rounded w-fit whitespace-nowrap">
                                Save ${(product.price - product.discount_price).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-700">{product.rating.toFixed(1)}</span>
                          {product.total_orders && (
                            <span className="text-xs text-gray-500">({product.total_orders})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show "Load More" indicator */}
            {displayCount < processedProducts.length && (
              <div className="text-center py-6">
                <div className="text-sm text-gray-500">
                  Scroll down to discover more books...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <div className="text-lg font-medium">No books available</div>
            <div className="text-sm mt-1">Check back later for new book deals</div>
          </div>
        )}
      </div>

      {/* Floating Add Book Button (for sellers) */}
      {onAddProduct && (
        <button
          onClick={handleAddProduct}
          className="fixed bottom-20 right-4 z-50 bg-white text-blue-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-blue-200 backdrop-blur-sm"
          aria-label="Add Book"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}