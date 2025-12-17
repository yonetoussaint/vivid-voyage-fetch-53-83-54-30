import React, { useState,useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
// Add this import with your other imports
import SectionHeader from "@/components/home/SectionHeader";
import { fetchAllProducts } from "@/integrations/supabase/products";
import FlashDeals from "@/components/home/FlashDeals";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Sparkles, ChevronRight, DollarSign, Zap, Video, Crown } from "lucide-react";

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

// ProductCard component - FIXED spacing and tags position
// ProductCard component - FIXED spacing issue
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
        {/* Product name with tags inline - REMOVED min-height */}
        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
          {tags.map((tag) => renderTag(tag))}
          {product.name}
        </p>
        <div className="flex items-center gap-0.5 mb-0.5">
          <span className="text-[10px] text-gray-500">{soldCount.toLocaleString()} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <div className="flex items-center">
            <span className="text-[10px] text-gray-700 mr-0.5">★</span>
            <span className="text-[10px] text-gray-700">{rating}</span>
          </div>
        </div>
        {/* Currency changed to HTG (G) */}
        <p className="text-sm font-bold text-gray-900">
          G{displayPrice.toLocaleString('en-US')}
          {hasDiscount && (
            <span className="text-[10px] text-gray-500 line-through ml-0.5">
              G{product.price.toLocaleString('en-US')}
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

// Favourite Channels Component
const FavouriteChannels: React.FC = () => {
  const channels = [
    {
      name: 'LazCash',
      icon: 'RM',
      bgColor: 'bg-gradient-to-br from-orange-300 to-orange-400',
      textColor: 'text-pink-600',
      iconType: 'text'
    },
    {
      name: 'LazFlash',
      icon: <Zap className="w-8 h-8" fill="white" stroke="white" />,
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      name: 'Choice',
      icon: 'CHOICE',
      bgColor: 'bg-yellow-400',
      textColor: 'text-gray-800',
      iconType: 'text'
    },
    {
      name: 'LazLive',
      icon: <Video className="w-8 h-8" fill="white" stroke="none" />,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      name: 'LazAffiliates',
      icon: <DollarSign className="w-10 h-10" strokeWidth={3} />,
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      textColor: 'text-white',
      iconType: 'component'
    },
    {
      name: 'Best Sellers',
      icon: <Crown className="w-8 h-8" fill="white" stroke="none" />,
      bgColor: 'bg-gradient-to-br from-amber-600 to-amber-700',
      textColor: 'text-white',
      iconType: 'component'
    }
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-6 gap-1">
        {channels.map((channel, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className={`w-9 h-9 rounded-full ${channel.bgColor} flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform`}>
              {channel.iconType === 'text' ? (
                <span className={`font-bold ${channel.textColor} text-[8px]`}>
                  {channel.icon}
                </span>
              ) : (
                <div className={channel.textColor}>
                  {React.cloneElement(channel.icon, { 
                    className: channel.icon.props.className.replace(/w-\d+|h-\d+/g, '').trim() + ' w-3.5 h-3.5'
                  })}
                </div>
              )}
            </div>
            <span className="text-[8px] font-medium text-gray-800 text-center max-w-[42px] overflow-hidden text-ellipsis leading-tight">
              {channel.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Popular Categories Component
// Popular Categories Component - UPDATED with SectionHeader
const PopularCategories: React.FC = () => {
  const navigate = useNavigate();

  const handleMoreClick = () => {
    navigate('/categories');
  };

  const categories = [
    {
      id: 1,
      name: 'Mobiles',
      discount: 'HOT',
      image: '📱',
      bgColor: 'bg-orange-100',
      discountBg: 'bg-pink-600'
    },
    {
      id: 2,
      name: 'Cribs & Cots',
      discount: '-50%',
      image: '🛏️',
      bgColor: 'bg-blue-100',
      discountBg: 'bg-blue-600'
    },
    {
      id: 3,
      name: 'Portable Speakers',
      discount: '-33%',
      image: '🔊',
      bgColor: 'bg-gray-100',
      discountBg: 'bg-pink-600'
    },
    {
      id: 4,
      name: 'Electric Insect...',
      discount: '-59%',
      image: '⚡',
      bgColor: 'bg-gray-50',
      discountBg: 'bg-pink-600'
    },
    {
      id: 5,
      name: 'Smart Watches',
      discount: '-45%',
      image: '⌚',
      bgColor: 'bg-purple-100',
      discountBg: 'bg-purple-600'
    }
  ];

  return (
    <div className="bg-white">
      {/* Use SectionHeader component like FlashDeals */}
      <SectionHeader
        title="Popular Categories for you"
        showTitleChevron={true}
        onTitleClick={handleMoreClick}
      />

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
              <h3 className="font-semibold text-[11px] text-gray-900 mb-0 truncate leading-tight">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Infinite Products Grid Component
// Infinite Products Grid Component - FIXED pagination
const InfiniteProductsGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [page, setPage] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const productsPerPage = 20;

  // Fetch ALL products
  const { data: initialProducts, isLoading: initialLoading } = useQuery({
    queryKey: ["products", "for-you", category],
    queryFn: () => fetchAllProducts(), // Fetch all products
    staleTime: 60000,
  });

  // Filter products by category if needed
  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    if (category && category !== 'recommendations') {
      // Filter products by category
      return initialProducts.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase() ||
        product.tags?.some(tag => tag.toLowerCase() === category.toLowerCase())
      );
    }
    
    return initialProducts;
  }, [initialProducts, category]);

  // Set filtered products when data loads
  useEffect(() => {
    if (filteredProducts && filteredProducts.length > 0) {
      setAllProducts(filteredProducts);
      // Check if we have more products than the first page
      setHasMore(filteredProducts.length > productsPerPage);
      setPage(0); // Reset page when category changes
    } else if (filteredProducts && filteredProducts.length === 0) {
      setAllProducts([]);
      setHasMore(false);
    }
  }, [filteredProducts]);

  // Calculate visible products
  const visibleProducts = useMemo(() => {
    const startIndex = 0;
    const endIndex = (page + 1) * productsPerPage;
    return allProducts.slice(startIndex, endIndex);
  }, [allProducts, page, productsPerPage]);

  // Check if we have more products to load
  useEffect(() => {
    if (allProducts.length > 0) {
      const totalLoaded = (page + 1) * productsPerPage;
      const hasMoreProducts = totalLoaded < allProducts.length;
      setHasMore(hasMoreProducts);
    }
  }, [allProducts, page, productsPerPage]);

  // Load more products function
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      // Simply increment the page
      const nextPage = page + 1;
      setPage(nextPage);
      
      // Check if we've reached the end
      const totalLoaded = (nextPage + 1) * productsPerPage;
      if (totalLoaded >= allProducts.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, allProducts, productsPerPage]);

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

        {/* Load more trigger - FIXED: Only show if we actually have more products */}
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

  // Components array with reduced height separators
  const components = [
    <div key="hero" ref={heroBannerRef} className="mb-2">
      <HeroBanner showNewsTicker={true} />
    </div>,

    <div key="favourite-channels-wrapper" className="">
      <FavouriteChannels />
    </div>,

    <div key="separator-1" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <div key="flash-deals-wrapper" className="mb-2">
      <FlashDeals
        showCountdown={true}
        icon={Tag}
        showTitleChevron={true}
      />
    </div>,

    <div key="separator-2" className="w-full bg-gray-100 h-1 mb-2"></div>,

    <PopularCategories key="popular-categories" />,

    <div key="separator-3" className="w-full bg-gray-100 h-1 mb-2"></div>,

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