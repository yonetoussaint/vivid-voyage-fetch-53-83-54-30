import React from "react";
import { Link } from "react-router-dom";
import { Timer, Plus, ChevronRight } from "lucide-react"; // Added Plus icon
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useSellerByUserId } from "@/hooks/useSellerByUserId";
import { supabase } from "@/integrations/supabase/client";
import SellerSummaryHeader from "@/components/seller-app/SellerSummaryHeader";
import ProductFilterBar from "@/components/home/ProductFilterBar";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  product_images?: Array<{ src: string }>;
  inventory?: number;
  flash_start_time?: string;
  seller_id?: string; // Added seller_id
  category?: string; // Added category
}

interface GenreFlashDealsProps {
  productType?: string;
  excludeTypes?: string[];
  className?: string;
  products?: Product[];
  sellerId?: string;
  onAddProduct?: () => void; // Added prop for add product action
  title?: string;
  subtitle?: string;
  showSectionHeader?: boolean;
  showSummary?: boolean;
  icon?: React.ComponentType<any>;
  customCountdown?: string;
  showCountdown?: boolean;
}

interface SummaryStats {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  onDiscount: number;
  totalValue: number;
  lowStock: number;
}

export default function BookGenreFlashDeals({
  productType = undefined,
  excludeTypes = [],
  className = '',
  products: externalProducts,
  sellerId,
  onAddProduct, // Added prop
  title = "Products",
  subtitle = "Manage all your products",
  showSectionHeader = true,
  showSummary = true,
  icon,
  customCountdown,
  showCountdown
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
    // You can add custom logic here if needed
    console.log('Filter button clicked:', filterId);
  };

  // Fetch ALL products only if no external products provided
  const { data: fetchedProducts = [], isLoading: allProductsLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => fetchAllProducts(),
    refetchInterval: 5 * 60 * 1000,
    enabled: !externalProducts,
  });

  // Determine which products to use and filter by sellerId if provided
  let allProducts = externalProducts || fetchedProducts || [];
  if (sellerId && !externalProducts) {
    allProducts = allProducts.filter(product => product.seller_id === sellerId);
  }
  const isLoading = allProductsLoading;

  const [timeLeft, setTimeLeft] = useState({
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

    return {
      totalProducts,
      inStock,
      outOfStock,
      onDiscount,
      totalValue,
      lowStock
    };
  }, [allProducts]);

  // Create action button configuration
  const addProductButton = React.useMemo(() => {
    if (!onAddProduct) return undefined;

    return {
      label: "Add Product",
      icon: Plus,
      onClick: onAddProduct
    };
  }, [onAddProduct]);

  // Internal Section Header Component
  const InternalSectionHeader = () => {
    const Icon = icon;
    
    return (
      <div className="flex items-center px-2 mb-2 py-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 font-bold tracking-wide text-xs uppercase">
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span className="h-4 flex items-center justify-center">
              <span className="leading-none">{title}</span>
            </span>
            {showCountdown && timeLeft && (
              <>
                <span className="text-gray-400 mx-1 flex-shrink-0">|</span>
                <span className={`font-bold transition-colors duration-300 flex-shrink-0 text-sm ${
                  (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) < 10 ? 'text-red-600 animate-bounce' : 'text-red-500'
                }`}>
                  {customCountdown || `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
                </span>
              </>
            )}
          </div>
          <a
            href="/search?category=flash-deals"
            className="text-xs hover:underline flex items-center font-medium transition-colors"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </a>
        </div>
      </div>
    );
  };

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!allProducts || allProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const latestFlashStart = allProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000);
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [allProducts]);

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

    // Apply filters (skip if it's an "All" option)
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
          ? Math.round(((product.price - product.discount_price) / product.price) * 100)
          : 0;
        switch (selectedFilters.discount) {
          case 'On Sale': return discountPercentage > 0;
          case 'No Discount': return discountPercentage === 0;
          default: return true;
        }
      });
    }

    return products;
  }, [allProducts, selectedFilters]);

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

  const summaryHeaderStats = React.useMemo(() => {
    if (isLoading || processedProducts.length === 0) return [];

    return [
      { value: summaryStats.totalProducts, label: 'Total', color: 'text-blue-600' },
      { value: summaryStats.inStock, label: 'In Stock', color: 'text-green-600' },
      { value: summaryStats.onDiscount, label: 'On Discount', color: 'text-orange-600' },
      { value: `$${summaryStats.totalValue.toFixed(0)}`, label: 'Total Value', color: 'text-purple-600' },
      { value: summaryStats.lowStock, label: 'Low Stock', color: 'text-yellow-600' },
      { value: summaryStats.outOfStock, label: 'Out of Stock', color: 'text-red-600' }
    ];
  }, [summaryStats, isLoading, processedProducts.length]);

  return (
    <div className={`w-full bg-white ${className}`}>
      {/* Section Header - Optional */}
      {showSectionHeader && <InternalSectionHeader />}

      {/* Summary Section - Optional */}
      {showSummary && (
        <SellerSummaryHeader
          title={title}
          subtitle={subtitle}
          stats={summaryHeaderStats}
          actionButton={addProductButton}
          showStats={!isLoading && processedProducts.length > 0}
        />
      )}

      {/* Filter Bar Section - Added right before the products grid */}
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

      {/* Products Grid - Reverted to old version design */}
      <div className="py-4">
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
              {processedProducts.slice(0, displayCount).map((product) => (
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

                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-medium z-10">
                          -{product.discountPercentage}%
                        </div>
                      )}

                      {timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs flex items-center justify-center py-2 gap-1 z-10">
                          <Timer className="w-3 h-3" />
                          <span className="font-mono">
                            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                              <span key={i}>
                                {unit.toString().padStart(2, "0")}
                                {i < 2 && <span className="mx-0.5">:</span>}
                              </span>
                            ))}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="p-3 space-y-2">
                      <h4 className="text-sm font-medium line-clamp-2 text-gray-900 leading-tight">
                        {product.name}
                      </h4>

                      <div className="flex items-baseline gap-2">
                        <span className="text-red-600 font-bold text-base">
                          ${Number(product.discount_price || product.price).toFixed(2)}
                        </span>
                        {product.discount_price && (
                          <span className="text-xs text-gray-400 line-through">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>

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
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium">No products available</div>
            <div className="text-sm mt-1">Check back later for new deals</div>
          </div>
        )}
      </div>
    </div>
  );
}