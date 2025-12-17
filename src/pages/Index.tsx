import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import FlashDeals from "@/components/home/FlashDeals";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Sparkles, ChevronRight } from "lucide-react";

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

// Helper function to render tag elements
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
  return null;
};

// ProductCard component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const soldCount = product.sold_count || Math.floor(Math.random() * 10000) + 100;
  const rating = product.rating || (Math.random() * 1 + 4).toFixed(1);
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
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;
  const salesNote = soldCount > 5000 ? "Top selling on AliExpress" : "";

  return (
    <div className="bg-white rounded overflow-hidden">
      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-0.5">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
      </div>
      <div className="p-0.5">
        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight min-h-[2.2rem]">
          {tags.map((tag) => renderTag(tag))}
          {product.description || product.name}
        </p>
        <div className="flex items-center gap-0.5 mb-0.5">
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
            <span className="text-[10px] text-gray-500 line-through ml-0.5">
              ₱{product.price.toLocaleString('en-US')}
            </span>
          )}
        </p>
        {salesNote && (
          <p className="text-[10px] text-gray-500">{salesNote}</p>
        )}
      </div>
    </div>
  );
};

// Popular Categories Component
const PopularCategories: React.FC = () => {
  const categories = [
    {
      id: 1,
      name: 'Mobiles',
      searches: '114K+ search',
      discount: 'HOT',
      image: '📱',
      bgColor: 'bg-orange-100',
      discountBg: 'bg-pink-600'
    },
    {
      id: 2,
      name: 'Cribs & Cots',
      searches: '205 search',
      discount: '-50%',
      image: '🛏️',
      bgColor: 'bg-blue-100',
      discountBg: 'bg-blue-600'
    },
    {
      id: 3,
      name: 'Portable Speakers',
      searches: '3K+ search',
      discount: '-33%',
      image: '🔊',
      bgColor: 'bg-gray-100',
      discountBg: 'bg-pink-600'
    },
    {
      id: 4,
      name: 'Electric Insect...',
      searches: '3K+ search',
      discount: '-59%',
      image: '⚡',
      bgColor: 'bg-gray-50',
      discountBg: 'bg-pink-600'
    },
    {
      id: 5,
      name: 'Smart Watches',
      searches: '89K+ search',
      discount: '-45%',
      image: '⌚',
      bgColor: 'bg-purple-100',
      discountBg: 'bg-purple-600'
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 px-2 pt-2">
        <div className="flex-1 mr-2">
          <h2 className="text-lg font-bold text-gray-900">Popular Categories for you</h2>
          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">Trending items based on your interests</p>
        </div>
        <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 mt-1">
          <span className="text-xs font-medium">More</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="flex gap-2 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 w-20 cursor-pointer group"
          >
            {/* Image Container */}
            <div className={`relative ${category.bgColor} rounded-lg overflow-hidden mb-2 aspect-square flex items-center justify-center transition-transform group-hover:scale-105`}>
              {/* Discount Badge */}
              <div className={`absolute top-1 left-1 ${category.discountBg} text-white px-1 py-0.5 text-[9px] font-bold rounded`}>
                {category.discount}
              </div>
              
              {/* Product Image Placeholder */}
              <div className="text-2xl">{category.image}</div>
            </div>

            {/* Category Info */}
            <div className="text-center">
              <h3 className="font-semibold text-[11px] text-gray-900 mb-0.5 truncate leading-tight">
                {category.name}
              </h3>
              <p className="text-[9px] text-gray-500">
                {category.searches}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Infinite Products Grid Component
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
    queryFn: () => fetchAllProducts(undefined, category, 100),
    staleTime: 60000,
  });

  // Set initial products when data loads
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts);
      setHasMore(initialProducts.length >= productsPerPage);
    }
  }, [initialProducts]);

  // Load more products function
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      const startIndex = nextPage * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      
      if (initialProducts && startIndex < initialProducts.length) {
        const newProducts = initialProducts.slice(startIndex, endIndex);
        
        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setAllProducts(prev => [...prev, ...newProducts]);
          setPage(nextPage);
        }
      } else {
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

  // Show loading state while fetching initial data
  if (initialLoading && allProducts.length === 0) {
    return (
      <div className="pt-2">
        <div className="px-2">
          <div className="text-center py-8 text-gray-500">
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (!initialLoading && allProducts.length === 0) {
    return (
      <div className="pt-2">
        <div className="text-center py-8 text-gray-500">
          No products found. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="px-2">
        <div className="grid grid-cols-2 gap-2">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
    </div>
  );
};

const ForYouContent: React.FC<ForYouContentProps> = ({ category }) => {
  const navigate = useNavigate();
  const { setHeaderMode, headerMode } = useHeaderFilter();
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  // Improved scroll detection for header mode switching
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - scrollY.current;

          const header = document.getElementById("ali-header");
          if (!header) return;

          const headerHeight = header.getBoundingClientRect().height;
          const newsTicker = document.querySelector('.news-ticker');

          if (newsTicker) {
            const newsTickerRect = newsTicker.getBoundingClientRect();
            const newsTickerTopRelativeToHeader = newsTickerRect.top - headerHeight;
            const shouldShowNews = newsTickerTopRelativeToHeader <= 0;

            const scrollThreshold = 2;
            const isScrollingDown = scrollDelta > scrollThreshold;
            const isScrollingUp = scrollDelta < -scrollThreshold;

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

  // Components array with separators after each component
  const components = [
    <div key="hero" ref={heroBannerRef} className="mb-2">
      <HeroBanner showNewsTicker={true} />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-2 mb-2"></div>,

    <div key="flash-deals-wrapper" className="mb-2">
      <FlashDeals
        showCountdown={true}
        icon={Tag}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-2 mb-2"></div>,

    <PopularCategories key="popular-categories" />,

    <div key="separator-3" className="w-full bg-gray-100 h-2 mb-2"></div>,

    <InfiniteProductsGrid key="infinite-grid" category={category} />,
  ];

  return (
    <div className="overflow-hidden relative">
      <div className="pb-2">
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