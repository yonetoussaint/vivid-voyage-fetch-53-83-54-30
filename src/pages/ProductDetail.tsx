// ProductDetail.tsx - Clean version with direct tab rendering
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share, Play } from 'lucide-react';
import ProductDetailError from "@/components/product/ProductDetailError";
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { IPhoneXRListing } from '@/components/product/iPhoneXRListing';
import ProductImageGallery from "@/components/ProductImageGallery";
import TabsNavigation from '@/components/home/TabsNavigation';
import ProductHeader from '@/components/product/ProductHeader";
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import CustomerReviewsEnhanced from "@/components/product/CustomerReviewsEnhanced";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

// GalleryThumbnails component moved inline
interface GalleryThumbnailsProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  isPlaying?: boolean;
  videoIndices?: number[];
  galleryItems?: Array<{
    type: 'image' | 'video';
    src: string;
    videoData?: any;
  }>;
  variantNames?: string[];
}

const GalleryThumbnails = ({
  images,
  currentIndex,
  onThumbnailClick,
  isPlaying = false,
  videoIndices = [],
  galleryItems = [],
  variantNames = []
}: GalleryThumbnailsProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  const handleImageError = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  const maxThumbnails = 5.5; // Show 5.5 elements
  const displayImages = images.slice(0, maxThumbnails);
  const remainingCount = images.length - maxThumbnails;

  const slots = Array.from({ length: Math.ceil(maxThumbnails) }, (_, i) => i);

  const ThumbnailSkeleton = ({ className }: { className?: string }) => (
    <div className={cn("bg-gray-200 animate-pulse", className)} />
  );

  return (
    <div className="flex items-center gap-1.5 w-full">
      {slots.map((slotIndex) => {
        const src = displayImages[slotIndex];
        const index = slotIndex;
        
        if (!src) {
          return (
            <div
              key={`empty-${slotIndex}`}
              className="aspect-square w-[18%] opacity-0 pointer-events-none"
            />
          );
        }

        const isVideo = videoIndices.includes(index);
        const galleryItem = galleryItems[index];
        const isImageLoaded = loadedImages.has(index);
        const isLastThumbnailWithCounter = index === maxThumbnails - 1 && remainingCount > 0;
        const variantName = variantNames[index];

        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden border aspect-square w-[18%]", // Reduced size, flat borders
              "cursor-pointer transition-all",
              currentIndex === index 
                ? "border-2 border-primary" 
                : "border border-gray-300 hover:border-gray-400"
            )}
            onClick={() => onThumbnailClick(index)}
          >
            {!isImageLoaded && (
              <ThumbnailSkeleton className="absolute inset-0 w-full h-full" />
            )}

            {isVideo || galleryItem?.type === 'video' ? (
              <>
                <video 
                  src={src}
                  className={cn("w-full h-full object-cover", 
                    !isImageLoaded && "opacity-0"
                  )}
                  muted
                  preload="metadata"
                  poster={galleryItem?.videoData?.thumbnail_url}
                  onLoadedData={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />

                {isImageLoaded && (
                  <>
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/40",
                      currentIndex === index && isPlaying && "opacity-0"
                    )}>
                      <Play className="h-3 w-3 text-white" /> {/* Smaller icon */}
                    </div>
                    <div className="absolute top-0.5 left-0.5 text-[7px] bg-black/60 text-white px-0.5"> {/* Smaller text */}
                      VIDEO
                    </div>
                  </>
                )}
              </>
            ) : (
              <img 
                src={src} 
                alt={`Thumbnail ${index}`} 
                className={cn("w-full h-full object-cover", 
                  !isImageLoaded && "opacity-0"
                )}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            )}

            {isLastThumbnailWithCounter && isImageLoaded && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-[10px] font-semibold">+{Math.ceil(remainingCount)}</span> {/* Smaller text */}
              </div>
            )}

            {variantName && isImageLoaded && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-0.5 py-0.5"> {/* Smaller padding */}
                <p className="text-[8px] text-center text-foreground truncate font-medium"> {/* Smaller text */}
                  {variantName}
                </p>
              </div>
            )}
          </div>
        );
      })}
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
  const topContentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<any>(null);
  const tabsRef = useRef<any>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  // Fetch all products for overview tab
  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products-overview'],
    queryFn: fetchAllProducts,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const tabs = React.useMemo(() => {
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'reviews', label: 'Reviews' }
    ];
  }, []);

  const getCurrentTab = () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const validTab = tabs.find(tab => tab.id === lastPart);
    return validTab ? validTab.id : 'overview';
  };

  useEffect(() => {
    if (inPanel) return;

    const currentTabFromURL = getCurrentTab();
    if (currentTabFromURL !== activeTab) {
      setActiveTab(currentTabFromURL);
    }
  }, [location.pathname, inPanel]);

  useEffect(() => {
    if (inPanel || !productId) return;

    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    const isProductRoot = currentPath.match(/\/product\/[^/]+$/) || 
                         !tabs.find(tab => tab.id === lastPart);

    if (isProductRoot) {
      const newPath = `/product/${productId}/overview`;
      navigate(newPath, { replace: true });
    }
  }, [navigate, productId, tabs, inPanel]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    if (!productId || inPanel) return;

    const newPath = `/product/${productId}/${tabId}`;
    navigate(newPath);
    window.scrollTo(0, 0);
  };

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

  const isOverviewTab = activeTab === 'overview';
  const showGallery = isOverviewTab;

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

  // Prepare data for overview tab components
  const galleryImages = product?.images?.length > 0 
    ? product.images 
    : product?.product_images?.map((img: any) => img.src) || ["https://placehold.co/300x300?text=No+Image"];

  const videoIndices = product?.product_videos?.length > 0 ? [galleryImages.length] : [];

  const allGalleryItems = [
    ...(galleryImages.map((src: string) => ({ type: 'image' as const, src }))),
    ...(product?.product_videos?.map((video: any) => ({ 
      type: 'video' as const, 
      src: video.url,
      videoData: video 
    })) || [])
  ];

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

  const relatedProducts = React.useMemo(() => {
    if (isLoadingProducts) {
      return [];
    }

    return allProducts
      .filter(p => p.id !== product?.id)
      .slice(0, 8)
      .map(p => ({
        id: p.id,
        name: p.name || 'Unnamed Product',
        price: Number(p.price) || 0,
        discount_price: p.discount_price ? Number(p.discount_price) : undefined,
        product_images: p.product_images || [{ src: "https://placehold.co/300x300?text=No+Image" }],
        inventory: p.inventory || 0,
        category: p.category || 'Uncategorized',
        flash_start_time: p.flash_start_time,
        seller_id: p.seller_id,
      }));
  }, [allProducts, product?.id, isLoadingProducts]);

  // Render tab content directly based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="w-full space-y-2"> {/* Removed mt-2 */}
            <GalleryThumbnails
              images={galleryImages}
              currentIndex={currentGalleryIndex}
              onThumbnailClick={(index) => {
                setCurrentGalleryIndex(index);
                if (galleryRef.current) {
                  galleryRef.current.scrollTo?.(index);
                }
              }}
              videoIndices={videoIndices}
              galleryItems={allGalleryItems}
              variantNames={[]}
            />

            <IPhoneXRListing 
              product={listingProduct}
              onReadMore={() => {}}
            />

            {!isLoadingProducts && relatedProducts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Related Products</h3>
                <p className="text-gray-600">
                  {relatedProducts.length} related products available
                </p>
              </div>
            )}
          </div>
        );
      case 'reviews':
        return <CustomerReviewsEnhanced productId={productId} />;
      default:
        return (
          <div className="w-full space-y-2"> {/* Removed mt-2 */}
            <GalleryThumbnails
              images={galleryImages}
              currentIndex={currentGalleryIndex}
              onThumbnailClick={(index) => {
                setCurrentGalleryIndex(index);
                if (galleryRef.current) {
                  galleryRef.current.scrollTo?.(index);
                }
              }}
              videoIndices={videoIndices}
              galleryItems={allGalleryItems}
              variantNames={[]}
            />

            <IPhoneXRListing 
              product={listingProduct}
              onReadMore={() => {}}
            />

            {!isLoadingProducts && relatedProducts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Related Products</h3>
                <p className="text-gray-600">
                  {relatedProducts.length} related products available
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  const header = !hideHeader ? (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <ProductHeader
        onCloseClick={handleBackClick}
        onShareClick={handleShareClick}
        actionButtons={actionButtons}
        forceScrolledState={!isOverviewTab}
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
  ) : null;

  const productGalleryImages = product?.product_images?.map(img => img.src) || product?.images || ["/placeholder.svg"];
  
  const topContent = showGallery ? (
    <div ref={topContentRef} className="w-full bg-white">
      <ProductImageGallery 
        ref={galleryRef}
        images={productGalleryImages}
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
  ) : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {header}
      
      {/* Main content with scrollable area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: hideHeader ? '0' : '56px' }}
      >
        {/* Top content (Gallery) - only shown for overview tab */}
        {topContent}
        
        {/* Tabs Navigation */}
        <div 
          className="sticky top-[56px] z-40 bg-white"
          style={{ top: hideHeader ? '0' : '56px' }}
        >
          <TabsNavigation
            ref={tabsRef}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={inPanel ? setActiveTab : handleTabChange}
            variant="underline"
            showTopBorder={false}
            edgeToEdge={true}
          />
        </div>
        
        {/* Tab content - removed p-4 padding */}
        <div>
          {renderTabContent()}
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