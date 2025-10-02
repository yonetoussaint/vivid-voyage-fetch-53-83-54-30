
-- Function to create a seller account for a user
CREATE OR REPLACE FUNCTION public.create_seller_account(
  user_id UUID,
  seller_name TEXT,
  seller_description TEXT DEFAULT NULL,
  seller_category TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_seller_id UUID;
BEGIN
  -- Check if user already has a seller account
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND seller_id IS NOT NULL) THEN
    RAISE EXCEPTION 'User already has a seller account';
  END IF;

  -- Create the seller
  INSERT INTO public.sellers (name, description, category, status, verified, trust_score, total_sales, followers_count)
  VALUES (seller_name, seller_description, seller_category, 'active', false, 0, 0, 0)
  RETURNING id INTO new_seller_id;

  -- Link the seller to the user profile
  UPDATE public.profiles
  SET seller_id = new_seller_id, updated_at = NOW()
  WHERE id = user_id;

  RETURN new_seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_seller_account TO authenticated;
