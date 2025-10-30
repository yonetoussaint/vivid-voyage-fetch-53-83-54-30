// utils/productHelpers.ts (Enhanced)
export const safeObjectValues = (obj: any): any[] => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return [];
  }
  try {
    return Object.values(obj).filter(value => value != null);
  } catch (error) {
    console.error('Error in safeObjectValues:', error);
    return [];
  }
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

// Safe way to get object entries
export const safeObjectEntries = (obj: any): [string, any][] => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return [];
  }
  try {
    return Object.entries(obj);
  } catch (error) {
    console.error('Error in safeObjectEntries:', error);
    return [];
  }
};