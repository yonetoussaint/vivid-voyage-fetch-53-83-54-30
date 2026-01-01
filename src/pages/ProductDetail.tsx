// src/components/product/ProductDetail.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Store } from "lucide-react";
import ProductDetailError from "@/components/product/ProductDetailError";
import ProductImageGallery from "@/components/ProductImageGallery";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import FlashDeals from "@/components/home/FlashDeals";
import Separator from "@/components/shared/Separator";
import StoreBanner from "@/components/StoreBanner";
import GalleryThumbnails from "@/components/product/GalleryThumbnails";
import ProductDetailInfo from "@/components/product/ProductDetailInfo";
import ProductDetailLoading from "@/components/product/ProductDetailLoading";
import CustomerReviews from "@/components/product/CustomerReviewsEnhanced";
import ReviewsGallery from "@/components/product/ReviewsGallery";
import ReviewTypingBar from "@/components/product/ReviewTypingBar";
import { useProductDetail } from "@/hooks/product-detail.hooks";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

const ProductDetailContent: React.FC<ProductDetailProps> = (props) => {
  const {
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
  } = useProductDetail(props);

  const [isThumbnailsVisible, setIsThumbnailsVisible] = useState(false);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  // Ensure thumbnails are visible after initial load
  useEffect(() => {
    if (galleryImages.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setIsThumbnailsVisible(true);
        
        // Trigger resize to ensure proper layout
        window.dispatchEvent(new Event('resize'));
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (thumbnailsContainerRef.current) {
            thumbnailsContainerRef.current.style.opacity = "1";
            thumbnailsContainerRef.current.style.transform = "translateY(0)";
          }
        }, 100);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [galleryImages.length, isLoading]);

  // Handle review submission
  const handleReviewSubmit = async (review: string, rating: number) => {
    try {
      console.log("Submitting review:", { review, rating, productId });
      // Add your API call here
      alert("Review submitted successfully! Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // Force scroll to top on image change
  useEffect(() => {
    if (thumbnailsContainerRef.current && galleryImages.length > 0) {
      // Ensure gallery thumbnails are visible
      thumbnailsContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentGalleryIndex, galleryImages.length]);

  if (!productId) {
    return <ProductDetailError message="Product ID is missing" />;
  }

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error || !product) {
    return <ProductDetailError />;
  }

  return (
    <>
      <AliExpressHeader
        mode="product-detail"
        scrollY={scrollY}
        productData={{
          sellers: product?.sellers,
          favorite_count: product?.favorite_count,
        }}
        onBackClick={handleBackClick}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        isFavorite={isFavorite}
        inPanel={props.inPanel}
        hideSearchBar={true}
      />

      {/* Add padding at the bottom to account for the fixed review bar */}
      <div style={{ minHeight: "100vh", paddingBottom: "120px" }}>
        {/* Main Image Gallery */}
        <div className="w-full bg-white">
          <ProductImageGallery
            ref={galleryRef}
            images={galleryImages}
            videos={product?.product_videos || []}
            model3dUrl={product?.model_3d_url}
            seller={product?.sellers}
            product={{
              id: product?.id || "",
              name: product?.name || "",
              price: product?.price || 0,
              discount_price: product?.discount_price,
              inventory: product?.inventory || 0,
              sold_count: product?.sold_count || 0,
            }}
            onSellerClick={() => {
              if (product?.sellers?.id) {
                handleBackClick();
              }
            }}
            onBuyNow={handleBuyNow}
            onImageIndexChange={handleImageIndexChange}
          />
        </div>

        {/* Gallery Thumbnails with proper container and snapping */}
        {galleryImages.length > 1 && (
          <div 
            ref={thumbnailsContainerRef}
            className="mt-2 bg-white border-t border-b border-gray-100 transition-all duration-300 ease-out"
            style={{
              opacity: isThumbnailsVisible ? 1 : 0,
              transform: isThumbnailsVisible ? 'translateY(0)' : 'translateY(-10px)',
            }}
          >
            <div className="py-1">
              <GalleryThumbnails
                images={galleryImages}
                currentIndex={currentGalleryIndex}
                onThumbnailClick={handleThumbnailClick}
              />
            </div>
            
            {/* Current image indicator */}
            <div className="text-center text-xs text-gray-500 pb-1">
              Image {currentGalleryIndex + 1} of {galleryImages.length}
            </div>
          </div>
        )}

        {/* Product Information */}
        <div className="mt-4 px-4">
          <ProductDetailInfo
            product={listingProduct}
            onReadMore={handleReadMore}
          />
        </div>

        <Separator />

        {/* Store Information */}
        <div className="mt-4 px-4">
          <StoreBanner />
        </div>

        <Separator />

        {/* More from this store */}
        <div className="mt-4 px-4">
          <FlashDeals
            title="More from this store"
            icon={Store}
            showSectionHeader={true}
            showCountdown={false}
            showTitleChevron={false}
            maxProducts={20}
            viewAllLink={`/seller/${product?.sellers?.id}`}
            viewAllText="View More"
          />
        </div>

        <Separator />

        {/* Reviews Gallery */}
        <div className="mt-4 px-4">
          <ReviewsGallery viewAllLink="/reviews" />
        </div>

        <Separator />

        {/* Customer Reviews */}
        <div className="mt-4 px-4">
          <CustomerReviews 
            productId={productId} 
            limit={5}
            onReviewClick={() => {
              // Scroll to reviews section
              document.getElementById('reviews-section')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          />
        </div>

        <div id="reviews-section" className="mt-2" />

        <Separator />

        {/* Related Products */}
        <div className="mt-4 px-4">
          <h2 className="text-lg font-semibold mb-4">Related Products</h2>
          <InfiniteContentGrid
            initialProducts={[]}
            fetchPageSize={20}
            enableFilters={true}
            enableSorting={true}
            gridLayout="fluid"
            showHeader={false}
            containerClassName="mt-0"
            contentClassName="px-0"
          />
        </div>
      </div>

      {/* ALWAYS VISIBLE Review Typing Bar */}
      <ReviewTypingBar
        productName={product.name || "This product"}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // Smooth scroll to top on page load
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Reset scroll position for thumbnails
    const timer = setTimeout(() => {
      const thumbnails = document.querySelector('.gallery-thumbnails-container');
      if (thumbnails) {
        (thumbnails as HTMLElement).scrollLeft = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, id]);

  if (!id) {
    return <ProductDetailError message="Product not found" />;
  }

  return <ProductDetailContent productId={id} />;
};

export { ProductDetailContent };
export default ProductDetail;