-- Database Diagnostic Script
-- Run this in Supabase SQL Editor to check what's missing

-- 1. Check if tables exist
SELECT 
    table_name,
    CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'user_roles');

-- 2. Check if enum types exist
SELECT 
    typname as enum_name,
    CASE WHEN typname IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_type 
WHERE typname IN ('user_role', 'member_status');

-- 3. Check if functions exist
SELECT 
    proname as function_name,
    CASE WHEN proname IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_proc 
WHERE proname IN ('get_user_role', 'has_role', 'is_admin_or_clergy', 'handle_new_user');

-- 4. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles');

-- 5. Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles'); 