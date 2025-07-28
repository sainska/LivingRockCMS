# SQL Updates Needed for Registration System

## Overview
After analyzing the current database schema and functions, I've identified several potential issues that need to be addressed to ensure the registration system works correctly. The main issues are related to error handling, table structure consistency, and trigger reliability.

## Issues Identified

### 1. **Error Handling in Database Functions**
- The current `handle_new_user()` function doesn't handle edge cases properly
- No error handling for duplicate profile or role insertions
- Function could fail silently, causing registration issues

### 2. **Table Structure Inconsistencies**
- Some migration files have different table structures
- Missing columns in some table definitions
- Inconsistent column constraints

### 3. **Trigger Reliability**
- Triggers might not be properly set up in all environments
- No fallback mechanisms for trigger failures

### 4. **RLS Policy Issues**
- Some RLS policies might be missing or incorrectly configured
- Potential access issues for system operations

## SQL Updates Required

### 1. **Enhanced handle_new_user() Function**
The updated function includes:
- **Error handling** for duplicate insertions
- **Fallback mechanisms** for profile updates
- **Warning logging** instead of complete failures
- **Graceful degradation** when operations fail

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert profile with error handling
    BEGIN
        INSERT INTO public.profiles (id, first_name, last_name, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
            NEW.email
        );
    EXCEPTION
        WHEN unique_violation THEN
            -- Profile already exists, update it instead
            UPDATE public.profiles 
            SET 
                first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
                last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
                email = NEW.email,
                updated_at = NOW()
            WHERE id = NEW.id;
        WHEN OTHERS THEN
            -- Log the error but don't fail the registration
            RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Auto-assign member role with error handling
    BEGIN
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (NEW.id, 'member', true);
    EXCEPTION
        WHEN unique_violation THEN
            -- Role already exists, update it to active
            UPDATE public.user_roles 
            SET is_active = true, assigned_at = NOW()
            WHERE user_id = NEW.id AND role = 'member';
        WHEN OTHERS THEN
            -- Log the error but don't fail the registration
            RAISE WARNING 'Error assigning role for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;
```

### 2. **Table Structure Updates**
Ensure all necessary columns exist:

```sql
-- Update profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Kenya',
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### 3. **Trigger Reconfiguration**
Ensure triggers are properly set up:

```sql
-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for updating profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### 4. **RLS Policy Updates**
Ensure proper access control:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);
```

### 5. **Performance Indexes**
Add indexes for better performance:

```sql
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
```

## How to Apply Updates

### Option 1: Run the Complete SQL Script
1. Open your Supabase SQL Editor
2. Copy and paste the entire `REGISTRATION_SQL_UPDATES.sql` file
3. Execute the script
4. Verify the changes with the test queries

### Option 2: Run Updates Incrementally
If you prefer to run updates step by step:

1. **First**: Run the enum type creation
2. **Second**: Run the table structure updates
3. **Third**: Run the function updates
4. **Fourth**: Run the trigger updates
5. **Fifth**: Run the RLS policy updates
6. **Finally**: Run the index creation

## Verification Steps

After applying the updates, verify everything is working:

### 1. **Test Database Functions**
```sql
-- Test get_user_role function
SELECT public.get_user_role('your-user-uuid-here');

-- Test has_role function
SELECT public.has_role('your-user-uuid-here', 'member');

-- Test is_admin_or_clergy function
SELECT public.is_admin_or_clergy('your-user-uuid-here');
```

### 2. **Check Table Structure**
```sql
-- Verify profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Verify user_roles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_roles'
ORDER BY ordinal_position;
```

### 3. **Check Triggers**
```sql
-- Verify triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'users';
```

### 4. **Check RLS Policies**
```sql
-- Verify RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_roles');
```

## Benefits of These Updates

### 1. **Improved Reliability**
- Better error handling prevents registration failures
- Graceful degradation when operations fail
- Consistent behavior across different scenarios

### 2. **Enhanced Security**
- Proper RLS policies ensure data access control
- System operations are properly authorized
- User data is protected appropriately

### 3. **Better Performance**
- Optimized indexes improve query performance
- Efficient role lookups
- Faster profile updates

### 4. **Easier Maintenance**
- Clear error messages for debugging
- Consistent table structures
- Well-documented functions

## Potential Issues Without Updates

If these SQL updates are not applied, you might encounter:

1. **Registration Failures**: Users might not be able to register if the trigger fails
2. **Missing Data**: Profile information might not be saved correctly
3. **Role Assignment Issues**: Users might not get proper role assignments
4. **Performance Problems**: Slow queries due to missing indexes
5. **Security Vulnerabilities**: Improper access control due to missing RLS policies

## Conclusion

The SQL updates provided in `REGISTRATION_SQL_UPDATES.sql` are essential for ensuring the registration system works reliably and securely. These updates address potential issues that could cause registration failures and improve the overall robustness of the system.

**Recommendation**: Run the complete SQL script in your Supabase environment to ensure all components are properly configured for the registration system. 