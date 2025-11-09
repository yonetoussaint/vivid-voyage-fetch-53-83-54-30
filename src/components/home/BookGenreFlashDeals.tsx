import React from "react";
import { Link } from "react-router-dom";
import { Timer, Plus, ChevronRight, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useSellerByUserId } from "@/hooks/useSellerByUserId";
import { supabase } from "@/integrations/supabase/client";
import SellerSummaryHeader from "@/components/seller-app/SellerSummaryHeader";
import ProductFilterBar from "@/components/home/ProductFilterBar";
import PriceInfo from "@/components/product/PriceInfo";

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
  expiryField = 'expiry'
}: GenreFlashDealsProps) {
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
          averagePrice: summaryStats.totalProducts > 0 ? `$${(summaryStats.totalValue / summaryStats.totalProducts).toFixed(2)}` : '$0.00',
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
      <div className="">
        {isLoading && !externalProducts ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-white overflow-hidden">
                <div className="aspect-square bg-gray-100 animate-pulse"></div>
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
                  <div key={product.id} className="bg-white border border-gray-200 overflow-hidden">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => trackProductView(product.id)}
                      className="block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
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

                        {/* Currency switcher badge - positioned outside the Link */}
                        <div className="absolute top-2 right-2 z-20">
                          <PriceInfo 
                            price={product.discount_price || product.price}
                            size="sm"
                            showOnlyBadge={true}
                          />
                        </div>

                        {/* Custom product render section */}
                        {customProductRender && customProductRender(product)}

                        {/* Only show discount badge */}
                        {product.discountPercentage > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-medium z-10">
                            -{product.discountPercentage}%
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

                    <div className="p-1 space-y-2">
                      <h4 className="text-xs font-medium line-clamp-2 text-gray-900 leading-tight">
                        {product.name}
                      </h4>

                      {/* PriceInfo component */}
                      <PriceInfo 
                        price={product.discount_price || product.price}
                        originalPrice={product.discount_price ? product.price : undefined}
                        size="sm"
                        showOnlyBadge={false}
                      />

                      {/* Custom product info section */}
                      {customProductInfo ? (
                        customProductInfo(product)
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {product.stock} in stock
                          </div>
                          {product.discountPercentage > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              Save ${(product.price - (product.discount_price || product.price)).toFixed(2)}
                            </div>
                          )}
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
      {onAddProduct && (
        <button
          onClick={onAddProduct}
          className="fixed bottom-20 right-4 z-50 bg-gradient-to-r from-red-400/80 to-pink-500/80 backdrop-blur-md text-white rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Add Product"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="font-medium text-sm">Add Product</span>
          </div>
        </button>
      )}
    </div>
  );
}