// ProductDetail.tsx - With ProductHeader inline and fixed
import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share, ChevronDown, ChevronLeft, X, LucideIcon } from 'lucide-react';
import ProductDetailError from "@/components/product/ProductDetailError";
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import ProductImageGallery from "@/components/ProductImageGallery";
import { VerificationBadge } from '@/components/shared/VerificationBadge';

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

// Header Action Button Component
interface HeaderActionButtonProps {
  Icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  progress: number;
  activeColor?: string;
  badge?: number;
  fillWhenActive?: boolean;
  transform?: string;
  likeCount?: number;
  shareCount?: number;
}

const HeaderActionButton = ({ 
  Icon, 
  active = false, 
  onClick, 
  progress, 
  activeColor = '#f97316',
  badge,
  fillWhenActive = true,
  transform = '',
  likeCount,
  shareCount
}: HeaderActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    // Only trigger animation for heart icon
    if (Icon.name === "Heart" || Icon.displayName === "Heart") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  // Determine which count to show
  const count = likeCount ?? shareCount;

  // Improved transition thresholds for smoother animation
  const expandedThreshold = 0.2;
  const fadingThreshold = 0.4;

  // Show horizontal layout with count in non-scroll state
  if (count !== undefined && progress < expandedThreshold) {
    return (
      <div 
        className="rounded-full transition-all duration-700 hover-scale"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-700 ease-out animate-fade-in"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.95 - (progress * 0.2)})`,
              opacity: 1 - (progress / expandedThreshold),
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Transitional state - fading count while shrinking
  if (count !== undefined && progress < fadingThreshold) {
    const transitionProgress = (progress - expandedThreshold) / (fadingThreshold - expandedThreshold);

    return (
      <div 
        className="rounded-full transition-all duration-700"
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
      >
        <button
          onClick={handleClick}
          className="flex items-center h-8 px-3 rounded-full transition-all duration-700 relative"
          style={{
            gap: `${6 - (transitionProgress * 6)}px`,
          }}
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: progress > 0.5 
                ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
                : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-700"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`,
              opacity: 1 - transitionProgress,
              transform: `scaleX(${1 - transitionProgress})`,
              transformOrigin: 'left center',
              width: `${20 * (1 - transitionProgress)}px`,
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Compact circular button state
  return (
    <div 
      className="rounded-full transition-all duration-700"
      style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}
    >
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700 relative"
      >
        <Icon
          size={20}
          strokeWidth={2.5}
          className={`transition-all duration-700 ${isAnimating ? 'heart-animation' : ''}`}
          style={{
            fill: active && fillWhenActive ? activeColor : 'transparent',
            color: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
          }}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center animate-scale-in">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
};

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
  onReadMore?: () => void;
}

const IPhoneXRListing = ({ product, onReadMore }: IPhoneXRListingProps) => {
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

  const formatPrice = (price: number, currency = currentCurrency) => {
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

  const productId = propProductId || paramId;
  const { data: product, isLoading, error } = useProduct(productId!);

  const galleryRef = useRef<any>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0); // For scroll progress

  // Fetch all products for overview tab
  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products-overview'],
    queryFn: fetchAllProducts,
  });

  // Scroll progress tracking
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Calculate scroll progress for header transitions
  const maxScroll = 120;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const displayProgress = scrollProgress;

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
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchFocus = () => {
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

  // Back/Close icon component
  const IconComponent = inPanel ? X : ChevronLeft;

  return (
    <>
      {/* INLINE PRODUCT HEADER - FIXED AT THE TOP */}
      {!hideHeader && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%'
          }}
        >
          {/* Main Header Container - Fixed at the top */}
          <div
            className="w-full transition-all duration-700"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
              backdropFilter: `blur(${displayProgress * 8}px)`,
              // Start with transparent background, become opaque on scroll
              boxShadow: displayProgress > 0.1 ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            {/* Main Header Content */}
            <div className="py-2 px-3 w-full">
              <div className="flex items-center justify-between w-full max-w-6xl mx-auto gap-4">
                {/* Left side - Back button and seller info */}
                <div className="flex items-center gap-3 flex-shrink-0 min-w-0 flex-1">
                  {/* Back/Close Button - Always visible */}
                  <div 
                    className="rounded-full transition-all duration-700"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
                  >
                    <button 
                      className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700"
                      onClick={handleBackClick}
                    >
                      <IconComponent
                        size={24}
                        strokeWidth={2.5}
                        className="transition-all duration-700"
                        style={{
                          color: displayProgress > 0.5 
                            ? `rgba(75, 85, 99, ${0.7 + (displayProgress * 0.3)})` 
                            : `rgba(255, 255, 255, ${0.9 - (displayProgress * 0.2)})`
                        }}
                      />
                    </button>
                  </div>

                  {/* Seller info - shows when not scrolled AND seller exists */}
                  {displayProgress < 0.5 && product?.sellers && (
                    <div 
                      className="rounded-full transition-all duration-700 flex-shrink-0"
                      style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - displayProgress)})` }}
                    >
                      <button
                        onClick={() => {
                          if (product?.sellers?.id) {
                            navigate(`/seller/${product.sellers.id}`);
                          }
                        }}
                        className="flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all duration-700 relative"
                      >
                        {/* Seller Avatar */}
                        <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                          <img 
                            src={product.sellers.image_url || "https://picsum.photos/100/100?random=1"}
                            alt={`${product.sellers.name} seller`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://picsum.photos/100/100?random=1";
                              target.onerror = null;
                            }}
                          />
                        </div>
                        
                        {/* Seller Name */}
                        <span 
                          className="text-xs font-medium transition-all duration-700"
                          style={{
                            color: `rgba(255, 255, 255, ${0.95 - (displayProgress * 0.2)})`
                          }}
                        >
                          {product.sellers.name}
                        </span>
                        
                        {/* Verification Badge */}
                        {product.sellers.verified && <VerificationBadge />}
                        
                        {/* Follower Count */}
                        <span 
                          className="text-xs font-medium transition-all duration-700"
                          style={{
                            color: `rgba(255, 255, 255, ${0.7 - (displayProgress * 0.2)})`
                          }}
                        >
                          {product.sellers.followers_count >= 1000000 
                            ? `${(product.sellers.followers_count / 1000000).toFixed(1)}M`
                            : product.sellers.followers_count >= 1000
                            ? `${(product.sellers.followers_count / 1000).toFixed(1)}K`
                            : product.sellers.followers_count.toString()
                          }
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right side - Action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {/* Custom action buttons OR default heart button */}
                  {actionButtons.length > 0 ? (
                    actionButtons.map((button, index) => (
                      <HeaderActionButton
                        key={index}
                        Icon={button.Icon}
                        active={button.active}
                        onClick={button.onClick}
                        progress={displayProgress}
                        activeColor={button.activeColor}
                        likeCount={button.count}
                      />
                    ))
                  ) : (
                    <HeaderActionButton
                      Icon={Heart}
                      active={isFavorite}
                      onClick={handleFavoriteClick}
                      progress={displayProgress}
                      activeColor="#f43f5e"
                      likeCount={147}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content - Starts from top edge, flows under fixed header */}
      <div className="pt-0">
        {/* ProductImageGallery - Should extend to top of viewport */}
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

        {/* LARGE BOTTOM SPACER for scrolling room */}
        <div 
          className="w-full"
          style={{
            height: 'calc(100vh + 200px)',
            backgroundColor: 'transparent'
          }}
        >
          {/* Empty space for scrolling */}
        </div>
      </div>
    </>
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