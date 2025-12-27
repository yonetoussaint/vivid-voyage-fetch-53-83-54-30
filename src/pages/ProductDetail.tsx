// ProductDetail.tsx - Simplified version
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share, Star, ShieldCheck, Video, CreditCard, ChevronDown } from 'lucide-react';
import ProductDetailError from "@/components/product/ProductDetailError";
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductHeader from '@/components/product/ProductHeader';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

// Enhanced GalleryThumbnails with 5.5 items and horizontal scrolling
const GalleryThumbnails = ({
  images,
  currentIndex,
  onThumbnailClick,
}: {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate how many items to show (5.5 items)
  const itemCount = 5.5;
  const itemWidth = 16.5; // percentage for 5.5 items (100/5.5 ≈ 18.18, reduced a bit for spacing)

  return (
    <div className="relative w-full overflow-hidden"> {/* Edge-to-edge container */}
      {/* Scrollable container with internal padding */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-1.5 py-1 px-2" // px-2 for internal breathing room
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${itemWidth}%` }}
          >
            <div
              className={`relative overflow-hidden border aspect-square cursor-pointer transition-all ${
                currentIndex === index 
                  ? "border-2 border-primary" 
                  : "border border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => onThumbnailClick(index)}
            >
              <img 
                src={src} 
                alt={`Thumbnail ${index}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for broken images
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/300x300?text=No+Image";
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Custom scrollbar style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Inline iPhoneXRListing component - Clean version with title, price, and description
interface IPhoneXRListingProps {
  product?: {
    name?: string;
    short_description?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    inventory?: number;
    sold_count?: number;
    change?: number;
    unitPrice?: number;
    demoVideoUrl?: string;
    minOrderQty?: number;
    paymentTerms?: string;
    tradeAssurance?: boolean;
  };
}

const IPhoneXRListing = ({ product }: IPhoneXRListingProps) => {
  // Only two currencies: HTG first, then USD
  const currencies = {
    HTG: 'HTG',
    USD: 'USD'
  };

  const currencyToCountry = {
    HTG: 'ht',
    USD: 'us'
  };

  const exchangeRates = {
    HTG: 132.50, // Example exchange rate
    USD: 1
  };

  // Mock data for demonstration
  const mockB2BData = {
    unitPrice: 189.99,
  };

  // Merge product with mock B2B data
  const mergedProduct = { ...mockB2BData, ...product };

  const displayDescription =
    mergedProduct?.short_description || mergedProduct?.description || 'Product description not available.';
  const needsTruncation = displayDescription.length > 150;
  const truncatedDescription = displayDescription.slice(0, 150) + (displayDescription.length > 150 ? '...' : '');

  // PriceInfo logic moved inline - HTG set as default
  const [currentCurrency, setCurrentCurrency] = useState('HTG');

  const toggleCurrency = () => {
    const currencyKeys = Object.keys(currencies);
    const currentIndex = currencyKeys.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyKeys.length;
    setCurrentCurrency(currencyKeys[nextIndex]);
  };

  const formatPrice = (price, currency = currentCurrency) => {
    const convertedPrice = price * exchangeRates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  const currentPrice = mergedProduct.unitPrice || 25; // Default price if not provided

  // CurrencySwitcher Component
  const CurrencySwitcher = () => {
    return (
      <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
        <button
          onClick={toggleCurrency}
          className="p-1 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors text-xs"
          aria-label="Change currency"
        >
          <span className={`fi fi-${currencyToCountry[currentCurrency]}`}></span>
          <span className="text-gray-700">{currentCurrency}</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </button>
      </>
    );
  };

  return (
    <div className="w-full px-2 bg-white font-sans space-y-2">
      {/* Product Title */}
      {mergedProduct?.name && (
        <h2 className="text-sm text-gray-700 leading-tight">
          {mergedProduct?.name}
        </h2>
      )}

      {/* Price Row with Currency Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500 leading-none">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-sm text-gray-500">/ unit</span>
        </div>
        <CurrencySwitcher />
      </div>

      {/* Description Section */}
      <div className="space-y-1">
        <p className="text-sm text-gray-600 leading-relaxed">
          {truncatedDescription}
        </p>
      </div>
    </div>
  );
};

const ProductDetailContent: React.FC<ProductDetailProps> = ({ 
  productId: propProductId, 
  hideHeader = false, 
  inPanel = false, 
  scrollContainerRef,
  stickyTopOffset 
}) => {
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const { startLoading } = useNavigationLoading();

  const productId = propProductId || paramId;
  const { data: product, isLoading, error } = useProduct(productId!);

  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<any>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  // Fetch all products for overview tab
  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products-overview'],
    queryFn: fetchAllProducts,
  });

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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      startLoading();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    startLoading();
    navigate('/search');
  };

  const buyNow = async () => {
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

  const actionButtons = [
    {
      Icon: Heart,
      onClick: handleFavoriteClick,
      active: isFavorite,
      activeColor: "#f43f5e",
      count: product?.favorite_count || 0
    },
    {
      Icon: Share,
      onClick: handleShareClick,
      active: false
    }
  ];

  if (!productId) {
    return <ProductDetailError message="Product ID is missing" />;
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <ProductDetailError />;
  }

  // Prepare data for components
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {!hideHeader && (
        <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
          <ProductHeader
            onCloseClick={handleBackClick}
            onShareClick={handleShareClick}
            actionButtons={actionButtons}
            forceScrolledState={false}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onSearchFocus={handleSearchFocus}
            inPanel={inPanel}
            seller={product?.sellers}
            onSellerClick={() => {
              if (product?.sellers?.id) {
                navigate(`/seller/${product?.sellers?.id}`);
              }
            }}
          />
        </div>
      )}

      {/* Main content with scrollable area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: hideHeader ? '0' : '56px' }}
      >
        {/* ProductImageGallery */}
        <div className="w-full bg-white">
          <ProductImageGallery 
            ref={galleryRef}
            images={galleryImages}
            videos={product?.product_videos || []}
            model3dUrl={product?.model_3d_url}
            seller={product?.sellers}
            product={{
              id: product?.id || '',
              name: product?.name || '',
              price: product?.price || 0,
              discount_price: product?.discount_price,
              inventory: product?.inventory || 0,
              sold_count: product?.sold_count || 0
            }}
            onSellerClick={() => {
              if (product?.sellers?.id) {
                navigate(`/seller/${product?.sellers?.id}`);
              }
            }}
            onBuyNow={buyNow}
            onImageIndexChange={(currentIndex) => {
              setCurrentGalleryIndex(currentIndex);
            }}
          />
        </div>

        {/* GalleryThumbnails */}
        <div className="mt-2">
          <GalleryThumbnails
            images={galleryImages}
            currentIndex={currentGalleryIndex}
            onThumbnailClick={(index) => {
              setCurrentGalleryIndex(index);
              if (galleryRef.current) {
                galleryRef.current.scrollTo?.(index);
              }
            }}
          />
        </div>

        {/* IPhoneXRListing */}
        <div className="mt-2">
          <IPhoneXRListing 
            product={listingProduct}
            onReadMore={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (!id) {
    return <ProductDetailError message="Product not found" />;
  }

  return (
    <ProductDetailContent productId={id} />
  );
};

export { ProductDetailContent };
export default ProductDetail;