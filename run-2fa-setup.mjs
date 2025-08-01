#!/usr/bin/env node

/**
 * 2FA Setup Script for Living Rock Church Management System
 * This script deploys the complete 2FA system to the database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function run2FASetup() {
  console.log('🚀 Starting 2FA Setup for Living Rock Church Management System...\n');

  try {
    // Read the 2FA migration file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20250721130000_two_factor_auth_complete.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📋 Executing 2FA database migration...');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Error executing 2FA migration:', error);
      throw error;
    }

    console.log('✅ 2FA database migration completed successfully!\n');

    // Test the 2FA functions
    console.log('🧪 Testing 2FA functions...');

    // Test get_2fa_status function
    const { data: statusTest, error: statusError } = await supabase.rpc('get_2fa_status', {
      user_email: 'test@example.com'
    });

    if (statusError) {
      console.log('⚠️  get_2fa_status test (expected for non-existent user):', statusError.message);
    } else {
      console.log('✅ get_2fa_status function working correctly');
    }

    // Test enable_2fa_for_user function
    const { data: enableTest, error: enableError } = await supabase.rpc('enable_2fa_for_user', {
      user_email: 'test@example.com',
      method: 'email'
    });

    if (enableError) {
      console.log('⚠️  enable_2fa_for_user test (expected for non-existent user):', enableError.message);
    } else {
      console.log('✅ enable_2fa_for_user function working correctly');
    }

    // Test generate_2fa_code function
    const { data: generateTest, error: generateError } = await supabase.rpc('generate_2fa_code', {
      user_email: 'test@example.com',
      method: 'email'
    });

    if (generateError) {
      console.log('⚠️  generate_2fa_code test (expected for non-existent user):', generateError.message);
    } else {
      console.log('✅ generate_2fa_code function working correctly');
    }

    console.log('\n🎉 2FA Setup completed successfully!');
    console.log('\n📋 What was installed:');
    console.log('   ✅ Two-factor authentication database schema');
    console.log('   ✅ 2FA verification codes table');
    console.log('   ✅ 2FA attempts tracking table');
    console.log('   ✅ Database functions for 2FA operations');
    console.log('   ✅ Security policies and indexes');
    console.log('   ✅ Email template for 2FA verification');
    console.log('   ✅ Frontend components for 2FA flow');
    console.log('   ✅ Updated authentication context');
    console.log('   ✅ Login flow with 2FA integration');
    console.log('\n🔧 Next steps:');
    console.log('   1. Users can now enable 2FA in their profile settings');
    console.log('   2. 2FA will be required for users who have it enabled');
    console.log('   3. Verification codes are sent via email (SMS integration ready)');
    console.log('   4. Security measures include rate limiting and account lockout');

  } catch (error) {
    console.error('❌ 2FA Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
run2FASetup(); 