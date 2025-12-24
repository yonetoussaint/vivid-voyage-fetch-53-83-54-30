import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";

// Types
interface FilterState {
  priceRange?: {
    min: number;
    max: number;
  } | null;
  rating: number | null;
  freeShipping: boolean;
  onSale: boolean;
  freeReturns: boolean;
  newArrivals: boolean;
  shippedFrom: string[];
  sortBy: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating';
  [key: string]: any;
}

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
  type?: 'product';
  shipping?: {
    free_shipping?: boolean;
    returns?: boolean;
    location?: string;
  };
}

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

interface Post {
  id: string;
  type: 'post';
  author: {
    id: string;
    username: string;
    avatar: string;
    is_verified: boolean;
    follower_count: number;
  };
  content: {
    images: string[];
    caption: string;
    location?: string;
    hashtags: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views?: number;
  };
  products_tagged: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    x_position: number;
    y_position: number;
  }>;
  created_at: string;
  is_sponsored: boolean;
  is_liked?: boolean;
  is_saved?: boolean;
}

interface Vendor {
  id: string;
  name: string;
  type: 'vendor';
  rating: number;
  followers: number;
  verified: boolean;
  rank: number;
  discount?: string;
  image?: string;
  products: Array<{
    id: string;
    image?: string;
  }>;
  isPickupStation?: boolean;
}

type ContentItem = Product | Reel | Post | Vendor;

// Utility Functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const fetchReels = async (limit: number = 8): Promise<Reel[]> => {
  const mockReels: Reel[] = Array.from({ length: limit }, (_, i) => ({
    id: `reel-${i}`,
    title: `Trending Reel #${i + 1}`,
    video_url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    thumbnail_url: `https://images.unsplash.com/photo-${150000 + i}?w=400&h=600&fit=crop`,
    views: Math.floor(Math.random() * 1000000) + 10000,
    duration: Math.floor(Math.random() * 60) + 15,
    likes: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 1000) + 10,
    created_at: new Date().toISOString(),
    is_live: i % 5 === 0,
    type: 'reel' as const
  }));
  return mockReels;
};

const fetchPosts = async (limit: number = 15): Promise<Post[]> => {
  const mockPosts: Post[] = [
    {
      id: 'post-1',
      type: 'post',
      author: {
        id: 'user-1',
        username: 'FashionistaJane',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        is_verified: true,
        follower_count: 14500
      },
      content: {
        images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop'
        ],
        caption: 'Just got these amazing summer outfits! Perfect for the beach #summerfashion #beachvibes #ootd',
        location: 'Miami Beach',
        hashtags: ['summerfashion', 'beachvibes', 'ootd', 'fashion', 'style']
      },
      engagement: {
        likes: 2450,
        comments: 128,
        shares: 56,
        saves: 312,
        views: 12500
      },
      products_tagged: [
        {
          id: 'prod-1',
          name: 'Floral Summer Dress',
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1561042187-5b4d1c493f3d?w=300&h=400&fit=crop',
          x_position: 65,
          y_position: 40
        },
        {
          id: 'prod-2',
          name: 'Straw Beach Hat',
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w-300&h=400&fit=crop',
          x_position: 35,
          y_position: 20
        }
      ],
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_sponsored: false,
      is_liked: false,
      is_saved: false
    }
  ];
  return mockPosts.slice(0, limit);
};

const fetchVendors = async (limit: number = 6): Promise<Vendor[]> => {
  const mockVendors: Vendor[] = Array.from({ length: limit }, (_, i) => ({
    id: `vendor-${i}`,
    name: `Vendor ${i + 1}`,
    type: 'vendor' as const,
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
    followers: Math.floor(Math.random() * 10000) + 1000,
    verified: Math.random() > 0.3,
    rank: i + 1,
    discount: Math.random() > 0.5 ? `-${Math.floor(Math.random() * 50) + 10}%` : undefined,
    image: `https://images.unsplash.com/photo-${150000 + i}?w=200&h=200&fit=crop&crop=face`,
    products: Array.from({ length: 4 }, (_, j) => ({
      id: `vendor-${i}-product-${j}`,
      image: `https://images.unsplash.com/photo-${160000 + (i * 10) + j}?w=200&h=200&fit=crop`
    })),
    isPickupStation: i % 3 === 0
  }));
  return mockVendors;
};

