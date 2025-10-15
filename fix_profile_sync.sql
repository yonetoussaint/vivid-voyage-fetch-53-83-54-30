-- First, delete the old profile record that doesn't match auth.users
DELETE FROM public.profiles 
WHERE email = 'yonetoussaint25@gmail.com' 
AND id NOT IN (SELECT id FROM auth.users);

-- Then create the correct profile record matching auth.users
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)) as full_name,
  created_at,
  NOW() as updated_at
FROM auth.users
WHERE email = 'yonetoussaint25@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
  updated_at = NOW();

-- Update any comments that used the old profile ID to use the correct one
UPDATE post_comments
SET user_id = (SELECT id FROM auth.users WHERE email = 'yonetoussaint25@gmail.com')
WHERE user_id = '6a01fb2e-9c7b-45b4-ab7f-9e2c058f54f3';
