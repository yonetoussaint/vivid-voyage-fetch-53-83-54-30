import React from 'react';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';

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
  const { user } = useAuth();
  const { data: sellerData } = useSellerByUserId(user?.id || '');

  return (
    <div>
      <BookGenreFlashDeals 
        sellerId={sellerData?.id}
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
