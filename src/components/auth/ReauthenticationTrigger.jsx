import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Lock,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ReauthenticationTrigger = ({ 
  actionType, 
  actionDescription, 
  onReauthenticationSuccess, 
  children,
  className = "",
  variant = "default"
}) => {
  const { requireReauthentication } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleReauthentication = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await requireReauthentication(actionType);

      if (error) {
        setError(error);
        toast({
          title: "Reauthentication Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        setIsReauthenticated(true);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your identity.",
        });
      }
    } catch (error) {
      console.error('Error requiring reauthentication:', error);
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: "Reauthentication Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    if (onReauthenticationSuccess) {
      onReauthenticationSuccess();
    }
  };

  // If already reauthenticated, render the children
  if (isReauthenticated) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  // Render the reauthentication trigger
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-purple-600" />
          <CardTitle className="text-2xl text-purple-600">
            Reauthentication Required
          </CardTitle>
        </div>
        <p className="text-gray-600">
          Additional verification needed for this action
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-medium text-purple-900 mb-1">Action Requiring Verification</h4>
              <p className="text-sm text-purple-700">{actionDescription}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-medium text-blue-900 mb-1">Why Reauthentication?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Protects your account from unauthorized changes</li>
                <li>• Required for sensitive actions like password changes</li>
                <li>• Ensures only you can perform this action</li>
                <li>• Standard security practice for account protection</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button 
          onClick={handleReauthentication}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending Verification Email...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Verify My Identity
            </>
          )}
        </Button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-medium text-yellow-900 mb-1">What Happens Next?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check your email for a verification link</li>
                <li>• Click the link to verify your identity</li>
                <li>• Return here to complete your action</li>
                <li>• Verification link expires in 30 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Higher-order component for wrapping components that need reauthentication
export const withReauthentication = (WrappedComponent, actionType, actionDescription) => {
  return function ReauthenticatedComponent(props) {
    const [isReauthenticated, setIsReauthenticated] = useState(false);

    if (isReauthenticated) {
      return <WrappedComponent {...props} />;
    }

    return (
      <ReauthenticationTrigger
        actionType={actionType}
        actionDescription={actionDescription}
        onReauthenticationSuccess={() => setIsReauthenticated(true)}
      >
        <WrappedComponent {...props} />
      </ReauthenticationTrigger>
    );
  };
};

// Hook for manual reauthentication
export const useReauthentication = () => {
  const { requireReauthentication } = useAuth();
  const { toast } = useToast();
  
  const triggerReauthentication = async (actionType) => {
    try {
      const { error } = await requireReauthentication(actionType);

      if (error) {
        toast({
          title: "Reauthentication Failed",
          description: error,
          variant: "destructive",
        });
        return { success: false, error };
      } else {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your identity.",
        });
        return { success: true, error: null };
      }
    } catch (error) {
      console.error('Error requiring reauthentication:', error);
      toast({
        title: "Reauthentication Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  return { triggerReauthentication };
};

export default ReauthenticationTrigger; 