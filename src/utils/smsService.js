/**
 * SMS Service for Living Rock Church Management System
 * Handles SMS verification codes and notifications
 */

/**
 * Send 2FA verification code via SMS
 * @param {string} phone - User's phone number
 * @param {string} code - 6-digit verification code
 * @param {string} userName - User's name
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
export const send2FAVerificationSMS = async (phone, code, userName) => {
  try {
    console.log('Sending 2FA verification SMS to:', phone, 'for user:', userName);
    
    // Prepare SMS data
    const smsData = {
      to: phone,
      message: `Living Rock Church 2FA Code: ${code}. Valid for 10 minutes. Do not share this code.`,
      from: 'LivingRock', // Your SMS sender ID
      template: '2fa-verification'
    };

    // Call the SMS API endpoint
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send SMS');
    }
    
    const result = await response.json();
    console.log('2FA SMS sent successfully:', result);
    
    return { success: true, message: '2FA verification SMS sent successfully' };
  } catch (error) {
    console.error('Error sending 2FA verification SMS:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification SMS
 * @param {string} phone - User's phone number
 * @param {string} message - SMS message content
 * @param {string} from - Sender ID
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
export const sendNotificationSMS = async (phone, message, from = 'LivingRock') => {
  try {
    const smsData = {
      to: phone,
      message: message,
      from: from
    };

    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send SMS');
    }
    
    const result = await response.json();
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('Error sending notification SMS:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic phone number validation (can be enhanced based on your needs)
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number for display
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  return phone; // Return original if no pattern matches
}; 