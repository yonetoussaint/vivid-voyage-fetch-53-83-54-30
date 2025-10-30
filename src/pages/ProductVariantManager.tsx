// ProductVariantManager.tsx (Updated for new variants system)
import React, { useEffect } from 'react';

interface ProductVariantManagerProps {
  product: any;
  displayImages: string[];
  setDisplayImages: (images: string[]) => void;
  setCurrentImageIndex: (index: number) => void;
}

const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  product,
  displayImages,
  setDisplayImages,
  setCurrentImageIndex
}) => {
  
  useEffect(() => {
    // Initialize display images based on product variants or default images
    if (product?.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const variantImages = [
        firstVariant.mainImage,
        ...(firstVariant.additionalImages || [])
      ].filter(Boolean);
      
      if (variantImages.length > 0) {
        setDisplayImages(variantImages);
        setCurrentImageIndex(0);
      }
    }
  }, [product, setDisplayImages, setCurrentImageIndex]);

  return null; // This component doesn't render anything
};

export default ProductVariantManager;