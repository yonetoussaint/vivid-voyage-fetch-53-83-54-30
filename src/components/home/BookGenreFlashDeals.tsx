import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Timer, Plus, ChevronRight, Package, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useSellerByUserId } from "@/hooks/useSellerByUserId";
import { supabase } from "@/integrations/supabase/client";
import SellerSummaryHeader from "@/components/seller-app/SellerSummaryHeader";
import ProductFilterBar from "@/components/home/ProductFilterBar";
import PriceInfo from "@/components/product/PriceInfo";
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
  title = "Products",
  subtitle = "Manage all your products",
  showSectionHeader = true,
  showSummary = true,
  showFilters = true,
  icon,
  customCountdown,
  showCountdown,
  showVerifiedSellers = false,
  verifiedSellersText = "Verified Sellers",
  summaryMode = 'products',
  customProductRender,
  customProductInfo,
  showExpiryTimer = false,
  expiryField = 'expiry',
  showMarketingMetrics = false,
  showStatusBadge = false
}: GenreFlashDealsProps) {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(8);

  // Define filter categories
  const filterCategories = React.useMemo(() => [
    {
      id: 'category',
      label: 'Category',
      options: ['All Categories', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business']
    },
    {
      id: 'price',
      label: 'Price Range',
      options: ['All Prices', 'Under $10', '$10-$25', '$25-$50', 'Over $50']
    },
    {
      id: 'availability',
      label: 'Availability',
      options: ['All Stock', 'In Stock', 'Low Stock', 'Out of Stock']
    },
    {
      id: 'discount',
      label: 'Discount',
      options: ['All Discounts', 'On Sale', 'No Discount']
    }
  ], []);

  // Add filter state with initial "All" options
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(() => ({
    category: 'All Categories',
    price: 'All Prices',
    availability: 'All Stock',
    discount: 'All Discounts'
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

  // Helper function to get status color (moved from SellerMarketing)
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
      // If a custom handler is provided, use it
      onAddProduct();
    } else {
      // Default behavior: navigate to product edit page for new product
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
  console.log('All products loading:', allProductsLoading);

  // Determine which products to use
  let allProducts = externalProducts || fetchedProducts || [];

  console.log('Total products to display:', allProducts.length);

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

      return {
        ...product,
        discountPercentage,
        stock: product.inventory ?? 0,
        image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
      };
    });

    // Apply filters only if showFilters is true
    if (showFilters) {
      if (selectedFilters.category && !isAllOption(selectedFilters.category)) {
        products = products.filter(p => p.category === selectedFilters.category);
      }

      if (selectedFilters.price && !isAllOption(selectedFilters.price)) {
        products = products.filter(p => {
          const price = p.discount_price || p.price;
          switch (selectedFilters.price) {
            case 'Under $10': return price < 10;
            case '$10-$25': return price >= 10 && price <= 25;
            case '$25-$50': return price > 25 && price <= 50;
            case 'Over $50': return price > 50;
            default: return true;
          }
        });
      }

      if (selectedFilters.availability && !isAllOption(selectedFilters.availability)) {
        products = products.filter(p => {
          switch (selectedFilters.availability) {
            case 'In Stock': return (p.inventory ?? 0) > 0;
            case 'Out of Stock': return (p.inventory ?? 0) === 0;
            case 'Low Stock': return (p.inventory ?? 0) > 0 && (p.inventory ?? 0) <= 10;
            default: return true;
          }
        });
      }

      if (selectedFilters.discount && !isAllOption(selectedFilters.discount)) {
        products = products.filter(p => {
          const discountPercentage = p.discount_price
            ? Math.round(((p.price - p.discount_price) / p.price) * 100)
            : 0;
          switch (selectedFilters.discount) {
            case 'On Sale': return discountPercentage > 0;
            case 'No Discount': return discountPercentage === 0;
            default: return true;
          }
        });
      }
    }

    console.log('✅ Processed products count:', products.length);
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

  // Prepare data for SellerSummaryHeader based on mode
  const getHeaderProps = () => {
    if (summaryMode === 'inventory') {
      return {
        mode: 'inventory' as const,
        title: "Inventory Overview",
        subtitle: "Manage your stock levels and product availability",
        stats: [
          { value: summaryStats.totalProducts.toString(), label: 'Total Items', color: 'text-blue-600' },
          { value: summaryStats.lowStock.toString(), label: 'Low Stock', color: 'text-red-600', status: 'low' as const },
          { value: `${Math.round((summaryStats.inStock / summaryStats.totalProducts) * 100)}%`, label: 'Availability', color: 'text-green-600' },
          { value: summaryStats.categories.toString(), label: 'Categories', color: 'text-purple-600' }
        ],
        progressPercentage: Math.round((summaryStats.inStock / summaryStats.totalProducts) * 100),
        progressVariant: 'stock-level' as const,
        progressStatus: summaryStats.lowStock > 10 ? 'low' as const : 'high' as const
      };
    } else if (summaryMode === 'products') {
      return {
        mode: 'products' as const,
        productsSummary: {
          totalProducts: summaryStats.totalProducts,
          activeProducts: summaryStats.inStock,
          categories: summaryStats.categories,
          averagePrice: summaryStats.totalProducts > 0 ? `G ${(summaryStats.totalValue / summaryStats.totalProducts).toFixed(2)}` : 'G 0.00',
          metrics: [
            { value: summaryStats.outOfStock.toString(), label: 'Out of Stock', color: 'text-red-600' },
            { value: summaryStats.categories.toString(), label: 'Categories', color: 'text-purple-600' },
            { value: summaryStats.lowStock.toString(), label: 'Low Stock', color: 'text-yellow-600' },
            { value: summaryStats.onDiscount.toString(), label: 'On Sale', color: 'text-blue-600' }
          ]
        }
      };
    } else {
      // reviews mode - use mock data or fetch real reviews
      return {
        mode: 'reviews' as const,
        reviewsSummary: {
          averageRating: 4.6,
          totalReviews: 1459914,
          distribution: [
            { stars: 5, count: 1100000, percentage: 75 },
            { stars: 4, count: 200000, percentage: 14 },
            { stars: 3, count: 80000, percentage: 5 },
            { stars: 2, count: 40000, percentage: 3 },
            { stars: 1, count: 39914, percentage: 3 }
          ]
        }
      };
    }
  };

  return (
    <div className={`w-full bg-white relative ${className}`}>
      {/* Summary Section - Optional */}
      {showSummary && (
        <SellerSummaryHeader {...getHeaderProps()} />
      )}

      {/* Filter Bar Section - Conditionally rendered */}
      {showFilters && (
        <div className="-mx-2">
          <ProductFilterBar
            filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            onFilterSelect={handleFilterSelect}
            onFilterClear={handleFilterClear}
            onClearAll={handleClearAll}
            onFilterButtonClick={handleFilterButtonClick}
          />
        </div>
      )}

      {/* Products Grid */}
      <div className="px-2">
        {isLoading && !externalProducts ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-white overflow-hidden">
                <div className="aspect-square bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-100 animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-100 animate-pulse"></div>
                  <div className="h-3 w-1/3 bg-gray-100 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2">
              {processedProducts.slice(0, displayCount).map((product) => {
                const productExpiryTime = expiryTimes[product.id];
                const hasExpiryTimer = showExpiryTimer && productExpiryTime && 
                  (productExpiryTime.days > 0 || productExpiryTime.hours > 0 || productExpiryTime.minutes > 0 || productExpiryTime.seconds > 0);

                return (
                  <div key={product.id} className="bg-white overflow-hidden">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => trackProductView(product.id)}
                      className="block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          style={{
                            objectFit: 'cover',
                            aspectRatio: '1/1'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/300x300?text=No+Image";
                          }}
                        />

                        {/* Status Badge - Top Left */}
                        {showStatusBadge && product.status && (
                          <div className="absolute top-2 left-2 z-20">
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(product.status)} text-xs`}
                            >
                              {product.status}
                            </Badge>
                          </div>
                        )}

                        {/* Views with Eye Icon - Top Right */}
                        {showMarketingMetrics && product.views !== undefined && (
                          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                            <Eye className="w-3 h-3" />
                            <span className="font-medium">{formatNumber(product.views)}</span>
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

                    <div className="p-1">
                      <h4 className="text-xs font-medium line-clamp-2 text-gray-900 leading-tight">
                        {product.name}
                      </h4>

                      {/* Custom price display without currency switcher */}
                      <div className="leading-none">
                        {/* Current price */}
                        <div className="flex items-center gap-2 leading-none">
                          <span className="font-bold text-orange-500 text-base">
                            G {(product.discount_price || product.price).toFixed(2)}
                          </span>
                          <span className="text-gray-500 text-xs">/ unit</span>
                        </div>

                        {/* Barred original price if discounted */}
                        {product.discount_price && product.discount_price < product.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                              G {product.price.toFixed(2)}
                            </span>
                            <span className="text-green-600 font-medium text-xs bg-green-50 px-1.5 py-0.5 rounded">
                              Save G {(product.price - product.discount_price).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product info section */}
                      {customProductInfo ? customProductInfo(product) : 
                       showMarketingMetrics ? renderMarketingProductInfo(product) : (
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-gray-500">
                            {product.stock} in stock
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show "Load More" indicator if there are more products */}
            {displayCount < processedProducts.length && (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">
                  Scroll down to load more products...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium">No products available</div>
            <div className="text-sm mt-1">Check back later for new deals</div>
          </div>
        )}
      </div>

      {/* Floating Add Product Button */}
      <button
        onClick={handleAddProduct}
        className="fixed bottom-20 right-4 z-50 bg-white text-gray-900 rounded-full p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200 backdrop-blur-sm"
        aria-label="Add Product"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}