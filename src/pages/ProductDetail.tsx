// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import ProductDetailLayout from "@/components/product/ProductDetailLayout";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetailError from "@/components/product/ProductDetailError";
import SlideUpPanel from "@/components/shared/SlideUpPanel";

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

interface ProductDetailProps {
  productId?: string;
  hideHeader?: boolean;
  inPanel?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  stickyTopOffset?: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  productId: propProductId, 
  hideHeader = false, 
  inPanel = false, 
  scrollContainerRef,
  stickyTopOffset 
}) => {
  console.log('🚀 ProductDetail component loaded');

  const { id: paramId } = useParams<{ id: string }>();
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;
  const { data: product, isLoading } = useProduct(productId);

  // State for description panel
  const [isDescriptionPanelOpen, setIsDescriptionPanelOpen] = useState(false);

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

  if (!product) {
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
        onReadMore={handleReadMore} // Pass handler to layout
      />

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

export default ProductDetail;