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
  products?: Product[];
  isLoading?: boolean;
}

const SellerProducts: React.FC<SellerProductsProps> = ({
  products,
  isLoading
}) => {
  return (
    <div className="p-2">
      <BookGenreFlashDeals 
        products={products}
        fetchSellerProducts={true}
        className="seller-products-view"
      />
    </div>
  );
};

export default SellerProducts;
