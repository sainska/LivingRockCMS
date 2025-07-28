import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Shield,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ReauthenticationConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [message, setMessage] = useState('');
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    const confirmReauthentication = async () => {
      const token = searchParams.get('token');
      const action = searchParams.get('action');

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. Missing required parameters.');
        return;
      }

      setActionType(action || 'this action');

      try {
        // Call the database function to confirm reauthentication
        const { data, error } = await supabase.rpc('confirm_reauthentication', {
          token: token
        });

        if (error) {
          console.error('Error confirming reauthentication:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to confirm reauthentication.');
          return;
        }

        if (data && data.length > 0) {
          const result = data[0];
          
          if (result.success) {
            setStatus('success');
            setMessage(result.message);
            setActionType(result.action_type || actionType);
            
            toast({
              title: "Identity Verified",
              description: "You can now proceed with your requested action.",
            });
          } else {
            setStatus('error');
            setMessage(result.message);
          }
        } else {
          setStatus('error');
          setMessage('Invalid or expired verification link.');
        }
      } catch (error) {
        console.error('Error in reauthentication confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmReauthentication();
  }, [searchParams, toast, actionType]);

  const handleContinue = () => {
    // Redirect back to the previous page or dashboard
    navigate(-1);
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getActionDescription = (action) => {
    const actionDescriptions = {
      'password_change': 'Changing your password',
      'email_change': 'Changing your email address',
      'account_settings': 'Modifying account settings',
      'financial_access': 'Accessing financial information',
      'admin_settings': 'Modifying administrative settings',
      'data_export': 'Exporting your data',
      'account_deletion': 'Deleting your account',
      'default': 'performing this action'
    };
    
    return actionDescriptions[action] || actionDescriptions.default;
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verifying Your Identity
              </h3>
              <p className="text-gray-600">
                Please wait while we verify your identity...
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
                Identity Verified Successfully!
              </h3>
              <p className="text-gray-600">
                Your identity has been verified. You can now proceed with {getActionDescription(actionType)}.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-green-900 mb-1">Verification Complete</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Your identity has been confirmed</li>
                    <li>• You can now proceed with your action</li>
                    <li>• This verification is valid for this session</li>
                    <li>• Your account remains secure</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">Security Notice</h4>
                  <p className="text-sm text-blue-700">
                    This verification was required to protect your account. You may need to verify again for other sensitive actions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleContinue}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue with Action
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
                Verification Failed
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
                    <li>• Your identity could not be verified</li>
                    <li>• You cannot proceed with the requested action</li>
                    <li>• You may need to request verification again</li>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-2xl text-purple-600">
                Identity Verification
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

export default ReauthenticationConfirmation; 