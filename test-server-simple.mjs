import fetch from 'node-fetch';

// Simple test to verify server is working
async function testServer() {
  console.log('🧪 Testing Server Connection...\n');

  try {
    // Test health endpoint
    console.log('📡 Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:8080/api/health');
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
      return;
    }

    // Test email endpoint with minimal data
    console.log('\n📧 Testing email endpoint...');
    const emailData = {
      to: 'kogoallan593@gmail.com',
      subject: 'Server Test - Living Rock Church Management System',
      template: 'two-factor-auth',
      templateData: {
        SiteURL: 'http://localhost:3000',
        Email: 'kogoallan593@gmail.com',
        UserName: 'Test User',
        Token: '123456',
        RequestTime: new Date().toLocaleString()
      }
    };

    const emailResponse = await fetch('http://localhost:8080/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (emailResponse.ok) {
      const result = await emailResponse.json();
      console.log('✅ Email API test successful:', result);
    } else {
      const errorData = await emailResponse.text();
      console.log('❌ Email API test failed:', emailResponse.status, errorData);
    }

  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    console.log('\n🔧 Make sure the server is running:');
    console.log('   node server.js');
  }
}

testServer(); 