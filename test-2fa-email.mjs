import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set environment variables directly for testing
process.env.VITE_SUPABASE_URL = 'https://xxfsnejccbszsjmtwnvj.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'your-anon-key-here';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.error('\nPlease set these environment variables and try again.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test2FAEmail() {
  try {
    console.log('🧪 Testing 2FA Email System...\n');

    // Test 1: Check if user exists
    console.log('📧 Test 1: Check if user exists');
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .limit(1);

    if (userError) {
      console.log('❌ Error fetching user:', userError.message);
      return;
    }

    if (!userData || userData.length === 0) {
      console.log('❌ No users found in profiles table');
      return;
    }

    const testUser = userData[0];
    console.log('✅ Found user:', testUser.email);

    // Test 2: Assign 2FA code
    console.log('\n📧 Test 2: Assign 2FA code');
    const { data: codeData, error: codeError } = await supabase.rpc('assign_2fa_code', {
      user_email: testUser.email
    });

    if (codeError) {
      console.log('❌ Error assigning 2FA code:', codeError.message);
      return;
    }

    if (!codeData.success) {
      console.log('❌ 2FA code assignment failed:', codeData.message);
      return;
    }

    console.log('✅ 2FA code assigned successfully');
    console.log('   Code:', codeData.code);
    console.log('   User:', codeData.user_name);
    console.log('   Expires:', codeData.expires_at);

    // Test 3: Test email sending via API
    console.log('\n📧 Test 3: Test email sending via API');
    const emailData = {
      to: 'kogoallan593@gmail.com', // Use your email for testing
      subject: 'Test 2FA Email - Living Rock Church Management System',
      template: 'two-factor-auth',
      templateData: {
        SiteURL: 'http://localhost:3000',
        Email: 'kogoallan593@gmail.com',
        UserName: codeData.user_name,
        Token: codeData.code,
        RequestTime: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    };

    try {
      const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ Email API error:', errorData);
        return;
      }

      const emailResult = await response.json();
      console.log('✅ Email API response:', emailResult);

    } catch (apiError) {
      console.log('❌ Email API call failed:', apiError.message);
      console.log('   Make sure your development server is running on http://localhost:3000');
    }

    // Test 4: Verify 2FA code
    console.log('\n📧 Test 4: Verify 2FA code');
    const { data: verifyData, error: verifyError } = await supabase.rpc('verify_and_use_2fa_code', {
      user_email: testUser.email,
      code: codeData.code
    });

    if (verifyError) {
      console.log('❌ Error verifying 2FA code:', verifyError.message);
      return;
    }

    if (!verifyData.success) {
      console.log('❌ 2FA verification failed:', verifyData.message);
      return;
    }

    console.log('✅ 2FA verification successful');
    console.log('   User:', verifyData.user_name);
    console.log('   Used at:', verifyData.used_at);

    // Test 5: Check system stats
    console.log('\n📧 Test 5: Check system stats');
    const { data: statsData, error: statsError } = await supabase.rpc('get_2fa_system_stats');

    if (statsError) {
      console.log('❌ Error getting stats:', statsError.message);
      return;
    }

    console.log('✅ System stats:', statsData);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test2FAEmail(); 