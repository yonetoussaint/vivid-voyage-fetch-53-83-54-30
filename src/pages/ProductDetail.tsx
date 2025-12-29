// src/pages/ProductDetail.tsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Heart, Share, ChevronDown, ChevronLeft, X, Store } from 'lucide-react';
import ProductDetailError from "@/components/product/ProductDetailError";
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import ProductImageGallery from "@/components/ProductImageGallery";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FlashDeals from "@/components/home/FlashDeals";
import Separator from "@/components/shared/Separator";
import StoreBanner from "@/components/StoreBanner";
import GalleryThumbnails from "@/components/product/GalleryThumbnails";
import ProductDetailInfo from "@/components/product/ProductDetailInfo";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

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

  const handleReadMore = () => {
    // Implement read more functionality
    // You could open a modal or expand the description
    console.log('Read more clicked');
  };

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
    <>
      <AliExpressHeader
        mode="product-detail"
        scrollY={scrollY}
        productData={{
          sellers: product?.sellers,
          favorite_count: product?.favorite_count
        }}
        onBackClick={handleBackClick}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        isFavorite={isFavorite}
        inPanel={inPanel}
        hideSearchBar={true}
      />

      <div style={{ 
        minHeight: '100vh'
      }}>
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

        <div className="mt-2">
          <ProductDetailInfo 
            product={listingProduct}
            onReadMore={handleReadMore}
          />
        </div>

        {/* Separator between ProductDetailInfo and StoreBanner */}
        <Separator />

        {/* Store Banner - Added before FlashDeals */}
        <div className="mt-4 px-4">
          <StoreBanner />
        </div>

        {/* Separator between StoreBanner and FlashDeals */}
        <Separator />

        {/* More from this store - FlashDeals Component with Store icon and View More button */}
        <div className="mt-4">
          <FlashDeals 
            title="More from this store"
            icon={Store}  // Add Store icon here
            showSectionHeader={true}
            showCountdown={false}
            showTitleChevron={false}
            maxProducts={20}
            viewAllLink={`/seller/${product?.sellers?.id}`}
            viewAllText="View More"
          />
        </div>

        {/* Separator between FlashDeals and InfiniteContentGrid */}
        <Separator />

        {/* InfiniteContentGrid for related products */}
        <InfiniteContentGrid
          initialProducts={[]}
          fetchPageSize={20}
          enableFilters={true}
          enableSorting={true}
          gridLayout="fluid"
          showHeader={false}
          containerClassName="mt-0"
          contentClassName="px-4"
        />
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