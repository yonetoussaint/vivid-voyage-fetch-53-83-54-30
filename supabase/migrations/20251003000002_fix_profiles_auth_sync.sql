

-- First, let's check if the profiles table has the correct structure
-- and fix the relationship with auth.users

-- Drop the existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure profiles table has the correct structure
-- This will alter the existing table if needed
ALTER TABLE public.profiles 
  ALTER COLUMN id SET DATA TYPE UUID USING id::uuid;

-- Make sure the id column is the primary key
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- Add foreign key constraint to ensure data integrity
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Sync existing auth users to profiles
-- This will update existing profiles or create new ones
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW()
WHERE 
  au.email IS NOT NULL;

-- Update any existing profiles that might have different IDs
-- If there are profiles with email matches but wrong IDs, fix them
UPDATE public.profiles 
SET id = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = profiles.email 
  LIMIT 1
)
WHERE id NOT IN (SELECT id FROM auth.users)
  AND email IN (SELECT email FROM auth.users);

