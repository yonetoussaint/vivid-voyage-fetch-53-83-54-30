import React from "react";
import { useNavigate } from "react-router-dom";
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import SocialSharePanel from "@/components/product/SocialSharePanel";

interface ProductStickyComponentsProps {
  product: any;
  onBuyNow: () => void;
  sharePanelOpen: boolean;
  setSharePanelOpen: (open: boolean) => void;
  hideCheckoutBar?: boolean;
  activeTab?: string;
}

const ProductStickyComponents: React.FC<ProductStickyComponentsProps> = ({
  product,
  onBuyNow,
  sharePanelOpen,
  setSharePanelOpen,
  hideCheckoutBar = false,
  activeTab = 'overview'
}) => {
  const navigate = useNavigate();

  const handleViewCart = () => {
    console.log('🛒 Navigating to cart page from ProductStickyComponents');
    navigate('/cart');
  };

  // Debug: Log current state
  console.log('🔍 ProductStickyComponents - activeTab:', activeTab, 'hideCheckoutBar:', hideCheckoutBar);

  // Only show checkout bar on overview tab AND if not explicitly hidden
  const shouldShowCheckoutBar = !hideCheckoutBar && activeTab === 'overview';

  console.log('🔍 ProductStickyComponents - shouldShowCheckoutBar:', shouldShowCheckoutBar);

  if (!shouldShowCheckoutBar) {
    console.log('🚫 StickyCheckoutBar is HIDDEN - either not overview tab or explicitly hidden');
    return (
      <SocialSharePanel 
        open={sharePanelOpen}
        onOpenChange={setSharePanelOpen}
        product={product}
      />
    );
  }

  return (
    <>
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

      <SocialSharePanel 
        open={sharePanelOpen}
        onOpenChange={setSharePanelOpen}
        product={product}
      />
    </>
  );
};

export default ProductStickyComponents;