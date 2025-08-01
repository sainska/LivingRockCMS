#!/usr/bin/env node

/**
 * Quick 2FA Test Script
 * This script tests if the 2FA functions are working
 */

import { createClient } from '@supabase/supabase-js';

// Use the existing Supabase configuration
const SUPABASE_URL = "https://xxfsnejccbszsjmtwnvj.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "YOUR_ANON_KEY_HERE";

if (SUPABASE_ANON_KEY === "YOUR_ANON_KEY_HERE") {
  console.log('❌ Please set your Supabase anon key:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Go to Settings > API');
  console.log('3. Copy the "anon" key');
  console.log('4. Set it as environment variable: VITE_SUPABASE_ANON_KEY=your_key_here');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test2FAFunctions() {
  console.log('🧪 Testing 2FA Functions...\n');

  try {
    // Step 1: Get a real user from the database
    console.log('📋 Step 1: Getting a test user...');
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('email')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Could not fetch users:', usersError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('❌ No users found in the database');
      return;
    }
    
    const testEmail = users[0].email;
    console.log(`✅ Found test user: ${testEmail}`);

    // Step 2: Test generate_2fa_code function
    console.log('\n📋 Step 2: Testing generate_2fa_code function...');
    
    try {
      const { data: codeData, error: codeError } = await supabase.rpc('generate_2fa_code', {
        user_email: testEmail,
        method: 'email'
      });
      
      if (codeError) {
        console.log('❌ generate_2fa_code failed:', codeError.message);
        return;
      }
      
      console.log('✅ generate_2fa_code function works!');
      console.log('   Response:', JSON.stringify(codeData, null, 2));
      
      if (codeData.success && codeData.code) {
        console.log(`   Generated code: ${codeData.code}`);
        
        // Step 3: Test verify_2fa_code function
        console.log('\n📋 Step 3: Testing verify_2fa_code function...');
        
        const { data: verifyData, error: verifyError } = await supabase.rpc('verify_2fa_code', {
          user_email: testEmail,
          code: codeData.code,
          method: 'email'
        });
        
        if (verifyError) {
          console.log('❌ verify_2fa_code failed:', verifyError.message);
        } else {
          console.log('✅ verify_2fa_code function works!');
          console.log('   Response:', JSON.stringify(verifyData, null, 2));
        }
      }
      
    } catch (err) {
      console.log('❌ Error testing generate_2fa_code:', err.message);
    }

    console.log('\n🎯 Test Summary:');
    console.log('   If you see ✅ above, the 2FA functions are working correctly!');
    console.log('   If you see ❌ errors, the database functions need to be created.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
test2FAFunctions(); 