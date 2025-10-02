import React from 'react';
import SellerProducts from '@/components/seller/SellerProducts';

interface SellerProductsPageProps {
  products?: any[];
  isLoading?: boolean;
}

const SellerProductsPage: React.FC<SellerProductsPageProps> = ({
  products = [],
  isLoading = false
}) => {
  return (
    <div className="p-4">
      <SellerProducts products={products} isLoading={isLoading} />
    </div>
  );
};

export default SellerProductsPage;