#!/usr/bin/env node

/**
 * Fix 2FA Database Setup Script
 * This script checks and creates the necessary 2FA database functions and tables
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fix2FADatabase() {
  console.log('🔧 Checking and fixing 2FA database setup...\n');

  try {
    // Step 1: Check if profiles table has 2FA columns
    console.log('📋 Step 1: Checking profiles table...');
    const { data: profileColumns, error: profileError } = await supabase
      .from('profiles')
      .select('two_factor_enabled')
      .limit(1);

    if (profileError && profileError.message.includes('column "two_factor_enabled" does not exist')) {
      console.log('⚠️  2FA columns missing from profiles table. Adding them...');
      
      // Add 2FA columns to profiles table
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
          ADD COLUMN IF NOT EXISTS two_factor_method VARCHAR(10) DEFAULT 'email' CHECK (two_factor_method IN ('email', 'phone')),
          ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
          ADD COLUMN IF NOT EXISTS backup_codes TEXT[],
          ADD COLUMN IF NOT EXISTS last_2fa_attempt TIMESTAMP WITH TIME ZONE,
          ADD COLUMN IF NOT EXISTS failed_2fa_attempts INTEGER DEFAULT 0;
        `
      });

      if (alterError) {
        console.error('❌ Error adding 2FA columns:', alterError);
        throw alterError;
      }
      console.log('✅ 2FA columns added to profiles table');
    } else {
      console.log('✅ Profiles table already has 2FA columns');
    }

    // Step 2: Check if two_factor_codes table exists
    console.log('\n📋 Step 2: Checking two_factor_codes table...');
    const { data: codesTable, error: codesError } = await supabase
      .from('two_factor_codes')
      .select('id')
      .limit(1);

    if (codesError && codesError.message.includes('relation "two_factor_codes" does not exist')) {
      console.log('⚠️  two_factor_codes table missing. Creating it...');
      
      const { error: createCodesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS two_factor_codes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            code VARCHAR(6) NOT NULL,
            method VARCHAR(10) NOT NULL CHECK (method IN ('email', 'phone')),
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            used_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ip_address INET,
            user_agent TEXT,
            is_valid BOOLEAN DEFAULT true
          );
        `
      });

      if (createCodesError) {
        console.error('❌ Error creating two_factor_codes table:', createCodesError);
        throw createCodesError;
      }
      console.log('✅ two_factor_codes table created');
    } else {
      console.log('✅ two_factor_codes table already exists');
    }

    // Step 3: Check if two_factor_attempts table exists
    console.log('\n📋 Step 3: Checking two_factor_attempts table...');
    const { data: attemptsTable, error: attemptsError } = await supabase
      .from('two_factor_attempts')
      .select('id')
      .limit(1);

    if (attemptsError && attemptsError.message.includes('relation "two_factor_attempts" does not exist')) {
      console.log('⚠️  two_factor_attempts table missing. Creating it...');
      
      const { error: createAttemptsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS two_factor_attempts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            attempt_type VARCHAR(20) NOT NULL CHECK (attempt_type IN ('success', 'failed', 'expired')),
            method VARCHAR(10) NOT NULL CHECK (method IN ('email', 'phone')),
            ip_address INET,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (createAttemptsError) {
        console.error('❌ Error creating two_factor_attempts table:', createAttemptsError);
        throw createAttemptsError;
      }
      console.log('✅ two_factor_attempts table created');
    } else {
      console.log('✅ two_factor_attempts table already exists');
    }

    // Step 4: Create the generate_2fa_code function
    console.log('\n📋 Step 4: Creating generate_2fa_code function...');
    const { error: generateFunctionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION generate_2fa_code(
          user_email TEXT,
          method VARCHAR(10) DEFAULT 'email'
        )
        RETURNS JSON AS $$
        DECLARE
          user_profile RECORD;
          verification_code VARCHAR(6);
          result JSON;
        BEGIN
          -- Check if user exists and 2FA is enabled
          SELECT id, email, two_factor_enabled, two_factor_method, phone
          INTO user_profile
          FROM profiles
          WHERE email = user_email
          LIMIT 1;

          IF user_profile IS NULL THEN
            result := json_build_object('success', false, 'message', 'User not found');
            RETURN result;
          END IF;

          IF user_profile.two_factor_enabled = false THEN
            result := json_build_object('success', false, 'message', '2FA is not enabled for this user');
            RETURN result;
          END IF;

          -- Check if method matches user's 2FA method
          IF method != user_profile.two_factor_method THEN
            result := json_build_object('success', false, 'message', 'Invalid 2FA method for this user');
            RETURN result;
          END IF;

          -- Check if user has phone number for SMS method
          IF method = 'phone' AND (user_profile.phone IS NULL OR user_profile.phone = '') THEN
            result := json_build_object('success', false, 'message', 'Phone number not available for SMS 2FA');
            RETURN result;
          END IF;

          -- Generate 6-digit verification code
          verification_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

          -- Invalidate any existing codes for this user
          UPDATE two_factor_codes 
          SET is_valid = false 
          WHERE user_id = user_profile.id AND is_valid = true;

          -- Insert new verification code
          INSERT INTO two_factor_codes (user_id, code, method, expires_at, ip_address, user_agent)
          VALUES (
            user_profile.id,
            verification_code,
            method,
            NOW() + INTERVAL '10 minutes',
            inet_client_addr(),
            current_setting('request.headers', true)::json->>'user-agent'
          );

          result := json_build_object(
            'success', true,
            'message', '2FA code generated successfully',
            'code', verification_code,
            'expires_at', NOW() + INTERVAL '10 minutes',
            'method', method,
            'user_id', user_profile.id
          );
          
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            result := json_build_object('success', false, 'message', 'Database error occurred');
            RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (generateFunctionError) {
      console.error('❌ Error creating generate_2fa_code function:', generateFunctionError);
      throw generateFunctionError;
    }
    console.log('✅ generate_2fa_code function created');

    // Step 5: Create the verify_2fa_code function
    console.log('\n📋 Step 5: Creating verify_2fa_code function...');
    const { error: verifyFunctionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION verify_2fa_code(
          user_email TEXT,
          code VARCHAR(6),
          method VARCHAR(10) DEFAULT 'email'
        )
        RETURNS JSON AS $$
        DECLARE
          user_profile RECORD;
          code_record RECORD;
          result JSON;
        BEGIN
          -- Check if user exists and 2FA is enabled
          SELECT id, email, two_factor_enabled, two_factor_method, failed_2fa_attempts
          INTO user_profile
          FROM profiles
          WHERE email = user_email
          LIMIT 1;

          IF user_profile IS NULL THEN
            result := json_build_object('success', false, 'message', 'User not found');
            RETURN result;
          END IF;

          IF user_profile.two_factor_enabled = false THEN
            result := json_build_object('success', false, 'message', '2FA is not enabled for this user');
            RETURN result;
          END IF;

          -- Check if method matches user's 2FA method
          IF method != user_profile.two_factor_method THEN
            result := json_build_object('success', false, 'message', 'Invalid 2FA method for this user');
            RETURN result;
          END IF;

          -- Check for too many failed attempts (lock for 15 minutes after 5 failed attempts)
          IF user_profile.failed_2fa_attempts >= 5 THEN
            -- Check if 15 minutes have passed since last attempt
            SELECT last_2fa_attempt INTO code_record
            FROM profiles
            WHERE id = user_profile.id;

            IF code_record.last_2fa_attempt IS NOT NULL AND 
               code_record.last_2fa_attempt > NOW() - INTERVAL '15 minutes' THEN
              result := json_build_object(
                'success', false, 
                'message', 'Too many failed attempts. Please try again in 15 minutes.',
                'locked_until', code_record.last_2fa_attempt + INTERVAL '15 minutes'
              );
              RETURN result;
            ELSE
              -- Reset failed attempts after 15 minutes
              UPDATE profiles 
              SET failed_2fa_attempts = 0 
              WHERE id = user_profile.id;
            END IF;
          END IF;

          -- Find valid verification code
          SELECT * INTO code_record
          FROM two_factor_codes
          WHERE user_id = user_profile.id 
            AND code = verify_2fa_code.code
            AND method = verify_2fa_code.method
            AND is_valid = true
            AND expires_at > NOW()
            AND used_at IS NULL
          ORDER BY created_at DESC
          LIMIT 1;

          IF code_record IS NULL THEN
            -- Increment failed attempts
            UPDATE profiles 
            SET 
              failed_2fa_attempts = failed_2fa_attempts + 1,
              last_2fa_attempt = NOW()
            WHERE id = user_profile.id;

            -- Log failed attempt
            INSERT INTO two_factor_attempts (user_id, attempt_type, method, ip_address, user_agent)
            VALUES (user_profile.id, 'failed', method, inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent');

            result := json_build_object('success', false, 'message', 'Invalid or expired verification code');
            RETURN result;
          END IF;

          -- Mark code as used
          UPDATE two_factor_codes 
          SET used_at = NOW() 
          WHERE id = code_record.id;

          -- Reset failed attempts on successful verification
          UPDATE profiles 
          SET 
            failed_2fa_attempts = 0,
            last_2fa_attempt = NOW()
          WHERE id = user_profile.id;

          -- Log successful attempt
          INSERT INTO two_factor_attempts (user_id, attempt_type, method, ip_address, user_agent)
          VALUES (user_profile.id, 'success', method, inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent');

          result := json_build_object(
            'success', true,
            'message', '2FA verification successful',
            'user_id', user_profile.id
          );
          
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            result := json_build_object('success', false, 'message', 'Database error occurred');
            RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (verifyFunctionError) {
      console.error('❌ Error creating verify_2fa_code function:', verifyFunctionError);
      throw verifyFunctionError;
    }
    console.log('✅ verify_2fa_code function created');

    // Step 6: Create other 2FA functions
    console.log('\n📋 Step 6: Creating other 2FA functions...');
    const { error: otherFunctionsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable 2FA function
        CREATE OR REPLACE FUNCTION enable_2fa_for_user(
          user_email TEXT,
          method VARCHAR(10) DEFAULT 'email'
        )
        RETURNS JSON AS $$
        DECLARE
          user_profile RECORD;
          result JSON;
        BEGIN
          -- Check if user exists
          SELECT id, email, two_factor_enabled, phone
          INTO user_profile
          FROM profiles
          WHERE email = user_email
          LIMIT 1;

          IF user_profile IS NULL THEN
            result := json_build_object('success', false, 'message', 'User not found');
            RETURN result;
          END IF;

          -- Check if 2FA is already enabled
          IF user_profile.two_factor_enabled = true THEN
            result := json_build_object('success', false, 'message', '2FA is already enabled for this user');
            RETURN result;
          END IF;

          -- Check if phone number is available for SMS method
          IF method = 'phone' AND (user_profile.phone IS NULL OR user_profile.phone = '') THEN
            result := json_build_object('success', false, 'message', 'Phone number is required for SMS 2FA');
            RETURN result;
          END IF;

          -- Enable 2FA
          UPDATE profiles 
          SET 
            two_factor_enabled = true,
            two_factor_method = method,
            updated_at = NOW()
          WHERE email = user_email;

          result := json_build_object(
            'success', true, 
            'message', '2FA enabled successfully',
            'method', method,
            'user_id', user_profile.id
          );
          
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            result := json_build_object('success', false, 'message', 'Database error occurred');
            RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Disable 2FA function
        CREATE OR REPLACE FUNCTION disable_2fa_for_user(user_email TEXT)
        RETURNS JSON AS $$
        DECLARE
          user_profile RECORD;
          result JSON;
        BEGIN
          -- Check if user exists
          SELECT id, email, two_factor_enabled
          INTO user_profile
          FROM profiles
          WHERE email = user_email
          LIMIT 1;

          IF user_profile IS NULL THEN
            result := json_build_object('success', false, 'message', 'User not found');
            RETURN result;
          END IF;

          -- Check if 2FA is already disabled
          IF user_profile.two_factor_enabled = false THEN
            result := json_build_object('success', false, 'message', '2FA is already disabled for this user');
            RETURN result;
          END IF;

          -- Disable 2FA and clean up
          UPDATE profiles 
          SET 
            two_factor_enabled = false,
            two_factor_method = 'email',
            two_factor_secret = NULL,
            backup_codes = NULL,
            failed_2fa_attempts = 0,
            last_2fa_attempt = NULL,
            updated_at = NOW()
          WHERE email = user_email;

          -- Invalidate all existing codes
          UPDATE two_factor_codes 
          SET is_valid = false 
          WHERE user_id = user_profile.id;

          result := json_build_object(
            'success', true, 
            'message', '2FA disabled successfully',
            'user_id', user_profile.id
          );
          
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            result := json_build_object('success', false, 'message', 'Database error occurred');
            RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Get 2FA status function
        CREATE OR REPLACE FUNCTION get_2fa_status(user_email TEXT)
        RETURNS JSON AS $$
        DECLARE
          user_profile RECORD;
          result JSON;
        BEGIN
          -- Get user profile with 2FA information
          SELECT id, email, two_factor_enabled, two_factor_method, phone
          INTO user_profile
          FROM profiles
          WHERE email = user_email
          LIMIT 1;

          IF user_profile IS NULL THEN
            result := json_build_object('success', false, 'message', 'User not found');
            RETURN result;
          END IF;

          result := json_build_object(
            'success', true,
            'two_factor_enabled', user_profile.two_factor_enabled,
            'two_factor_method', user_profile.two_factor_method,
            'has_phone', user_profile.phone IS NOT NULL AND user_profile.phone != '',
            'user_id', user_profile.id
          );
          
          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            result := json_build_object('success', false, 'message', 'Database error occurred');
            RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (otherFunctionsError) {
      console.error('❌ Error creating other 2FA functions:', otherFunctionsError);
      throw otherFunctionsError;
    }
    console.log('✅ Other 2FA functions created');

    // Step 7: Grant permissions
    console.log('\n📋 Step 7: Granting permissions...');
    const { error: grantError } = await supabase.rpc('exec_sql', {
      sql: `
        GRANT EXECUTE ON FUNCTION generate_2fa_code(TEXT, VARCHAR) TO authenticated;
        GRANT EXECUTE ON FUNCTION verify_2fa_code(TEXT, VARCHAR, VARCHAR) TO authenticated;
        GRANT EXECUTE ON FUNCTION enable_2fa_for_user(TEXT, VARCHAR) TO authenticated;
        GRANT EXECUTE ON FUNCTION disable_2fa_for_user(TEXT) TO authenticated;
        GRANT EXECUTE ON FUNCTION get_2fa_status(TEXT) TO authenticated;
      `
    });

    if (grantError) {
      console.error('❌ Error granting permissions:', grantError);
      throw grantError;
    }
    console.log('✅ Permissions granted');

    // Step 8: Create indexes
    console.log('\n📋 Step 8: Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_profiles_2fa_enabled ON profiles(two_factor_enabled);
        CREATE INDEX IF NOT EXISTS idx_profiles_email_2fa ON profiles(email, two_factor_enabled);
        CREATE INDEX IF NOT EXISTS idx_two_factor_codes_user_id ON two_factor_codes(user_id);
        CREATE INDEX IF NOT EXISTS idx_two_factor_codes_expires_at ON two_factor_codes(expires_at);
        CREATE INDEX IF NOT EXISTS idx_two_factor_codes_valid ON two_factor_codes(is_valid, expires_at);
        CREATE INDEX IF NOT EXISTS idx_two_factor_attempts_user_id ON two_factor_attempts(user_id);
        CREATE INDEX IF NOT EXISTS idx_two_factor_attempts_created_at ON two_factor_attempts(created_at);
      `
    });

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
      throw indexError;
    }
    console.log('✅ Indexes created');

    // Step 9: Enable RLS and create policies
    console.log('\n📋 Step 9: Setting up RLS policies...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE two_factor_codes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE two_factor_attempts ENABLE ROW LEVEL SECURITY;

        -- Policy for two_factor_codes - users can only see their own codes
        DROP POLICY IF EXISTS "Users can view their own 2FA codes" ON two_factor_codes;
        CREATE POLICY "Users can view their own 2FA codes" ON two_factor_codes
          FOR SELECT USING (auth.uid() = user_id);

        -- Policy for two_factor_attempts - users can only see their own attempts
        DROP POLICY IF EXISTS "Users can view their own 2FA attempts" ON two_factor_attempts;
        CREATE POLICY "Users can view their own 2FA attempts" ON two_factor_attempts
          FOR SELECT USING (auth.uid() = user_id);
      `
    });

    if (rlsError) {
      console.error('❌ Error setting up RLS policies:', rlsError);
      throw rlsError;
    }
    console.log('✅ RLS policies created');

    console.log('\n🎉 2FA Database setup completed successfully!');
    console.log('\n📋 What was fixed:');
    console.log('   ✅ Added 2FA columns to profiles table');
    console.log('   ✅ Created two_factor_codes table');
    console.log('   ✅ Created two_factor_attempts table');
    console.log('   ✅ Created all 2FA database functions');
    console.log('   ✅ Granted proper permissions');
    console.log('   ✅ Created performance indexes');
    console.log('   ✅ Set up RLS security policies');
    console.log('\n🔧 You can now test the 2FA functionality!');

  } catch (error) {
    console.error('❌ 2FA Database setup failed:', error);
    process.exit(1);
  }
}

// Run the fix
fix2FADatabase(); 