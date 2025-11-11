import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
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
  const navigate = useNavigate(); // Add this hook

  const handleAddProduct = () => {
    console.log("Add product clicked - navigating to product edit page");
    // Navigate to the product edit page for creating a new product
    navigate('/seller-dashboard/products/edit/new');
  };

  return (
    <div>
      <BookGenreFlashDeals 
        sellerId={sellerData?.id}
        onAddProduct={handleAddProduct} // Pass the navigation handler
        products={products}
        // You can add other props as needed
        showSummary={true}
        showFilters={true}
        summaryMode="products"
      />
    </div>
  );
};

export default SellerProducts;