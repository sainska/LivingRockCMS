import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Test Gmail SMTP for real email delivery
async function testGmail2FA() {
  console.log('🧪 Testing Gmail SMTP for Real Email Delivery...\n');

  // Generate a test 2FA code
  const testCode = Math.floor(100000 + Math.random() * 900000).toString();
  const testUserName = 'Test User';
  const testEmail = 'kogoallan593@gmail.com';
  const requestTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  console.log('📧 Generated test 2FA code:', testCode);
  console.log('📧 Sending to:', testEmail);

  try {
    // Load 2FA email template
    const templatePath = path.join(process.cwd(), 'email-templates', 'two-factor-auth.html');
    let emailHtml = '';

    if (fs.existsSync(templatePath)) {
      emailHtml = fs.readFileSync(templatePath, 'utf8');
      
      // Replace template variables
      const templateData = {
        SiteURL: 'http://localhost:3000',
        Email: testEmail,
        UserName: testUserName,
        Token: testCode,
        RequestTime: requestTime
      };

      Object.entries(templateData).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*\\.${key}\\s*}}`, 'g');
        emailHtml = emailHtml.replace(regex, value);
      });

      console.log('✅ Email template loaded and processed');
    } else {
      console.log('⚠️ Template file not found, using fallback template');
      emailHtml = `
        <html>
          <body>
            <h2>Two-Factor Authentication Code</h2>
            <p>Hello ${testUserName},</p>
            <p>Your verification code is: <strong>${testCode}</strong></p>
            <p>Requested at: ${requestTime}</p>
            <p>Best regards,<br>Living Rock Church Management System</p>
          </body>
        </html>
      `;
    }

    // Gmail SMTP Configuration
    // You'll need to replace these with your actual Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-gmail@gmail.com', // Replace with your Gmail
        pass: 'your-app-password',    // Replace with your Gmail app password
      },
    });

    // Send the email
    const mailOptions = {
      from: 'your-gmail@gmail.com', // Replace with your Gmail
      to: testEmail,
      subject: 'Your 2FA Code - Living Rock Church Management System',
      html: emailHtml,
      text: `Hello ${testUserName},\n\nYour verification code is: ${testCode}\n\nRequested at: ${requestTime}\n\nBest regards,\nLiving Rock Church Management System`
    };

    console.log('📧 Sending 2FA email via Gmail...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ 2FA email sent successfully via Gmail!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 To:', testEmail);
    console.log('🔐 2FA Code:', testCode);
    console.log('\n🎉 Check your Gmail inbox for the 2FA code!');

  } catch (error) {
    console.error('❌ Failed to send 2FA email:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('1. Enable 2-factor authentication on your Gmail account');
    console.log('2. Generate an "App Password" in Gmail settings');
    console.log('3. Replace "your-gmail@gmail.com" and "your-app-password" with your actual credentials');
  }
}

testGmail2FA(); 