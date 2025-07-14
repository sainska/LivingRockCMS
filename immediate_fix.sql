-- IMMEDIATE FIX FOR INFINITE RECURSION ERROR
-- Run this in your Supabase SQL Editor immediately

-- Step 1: Temporarily disable RLS on user_roles table
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all problematic policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "System admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to manage roles" ON public.user_roles;

-- Step 3: Create a policy that allows users to view their own roles
DROP POLICY IF EXISTS "Simple user roles policy" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles 
FOR SELECT USING (auth.uid() = user_id);

-- Optionally, you can add a broader policy for admins if needed
-- CREATE POLICY "System admins can manage all roles" ON public.user_roles 
-- FOR ALL USING (auth.role() = 'authenticated');

-- Step 4: Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 5: Ensure the current user has a role record
INSERT INTO public.user_roles (user_id, role, is_active)
VALUES (
    '24b1fbd6-a3f4-4650-adc5-f2c0cc7a1145', -- Replace with your actual user ID
    'member',
    true
)
ON CONFLICT (user_id) DO UPDATE SET 
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Step 6: Also fix other tables that might have similar issues
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can manage members" ON public.members;
CREATE POLICY "Simple members policy" ON public.members FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON public.events;
CREATE POLICY "Simple events policy" ON public.events FOR ALL USING (auth.role() = 'authenticated');
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Step 7: Test the fix
SELECT * FROM public.user_roles WHERE user_id = '24b1fbd6-a3f4-4650-adc5-f2c0cc7a1145'; 