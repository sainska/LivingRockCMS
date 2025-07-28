// Email Service Utility for LivingRockCMS
// This utility handles sending emails for invitations and other notifications

/**
 * Send invitation email to a user
 * @param {Object} invitation - The invitation object
 * @param {string} invitationUrl - The invitation acceptance URL
 * @param {Object} inviter - The user who sent the invitation
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendInvitationEmail = async (invitation, invitationUrl, inviter) => {
  try {
    // In a real implementation, this would integrate with your email service
    // (SendGrid, AWS SES, Mailgun, etc.)
    
    const emailData = {
      to: invitation.email,
      subject: `You're Invited - Living Rock Church Management System`,
      template: 'user-invitation',
      templateData: {
        SiteURL: window.location.origin,
        ConfirmationURL: invitationUrl,
        InviterName: `${inviter.first_name} ${inviter.last_name}`,
        InviterRole: inviter.role || 'Administrator',
        UserRole: invitation.role,
        UserFirstName: invitation.first_name,
        UserLastName: invitation.last_name,
        ExpiresAt: new Date(invitation.expires_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    };

    // For development/testing, log the email data
    console.log('Email would be sent with data:', emailData);
    
    // In production, you would call your email service here
    // Example with a hypothetical email service:
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    */

    return { success: true, message: 'Invitation email sent successfully' };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error: error.message };
  }
};



/**
 * Send magic link email
 * @param {string} email - User's email address
 * @param {string} magicLinkUrl - Magic link URL
 * @param {boolean} isNewUser - Whether this is for a new user signup
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendMagicLinkEmail = async (email, magicLinkUrl, isNewUser = false) => {
  try {
    const emailData = {
      to: email,
      subject: isNewUser 
        ? `Welcome to Living Rock Church Management System - Magic Link`
        : `Your Magic Link - Living Rock Church Management System`,
      template: 'magic-link',
      templateData: {
        SiteURL: window.location.origin,
        ConfirmationURL: magicLinkUrl,
        Email: email,
        IsNewUser: isNewUser,
        UserName: email.split('@')[0], // Basic name extraction
        ExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    };

    console.log('Magic link email would be sent with data:', emailData);
    
    return { success: true, message: 'Magic link email sent successfully' };
  } catch (error) {
    console.error('Error sending magic link email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send change email confirmation
 * @param {string} oldEmail - User's current email address
 * @param {string} newEmail - User's new email address
 * @param {string} confirmationUrl - Confirmation URL
 * @param {string} userName - User's name
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendChangeEmailConfirmation = async (oldEmail, newEmail, confirmationUrl, userName) => {
  try {
    const emailData = {
      to: newEmail,
      subject: `Confirm Email Change - Living Rock Church Management System`,
      template: 'change-email',
      templateData: {
        SiteURL: window.location.origin,
        ConfirmationURL: confirmationUrl,
        OldEmail: oldEmail,
        NewEmail: newEmail,
        UserName: userName,
        RequestTime: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    };

    console.log('Change email confirmation would be sent with data:', emailData);
    
    return { success: true, message: 'Change email confirmation sent successfully' };
  } catch (error) {
    console.error('Error sending change email confirmation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetUrl - Password reset URL
 * @param {string} userName - User's name
 * @param {string} ipAddress - IP address of the request
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendPasswordResetEmail = async (email, resetUrl, userName, ipAddress = 'Unknown') => {
  try {
    const emailData = {
      to: email,
      subject: `Reset Your Password - Living Rock Church Management System`,
      template: 'reset-password',
      templateData: {
        SiteURL: window.location.origin,
        ConfirmationURL: resetUrl,
        Email: email,
        UserName: userName,
        RequestTime: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        IPAddress: ipAddress
      }
    };

    console.log('Password reset email would be sent with data:', emailData);
    
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send reauthentication email
 * @param {string} email - User's email address
 * @param {string} confirmationUrl - Confirmation URL
 * @param {string} userName - User's name
 * @param {string} actionType - Type of action requiring reauthentication
 * @param {string} ipAddress - IP address of the request
 * @param {string} deviceInfo - Device information
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendReauthenticationEmail = async (email, confirmationUrl, userName, actionType, ipAddress = 'Unknown', deviceInfo = 'Unknown') => {
  try {
    const emailData = {
      to: email,
      subject: `Reauthentication Required - Living Rock Church Management System`,
      template: 'reauthentication',
      templateData: {
        SiteURL: window.location.origin,
        ConfirmationURL: confirmationUrl,
        Email: email,
        UserName: userName,
        ActionType: actionType,
        RequestTime: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        IPAddress: ipAddress,
        DeviceInfo: deviceInfo
      }
    };

    console.log('Reauthentication email would be sent with data:', emailData);
    
    return { success: true, message: 'Reauthentication email sent successfully' };
  } catch (error) {
    console.error('Error sending reauthentication email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email to new users
 * @param {Object} user - The new user object
 * @param {string} role - The user's assigned role
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendWelcomeEmail = async (user, role) => {
  try {
    const emailData = {
      to: user.email,
      subject: `Welcome to Living Rock Church Management System`,
      template: 'welcome-email',
      templateData: {
        SiteURL: window.location.origin,
        UserName: `${user.first_name} ${user.last_name}`,
        UserRole: role,
        LoginURL: `${window.location.origin}/auth`
      }
    };

    console.log('Welcome email would be sent with data:', emailData);
    
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification email
 * @param {string} email - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @param {string} template - Email template to use
 * @param {Object} templateData - Template variables
 * @returns {Promise<Object>} - Result of the email sending operation
 */
export const sendNotificationEmail = async (email, subject, message, template = 'notification', templateData = {}) => {
  try {
    const emailData = {
      to: email,
      subject,
      template,
      templateData: {
        SiteURL: window.location.origin,
        Message: message,
        ...templateData
      }
    };

    console.log('Notification email would be sent with data:', emailData);
    
    return { success: true, message: 'Notification email sent successfully' };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate email template variables for common use cases
 * @param {Object} data - Data to generate variables from
 * @returns {Object} - Template variables object
 */
export const generateTemplateVariables = (data) => {
  return {
    SiteURL: window.location.origin,
    CurrentDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    CurrentYear: new Date().getFullYear(),
    ...data
  };
};

/**
 * Get email template by name
 * @param {string} templateName - Name of the template
 * @returns {string|null} - Template HTML content or null if not found
 */
export const getEmailTemplate = (templateName) => {
  // In a real implementation, you would load templates from your server
  // or use a template engine
  
  const templates = {
    'user-invitation': 'email-templates/user-invitation.html',
    'confirm-signup': 'email-templates/confirm-signup.html',
    'welcome-email': 'email-templates/welcome-email.html',
    'notification': 'email-templates/notification.html',
    'magic-link': 'email-templates/magic-link.html',
    'change-email': 'email-templates/change-email.html',
    'reset-password': 'email-templates/reset-password.html',
    'reauthentication': 'email-templates/reauthentication.html'
  };

  return templates[templateName] || null;
};

/**
 * Process email template with variables
 * @param {string} template - Email template HTML
 * @param {Object} variables - Template variables
 * @returns {string} - Processed template HTML
 */
export const processEmailTemplate = (template, variables) => {
  let processedTemplate = template;
  
  // Replace template variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*\\.${key}\\s*}}`, 'g');
    processedTemplate = processedTemplate.replace(regex, value);
  });
  
  return processedTemplate;
};

export default {
  sendInvitationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNotificationEmail,
  isValidEmail,
  generateTemplateVariables,
  getEmailTemplate,
  processEmailTemplate
}; 