import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import FlashDeals from "@/components/home/FlashDeals";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { useAuth } from "@/components/Providers";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Star, ShoppingBag, TrendingUp, Zap, Sparkles } from "lucide-react";
import { useLocation } from 'react-router-dom';

interface ForYouContentProps {
  category: string;
}

// Product interface matching your database structure
interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  inventory: number;
  rating?: number;
  sold_count?: number;
  product_images?: Array<{ src: string }>;
  description?: string;
  category?: string;
  tags?: string[];
  flash_start_time?: string;
  created_at?: string;
}

// Helper function to render tag elements (updated to match your product tags)
const renderTag = (tag: string) => {
  if (tag === "Sale" || tag === "sale") {
    return <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>;
  }
  if (tag === "SuperDeals" || tag === "flash_deal") {
    return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">SuperDeals</span>;
  }
  if (tag === "Brand+" || tag === "premium") {
    return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Brand+</span>;
  }
  if (tag === "Certified Original" || tag === "original") {
    return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Certified Original</span>;
  }
  if (tag === "250%") {
    return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">250%</span>;
  }
  return null;
};

// ProductCard component updated for real data
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Calculate sold count - using inventory or a default
  const soldCount = product.sold_count || Math.floor(Math.random() * 10000) + 100;
  
  // Get rating or generate a realistic one
  const rating = product.rating || (Math.random() * 1 + 4).toFixed(1);
  
  // Get the first product image or use a placeholder
  const imageUrl = product.product_images?.[0]?.src || `https://placehold.co/300x300?text=Product`;
  
  // Generate tags based on product properties
  const generateTags = () => {
    const tags = [];
    if (product.discount_price) tags.push("Sale");
    if (product.flash_start_time) tags.push("SuperDeals");
    if (product.category?.toLowerCase().includes("premium")) tags.push("Brand+");
    if (product.tags && product.tags.length > 0) {
      tags.push(...product.tags.slice(0, 2));
    }
    return tags.length > 0 ? tags : ["Popular"];
  };

  const tags = generateTags();
  
  // Get display price (discount or regular)
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;
  
  // Generate quality note based on price tier
  const qualityNote = product.price > 10000 ? "Premium Quality" : "";
  
  // Generate sales note
  const salesNote = soldCount > 5000 ? "Top selling on AliExpress" : "";

  return (
    <div className="bg-white rounded overflow-hidden">
      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
      </div>
      <div className="p-1">
        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight min-h-[2.2rem]">
          {tags.map((tag) => renderTag(tag))}
          {product.description || product.name}
        </p>
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[10px] text-gray-500">{soldCount.toLocaleString()} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <div className="flex items-center">
            <span className="text-[10px] text-gray-700 mr-0.5">★</span>
            <span className="text-[10px] text-gray-700">{rating}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-900">
          ₱{displayPrice.toLocaleString('en-US')}
          {hasDiscount && (
            <span className="text-[10px] text-gray-500 line-through ml-1">
              ₱{product.price.toLocaleString('en-US')}
            </span>
          )}
        </p>
        {salesNote && (
          <p className="text-[10px] text-gray-500">{salesNote}</p>
        )}
        {qualityNote && (
          <p className="text-[10px] text-orange-600">{qualityNote}</p>
        )}
      </div>
    </div>
  );
};

