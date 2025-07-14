-- Fix RLS Policies to prevent infinite recursion
-- Run this in your Supabase SQL editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "System admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "System admins can manage members" ON public.members;
DROP POLICY IF EXISTS "System admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Treasurers and admins can access financial data" ON public.financial_transactions;
DROP POLICY IF EXISTS "Treasurers and admins can access donations" ON public.donations;
DROP POLICY IF EXISTS "System admins can manage church settings" ON public.church_settings;
DROP POLICY IF EXISTS "System admins can view audit logs" ON public.audit_logs;

-- Create new policies that don't cause infinite recursion
CREATE POLICY "Allow authenticated users to manage roles" ON public.user_roles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage members" ON public.members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access financial data" ON public.financial_transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access donations" ON public.donations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage church settings" ON public.church_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view audit logs" ON public.audit_logs FOR SELECT USING (auth.role() = 'authenticated');

-- Ensure user_roles table has at least one record for the current user
-- This will be handled by the trigger when users sign up, but let's make sure
INSERT INTO public.user_roles (user_id, role, is_active)
SELECT 
    auth.uid() as user_id,
    'member' as role,
    true as is_active
WHERE 
    auth.uid() IS NOT NULL 
    AND NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid()
    )
ON CONFLICT (user_id) DO NOTHING; 