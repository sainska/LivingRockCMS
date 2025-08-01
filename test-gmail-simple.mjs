import nodemailer from 'nodemailer';

// Gmail SMTP Test - Simple Version
async function testGmailSMTP() {
  console.log('🧪 Testing Gmail SMTP for Real Email Delivery...\n');

  // ⚠️ GMAIL CREDENTIALS CONFIGURED ⚠️
  const GMAIL_USER = 'kogoallan593@gmail.com';        // Your Gmail
  const GMAIL_APP_PASSWORD = 'ciku oxwp ikup cmxa';   // Your 16-character app password
  
  const testEmail = 'kogoallan593@gmail.com';
  const testCode = Math.floor(100000 + Math.random() * 900000).toString();

  console.log('📧 Generated test 2FA code:', testCode);
  console.log('📧 Sending to:', testEmail);
  console.log('📧 From Gmail:', GMAIL_USER);

  try {
    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    // Send test email
    const mailOptions = {
      from: GMAIL_USER,
      to: testEmail,
      subject: '2FA Test - Living Rock Church Management System',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">🔐 Two-Factor Authentication Test</h2>
            <p>Hello!</p>
            <p>This is a test email to verify Gmail SMTP is working correctly.</p>
            <p><strong>Your test 2FA code is: <span style="color: #007bff; font-size: 24px;">${testCode}</span></strong></p>
            <p>If you receive this email, your 2FA system will work perfectly!</p>
            <br>
            <p>Best regards,<br>Living Rock Church Management System</p>
          </body>
        </html>
      `,
      text: `2FA Test - Living Rock Church Management System\n\nHello!\n\nThis is a test email to verify Gmail SMTP is working correctly.\n\nYour test 2FA code is: ${testCode}\n\nIf you receive this email, your 2FA system will work perfectly!\n\nBest regards,\nLiving Rock Church Management System`
    };

    console.log('📧 Sending test email via Gmail...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully via Gmail!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 To:', testEmail);
    console.log('🔐 Test Code:', testCode);
    console.log('\n🎉 Check your Gmail inbox for the test email!');

  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.log('\n🔧 Common Gmail SMTP issues:');
    console.log('1. Make sure 2-Factor Authentication is enabled on your Gmail account');
    console.log('2. Generate an App Password (not your regular password)');
    console.log('3. Replace GMAIL_USER and GMAIL_APP_PASSWORD with your actual credentials');
    console.log('4. Make sure "Less secure app access" is not required (use App Password instead)');
  }
}

testGmailSMTP(); 