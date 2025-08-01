import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  Sparkles, 
  Shield, 
  Clock, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MagicLink = ({ onSuccess, allowSignUp = false }) => {
  const { sendMagicLink, signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Send magic link (validation is now handled server-side)
      const result = allowSignUp 
        ? await signInWithMagicLink(email)
        : await sendMagicLink(email);

      console.log('Magic link result:', result);

      if (result.error) {
        setError(result.error.message);
        console.log('Magic link error:', result.error.message);
      } else {
        setIsSent(true);
        toast({
          title: "Magic Link Sent!",
          description: "Check your email for a secure login link.",
        });
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = allowSignUp 
        ? await signInWithMagicLink(email)
        : await sendMagicLink(email);

      if (result.error) {
        setError(result.error.message);
      } else {
        toast({
          title: "Magic Link Resent!",
          description: "Check your email for a new secure login link.",
        });
      }
    } catch (error) {
      console.error('Error resending magic link:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (isSent) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-2xl text-purple-600">
                Magic Link Sent!
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Check Your Email
              </h3>
              <p className="text-gray-600">
                We've sent a secure magic link to <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">What's Next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the "Log In Now" button in the email</li>
                    <li>• You'll be automatically logged in</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResend}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Magic Link
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  setIsSent(false);
                  setEmail('');
                  setError('');
                }}
                variant="ghost"
                className="w-full"
              >
                Try Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <CardTitle className="text-2xl text-purple-600">
              Magic Link Login
            </CardTitle>
          </div>
          <p className="text-gray-600">
            Enter your email to receive a secure login link for existing accounts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                className={error ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>

          <Separator />

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Secure & Passwordless</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Link expires in 1 hour</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MagicLink; 