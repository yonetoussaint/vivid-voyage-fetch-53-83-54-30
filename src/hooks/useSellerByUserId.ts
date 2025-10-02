import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['seller-by-user-id', userId],
    queryFn: async () => {
      if (!userId) return null;

      console.log('🔍 Fetching seller for user:', userId);

      // First, try to get the user's auth data which might have seller_id
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 User auth data:', user);

      let sellerId: string | null = null;

      // Check if seller_id exists in user metadata
      if (user && (user as any).seller_id) {
        sellerId = (user as any).seller_id;
        console.log('✅ Found seller_id in user object:', sellerId);
      } else {
        // Fallback: Try to get from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('seller_id')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.log('❌ Profile query error:', profileError.message);
        }

        if (profileData?.seller_id) {
          sellerId = profileData.seller_id;
          console.log('✅ Found seller_id in profile:', sellerId);
        }
      }

      if (!sellerId) {
        console.log('❌ No seller_id found in user object or profile');
        return null;
      }

      // Now fetch the seller data using the seller_id
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', sellerId)
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