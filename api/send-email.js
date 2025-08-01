// API endpoint for sending emails
// This handles 2FA codes, invitations, and other email notifications

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, template, templateData } = req.body;

    // Validate required fields
    if (!to || !subject || !template) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, template' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    console.log('Email request received:', {
      to,
      subject,
      template,
      templateData
    });

    // Load and process email template
    let emailHtml = '';
    
    try {
      // Load template based on template name
      const templatePath = `./email-templates/${template}.html`;
      const fs = require('fs');
      
      if (fs.existsSync(templatePath)) {
        emailHtml = fs.readFileSync(templatePath, 'utf8');
        
        // Process template variables
        if (templateData) {
          Object.entries(templateData).forEach(([key, value]) => {
            const regex = new RegExp(`{{\\s*\\.${key}\\s*}}`, 'g');
            emailHtml = emailHtml.replace(regex, value);
          });
        }
      } else {
        // Fallback template if file doesn't exist
        emailHtml = `
          <html>
            <body>
              <h2>${subject}</h2>
              <p>Hello ${templateData?.UserName || 'User'},</p>
              ${templateData?.Token ? `<p>Your verification code is: <strong>${templateData.Token}</strong></p>` : ''}
              <p>Best regards,<br>Living Rock Church Management System</p>
            </body>
          </html>
        `;
      }
    } catch (templateError) {
      console.error('Template processing error:', templateError);
      // Use fallback template
      emailHtml = `
        <html>
          <body>
            <h2>${subject}</h2>
            <p>Hello ${templateData?.UserName || 'User'},</p>
            ${templateData?.Token ? `<p>Your verification code is: <strong>${templateData.Token}</strong></p>` : ''}
            <p>Best regards,<br>Living Rock Church Management System</p>
          </body>
        </html>
      `;
    }

    // Send email using SMTP
    const nodemailer = require('nodemailer');
    
    // Configure SMTP transport
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@livingrockchurch.com',
      to: to,
      subject: subject,
      html: emailHtml,
      text: `Hello ${templateData?.UserName || 'User'},\n\nYour verification code is: ${templateData?.Token || 'N/A'}\n\nBest regards,\nLiving Rock Church Management System`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', {
        messageId: info.messageId,
        to,
        subject,
        timestamp: new Date().toISOString()
      });
    } catch (emailError) {
      console.error('📧 Email sending failed:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      emailId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
} 