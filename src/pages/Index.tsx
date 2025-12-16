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

// Mock products for demonstration (you can replace with real data)
const MOCK_PRODUCTS = Array.from({ length: 100 }, (_, index) => ({
  id: `product-${index + 1}`,
  title: `High Quality Product ${index + 1} with Amazing Features`,
  price: Math.floor(Math.random() * 50000) + 1000,
  soldCount: Math.floor(Math.random() * 10000) + 100,
  rating: (Math.random() * 1 + 4).toFixed(1),
  imageUrl: `https://images.unsplash.com/photo-${1556742049 + index * 10}?q=80&w=300&h=300&auto=format&fit=crop`,
  tags: index % 3 === 0 ? ["Sale"] : index % 5 === 0 ? ["SuperDeals", "Sale"] : ["Brand+"],
  description: `Product description ${index + 1} with all features included`,
  note: index % 4 === 0 ? "Top selling on AliExpress" : "",
  qualityNote: index % 6 === 0 ? "Premium Quality" : "",
}));

// Helper function to render tag elements (exact copy from profile page)
const renderTag = (tag: string) => {
  if (tag === "Sale") {
    return <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
  }
  if (tag === "SuperDeals") {
    return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
  }
  if (tag === "Brand+") {
    return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
  }
  if (tag === "Certified Original") {
    return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
  }
  if (tag === "250%") {
    return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
  }
  return null;
};

// ProductCard component (exact copy from profile page)
const ProductCard: React.FC<{ product: any }> = ({ product }) => (
  <div className="bg-white rounded overflow-hidden">
    <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
      <img 
        src={product.imageUrl} 
        alt={product.title} 
        className="w-full h-full object-cover" 
      />
    </div>
    <div className="p-1">
      <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight min-h-[2.2rem]">
        {product.tags.map((tag: string) => renderTag(tag))}
        {product.description}
      </p>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[10px] text-gray-500">{product.soldCount.toLocaleString()} sold</span>
        <span className="text-[10px] text-gray-400">|</span>
        <div className="flex items-center">
          <span className="text-[10px] text-gray-700 mr-0.5">★</span>
          <span className="text-[10px] text-gray-700">{product.rating}</span>
        </div>
      </div>
      <p className="text-sm font-bold text-gray-900">₱{product.price.toLocaleString('en-US')}</p>
      {product.note && (
        <p className="text-[10px] text-gray-500">{product.note}</p>
      )}
      {product.qualityNote && (
        <p className="text-[10px] text-orange-600">{product.qualityNote}</p>
      )}
    </div>
  </div>
);

// Infinite Products Grid Component
const InfiniteProductsGrid: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loaderRef = useRef(null);
  const productsPerPage = 20;

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const startIndex = page * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const newProducts = MOCK_PRODUCTS.slice(startIndex, endIndex);

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setVisibleProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
      
      setLoading(false);
    }, 1000);
  }, [page, loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadMoreProducts();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
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

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, loadMoreProducts]);

  // Header for the products section
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

  // Loading skeleton matching the exact product card UI
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
          ) : (
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No more products to load</p>
              <p className="text-[10px] text-gray-400 mt-1">You've reached the end</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Back to top button - minimal style */}
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

  // State for lazy loading carousel data
  const [visibleCarousels, setVisibleCarousels] = useState<Set<number>>(new Set([0, 1, 2]));

  // Header filter context for news ticker functionality
  const {
    setHeaderMode,
    headerMode
  } = useHeaderFilter();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  // Scroll detection refs
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const heroBannerRef = useRef<HTMLDivElement>(null);
  const newsTickerRef = useRef<HTMLDivElement>(null);

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

            console.log('Scroll detection:', {
              currentScrollY,
              scrollDelta,
              shouldShowNews,
              headerMode,
              newsTickerTop: newsTickerRect.top,
              headerHeight
            });
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

  // Intersection Observer for lazy loading carousels
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const carouselIndex = parseInt(entry.target.getAttribute('data-carousel-index') || '0');
            setVisibleCarousels(prev => new Set([...prev, carouselIndex, carouselIndex + 1]));
          }
        });
      },
      {
        rootMargin: '400px',
        threshold: 0.01
      }
    );

    const placeholders = document.querySelectorAll('[data-carousel-placeholder]');
    placeholders.forEach(placeholder => observer.observe(placeholder));

    return () => observer.disconnect();
  }, []);

  // Helper function to render VendorProductCarousel with real data from database
  const renderVendorCarousel = (index: number) => {
    const productSlice = products?.slice((index * 5) % (products?.length || 20), ((index * 5) + 5) % (products?.length || 20)) || [];

    if (!visibleCarousels.has(index)) {
      return (
        <div 
          key={`vendor-placeholder-${index}`}
          data-carousel-placeholder
          data-carousel-index={index}
          className="w-full h-96 bg-gray-50 animate-pulse"
        />
      );
    }

    return null;
  };

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
    
    <InfiniteProductsGrid key="infinite-grid" />,
  ];

  return (
    <div className="overflow-hidden relative">
      {/* REMOVED the extra padding div - MainLayout handles spacing */}
      <div className="space-y-2">
        {components.map((component, index) => (
          <React.Fragment key={`section-${index}`}>
            {component}
          </React.Fragment>
        ))}
      </div>

      {/* Hidden Footer - present in DOM for Google Auth but not visible */}
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