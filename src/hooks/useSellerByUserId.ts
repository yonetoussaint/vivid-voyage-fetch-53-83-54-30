import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['seller-by-user-id', userId],
    queryFn: async () => {
      if (!userId) return null;

      console.log('🔍 Fetching seller for user:', userId);

      // Query the sellers table directly using user_id
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('📊 Seller query result:', { sellerData, sellerError });

      if (sellerError) {
        console.log('❌ Seller query error:', sellerError);
        return null;
      }

      if (!sellerData) {
        console.log('ℹ️ No seller profile found for user - this is normal for non-seller accounts');
        return null;
      }

      console.log('✅ Seller data fetched:', sellerData);
      return sellerData;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};