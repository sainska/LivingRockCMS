import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Shield, Mail, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

const TwoFactorSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState('email');
  const [hasPhone, setHasPhone] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    if (user) {
      load2FAStatus();
    }
  }, [user]);

  const load2FAStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled, two_factor_method, phone')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error loading 2FA status:', error);
        return;
      }

      setTwoFactorEnabled(data.two_factor_enabled || false);
      setTwoFactorMethod(data.two_factor_method || 'email');
      setHasPhone(!!data.phone);
      setUserPhone(data.phone || '');
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const handleToggle2FA = async (enabled) => {
    setIsLoading(true);
    try {
      if (enabled) {
        // Enable 2FA
        const { data, error } = await supabase.rpc('enable_2fa_for_user', {
          user_email: user.email,
          method: twoFactorMethod
        });

        if (error) {
          toast({
            title: "2FA Enable Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.success) {
          setTwoFactorEnabled(true);
          toast({
            title: "2FA Enabled",
            description: `Two-factor authentication enabled via ${twoFactorMethod}.`,
          });
        } else {
          toast({
            title: "2FA Enable Failed",
            description: data.message,
            variant: "destructive"
          });
        }
      } else {
        // Disable 2FA
        const { data, error } = await supabase.rpc('disable_2fa_for_user', {
          user_email: user.email
        });

        if (error) {
          toast({
            title: "2FA Disable Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.success) {
          setTwoFactorEnabled(false);
          toast({
            title: "2FA Disabled",
            description: "Two-factor authentication has been disabled.",
          });
        } else {
          toast({
            title: "2FA Disable Failed",
            description: data.message,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('2FA toggle error:', error);
      toast({
        title: "2FA Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodChange = async (method) => {
    if (!twoFactorEnabled) {
      setTwoFactorMethod(method);
      return;
    }

    // If 2FA is enabled, we need to update the method
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('enable_2fa_for_user', {
        user_email: user.email,
        method: method
      });

      if (error) {
        toast({
          title: "Method Change Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.success) {
        setTwoFactorMethod(method);
        toast({
          title: "Method Updated",
          description: `2FA method changed to ${method}.`,
        });
      } else {
        toast({
          title: "Method Change Failed",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Method change error:', error);
      toast({
        title: "Method Change Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle>Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Add an extra layer of security to your account by enabling two-factor authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 2FA Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {twoFactorEnabled ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            <div>
              <p className="font-medium">
                {twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
              </p>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled 
                  ? `Verification via ${twoFactorMethod}`
                  : 'Your account is protected by password only'
                }
              </p>
            </div>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isLoading}
          />
        </div>

        {/* 2FA Method Selection */}
        {twoFactorEnabled && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Verification Method</Label>
            <RadioGroup
              value={twoFactorMethod}
              onValueChange={handleMethodChange}
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Verification
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="phone" 
                  id="phone" 
                  disabled={!hasPhone}
                />
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone SMS Verification
                  {!hasPhone && (
                    <span className="text-sm text-gray-500">
                      (No phone number on file)
                    </span>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Security Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How 2FA Works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• When you log in, you'll receive a 6-digit verification code</li>
            <li>• Enter the code to complete your login</li>
            <li>• Codes expire after 10 minutes for security</li>
            <li>• You can change your verification method anytime</li>
          </ul>
        </div>

        {/* Warning */}
        {twoFactorEnabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Important</h4>
            <p className="text-sm text-yellow-800">
              Make sure you have access to your {twoFactorMethod} before enabling 2FA. 
              If you lose access, you may need to contact support to regain access to your account.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSettings; 