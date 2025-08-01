import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testComplete2FASystem() {
  console.log('🧪 Testing Complete 2FA System with Email...\n');

  // Step 1: Check SMTP Configuration
  console.log('📧 Step 1: Checking SMTP Configuration');
  const smtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingSmtp = smtpVars.filter(varName => !process.env[varName]);
  
  if (missingSmtp.length > 0) {
    console.log('❌ Missing SMTP environment variables:', missingSmtp.join(', '));
    console.log('📋 Please add these to your .env file:');
    console.log('SMTP_HOST=your-smtp-host.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your-email@domain.com');
    console.log('SMTP_PASS=your-password');
    console.log('SMTP_FROM=noreply@yourdomain.com');
    return;
  }
  console.log('✅ SMTP configuration found');

  // Step 2: Test SMTP Connection
  console.log('\n📧 Step 2: Testing SMTP Connection');
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return;
  }

  // Step 3: Find a test user
  console.log('\n👤 Step 3: Finding test user');
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name')
    .limit(1);

  if (userError) {
    console.error('❌ Error fetching user:', userError.message);
    return;
  }

  if (!userData || userData.length === 0) {
    console.log('❌ No users found in profiles table');
    return;
  }

  const testUser = userData[0];
  console.log('✅ Found test user:', testUser.email);

  // Step 4: Assign 2FA code
  console.log('\n🔐 Step 4: Assigning 2FA code');
  const { data: codeData, error: codeError } = await supabase.rpc('assign_2fa_code', {
    user_email: testUser.email
  });

  if (codeError) {
    console.error('❌ Error assigning 2FA code:', codeError.message);
    return;
  }

  if (!codeData.success) {
    console.error('❌ 2FA code assignment failed:', codeData.message);
    return;
  }

  console.log('✅ 2FA code assigned successfully');
  console.log('   Code:', codeData.code);
  console.log('   User:', codeData.user_name);
  console.log('   Expires:', codeData.expires_at);

  // Step 5: Send email via API
  console.log('\n📧 Step 5: Sending email via API');
  const emailData = {
    to: testUser.email,
    subject: '2FA Verification Code - Living Rock Church Management System',
    template: 'two-factor-auth',
    templateData: {
      SiteURL: 'http://localhost:3000',
      Email: testUser.email,
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
      console.error('❌ Email API error:', errorData);
      return;
    }

    const emailResult = await response.json();
    console.log('✅ Email sent successfully via API');
    console.log('   Email ID:', emailResult.emailId);

  } catch (apiError) {
    console.error('❌ Email API call failed:', apiError.message);
    console.log('   Make sure your development server is running on http://localhost:3000');
    return;
  }

  // Step 6: Verify 2FA code
  console.log('\n🔍 Step 6: Verifying 2FA code');
  const { data: verifyData, error: verifyError } = await supabase.rpc('verify_and_use_2fa_code', {
    user_email: testUser.email,
    code: codeData.code
  });

  if (verifyError) {
    console.error('❌ Error verifying 2FA code:', verifyError.message);
    return;
  }

  if (!verifyData.success) {
    console.error('❌ 2FA verification failed:', verifyData.message);
    return;
  }

  console.log('✅ 2FA verification successful');
  console.log('   User:', verifyData.user_name);
  console.log('   Used at:', verifyData.used_at);

  // Step 7: Check system stats
  console.log('\n📊 Step 7: Checking system stats');
  const { data: statsData, error: statsError } = await supabase.rpc('get_2fa_system_stats');

  if (statsError) {
    console.error('❌ Error getting stats:', statsError.message);
    return;
  }

  console.log('✅ System stats:', statsData);

  console.log('\n🎉 Complete 2FA System Test Results:');
  console.log('   ✅ SMTP Configuration: Working');
  console.log('   ✅ Database Functions: Working');
  console.log('   ✅ Email API: Working');
  console.log('   ✅ 2FA Code Assignment: Working');
  console.log('   ✅ Email Sending: Working');
  console.log('   ✅ 2FA Code Verification: Working');
  console.log('   ✅ System Statistics: Working');
  console.log('\n📧 Check your email inbox for the 2FA verification code!');
}

testComplete2FASystem(); 