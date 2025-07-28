# Role Column Error Fix Summary

## 🐛 **Problem Identified**

The error `ERROR: 42703: column "role" does not exist` was occurring because:

1. **Missing Role Column**: The `user_roles` table was missing the `role` column
2. **Inconsistent Table Structure**: Different SQL files were referencing a `role` column that didn't exist
3. **Missing Enum Type**: The `user_role` enum type was not properly defined
4. **Function Dependencies**: Functions like `get_user_role()` were trying to access a non-existent column

## 🔧 **Solution Implemented**

### **1. Database Schema Fix** (`supabase/migrations/20250721090000_fix_role_column_issues.sql`)

#### **Step 1: Check and Fix user_roles Table Structure**
```sql
-- Check if 'role' column exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'role'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Add the role column if it doesn't exist
        ALTER TABLE public.user_roles ADD COLUMN role TEXT;
        UPDATE public.user_roles SET role = 'member' WHERE role IS NULL;
        ALTER TABLE public.user_roles ALTER COLUMN role SET NOT NULL;
    END IF;
END $$;
```

#### **Step 2: Ensure user_role Enum Type Exists**
```sql
-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('system_admin', 'clergy', 'treasurer', 'secretary', 'member');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'user_role enum already exists';
END $$;
```

#### **Step 3: Convert Role Column to Enum Type**
```sql
-- Convert TEXT role column to enum
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE public.user_role 
USING role::public.user_role;
```

#### **Step 4: Add Missing Columns**
```sql
-- Add missing columns if they don't exist
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
```

### **2. Function Updates**

#### **Updated get_user_role Function**
```sql
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_value public.user_role;
BEGIN
    SELECT role INTO user_role_value
    FROM public.user_roles
    WHERE user_id = user_uuid AND is_active = true
    ORDER BY 
        CASE role
            WHEN 'system_admin' THEN 1
            WHEN 'clergy' THEN 2
            WHEN 'treasurer' THEN 3
            WHEN 'secretary' THEN 4
            WHEN 'member' THEN 5
        END
    LIMIT 1;
    
    RETURN user_role_value;
END;
$$;
```

#### **Updated has_role Function**
```sql
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role public.user_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_uuid 
        AND role = required_role 
        AND is_active = true
    );
END;
$$;
```

#### **Updated handle_new_user Function**
```sql
-- Updated to use enum type for role assignment
INSERT INTO public.user_roles (user_id, role, is_active)
VALUES (NEW.id, 'member'::public.user_role, true)
ON CONFLICT (user_id, role) DO NOTHING;
```

### **3. Helper Functions**

#### **Fix Existing User Roles**
```sql
CREATE OR REPLACE FUNCTION fix_existing_user_roles()
RETURNS void AS $$
BEGIN
    -- Update any NULL roles to 'member'
    UPDATE public.user_roles 
    SET role = 'member'::public.user_role 
    WHERE role IS NULL;
    
    -- Ensure all users have at least one role
    INSERT INTO public.user_roles (user_id, role, is_active)
    SELECT 
        p.id, 
        'member'::public.user_role, 
        true
    FROM public.profiles p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.id
    )
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### **Diagnostic Function**
```sql
CREATE OR REPLACE FUNCTION diagnose_role_issues()
RETURNS TABLE (
    issue_type TEXT,
    description TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Users without roles'::TEXT,
        'Users in profiles table without corresponding user_roles'::TEXT,
        COUNT(*)
    FROM public.profiles p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
    )
    
    UNION ALL
    
    SELECT 
        'NULL roles'::TEXT,
        'User roles with NULL role values'::TEXT,
        COUNT(*)
    FROM public.user_roles
    WHERE role IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🚀 **How to Apply the Fix**

### **Option 1: Automated Script**
```bash
node run-role-fix.mjs
```

### **Option 2: Manual SQL Execution**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Copy and paste the content of `supabase/migrations/20250721090000_fix_role_column_issues.sql`
4. Click "Run" to execute

### **Option 3: Supabase CLI**
```bash
npx supabase db push
```

## ✅ **What's Fixed**

1. **✅ Role Column**: Added missing `role` column to `user_roles` table
2. **✅ Enum Type**: Created `user_role` enum type with proper values
3. **✅ Table Structure**: Ensured all required columns exist
4. **✅ Function Compatibility**: Updated all functions to work with the new structure
5. **✅ Data Consistency**: Fixed existing data to have proper role assignments
6. **✅ Email Templates**: Email templates should now work without role column errors

## 🧪 **Testing the Fix**

### **Test Email Templates**
1. Try sending any email template that references user roles
2. Verify no "column role does not exist" errors occur
3. Check that role-based functionality works correctly

### **Verify Database State**
```sql
-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- Check role assignments
SELECT 
    p.email,
    ur.role,
    ur.is_active
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
LIMIT 10;

-- Run diagnostic
SELECT * FROM diagnose_role_issues();
```

## 📊 **Expected Results**

After applying the fix:

- ✅ **No more "column role does not exist" errors**
- ✅ **Email templates work correctly**
- ✅ **Role-based access control functions properly**
- ✅ **All users have proper role assignments**
- ✅ **Database schema is consistent**

## 🔍 **Debugging**

If you still encounter issues:

1. **Check Table Structure**: Verify the `user_roles` table has the correct columns
2. **Verify Enum Type**: Ensure `user_role` enum exists with correct values
3. **Test Functions**: Run the diagnostic function to identify any remaining issues
4. **Check Data**: Ensure all users have proper role assignments

## 🎉 **Success**

The role column error should now be completely resolved. All email templates, role-based functionality, and database operations should work without the "column role does not exist" error. 