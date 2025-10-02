import React from 'react';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
