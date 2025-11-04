// ProductDetail.tsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import ProductDetailLayout from "@/components/product/ProductDetailLayout";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetailError from "@/components/product/ProductDetailError";
import SlideUpPanel from "@/components/shared/SlideUpPanel";

// Import tab components
import ProductOverview from "@/components/product/tabs/ProductOverview";
import ProductVariants from "@/components/product/tabs/ProductVariants";
import ProductReviews from "@/components/product/tabs/ProductReviews";
import StoreReviews from "@/components/product/tabs/StoreReviews";
import ReviewsGallery from "@/components/product/tabs/ReviewsGallery";
import ProductQnA from "@/components/product/tabs/ProductQnA";

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

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
  console.log('🚀 ProductDetailContent component loaded');

  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Use prop productId first, then param, then default - ensure it's never undefined
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;
  const { data: product, isLoading, error } = useProduct(productId);

  // State for description panel
  const [isDescriptionPanelOpen, setIsDescriptionPanelOpen] = React.useState(false);

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const handleReadMore = () => {
    setIsDescriptionPanelOpen(true);
  };

  const handleCloseDescriptionPanel = () => {
    setIsDescriptionPanelOpen(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded" />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex space-x-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-12" />
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <ProductDetailError />;
  }

  return (
    <>
      <ProductDetailLayout 
        product={product} 
        productId={productId} 
        hideHeader={hideHeader}
        inPanel={inPanel}
        scrollContainerRef={scrollContainerRef}
        stickyTopOffset={stickyTopOffset}
        onReadMore={handleReadMore}
      >
        {/* Tab content routing */}
        <div className="product-tab-content">
          <Routes>
            <Route path="/variants" element={<ProductVariants product={product} />} />
            <Route path="/reviews" element={<ProductReviews product={product} />} />
            <Route path="/store-reviews" element={<StoreReviews product={product} />} />
            <Route path="/reviews-gallery" element={<ReviewsGallery product={product} />} />
            <Route path="/qna" element={<ProductQnA product={product} />} />
            <Route path="/overview" element={<ProductOverview product={product} />} />
            <Route path="/" element={<ProductOverview product={product} />} />
            {/* Catch-all route for any unmatched paths */}
            <Route path="*" element={<Navigate to={`/product/${productId}/overview`} replace />} />
          </Routes>
        </div>
      </ProductDetailLayout>

      {/* SlideUpPanel at the root level */}
      <SlideUpPanel
        isOpen={isDescriptionPanelOpen}
        onClose={handleCloseDescriptionPanel}
        title="Product Description"
        showCloseButton={true}
      >
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product?.description || product?.short_description || 'No description available.'}
          </p>
        </div>
      </SlideUpPanel>
    </>
  );
};

// Main wrapper component with routing
const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  console.log('🔍 ProductDetail routing debug:', {
    location: location.pathname,
    params: { id },
    fullPath: location.pathname
  });

  // If no ID is found in params, use the default
  const productId = id || DEFAULT_PRODUCT_ID;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/product/${productId}/overview`} replace />} />
      <Route path="/overview" element={<ProductDetailContent />} />
      <Route path="/variants" element={<ProductDetailContent />} />
      <Route path="/reviews" element={<ProductDetailContent />} />
      <Route path="/store-reviews" element={<ProductDetailContent />} />
      <Route path="/reviews-gallery" element={<ProductDetailContent />} />
      <Route path="/qna" element={<ProductDetailContent />} />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={`/product/${productId}/overview`} replace />} />
    </Routes>
  );
};

export default ProductDetail;