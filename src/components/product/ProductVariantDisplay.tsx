// components/product/ProductVariantDisplay.tsx (Fixed)
import React from 'react';
import { Product, ProductVariant } from '@/types/variant';
import { VariantSelector } from './VariantSelector';
import { GalleryThumbnails } from './GalleryThumbnails';

interface ProductVariantDisplayProps {
  product?: Product | null;
  currentVariant?: ProductVariant | null;
  onVariantChange: (variantId: string) => void;
  onImageSelect: (imageUrl: string, variantName: string) => void;
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  isPlaying?: boolean;
}

export const ProductVariantDisplay: React.FC<ProductVariantDisplayProps> = ({
  product,
  currentVariant,
  onVariantChange,
  onImageSelect,
  currentIndex,
  onThumbnailClick,
  isPlaying = false
}) => {
  // Safe fallbacks for currentVariant
  const safeVariant = currentVariant || product?.variants?.[0];
  
  const variantImages = safeVariant ? [
    safeVariant.mainImage,
    ...(safeVariant.additionalImages || [])
  ].filter(Boolean) : [];

  const variantName = safeVariant ? Object.values(safeVariant.options || {}).join(' / ') : '';

  const handleVariantChange = (variantId: string) => {
    onVariantChange(variantId);
    
    // Update the main image when variant changes
    const newVariant = product?.variants?.find(v => v.id === variantId);
    if (newVariant) {
      onImageSelect(newVariant.mainImage, Object.values(newVariant.options || {}).join(' / '));
    }
  };

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No product variants available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      <VariantSelector
        product={product}
        onVariantChange={handleVariantChange}
      />

      {/* Price Display */}
      {safeVariant && (
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-foreground">
            ${safeVariant.price.toFixed(2)}
          </span>
          {safeVariant.compareAtPrice && safeVariant.compareAtPrice > safeVariant.price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ${safeVariant.compareAtPrice.toFixed(2)}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                Save ${(safeVariant.compareAtPrice - safeVariant.price).toFixed(2)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Variant-specific Gallery */}
      {variantImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            {variantName} - Images
          </h4>
          <GalleryThumbnails
            images={variantImages}
            currentIndex={currentIndex}
            onThumbnailClick={onThumbnailClick}
            isPlaying={isPlaying}
            videoIndices={[]}
            galleryItems={variantImages.map(src => ({
              type: 'image' as const,
              src
            }))}
          />
        </div>
      )}
    </div>
  );
};