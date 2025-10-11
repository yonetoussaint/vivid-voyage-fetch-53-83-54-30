import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/integrations/supabase/products';
import FlashDeals from '@/components/home/FlashDeals';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
  });

  return (
    <div className="w-full bg-white">
      <FlashDeals
        layoutMode="grid"
        showSectionHeader={false}
        title="YOUR WISHLIST"
        icon={Heart}
      />
    </div>
  );
}
