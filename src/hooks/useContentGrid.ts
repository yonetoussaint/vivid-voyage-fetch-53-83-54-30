import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { supabase } from "@/integrations/supabase/client";

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

type ContentItem = Product | Reel;

// Utility Functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// REAL REELS FETCH FUNCTION - Using the SAME query as useVideos
const fetchReels = async (limit: number = 20): Promise<Reel[]> => {
  try {
    console.log("Fetching reels from Supabase videos table...");
    
    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    // Filter to only show videos from the storage bucket (same as useVideos)
    const bucketVideos = data?.filter(video => 
      video.video_url && video.video_url.includes('wkfzhcszhgewkvwukzes.supabase.co/storage/v1/object/public/videos')
    ) || [];

    console.log(`Fetched ${bucketVideos.length} reels from Supabase`);

    // Transform to match your Reel interface
    const reels: Reel[] = bucketVideos.map(video => {
      console.log("Video data:", video); // Debug each video
      
      const reel: Reel = {
        id: video.id,
        title: video.title || `Reel ${video.id}`,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
        views: video.views || 0,
        duration: video.duration || 30,
        likes: video.likes || 0,
        comments: video.comments || 0,
        created_at: video.created_at,
        is_live: video.is_live || false,
        type: 'reel' as const
      };

      // DEBUG: Log thumbnail status
      console.log(`Reel ${reel.id}:`, {
        hasVideo: !!reel.video_url,
        hasThumbnail: !!reel.thumbnail_url,
        videoUrl: reel.video_url,
        thumbnailUrl: reel.thumbnail_url
      });

      return reel;
    });

    return reels;
  } catch (error) {
    console.error('Error in fetchReels:', error);
    return [];
  }
};

// Helper to check if thumbnail exists
const checkThumbnailExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
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

    // Reels are not filtered (unless you want to add reel filters later)
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
        // Keep reels in their relative position
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
      // For popular, sort products by sold_count and reels by views
      sorted.sort((a, b) => {
        if (a.type === 'product' && b.type === 'product') {
          return ((b as Product).sold_count || 0) - ((a as Product).sold_count || 0);
        } else if (a.type === 'reel' && b.type === 'reel') {
          return (b as Reel).views - (a as Reel).views;
        }
        return 0;
      });
      break;
  }

  return sorted;
};

// Main Custom Hook - SIMPLIFIED for only reels and products
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

  // Fetch ONLY products and reels
  const { data: allContent, isLoading: initialLoading, refetch } = useQuery({
    queryKey: ["content", "for-you", category, JSON.stringify(appliedFilters)],
    queryFn: async () => {
      console.log("Fetching products and reels only...");
      try {
        const [products, reels] = await Promise.all([
          fetchAllProducts(),
          fetchReels(12) // Fetch 12 reels
        ]);

        console.log(`Fetched: ${products.length} products, ${reels.length} reels`);
        
        // Debug reels thumbnails
        reels.forEach((reel, index) => {
          console.log(`Reel ${index + 1}:`, {
            id: reel.id,
            title: reel.title,
            video_url: reel.video_url ? "YES" : "NO",
            thumbnail_url: reel.thumbnail_url ? "YES" : "NO",
            thumbnail: reel.thumbnail_url
          });
        });

        // Transform products with shipping info
        const productsWithShipping = products.map(p => ({
          ...p,
          shipping: {
            free_shipping: Math.random() > 0.5,
            returns: Math.random() > 0.7,
            location: Math.random() > 0.5 ? 'United States' : 'International'
          }
        }));

        // Combine only products and reels
        let allContent: ContentItem[] = [
          ...productsWithShipping.map(p => ({ ...p, type: 'product' as const })),
          ...reels.map(r => ({ ...r, type: 'reel' as const }))
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

        return allContent;
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

    // Debug: Count reels in visible content
    const reelsInView = result.filter(item => item.type === 'reel');
    console.log(`Visible content: ${result.length} items, ${reelsInView.length} reels`);
    
    if (reelsInView.length > 0) {
      reelsInView.forEach((reel, idx) => {
        const r = reel as Reel;
        console.log(`Visible Reel ${idx + 1}:`, {
          id: r.id,
          hasThumbnail: !!r.thumbnail_url,
          thumbnail: r.thumbnail_url,
          video: r.video_url
        });
      });
    }

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
    setHasMore(hasMoreContent);
  }, [page, allContent, contentPerPage]);

  const loadMoreContent = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, page]);

  // Setup intersection observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreContent();
        }
      },
      {
        root: null,
        rootMargin: "100px",
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
  ContentItem
};