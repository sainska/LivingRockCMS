import fetch from 'node-fetch';

// Verify 2FA system components
async function verify2FASystem() {
  console.log('🔍 Verifying 2FA System Components...\n');

  const checks = [];

  // Check 1: Backend server health
  try {
    console.log('1️⃣ Checking backend server...');
    const healthResponse = await fetch('http://localhost:8080/api/health');
    if (healthResponse.ok) {
      console.log('   ✅ Backend server is running');
      checks.push('Backend Server');
    } else {
      console.log('   ❌ Backend server not responding');
    }
  } catch (error) {
    console.log('   ❌ Backend server not accessible');
  }

  // Check 2: Frontend server
  try {
    console.log('2️⃣ Checking frontend server...');
    const frontendResponse = await fetch('http://localhost:3000');
    if (frontendResponse.ok) {
      console.log('   ✅ Frontend server is running');
      checks.push('Frontend Server');
    } else {
      console.log('   ❌ Frontend server not responding');
    }
  } catch (error) {
    console.log('   ❌ Frontend server not accessible');
  }

  // Check 3: Email API
  try {
    console.log('3️⃣ Testing email API...');
    const emailData = {
      to: 'kogoallan593@gmail.com',
      subject: '2FA System Verification Test',
      template: 'two-factor-auth',
      templateData: {
        SiteURL: 'http://localhost:3000',
        Email: 'kogoallan593@gmail.com',
        UserName: 'System Test',
        Token: '999999',
        RequestTime: new Date().toLocaleString()
      }
    };

    const emailResponse = await fetch('http://localhost:8080/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (emailResponse.ok) {
      const result = await emailResponse.json();
      console.log('   ✅ Email API is working');
      console.log('   📧 Email sent successfully');
      checks.push('Email API');
    } else {
      console.log('   ❌ Email API failed');
    }
  } catch (error) {
    console.log('   ❌ Email API not accessible');
  }

  // Summary
  console.log('\n📊 System Status:');
  console.log(`   Components working: ${checks.length}/3`);
  
  if (checks.length === 3) {
    console.log('\n🎉 2FA System is fully operational!');
    console.log('   You can now test the complete 2FA flow.');
  } else {
    console.log('\n⚠️ Some components need attention:');
    console.log('   Make sure both servers are running:');
    console.log('   - Backend: node server.js (port 8080)');
    console.log('   - Frontend: npm run dev (port 3000)');
  }
}

verify2FASystem(); 