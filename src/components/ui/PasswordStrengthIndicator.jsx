import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';
import { 
  validatePassword, 
  getPasswordStrengthLabel, 
  getPasswordStrengthColor 
} from '@/utils/passwordValidation';

const PasswordStrengthIndicator = ({ password, confirmPassword = "", userInfo = {} }) => {
  const validation = validatePassword(password);
  const strengthColor = getPasswordStrengthColor(validation.strength);
  const strengthLabel = getPasswordStrengthLabel(validation.strength);
  
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
      icon: password.length >= 8 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
      icon: /[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
      icon: /[a-z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    },
    {
      label: "One number",
      met: /\d/.test(password),
      icon: /\d/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    },
    {
      label: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      icon: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    }
  ];

  // Add password match requirement if confirmPassword is provided
  if (confirmPassword !== undefined) {
    requirements.push({
      label: "Passwords match",
      met: password === confirmPassword && password.length > 0,
      icon: password === confirmPassword && password.length > 0 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    });
  }

  // Check for personal information if userInfo is provided
  if (userInfo.email || userInfo.firstName || userInfo.lastName) {
    const passwordLower = password.toLowerCase();
    let hasPersonalInfo = false;
    
    if (userInfo.email) {
      const emailParts = userInfo.email.toLowerCase().split('@')[0];
      if (passwordLower.includes(emailParts) && emailParts.length > 3) {
        hasPersonalInfo = true;
      }
    }
    
    if (userInfo.firstName) {
      const firstName = userInfo.firstName.toLowerCase();
      if (passwordLower.includes(firstName) && firstName.length > 2) {
        hasPersonalInfo = true;
      }
    }
    
    if (userInfo.lastName) {
      const lastName = userInfo.lastName.toLowerCase();
      if (passwordLower.includes(lastName) && lastName.length > 2) {
        hasPersonalInfo = true;
      }
    }

    requirements.push({
      label: "No personal information",
      met: !hasPersonalInfo,
      icon: !hasPersonalInfo ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
    });
  }

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Password Strength:</span>
          <span className={`font-medium ${strengthColor}`}>
            {strengthLabel}
          </span>
        </div>
        <Progress 
          value={validation.strength} 
          className="h-2"
          style={{
            '--progress-background': strengthColor === 'text-red-500' ? '#ef4444' :
                                   strengthColor === 'text-orange-500' ? '#f97316' :
                                   strengthColor === 'text-yellow-500' ? '#eab308' :
                                   strengthColor === 'text-blue-500' ? '#3b82f6' : '#22c55e'
          }}
        />
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Requirements:</p>
        <div className="space-y-1">
          {requirements.map((requirement, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 text-xs ${
                requirement.met ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span className={`${requirement.met ? 'text-green-600' : 'text-red-600'}`}>
                {requirement.icon}
              </span>
              <span>{requirement.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Messages */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-600">Issues to fix:</p>
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-red-600">
                <X className="h-3 w-3" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator; 