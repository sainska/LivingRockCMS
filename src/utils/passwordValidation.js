// Password validation utility for Living Rock CMS

/**
 * Validates password strength and requirements
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
  const errors = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculates password strength score (0-100)
 * @param {string} password - The password to evaluate
 * @returns {number} - Strength score from 0 to 100
 */
export const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Base score for length
  score += Math.min(password.length * 4, 40);
  
  // Bonus for character variety
  if (/[A-Z]/.test(password)) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Bonus for mixed case
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 10;
  
  // Bonus for numbers and letters
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) score += 10;
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 10; // Common sequences
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Gets password strength label
 * @param {number} strength - Password strength score
 * @returns {string} - Strength label
 */
export const getPasswordStrengthLabel = (strength) => {
  if (strength < 30) return "Very Weak";
  if (strength < 50) return "Weak";
  if (strength < 70) return "Fair";
  if (strength < 90) return "Good";
  return "Strong";
};

/**
 * Gets password strength color
 * @param {number} strength - Password strength score
 * @returns {string} - CSS color class
 */
export const getPasswordStrengthColor = (strength) => {
  if (strength < 30) return "text-red-500";
  if (strength < 50) return "text-orange-500";
  if (strength < 70) return "text-yellow-500";
  if (strength < 90) return "text-blue-500";
  return "text-green-500";
};

/**
 * Validates that password doesn't contain personal information
 * @param {string} password - The password to validate
 * @param {object} userInfo - User information to check against
 * @returns {object} - Validation result
 */
export const validatePasswordPersonalInfo = (password, userInfo = {}) => {
  const errors = [];
  const passwordLower = password.toLowerCase();
  
  // Check for email parts
  if (userInfo.email) {
    const emailParts = userInfo.email.toLowerCase().split('@')[0];
    if (passwordLower.includes(emailParts) && emailParts.length > 3) {
      errors.push("Password should not contain your email username");
    }
  }
  
  // Check for name parts
  if (userInfo.firstName) {
    const firstName = userInfo.firstName.toLowerCase();
    if (passwordLower.includes(firstName) && firstName.length > 2) {
      errors.push("Password should not contain your first name");
    }
  }
  
  if (userInfo.lastName) {
    const lastName = userInfo.lastName.toLowerCase();
    if (passwordLower.includes(lastName) && lastName.length > 2) {
      errors.push("Password should not contain your last name");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Checks if password matches confirmation
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {boolean} - True if passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Comprehensive password validation
 * @param {string} password - The password to validate
 * @param {string} confirmPassword - The confirmation password
 * @param {object} userInfo - User information for personal info check
 * @returns {object} - Complete validation result
 */
export const validatePasswordComplete = (password, confirmPassword, userInfo = {}) => {
  const basicValidation = validatePassword(password);
  const personalInfoValidation = validatePasswordPersonalInfo(password, userInfo);
  const matchValidation = passwordsMatch(password, confirmPassword);
  
  const allErrors = [
    ...basicValidation.errors,
    ...personalInfoValidation.errors,
    ...(matchValidation ? [] : ["Passwords do not match"])
  ];
  
  return {
    isValid: basicValidation.isValid && personalInfoValidation.isValid && matchValidation,
    errors: allErrors,
    strength: basicValidation.strength,
    strengthLabel: getPasswordStrengthLabel(basicValidation.strength),
    strengthColor: getPasswordStrengthColor(basicValidation.strength)
  };
}; 