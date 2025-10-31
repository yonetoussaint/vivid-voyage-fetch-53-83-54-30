import React from "react";
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
  // Only render SocialSharePanel - StickyCheckoutBar is now handled in GalleryTabsContent
  return (
    <SocialSharePanel 
      open={sharePanelOpen}
      onOpenChange={setSharePanelOpen}
      product={product}
    />
  );
};

export default ProductStickyComponents;