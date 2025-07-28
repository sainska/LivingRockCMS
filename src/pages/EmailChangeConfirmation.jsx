import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Mail,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailChangeConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [message, setMessage] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const confirmEmailChange = async () => {
      const token = searchParams.get('token');
      const newEmailParam = searchParams.get('new_email');

      if (!token || !newEmailParam) {
        setStatus('error');
        setMessage('Invalid confirmation link. Missing required parameters.');
        return;
      }

      try {
        // Call the database function to confirm email change
        const { data, error } = await supabase.rpc('confirm_email_change', {
          token: token
        });

        if (error) {
          console.error('Error confirming email change:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to confirm email change.');
          return;
        }

        if (data && data.length > 0) {
          const result = data[0];
          
          if (result.success) {
            setStatus('success');
            setMessage(result.message);
            setOldEmail(result.old_email);
            setNewEmail(result.new_email);
            
            toast({
              title: "Email Changed Successfully",
              description: "Your email address has been updated.",
            });
          } else {
            setStatus('error');
            setMessage(result.message);
          }
        } else {
          setStatus('error');
          setMessage('Invalid or expired confirmation link.');
        }
      } catch (error) {
        console.error('Error in email change confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmailChange();
  }, [searchParams, toast]);

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirming Email Change
              </h3>
              <p className="text-gray-600">
                Please wait while we verify your email change request...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Email Changed Successfully!
              </h3>
              <p className="text-gray-600">
                Your email address has been updated successfully.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Previous Email:</span>
                  <span className="text-sm text-green-700 font-mono">{oldEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">New Email:</span>
                  <span className="text-sm text-green-700 font-mono">{newEmail}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">What's Next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use your new email address for future logins</li>
                    <li>• All future communications will be sent to your new email</li>
                    <li>• Your account settings have been updated automatically</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue to Login
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Email Change Failed
              </h3>
              <p className="text-gray-600">
                {message}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-red-900 mb-1">What This Means</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Your email address has not been changed</li>
                    <li>• Your current email remains active</li>
                    <li>• You can try requesting a new email change</li>
                    <li>• Contact support if you need assistance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Go to Login
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-2xl text-blue-600">
                Email Change Confirmation
              </CardTitle>
            </div>
            <p className="text-gray-600">
              Living Rock Church Management System
            </p>
          </CardHeader>
          
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailChangeConfirmation; 