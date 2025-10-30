// types/variant.ts (Updated)
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  options: {
    [key: string]: string; // e.g., { color: 'Red', size: 'Large', material: 'Cotton' }
  };
  mainImage: string;
  additionalImages?: string[];
  weight?: number;
  barcode?: string;
  isAvailable: boolean;
}

export interface ProductOption {
  id: string;
  name: string; // 'color', 'size', 'material'
  values: string[]; // ['Red', 'Blue', 'Green']
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  defaultVariantId: string;
  // Legacy properties for compatibility
  variant_names?: any[];
  product_videos?: any[];
  model_3d_url?: string;
  sellers?: any;
  inventory?: number;
  sold_count?: number;
  price?: number;
  discount_price?: number;
  name?: string;
}