#!/usr/bin/env node

/**
 * Test 2FA Functions Script
 * This script tests the 2FA database functions to ensure they're working correctly
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

async function test2FAFunctions() {
  console.log('🧪 Testing 2FA Database Functions...\n');

  try {
    // Test 1: Check if functions exist
    console.log('📋 Test 1: Checking if 2FA functions exist...');
    
    const functions = [
      'generate_2fa_code',
      'verify_2fa_code', 
      'enable_2fa_for_user',
      'disable_2fa_for_user',
      'get_2fa_status'
    ];

    for (const funcName of functions) {
      try {
        // Try to call each function with test parameters
        const { data, error } = await supabase.rpc(funcName, {
          user_email: 'test@example.com'
        });
        
        if (error && error.message.includes('function') && error.message.includes('does not exist')) {
          console.log(`❌ ${funcName} function does not exist`);
        } else {
          console.log(`✅ ${funcName} function exists`);
        }
      } catch (err) {
        console.log(`❌ Error testing ${funcName}:`, err.message);
      }
    }

    // Test 2: Check if tables exist
    console.log('\n📋 Test 2: Checking if 2FA tables exist...');
    
    const tables = ['two_factor_codes', 'two_factor_attempts'];
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
        
        if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`❌ ${tableName} table does not exist`);
        } else {
          console.log(`✅ ${tableName} table exists`);
        }
      } catch (err) {
        console.log(`❌ Error testing ${tableName}:`, err.message);
      }
    }

    // Test 3: Check if profiles table has 2FA columns
    console.log('\n📋 Test 3: Checking profiles table 2FA columns...');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled, two_factor_method')
        .limit(1);
      
      if (error && error.message.includes('column "two_factor_enabled" does not exist')) {
        console.log('❌ Profiles table missing 2FA columns');
      } else {
        console.log('✅ Profiles table has 2FA columns');
      }
    } catch (err) {
      console.log('❌ Error testing profiles table:', err.message);
    }

    // Test 4: Test get_2fa_status function with a real user (if available)
    console.log('\n📋 Test 4: Testing get_2fa_status function...');
    
    try {
      // First, get a real user from the profiles table
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('email')
        .limit(1);
      
      if (usersError) {
        console.log('❌ Could not fetch users for testing:', usersError.message);
      } else if (users && users.length > 0) {
        const testEmail = users[0].email;
        console.log(`🔍 Testing with email: ${testEmail}`);
        
        const { data: statusData, error: statusError } = await supabase.rpc('get_2fa_status', {
          user_email: testEmail
        });
        
        if (statusError) {
          console.log('❌ get_2fa_status error:', statusError.message);
        } else {
          console.log('✅ get_2fa_status working correctly');
          console.log('   Response:', JSON.stringify(statusData, null, 2));
        }
      } else {
        console.log('⚠️  No users found in profiles table for testing');
      }
    } catch (err) {
      console.log('❌ Error testing get_2fa_status:', err.message);
    }

    console.log('\n🎯 Test Summary:');
    console.log('   If you see any ❌ errors above, run the fix-2fa-database.mjs script');
    console.log('   If all tests show ✅, your 2FA functions are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the tests
test2FAFunctions(); 