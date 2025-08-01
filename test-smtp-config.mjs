import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if .env file is being loaded
console.log('🔍 Debug: Environment variables after dotenv.config():');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'Missing');

// Set environment variables directly for testing
process.env.SMTP_HOST = 'sandbox.smtp.mailtrap.io';
process.env.SMTP_PORT = '2525';
process.env.SMTP_USER = '1c668b22e3331f';
process.env.SMTP_PASS = '96b49edccea0c3';
process.env.SMTP_FROM = 'noreply@livingrockchurch.com';
process.env.TEST_EMAIL = 'kogoallan593@gmail.com';

console.log('🔧 Set environment variables directly:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'Missing');

// Test SMTP configuration
async function testSMTPConfig() {
  console.log('🧪 Testing SMTP Configuration...\n');

  // Check environment variables
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = [];

  console.log('📧 Environment Variables Check:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${varName.includes('PASS') ? '***' : value}`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log('\n❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n📋 Please add these to your .env file:');
    console.log('SMTP_HOST=your-smtp-host.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your-email@domain.com');
    console.log('SMTP_PASS=your-password');
    console.log('SMTP_FROM=noreply@yourdomain.com');
    return;
  }

  console.log('\n📧 Testing SMTP Connection...');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    console.log('   🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('   ✅ SMTP connection verified successfully!');

    // Send test email
    console.log('\n📧 Sending test email...');
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: testEmail,
      subject: 'Test Email - Living Rock Church Management System',
      html: `
        <html>
          <body>
            <h2>Test Email</h2>
            <p>Hello!</p>
            <p>This is a test email to verify your SMTP configuration is working correctly.</p>
            <p>If you receive this email, your 2FA system will be able to send verification codes.</p>
            <br>
            <p>Best regards,<br>Living Rock Church Management System</p>
          </body>
        </html>
      `,
      text: 'Test Email - Living Rock Church Management System\n\nHello!\n\nThis is a test email to verify your SMTP configuration is working correctly.\n\nBest regards,\nLiving Rock Church Management System'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('   ✅ Test email sent successfully!');
    console.log('   📧 Message ID:', info.messageId);
    console.log('   📧 To:', testEmail);

    console.log('\n🎉 SMTP configuration is working correctly!');
    console.log('   Your 2FA emails should now be sent successfully.');

  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    console.log('\n🔧 Common SMTP issues:');
    console.log('   1. Check your SMTP credentials');
    console.log('   2. Verify SMTP host and port');
    console.log('   3. Check if your email provider requires "Less secure app access"');
    console.log('   4. Try using an app password instead of your regular password');
  }
}

testSMTPConfig(); 