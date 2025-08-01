import fetch from 'node-fetch';

// Test frontend 2FA integration with backend API
async function testFrontend2FAIntegration() {
  console.log('🧪 Testing Frontend 2FA Integration with Backend API...\n');

  const testEmail = 'kogoallan593@gmail.com';
  const testCode = Math.floor(100000 + Math.random() * 900000).toString();
  const testUserName = 'Test User';

  try {
    // Test the same API call that the frontend makes
    const emailData = {
      to: testEmail,
      subject: 'Frontend 2FA Test - Living Rock Church Management System',
      template: 'two-factor-auth',
      templateData: {
        SiteURL: 'http://localhost:3000',
        Email: testEmail,
        UserName: testUserName,
        Token: testCode,
        RequestTime: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    };

    console.log('📧 Sending test email via frontend API call...');
    console.log('📧 Email data:', JSON.stringify(emailData, null, 2));

    // This simulates the exact API call the frontend makes
    const response = await fetch('http://localhost:8080/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ API call failed:', errorData);
      return;
    }

    const result = await response.json();
    console.log('✅ Frontend API call successful!');
    console.log('📧 API Response:', result);
    console.log('🔐 Test Code:', testCode);
    console.log('\n🎉 Frontend 2FA integration is working correctly!');
    console.log('   The frontend can now send 2FA emails through the backend API.');

  } catch (error) {
    console.error('❌ Frontend integration test failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('   1. Your development server is running on http://localhost:3000');
    console.log('   2. The /api/send-email endpoint is accessible');
    console.log('   3. Gmail SMTP is properly configured');
  }
}

testFrontend2FAIntegration(); 