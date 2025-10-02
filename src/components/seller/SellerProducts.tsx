import React from 'react';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  product_images?: Array<{ src: string }>;
  inventory?: number;
  flash_start_time?: string;
}

interface SellerProductsProps {
  products: Product[];
  isLoading: boolean;
}

const SellerProducts: React.FC<SellerProductsProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Products</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="w-full h-48 bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="font-medium">No products yet</p>
        <p className="text-sm text-muted-foreground">
          This seller hasn't listed any products yet.
        </p>
      </div>
    );
  }

  return (
    <BookGenreFlashDeals 
      products={products}
      className="seller-products-view"
    />
  );
};

export default SellerProducts;