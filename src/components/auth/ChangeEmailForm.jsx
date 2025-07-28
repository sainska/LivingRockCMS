import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ChangeEmailForm = () => {
  const { user, changeEmailAddress } = useAuth();
  const { toast } = useToast();
  
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEmail || !confirmEmail) {
      setError('Please fill in all fields');
      return;
    }

    if (newEmail !== confirmEmail) {
      setError('Email addresses do not match');
      return;
    }

    if (newEmail === user?.email) {
      setError('New email must be different from current email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await changeEmailAddress(newEmail);

      if (error) {
        setError(error);
      } else {
        setIsSuccess(true);
        setNewEmail('');
        setConfirmEmail('');
        toast({
          title: "Confirmation Email Sent",
          description: "Please check your new email address for confirmation.",
        });
      }
    } catch (error) {
      console.error('Error changing email:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
    if (error) setError('');
  };

  const handleConfirmEmailChange = (e) => {
    setConfirmEmail(e.target.value);
    if (error) setError('');
  };

  const handleReset = () => {
    setIsSuccess(false);
    setNewEmail('');
    setConfirmEmail('');
    setError('');
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <CardTitle className="text-2xl text-green-600">
              Confirmation Email Sent!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Check Your New Email
            </h3>
            <p className="text-gray-600">
              We've sent a confirmation email to <strong>{newEmail}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 mb-1">What's Next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your new email inbox (and spam folder)</li>
                  <li>• Click the "Confirm Email Change" button</li>
                  <li>• Your email will be updated automatically</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-yellow-900 mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-700">
                  The confirmation link will expire in 24 hours. After confirming, you'll need to use your new email address to log in.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            Change Different Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
          <CardTitle className="text-2xl text-blue-600">
            Change Email Address
          </CardTitle>
        </div>
        <p className="text-gray-600">
          Update your email address for <strong>Living Rock Church Management System</strong>
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">Current Email</span>
          </div>
          <p className="text-gray-700 font-mono text-sm">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email Address</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={handleEmailChange}
              placeholder="Enter your new email address"
              required
              className={error ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-email">Confirm New Email</Label>
            <Input
              id="confirm-email"
              type="email"
              value={confirmEmail}
              onChange={handleConfirmEmailChange}
              placeholder="Confirm your new email address"
              required
              className={error ? 'border-red-500' : ''}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Confirmation...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Confirmation Email
              </>
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 mb-1">Security Process</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• We'll send a confirmation email to your new address</li>
                  <li>• Click the confirmation link to verify ownership</li>
                  <li>• Your email will be updated after verification</li>
                  <li>• You'll need to use the new email for future logins</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-yellow-900 mb-1">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Confirmation link expires in 24 hours</li>
                  <li>• Your current email will remain active until confirmed</li>
                  <li>• All future communications will use your new email</li>
                  <li>• Contact support if you don't receive the confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeEmailForm; 