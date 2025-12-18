import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "@/components/home/SectionHeader";
import { fetchAllProducts } from "@/integrations/supabase/products";
import FlashDeals from "@/components/home/FlashDeals";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import { useHeaderFilter } from "@/contexts/HeaderFilterContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, LayoutPanelLeft, Sparkles, ChevronRight, DollarSign, Zap, Video, Crown, Play, Users } from "lucide-react";

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
  type?: 'product' | 'reel';
}

// Reel interface
interface Reel {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  views: number;
  duration: number;
  likes?: number;
  comments?: number;
  created_at?: string;
  is_live?: boolean;
  type: 'reel';
}

// Combined content type
type ContentItem = Product | Reel;

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

// Helper function to format views
const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K`;
  }
  return views.toString();
};

// Helper function to format duration
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Fetch reels function (you need to implement this based on your backend)
const fetchReels = async (limit: number = 20): Promise<Reel[]> => {
  // This is a placeholder - implement based on your backend
  // Example: return fetch('/api/reels').then(res => res.json());
  
  // Mock data for demonstration
  return Array.from({ length: limit }, (_, i) => ({
    id: `reel-${i}`,
    title: `Trending Reel #${i + 1}`,
    video_url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    thumbnail_url: `https://images.unsplash.com/photo-${150000 + i}?w=400&h=600&fit=crop`,
    views: Math.floor(Math.random() * 1000000) + 10000,
    duration: Math.floor(Math.random() * 60) + 15,
    likes: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 1000) + 10,
    created_at: new Date().toISOString(),
    is_live: i % 5 === 0, // Every 5th reel is "live"
    type: 'reel' as const
  }));
};

