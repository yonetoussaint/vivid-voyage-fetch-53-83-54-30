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
    <div>
      <BookGenreFlashDeals 
        fetchSellerProducts={true}
        onAddProduct={() => {
          console.log("Add product clicked");
          // Or navigate to add product page:
          // navigate('/add-product');
        }}
      />
    </div>
  );
};

export default SellerProducts;
