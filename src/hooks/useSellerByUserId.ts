import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['seller-by-user-id', userId],
    queryFn: async () => {
      if (!userId) return null;

      console.log('🔍 Fetching seller for user:', userId);

      // Query the profiles table to get the seller_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('seller_id')
        .eq('id', userId)
        .maybeSingle();

      console.log('📊 Profile query result:', { profileData, profileError });

      if (profileError) {
        console.log('❌ Profile query error:', profileError);
        return null;
      }

      if (!profileData) {
        console.log('❌ No profile found for user:', userId);
        return null;
      }

      if (!profileData.seller_id) {
        console.log('❌ No seller_id found in profile');
        return null;
      }

      const sellerId = profileData.seller_id;
      console.log('✅ Found seller_id in profile:', sellerId);

      // Now fetch the seller data using the seller_id
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', sellerId)
        .single();

      if (sellerError) {
        console.log('❌ Seller not found:', sellerError);
        return null;
      }

      console.log('✅ Seller data fetched:', sellerData);
      return sellerData;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};