// Infinite Products Grid Component using real data
const InfiniteProductsGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [page, setPage] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const productsPerPage = 20;

  // Fetch initial products
  const { data: initialProducts, isLoading: initialLoading } = useQuery({
    queryKey: ["products", "for-you", category],
    queryFn: () => fetchAllProducts(undefined, category, 100), // Fetch up to 100 products initially
    staleTime: 60000,
  });

  // Set initial products when data loads
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts);
      // Check if we have more products to load
      setHasMore(initialProducts.length >= productsPerPage);
    }
  }, [initialProducts]);

  // Load more products function
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      // Calculate the next page
      const nextPage = page + 1;
      
      // Fetch more products with pagination
      // You might need to create a paginated version of fetchAllProducts
      // For now, we'll simulate pagination from the initial dataset
      const startIndex = nextPage * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      
      // If we're using the initial dataset
      if (initialProducts && startIndex < initialProducts.length) {
        const newProducts = initialProducts.slice(startIndex, endIndex);
        
        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setAllProducts(prev => [...prev, ...newProducts]);
          setPage(nextPage);
        }
      } else {
        // If we need to fetch from API with pagination
        // You would implement API pagination here
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, initialProducts, productsPerPage]);

  // Get visible products based on current page
  const visibleProducts = allProducts.slice(0, (page + 1) * productsPerPage);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, loadMoreProducts]);

  // Section Header
  const SectionHeader: React.FC = () => (
    <div className="mb-4 px-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          Recommended For You
        </h2>
        <button className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
          View All
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Personalized recommendations based on your interests
      </p>
    </div>
  );

  // Loading skeleton
  const LoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded overflow-hidden">
          <div className="w-full aspect-square bg-gray-100 rounded overflow-hidden mb-1 animate-pulse"></div>
          <div className="p-1 space-y-1.5">
            <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
            <div className="flex items-center gap-1">
              <div className="h-2 bg-gray-100 rounded animate-pulse w-1/3"></div>
              <div className="h-2 bg-gray-100 rounded animate-pulse w-4"></div>
              <div className="h-2 bg-gray-100 rounded animate-pulse w-1/4"></div>
            </div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Show loading state while fetching initial data
  if (initialLoading && allProducts.length === 0) {
    return (
      <div className="py-4">
        <SectionHeader />
        <div className="px-2">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (!initialLoading && allProducts.length === 0) {
    return (
      <div className="py-4">
        <SectionHeader />
        <div className="text-center py-8 text-gray-500">
          No products found. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <SectionHeader />

      <div className="px-2">
        <div className="grid grid-cols-2 gap-2">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loading indicator */}
        {loading && <LoadingSkeleton />}

        {/* Load more trigger */}
        <div 
          ref={loaderRef}
          className="flex justify-center items-center py-6"
        >
          {hasMore ? (
            <div className="text-center">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500">Loading more products...</p>
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No more products to load</p>
              <p className="text-[10px] text-gray-400 mt-1">You've reached the end</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Back to top button */}
      {visibleProducts.length > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 bg-blue-600 text-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-blue-700 transition-colors z-40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for filter functionality
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Header filter context for news ticker functionality
  const {
    setHeaderMode,
    headerMode
  } = useHeaderFilter();

  // Scroll detection refs
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  // Define filter categories
  const filterCategories = [
    {
      id: 'category',
      label: 'Category',
      options: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Automotive', 'Kids']
    },
    {
      id: 'price',
      label: 'Price Range',
      options: ['Under $25', '$25-$50', '$50-$100', '$100-$200', 'Over $200']
    },
    {
      id: 'rating',
      label: 'Rating',
      options: ['4+ Stars', '3+ Stars', '2+ Stars', 'Any Rating']
    },
    {
      id: 'shipping',
      label: 'Shipping',
      options: ['Free Shipping', 'Fast Delivery', 'Local Seller']
    },
    {
      id: 'sort',
      label: 'Sort By',
      options: ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']
    }
  ];

  // Filter handler functions
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterId]: option }));
    console.log('Filter selected:', filterId, option);
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      console.log('Filter cleared:', filterId);
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    console.log('All filters cleared');
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  const isFilterDisabled = (filterId: string) => {
    return false;
  };

  // Custom handler function
  const yourCustomHandler = () => {
    navigate('/reels');
  };

  // Improved scroll detection for header mode switching
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - scrollY.current;

          // Get header element
          const header = document.getElementById("ali-header");
          if (!header) return;

          const headerHeight = header.getBoundingClientRect().height;

          // Find the news ticker element in the hero banner
          const newsTicker = document.querySelector('.news-ticker');

          if (newsTicker) {
            const newsTickerRect = newsTicker.getBoundingClientRect();

            // Calculate when news ticker reaches the bottom of the header
            const newsTickerTopRelativeToHeader = newsTickerRect.top - headerHeight;

            // More precise timing: switch to news when news ticker is about to be covered by header
            const shouldShowNews = newsTickerTopRelativeToHeader <= 0;

            // Determine scroll direction with threshold to prevent jitter
            const scrollThreshold = 2;
            const isScrollingDown = scrollDelta > scrollThreshold;
            const isScrollingUp = scrollDelta < -scrollThreshold;

            // Smart switching logic
            if (shouldShowNews && isScrollingDown) {
              setHeaderMode('news');
            } else if (isScrollingUp) {
              setHeaderMode('categories');
            } else if (currentScrollY <= headerHeight) {
              setHeaderMode('categories');
            }
          }

          scrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setHeaderMode, headerMode]);

  // Reset to categories when component unmounts
  useEffect(() => {
    return () => {
      setHeaderMode('categories');
    };
  }, [setHeaderMode]);

  // Define all components to render
  const components = [
    <div key="hero" ref={heroBannerRef}>
      <HeroBanner showNewsTicker={true} />
    </div>,

    <FlashDeals
      key="flash-1"
      showCountdown={true}
      icon={Tag}
      showTitleChevron={true}
    />,

    <InfiniteProductsGrid key="infinite-grid" category={category} />,
  ];

  return (
    <div className="overflow-hidden relative">
      <div className="space-y-2">
        {components.map((component, index) => (
          <React.Fragment key={`section-${index}`}>
            {component}
          </React.Fragment>
        ))}
      </div>

      {/* Hidden Footer */}
      <div 
        className="sr-only" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
        aria-hidden="true"
      >
        <Footer />
      </div>
    </div>
  );
};

const ForYou: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('recommendations');

  // Listen for category changes from header
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      console.log('Category changed to:', event.detail.category);
      setActiveCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ForYouContent category={activeCategory} />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ForYou;