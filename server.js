import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Email template loading function
function loadEmailTemplate(templateName) {
  try {
    const templatePath = path.join(__dirname, 'email-templates', `${templateName}.html`);
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }
    return null;
  } catch (error) {
    console.error('Error loading template:', error);
    return null;
  }
}

// Process template variables
function processTemplate(template, variables) {
  let processedTemplate = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*\\.${key}\\s*}}`, 'g');
    processedTemplate = processedTemplate.replace(regex, value);
  });
  return processedTemplate;
}

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
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
      const templateContent = loadEmailTemplate(template);
      
      if (templateContent) {
        emailHtml = processTemplate(templateContent, templateData);
        console.log('✅ Email template loaded and processed');
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
        console.log('⚠️ Template file not found, using fallback template');
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

    // Create Gmail SMTP transporter with improved settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'kogoallan593@gmail.com',
        pass: 'ciku oxwp ikup cmxa',
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Enable debug output
      logger: true // Log to console
    });

    // Send the email with improved headers
    const mailOptions = {
      from: '"Living Rock Church" <kogoallan593@gmail.com>',
      to: to,
      subject: subject,
      html: emailHtml,
      text: `Hello ${templateData?.UserName || 'User'},\n\nYour verification code is: ${templateData?.Token || 'N/A'}\n\nBest regards,\nLiving Rock Church Management System`,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject,
      timestamp: new Date().toISOString()
    });

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
});

// SMS sending endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message, from = 'LivingRock', template } = req.body;

    if (!to || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: to and message are required' 
      });
    }

    console.log('SMS Request:', { to, message, from, template });

    // For now, we'll use email as a fallback for SMS
    // In production, integrate with actual SMS services like Africa's Talking or Twilio
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Living Rock Church - SMS Notification</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>To:</strong> ${to}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
            ${message}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            This is a development fallback. In production, this would be sent as an actual SMS.
          </p>
        </div>
      </div>
    `;

    // Create Gmail SMTP transporter with improved settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'kogoallan593@gmail.com',
        pass: 'ciku oxwp ikup cmxa',
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Enable debug output
      logger: true // Log to console
    });

    // Send the SMS notification via email
    const mailOptions = {
      from: '"Living Rock Church" <kogoallan593@gmail.com>',
      to: 'kogoallan593@gmail.com', // Admin email to receive SMS notifications
      subject: `SMS to ${to} - Living Rock Church`,
      html: emailHtml
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📱 SMS notification sent via email:', {
      messageId: info.messageId,
      to,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'SMS sent successfully (via email fallback)',
      data: {
        messageId: info.messageId,
        fallback: true
      }
    });

  } catch (error) {
    console.error('SMS API Error:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📧 Email endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`📱 SMS endpoint: http://localhost:${PORT}/api/send-sms`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
}); 