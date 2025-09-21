import React from "react";
import { useNavigate } from "react-router-dom";
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import SocialSharePanel from "@/components/product/SocialSharePanel";

interface ProductStickyComponentsProps {
  product: any;
  onBuyNow: () => void;
  sharePanelOpen: boolean;
  setSharePanelOpen: (open: boolean) => void;
  hideCheckoutBar?: boolean; // Added this prop based on the changes
}

const ProductStickyComponents: React.FC<ProductStickyComponentsProps> = ({
  product,
  onBuyNow,
  sharePanelOpen,
  setSharePanelOpen,
  hideCheckoutBar = false // Default value for the new prop
}) => {
  const navigate = useNavigate();

  const handleViewCart = () => {
    console.log('🛒 Navigating to cart page from ProductStickyComponents');
    navigate('/cart');
  };
  return (
    <>
      {!hideCheckoutBar && (
        <StickyCheckoutBar 
          product={product}
          onBuyNow={onBuyNow}
          onViewCart={handleViewCart}
          selectedColor=""
          selectedStorage=""
          selectedNetwork=""
          selectedCondition=""
          className=""
        />
      )}

      <SocialSharePanel 
        open={sharePanelOpen}
        onOpenChange={setSharePanelOpen}
        product={product}
      />
    </>
  );
};

export default ProductStickyComponents;