const applyFilters = (items: ContentItem[], filters: FilterState): ContentItem[] => {
  return items.filter(item => {
    if (item.type === 'product') {
      const product = item as Product;

      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        if (min !== undefined && product.price < min) return false;
        if (max !== undefined && product.price > max) return false;
      }

      if (filters.rating !== null && (product.rating || 0) < filters.rating) return false;

      if (filters.freeShipping && (!product.shipping?.free_shipping)) return false;

      if (filters.onSale && !product.discount_price) return false;

      if (filters.freeReturns && (!product.shipping?.returns)) return false;

      if (filters.newArrivals) {
        const createdDate = product.created_at ? new Date(product.created_at) : new Date(0);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (createdDate < sevenDaysAgo) return false;
      }

      if (filters.shippedFrom && filters.shippedFrom.length > 0 && product.shipping?.location) {
        if (!filters.shippedFrom.includes(product.shipping.location)) return false;
      }

      return true;
    }

    return true;
  });
};

const sortContent = (items: ContentItem[], sortBy: FilterState['sortBy']): ContentItem[] => {
  const sorted = [...items];

  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;

    case 'price_low':
      sorted.sort((a, b) => {
        if (a.type === 'product' && b.type === 'product') {
          return (a as Product).price - (b as Product).price;
        }
        return 0;
      });
      break;

    case 'price_high':
      sorted.sort((a, b) => {
        if (a.type === 'product' && b.type === 'product') {
          return (b as Product).price - (a as Product).price;
        }
        return 0;
      });
      break;

    case 'rating':
      sorted.sort((a, b) => {
        const ratingA = (a.type === 'product' ? (a as Product).rating || 0 : 0);
        const ratingB = (b.type === 'product' ? (b as Product).rating || 0 : 0);
        return ratingB - ratingA;
      });
      break;

    case 'popular':
    default:
      break;
  }

  return sorted;
};