// Combined fetch function for both products and reels
const fetchAllContent = async (): Promise<ContentItem[]> => {
  const [products, reels] = await Promise.all([
    fetchAllProducts(),
    fetchReels(10) // Fetch 10 reels initially
  ]);
  
  // Combine and shuffle the content for a mixed feed
  const allContent: ContentItem[] = [
    ...products.map(p => ({ ...p, type: 'product' as const })),
    ...reels.map(r => ({ ...r, type: 'reel' as const }))
  ];
  
  // Shuffle the array for mixed feed
  return allContent.sort(() => Math.random() - 0.5);
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

// ReelCard component
const ReelCard: React.FC<{ reel: Reel }> = ({ reel }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/reels?video=${reel.id}`);
  };

  return (
    <div 
      className="bg-black rounded overflow-hidden relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full aspect-[3/4] bg-gray-800 relative overflow-hidden">
        {/* Video Thumbnail/Preview */}
        <div className="absolute inset-0">
          <video 
            src={reel.video_url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
        
        {/* Live Badge */}
        {reel.is_live && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>LIVE</span>
          </div>
        )}
        
        {/* Duration Badge (for non-live reels) */}
        {!reel.is_live && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded z-10">
            {formatDuration(reel.duration)}
          </div>
        )}
        
        {/* Gradient Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-10">
          <div className="flex items-center text-white text-[10px] gap-1">
            <Play className="w-3 h-3" fill="white" />
            <span>{formatViews(reel.views)} views</span>
          </div>
        </div>
      </div>
      
      {/* Reel Indicator Badge */}
      <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
        REEL
      </div>
      
      {/* Title/Description Area */}
      <div className="p-2">
        <p className="text-[11px] text-white font-medium line-clamp-2 mb-1">
          {reel.title}
        </p>
        {reel.is_live && (
          <div className="flex items-center gap-1 text-[10px] text-pink-300">
            <Users className="w-3 h-3" />
            <span>Live now • {formatViews(reel.views)} watching</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ContentCard component - switches between ProductCard and ReelCard
const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  if (item.type === 'reel') {
    return <ReelCard reel={item as Reel} />;
  }
  return <ProductCard product={item as Product} />;
};

// Favourite Channels Component (keep as is)
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

// Popular Categories Component (keep as is)
const PopularCategories: React.FC = () => {
  const navigate = useNavigate();
  const CategoryIcon = LayoutPanelLeft;

  const categories = [
    {
      id: 1,
      name: 'Mobiles',
      discount: 'HOT',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-pink-600'
    },
    {
      id: 2,
      name: 'Cribs & Cots',
      discount: '-50%',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-blue-600'
    },
    {
      id: 3,
      name: 'Portable Speakers',
      discount: '-33%',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-pink-600'
    },
    {
      id: 4,
      name: 'Electric Insect Killers',
      discount: '-59%',
      image: 'https://images.unsplash.com/photo-1564424302846-62b1d09af73c?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-pink-600'
    },
    {
      id: 5,
      name: 'Smart Watches',
      discount: '-45%',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-purple-600'
    },
    {
      id: 6,
      name: 'Laptops',
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-green-600'
    },
    {
      id: 7,
      name: 'Headphones',
      discount: '-40%',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-red-600'
    },
    {
      id: 8,
      name: 'Cameras',
      discount: '-30%',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center',
      discountBg: 'bg-indigo-600'
    }
  ];

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/category/${categoryId}`, { state: { title: categoryName } });
  };

  const handleViewAllClick = () => {
    navigate('/categories');
  };

  return (
    <div className="bg-white">
      <SectionHeader
        title="Popular Categories for you"
        icon={CategoryIcon}
        showTitleChevron={true}
        viewAllLink="/categories"
        viewAllText="More"
        onViewAllClick={handleViewAllClick}
      />

      <div className="flex gap-2 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id, category.name)}
            className="flex-shrink-0 w-20 cursor-pointer group"
          >
            <div className="relative rounded-sm overflow-hidden mb-2 aspect-square transition-transform group-hover:scale-105 border border-gray-100">
              <div className={`absolute top-1 left-1 z-10 ${category.discountBg} text-white px-1 py-0.5 text-[9px] font-bold rounded-sm`}>
                {category.discount}
              </div>
              <div className="relative w-full h-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/80x80/cccccc/969696?text=${encodeURIComponent(category.name.charAt(0))}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              </div>
            </div>
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

// Infinite Content Grid Component - UPDATED to handle both products and reels
const InfiniteContentGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [page, setPage] = useState(0);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const contentPerPage = 20;

  // Fetch ALL content (products + reels)
  const { data: initialContent, isLoading: initialLoading } = useQuery({
    queryKey: ["content", "for-you", category],
    queryFn: fetchAllContent,
    staleTime: 60000,
  });

  // Filter content by category if needed
  const filteredContent = useMemo(() => {
    if (!initialContent) return [];

    if (category && category !== 'recommendations') {
      // For products, filter by category
      return initialContent.filter(item => {
        if (item.type === 'product') {
          const product = item as Product;
          return product.category?.toLowerCase() === category.toLowerCase() ||
                 product.tags?.some(tag => tag.toLowerCase() === category.toLowerCase());
        }
        // Reels are always included unless specifically filtered
        return true;
      });
    }

    return initialContent;
  }, [initialContent, category]);

  // Set filtered content when data loads
  useEffect(() => {
    if (filteredContent && filteredContent.length > 0) {
      setAllContent(filteredContent);
      setHasMore(filteredContent.length > contentPerPage);
      setPage(0);
    } else if (filteredContent && filteredContent.length === 0) {
      setAllContent([]);
      setHasMore(false);
    }
  }, [filteredContent]);

  // Calculate visible content
  const visibleContent = useMemo(() => {
    const startIndex = 0;
    const endIndex = (page + 1) * contentPerPage;
    return allContent.slice(startIndex, endIndex);
  }, [allContent, page, contentPerPage]);

  // Check if we have more content to load
  useEffect(() => {
    if (allContent.length > 0) {
      const totalLoaded = (page + 1) * contentPerPage;
      const hasMoreContent = totalLoaded < allContent.length;
      setHasMore(hasMoreContent);
    }
  }, [allContent, page, contentPerPage]);

  // Load more content function
  const loadMoreContent = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      setPage(nextPage);

      const totalLoaded = (nextPage + 1) * contentPerPage;
      if (totalLoaded >= allContent.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more content:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, allContent, contentPerPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreContent();
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
  }, [hasMore, loading, loadMoreContent]);

  // Show loading state while fetching initial data
  if (initialLoading && allContent.length === 0) {
    return (
      <div className="pt-2">
        <div className="px-2">
          <div className="grid grid-cols-2 gap-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse aspect-square rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no content
  if (!initialLoading && allContent.length === 0) {
    return (
      <div className="pt-2">
        <div className="text-center py-8 text-gray-500">
          No content found. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="px-2">
        {/* Statistics Banner */}
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-600">Products</p>
              <p className="text-lg font-bold text-gray-900">
                {visibleContent.filter(item => item.type === 'product').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Reels</p>
              <p className="text-lg font-bold text-gray-900">
                {visibleContent.filter(item => item.type === 'reel').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-lg font-bold text-gray-900">
                {visibleContent.length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">
              Mixed feed showing products and trending reels
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {visibleContent.map((item) => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} />
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
              <p className="text-xs text-gray-500">Loading more content...</p>
            </div>
          ) : visibleContent.length > 0 ? (
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No more content to load</p>
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

    <InfiniteContentGrid key="infinite-grid" category={category} />,
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