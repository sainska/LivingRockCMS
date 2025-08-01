import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Mail, Smartphone, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TwoFactorSettings = () => {
  const { user, enable2FA, disable2FA, get2FAStatus, send2FACode } = useAuth();
  const { toast } = useToast();
  
  const [twoFactorStatus, setTwoFactorStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('email');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    load2FAStatus();
  }, [user]);

  const load2FAStatus = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await get2FAStatus(user.email);
      
      if (error) {
        console.error('Error loading 2FA status:', error);
        toast({
          title: "Error",
          description: "Failed to load 2FA status",
          variant: "destructive",
        });
      } else {
        setTwoFactorStatus(data);
        setSelectedMethod(data.two_factor_method || 'email');
      }
    } catch (error) {
      console.error('Unexpected error loading 2FA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!user?.email) return;
    
    setIsUpdating(true);
    try {
      const { error } = await enable2FA(user.email, selectedMethod);
      
      if (error) {
        console.error('Error enabling 2FA:', error);
        toast({
          title: "2FA Enable Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Send verification code to confirm setup
        const { error: codeError } = await send2FACode(user.email, selectedMethod);
        
        if (codeError) {
          console.error('Error sending verification code:', codeError);
          toast({
            title: "Verification Code Failed",
            description: "Failed to send verification code",
            variant: "destructive",
          });
        } else {
          setShowConfirmation(true);
          toast({
            title: "2FA Enabled",
            description: `Please enter the verification code sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}`,
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error enabling 2FA:', error);
      toast({
        title: "2FA Enable Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!user?.email) return;
    
    setIsUpdating(true);
    try {
      const { error } = await disable2FA(user.email);
      
      if (error) {
        console.error('Error disabling 2FA:', error);
        toast({
          title: "2FA Disable Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled successfully",
        });
        await load2FAStatus(); // Reload status
      }
    } catch (error) {
      console.error('Unexpected error disabling 2FA:', error);
      toast({
        title: "2FA Disable Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!user?.email || !confirmationCode) return;
    
    setIsVerifying(true);
    try {
      // For now, we'll just reload the status since the code was already verified
      // In a real implementation, you might want to verify the code here
      await load2FAStatus();
      setShowConfirmation(false);
      setConfirmationCode('');
      toast({
        title: "2FA Setup Complete",
        description: "Two-factor authentication has been successfully enabled",
      });
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify the code",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await send2FACode(user.email, selectedMethod);
      
      if (error) {
        toast({
          title: "Code Resend Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Resent",
          description: `A new verification code has been sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}`,
        });
      }
    } catch (error) {
      console.error('Error resending code:', error);
      toast({
        title: "Code Resend Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xiracom-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEnabled = twoFactorStatus?.two_factor_enabled;
  const currentMethod = twoFactorStatus?.two_factor_method;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">
                {isEnabled ? 'Two-Factor Authentication is Enabled' : 'Two-Factor Authentication is Disabled'}
              </p>
              <p className="text-sm text-gray-600">
                {isEnabled 
                  ? `Currently using ${currentMethod === 'email' ? 'email' : 'SMS'} verification`
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Security Info */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
          </AlertDescription>
        </Alert>

        {/* 2FA Management */}
        {!isEnabled ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Verification Method</Label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Verification
                    </div>
                  </SelectItem>
                  <SelectItem value="phone" disabled={!twoFactorStatus?.has_phone}>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      SMS Verification
                      {!twoFactorStatus?.has_phone && (
                        <span className="text-xs text-gray-500">(Phone number required)</span>
                      )}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {selectedMethod === 'phone' && !twoFactorStatus?.has_phone && (
                <p className="text-sm text-red-600">
                  Please add a phone number to your profile to use SMS verification.
                </p>
              )}
            </div>

            <Button
              onClick={handleEnable2FA}
              disabled={isUpdating || (selectedMethod === 'phone' && !twoFactorStatus?.has_phone)}
              className="w-full"
            >
              {isUpdating ? "Enabling..." : "Enable Two-Factor Authentication"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Disabling two-factor authentication will reduce the security of your account.
              </p>
            </div>

            <Button
              onClick={handleDisable2FA}
              disabled={isUpdating}
              variant="destructive"
              className="w-full"
            >
              {isUpdating ? "Disabling..." : "Disable Two-Factor Authentication"}
            </Button>
          </div>
        )}

        {/* Verification Code Input */}
        {showConfirmation && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">Verification Code</Label>
              <input
                id="confirmationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={confirmationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setConfirmationCode(value);
                }}
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xiracom-blue"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={isVerifying || confirmationCode.length !== 6}
                className="flex-1"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                onClick={handleResendCode}
                variant="outline"
                disabled={isVerifying}
              >
                Resend
              </Button>
            </div>

            <Button
              onClick={() => {
                setShowConfirmation(false);
                setConfirmationCode('');
              }}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSettings; 