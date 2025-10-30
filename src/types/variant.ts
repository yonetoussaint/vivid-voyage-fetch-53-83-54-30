// types/variant.ts
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
}