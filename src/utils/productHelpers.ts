// utils/productHelpers.ts (NEW - Add this utility file)
export const safeObjectValues = (obj: any): any[] => {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  return Object.values(obj).filter(value => value != null);
};

export const getVariantDisplayName = (variant: any): string => {
  if (!variant || !variant.options) {
    return '';
  }
  return safeObjectValues(variant.options).filter(Boolean).join(' / ');
};

export const getVariantImages = (variant: any): string[] => {
  if (!variant) {
    return [];
  }
  const images = [
    variant.mainImage,
    ...(variant.additionalImages || [])
  ].filter(Boolean);
  return images;
};

export const hasValidVariants = (product: any): boolean => {
  return !!(product?.variants && Array.isArray(product.variants) && product.variants.length > 0);
};