
-- Fix profile sync issues between auth.users and public.profiles
-- This migration ensures all profiles have matching IDs with auth.users

-- Step 1: Delete orphaned profile records that don't match any auth.users
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Step 2: Delete duplicate profiles that share the same email but have wrong IDs
DELETE FROM public.profiles p1
WHERE EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.email = p1.email
  AND au.id != p1.id
);

-- Step 3: Insert or update profiles to match auth.users
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as full_name,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
  updated_at = NOW();

-- Step 4: Update post_comments to use correct user_id from auth.users
UPDATE post_comments pc
SET user_id = (
  SELECT au.id 
  FROM auth.users au 
  JOIN public.profiles p ON p.email = au.email
  WHERE p.id = pc.user_id
  LIMIT 1
)
WHERE user_id NOT IN (SELECT id FROM auth.users)
AND user_id IN (SELECT id FROM public.profiles);

-- Step 5: Update conversation_participants to use correct user_id from auth.users
UPDATE conversation_participants cp
SET user_id = (
  SELECT au.id 
  FROM auth.users au 
  JOIN public.profiles p ON p.email = au.email
  WHERE p.id = cp.user_id
  LIMIT 1
)
WHERE user_id NOT IN (SELECT id FROM auth.users)
AND user_id IN (SELECT id FROM public.profiles)
AND EXISTS (
  SELECT 1 FROM auth.users au
  JOIN public.profiles p ON p.email = au.email
  WHERE p.id = cp.user_id
);

-- Step 6: Update messages to use correct sender_id from auth.users
UPDATE messages m
SET sender_id = (
  SELECT au.id 
  FROM auth.users au 
  JOIN public.profiles p ON p.email = au.email
  WHERE p.id = m.sender_id
  LIMIT 1
)
WHERE sender_id NOT IN (SELECT id FROM auth.users)
AND sender_id IN (SELECT id FROM public.profiles)
AND EXISTS (
  SELECT 1 FROM auth.users au
  JOIN public.profiles p ON p.email = au.email
  WHERE p.id = m.sender_id
);

-- Step 7: Ensure the trigger exists to keep future profiles in sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
