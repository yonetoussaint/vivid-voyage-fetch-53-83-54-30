import React from 'react';
import SellerProducts from '@/components/seller/SellerProducts';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SellerProductsPageProps {
  products?: any[];
  isLoading?: boolean;
}

const SellerProductsPage: React.FC<SellerProductsPageProps> = ({
  products: allProducts = [],
  isLoading: allProductsLoading = false
}) => {
  const { user } = useAuth();
  const { data: sellerData } = useSellerByUserId(user?.id || '');

  // Fetch products specific to this seller
  const { data: sellerProducts, isLoading: sellerProductsLoading } = useQuery({
    queryKey: ['seller-products', sellerData?.id],
    queryFn: async () => {
      if (!sellerData?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            src,
            alt
          )
        `)
        .eq('seller_id', sellerData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching seller products:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!sellerData?.id,
  });

  // Use seller-specific products if available, otherwise use all products
  const products = sellerProducts || allProducts;
  const isLoading = sellerProductsLoading || allProductsLoading;

  return (
    <div className="p-2">
      <SellerProducts products={products} isLoading={isLoading} />
    </div>
  );
};

export default SellerProductsPage;