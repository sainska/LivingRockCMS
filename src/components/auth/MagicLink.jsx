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
      const { error } = allowSignUp 
        ? await signInWithMagicLink(email)
        : await sendMagicLink(email);

      if (error) {
        setError(error.message);
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
      const { error } = allowSignUp 
        ? await signInWithMagicLink(email)
        : await sendMagicLink(email);

      if (error) {
        setError(error.message);
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-yellow-900 mb-1">Link Expires Soon</h4>
                <p className="text-sm text-yellow-700">
                  The magic link will expire in 1 hour for your security.
                </p>
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
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
              Use Different Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <CardTitle className="text-2xl text-purple-600">
            Magic Link Login
          </CardTitle>
        </div>
        <p className="text-gray-600">
          {allowSignUp 
            ? "Sign in or create an account with a secure magic link"
            : "Sign in to your account with a secure magic link"
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email Address</Label>
            <Input
              id="magic-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              required
              className={error ? 'border-red-500' : ''}
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
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Magic Link...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Send Magic Link
              </>
            )}
          </Button>
        </form>

        <Separator />

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-purple-900 mb-1">Why Magic Links?</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• No passwords to remember</li>
                  <li>• Enhanced security</li>
                  <li>• Instant access</li>
                  <li>• Works on all devices</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 mb-1">How It Works</h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Enter your email address</li>
                  <li>2. Check your email for a secure link</li>
                  <li>3. Click the link to log in instantly</li>
                  <li>4. Link expires in 1 hour for security</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {allowSignUp && (
          <div className="text-center text-sm text-gray-600">
            <p>
              Don't have an account? The magic link will create one for you automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MagicLink; 