import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['seller-by-user-id', userId],
    queryFn: async () => {
      if (!userId) return null;

      console.log('🔍 Fetching seller for user:', userId);

      // First get the profile to find the seller_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('seller_id')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.log('❌ Profile not found:', profileError.message);
        return null;
      }

      if (!profileData?.seller_id) {
        console.log('❌ No seller_id found in profile');
        return null;
      }

      console.log('✅ Found seller_id:', profileData.seller_id);

      // Now fetch the seller data using the seller_id
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', profileData.seller_id)
        .single();

      if (sellerError) {
        console.log('❌ Seller not found:', sellerError.message);
        return null;
      }

      console.log('✅ Seller data fetched:', sellerData);
      return sellerData;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};