// Main Custom Hook - SIMPLIFIED FIXED VERSION
export const useContentGrid = (category?: string, filters?: FilterState) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentPerPage = 20;
  const observerRef = useRef<IntersectionObserver | null>(null);

  const defaultFilters: FilterState = {
    priceRange: null,
    rating: null,
    freeShipping: false,
    onSale: false,
    freeReturns: false,
    newArrivals: false,
    shippedFrom: [],
    sortBy: 'popular'
  };

  const appliedFilters = filters || defaultFilters;

  // Fetch ALL content initially
  const { data: allContent, isLoading: initialLoading, refetch } = useQuery({
    queryKey: ["content", "for-you", category, JSON.stringify(appliedFilters)],
    queryFn: async () => {
      console.log("Fetching all content...");
      try {
        const [products, reels, posts, vendors] = await Promise.all([
          fetchAllProducts(),
          fetchReels(8),
          fetchPosts(10),
          fetchVendors(6)
        ]);

        console.log(`Fetched: ${products.length} products, ${reels.length} reels`);

        const productsWithShipping = products.map(p => ({
          ...p,
          shipping: {
            free_shipping: Math.random() > 0.5,
            returns: Math.random() > 0.7,
            location: Math.random() > 0.5 ? 'United States' : 'International'
          }
        }));

        let allContent: ContentItem[] = [
          ...productsWithShipping.map(p => ({ ...p, type: 'product' as const })),
          ...reels.map(r => ({ ...r, type: 'reel' as const })),
          ...posts.map(p => ({ ...p, type: 'post' as const })),
          ...vendors.map(v => ({ ...v, type: 'vendor' as const }))
        ];

        // Filter by category if needed
        if (category && category !== 'recommendations') {
          allContent = allContent.filter(item => {
            if (item.type === 'product') {
              const product = item as any;
              return product.category?.toLowerCase() === category.toLowerCase() ||
                     product.tags?.some((tag: string) => tag.toLowerCase() === category.toLowerCase());
            }
            return true;
          });
        }

        // Apply filters
        allContent = applyFilters(allContent, appliedFilters);
        
        // Sort content
        allContent = sortContent(allContent, appliedFilters.sortBy);

        // Shuffle content for variety
        const shuffled = [...allContent];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
      } catch (error) {
        console.error('Error fetching content:', error);
        return [];
      }
    },
    staleTime: 60000,
  });

  // Calculate visible content based on current page
  const visibleContent = useMemo(() => {
    if (!allContent || allContent.length === 0) return [];
    
    const startIndex = 0;
    const endIndex = page * contentPerPage;
    const result = allContent.slice(startIndex, endIndex);
    
    console.log(`Visible content: page=${page}, showing ${result.length} of ${allContent.length} total items`);
    
    return result;
  }, [allContent, page, contentPerPage]);

  // Update hasMore state when page or allContent changes
  useEffect(() => {
    if (!allContent || allContent.length === 0) {
      setHasMore(false);
      return;
    }
    
    const totalLoaded = page * contentPerPage;
    const hasMoreContent = totalLoaded < allContent.length;
    console.log(`Has more check: totalLoaded=${totalLoaded}, allContent=${allContent.length}, hasMore=${hasMoreContent}`);
    setHasMore(hasMoreContent);
  }, [page, allContent, contentPerPage]);

  const loadMoreContent = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      console.log(`Load more blocked: isLoadingMore=${isLoadingMore}, hasMore=${hasMore}`);
      return;
    }

    console.log(`Loading more content: page ${page} -> ${page + 1}`);
    setIsLoadingMore(true);
    
    // Simulate API delay
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, page]);

  // Setup intersection observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore) {
      console.log("Observer not setup: no loader ref or no more content");
      return;
    }

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    console.log("Setting up intersection observer");
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log(`Observer triggered: intersecting=${target.isIntersecting}, hasMore=${hasMore}, isLoadingMore=${isLoadingMore}`);
        
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          console.log("Loading more content triggered by observer");
          loadMoreContent();
        }
      },
      {
        root: null,
        rootMargin: "100px", // Start loading 100px before reaching the element
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isLoadingMore, loadMoreContent]);

  // Also listen to scroll events as backup
  useEffect(() => {
    const handleScroll = () => {
      if (!loaderRef.current || isLoadingMore || !hasMore) return;

      const loaderRect = loaderRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If loader is within 200px of viewport bottom
      if (loaderRect.top <= windowHeight + 200) {
        console.log("Scroll triggered load more");
        loadMoreContent();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, loadMoreContent]);

  const hasActiveFilters = useCallback(() => {
    return (
      appliedFilters.priceRange !== null ||
      appliedFilters.rating !== null ||
      appliedFilters.freeShipping ||
      appliedFilters.onSale ||
      appliedFilters.freeReturns ||
      appliedFilters.newArrivals ||
      (appliedFilters.shippedFrom && appliedFilters.shippedFrom.length > 0)
    );
  }, [appliedFilters]);

  return {
    visibleContent,
    allContent: allContent || [],
    loading: isLoadingMore,
    initialLoading,
    hasMore,
    loaderRef,
    page,
    setPage,
    hasActiveFilters,
    loadMoreContent,
    contentPerPage,
    formatNumber,
    refetch
  };
};

// Export types
export type {
  FilterState,
  Product,
  Reel,
  Post,
  Vendor,
  ContentItem
};