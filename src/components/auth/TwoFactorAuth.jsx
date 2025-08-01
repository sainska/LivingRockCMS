import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Mail, Smartphone, ArrowLeft, RefreshCw, Lock, CheckCircle, AlertCircle, User, Phone, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TwoFactorAuth = ({ 
  email, 
  method = 'email', 
  userName, 
  onVerificationSuccess,
  onBack 
}) => {
  const navigate = useNavigate();
  const { verify2FACode, send2FACode, getUserRole, getDashboardRoute } = useAuth();
  const { toast } = useToast();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(method);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showMethodSelection, setShowMethodSelection] = useState(false);

  // Load user profile and check available methods
  useEffect(() => {
    loadUserProfile();
  }, [email]);

  // Auto-send code on component mount (only if no method selection needed)
  useEffect(() => {
    if (userProfile && !showMethodSelection) {
      sendCode();
    }
  }, [userProfile, showMethodSelection]);

  // Auto-focus first input when component is ready
  useEffect(() => {
    if (!isLoadingProfile && !showMethodSelection) {
      setTimeout(() => {
        const firstInput = document.querySelector('input[data-index="0"]');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [isLoadingProfile, showMethodSelection]);

  // Handle lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setIsLocked(false);
          setLockoutTime(null);
          setAttempts(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutTime]);

  const loadUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, two_factor_enabled, two_factor_method')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      } else {
        setUserProfile(data);
        // Always show method selection if user has both options
        if (data.phone && data.email) {
          setShowMethodSelection(true);
          // Default to email if no method is selected
          if (!selectedMethod) {
            setSelectedMethod('email');
          }
        } else {
          // If user only has one option, use that
          setSelectedMethod(data.phone ? 'sms' : 'email');
          setShowMethodSelection(false);
        }
      }
    } catch (error) {
      console.error('Unexpected error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const sendCode = async () => {
    setIsResending(true);
    try {
      const { error } = await send2FACode(email, selectedMethod);
      if (error) {
        console.error('Error sending 2FA code:', error);
        toast({
          title: "Error",
          description: `Failed to send ${selectedMethod === 'email' ? 'email' : 'SMS'} code. Please try again.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Sent",
          description: `Verification code sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}.`,
        });
      }
    } catch (error) {
      console.error('Unexpected error sending 2FA code:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = verificationCode.split('');
    newCode[index] = value;
    const finalCode = newCode.join('');
    setVerificationCode(finalCode);

    // Auto-focus next input when a digit is entered
    if (value && index < 5) {
      setTimeout(() => {
        setFocusedIndex(index + 1);
        // Focus the next input element
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!verificationCode[index] && index > 0) {
        // If current field is empty, go to previous field
        setFocusedIndex(index - 1);
        setTimeout(() => {
          const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
          if (prevInput) {
            prevInput.focus();
          }
        }, 10);
      } else if (verificationCode[index]) {
        // If current field has value, clear it
        const newCode = verificationCode.split('');
        newCode[index] = '';
        setVerificationCode(newCode.join(''));
      }
    }
  };

  const handleMethodSelection = async (method) => {
    setSelectedMethod(method);
    setVerificationCode('');
    setFocusedIndex(0);
    // Don't automatically send code - let user click the Send Code button
  };

  // Update method parameter when selectedMethod changes
  useEffect(() => {
    if (selectedMethod && selectedMethod !== method) {
      // Update the method prop if it's different from the current selection
      console.log('Method changed from', method, 'to', selectedMethod);
    }
  }, [selectedMethod, method]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Temporarily Locked",
        description: `Too many failed attempts. Please try again in ${timeRemaining} seconds.`,
        variant: "destructive",
      });
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await verify2FACode(email, verificationCode, selectedMethod);
      
      if (error) {
        console.error('2FA verification failed:', error);
        
        // Handle lockout logic
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          const lockoutEnd = Date.now() + (15 * 60 * 1000); // 15 minutes
          setLockoutTime(lockoutEnd);
          setTimeRemaining(15 * 60);
          
          toast({
            title: "Account Locked",
            description: "Too many failed attempts. Your account is locked for 15 minutes.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Verification Failed",
            description: `Invalid code. ${5 - newAttempts} attempts remaining.`,
            variant: "destructive",
          });
        }
        
        setVerificationCode('');
        setFocusedIndex(0);
        return;
      }

      // Success - redirect to appropriate dashboard
      console.log('2FA verification successful, redirecting...');
      
      if (onVerificationSuccess) {
        onVerificationSuccess();
      } else {
        // Default redirect logic
        const userRole = await getUserRole();
        const dashboardRoute = getDashboardRoute(userRole);
        navigate(dashboardRoute);
      }
      
    } catch (error) {
      console.error('Unexpected error during 2FA verification:', error);
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    await sendCode();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="text-center py-8">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Smaller floating particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                2FA Verification
              </CardTitle>
            </div>
          </div>
          
          {/* User Profile Display */}
          {userProfile && (
            <div className="flex items-center justify-center gap-3 mb-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <User className="h-5 w-5 text-blue-400" />
              <span className="text-base font-medium text-gray-300">
                {userProfile.first_name} {userProfile.last_name}
              </span>
            </div>
          )}
          
                    {/* Method Selection - Always show if user has both options */}
          {showMethodSelection && (
            <div className="space-y-3 mb-4 p-4 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-lg border border-blue-500/20">
              <p className="text-sm text-gray-300 font-medium">Choose verification method:</p>
              <div className="grid grid-cols-2 gap-3">
                                  <Button
                    type="button"
                    variant={selectedMethod === 'email' ? 'default' : 'outline'}
                    size="default"
                    className={`flex items-center gap-2 text-sm ${
                      selectedMethod === 'email' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                    }`}
                    onClick={() => handleMethodSelection('email')}
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMethod === 'sms' ? 'default' : 'outline'} 
                    size="default"
                    className={`flex items-center gap-2 text-sm ${
                      selectedMethod === 'sms' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                    }`}
                    onClick={() => handleMethodSelection('sms')}
                  >
                    <Phone className="h-5 w-5" />
                    SMS
                  </Button>
              </div>
              <Button
                type="button"
                onClick={sendCode}
                disabled={isResending}
                size="default"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Code via {selectedMethod === 'email' ? 'Email' : 'SMS'}
                  </span>
                )}
              </Button>
            </div>
          )}
          
          {/* Current Method Display */}
          {!showMethodSelection && (
            <div className="flex items-center justify-center gap-3 mb-3 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
              {selectedMethod === 'email' ? (
                <Mail className="h-5 w-5 text-green-400" />
              ) : (
                <Smartphone className="h-5 w-5 text-blue-400" />
              )}
              <span className="text-sm font-medium text-gray-300">
                {selectedMethod === 'email' ? 'Email Verification' : 'SMS Verification'}
              </span>
              {!userProfile?.phone && selectedMethod === 'sms' && (
                <span className="text-sm text-red-400 ml-2">(No phone number available)</span>
              )}
            </div>
          )}
          
          {/* Method Selection for users with only one option */}
          {!showMethodSelection && userProfile && (
            <div className="mb-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-sm text-yellow-400 text-center">
                {!userProfile.phone 
                  ? "Only email verification is available. Add a phone number to your profile for SMS verification."
                  : "Only SMS verification is available. Add an email to your profile for email verification."
                }
              </p>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-300 text-base mb-2">
              Hello <span className="font-semibold text-white">{userProfile?.first_name || userName}</span>
            </p>
            <p className="text-sm text-gray-400">
              Enter the 6-digit code sent to your {selectedMethod === 'email' ? 'email' : 'phone'}
            </p>
            {selectedMethod === 'email' && (
              <p className="text-sm text-gray-500 mt-2">{email}</p>
            )}
            {selectedMethod === 'sms' && userProfile?.phone && (
              <p className="text-sm text-gray-500 mt-2">{userProfile.phone}</p>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLocked && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Account temporarily locked. Try again in <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-300">Verification Code</Label>
              
              {/* Modern 6-digit input */}
              <div className="flex gap-3 justify-center">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="relative">
                    <Input
                      type="text"
                      maxLength={1}
                      value={verificationCode[index] || ''}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={() => setFocusedIndex(index)}
                      disabled={isLocked}
                      data-index={index}
                      className={`
                        w-12 h-12 text-center text-lg font-bold bg-white/10 border-2 rounded-lg
                        focus:border-blue-400 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        ${focusedIndex === index ? 'border-blue-400 bg-white/20' : 'border-gray-600'}
                        ${verificationCode[index] ? 'border-green-400 bg-green-500/20' : ''}
                      `}
                      autoComplete="one-time-code"
                    />
                    {verificationCode[index] && (
                      <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index < verificationCode.length 
                        ? 'bg-green-400' 
                        : index === focusedIndex 
                        ? 'bg-blue-400' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Attempts and resend */}
            <div className="text-center space-y-2">
              {attempts > 0 && (
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {5 - attempts} attempts remaining
                  </span>
                </div>
              )}
              
              <div className="text-sm text-gray-400">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || isLocked}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                size="default"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                disabled={isLoading || isLocked || !verificationCode || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify Code'
                )}
              </Button>

              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="w-full border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-500 transition-all duration-200 text-base py-3"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Login
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default TwoFactorAuth; 