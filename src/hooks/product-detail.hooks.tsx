// src/hooks/useProductDetail.ts
import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';

export interface UseProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

export interface UseProductDetailReturn {
  // State
  isFavorite: boolean;
  currentGalleryIndex: number;
  scrollY: number;

  // Data
  productId: string | undefined;
  product: any;
  isLoading: boolean;
  error: any;
  galleryImages: string[];
  listingProduct: any;
  allProducts: any[];
  isLoadingProducts: boolean;

  // Refs
  galleryRef: React.RefObject<any>;

  // Handlers
  handleBackClick: () => void;
  handleFavoriteClick: () => void;
  handleShareClick: () => Promise<void>;
  handleBuyNow: () => Promise<void>;
  handleReadMore: () => void;
  handleThumbnailClick: (index: number) => void;
  handleImageIndexChange: (currentIndex: number) => void;

  // Navigation
  navigate: any;

  // Auth
  user: any;
}

export const useProductDetail = (props: UseProductDetailProps): UseProductDetailReturn => {
  const { 
    productId: propProductId, 
    hideHeader = false, 
    inPanel = false, 
    scrollContainerRef,
    stickyTopOffset 
  } = props;

  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const productId = propProductId || paramId;
  const { data: product, isLoading, error } = useProduct(productId!);

  const galleryRef = useRef<any>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products-overview'],
    queryFn: fetchAllProducts,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const handleBackClick = () => navigate(-1);
  const handleFavoriteClick = () => setIsFavorite(!isFavorite);

  const handleShareClick = async () => {
    try {
      if (navigator.share && product) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share the product",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      openAuthOverlay();
      return;
    }

    const currentPrice = product?.discount_price || product?.price || 0;
    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: "1",
      price: currentPrice.toString(),
    });

    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  const handleReadMore = () => {
    // Implement read more functionality
    // You could open a modal or expand the description
    console.log('Read more clicked');
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentGalleryIndex(index);
    if (galleryRef.current) {
      galleryRef.current.scrollTo?.(index);
    }
  };

  const handleImageIndexChange = (currentIndex: number) => {
    setCurrentGalleryIndex(currentIndex);
  };

  const galleryImages = product?.product_images?.map((img: any) => img.src) || product?.images || ["https://placehold.co/300x300?text=No+Image"];

  const listingProduct = {
    name: product?.name,
    short_description: product?.short_description,
    description: product?.description,
    rating: product?.rating,
    reviewCount: product?.review_count,
    inventory: product?.inventory,
    sold_count: product?.sold_count,
    change: product?.sales_change
  };

  return {
    // State
    isFavorite,
    currentGalleryIndex,
    scrollY,

    // Data
    productId,
    product,
    isLoading,
    error,
    galleryImages,
    listingProduct,
    allProducts,
    isLoadingProducts,

    // Refs
    galleryRef,

    // Handlers
    handleBackClick,
    handleFavoriteClick,
    handleShareClick,
    handleBuyNow,
    handleReadMore,
    handleThumbnailClick,
    handleImageIndexChange,

    // Navigation
    navigate,

    // Auth
    user
  };
};