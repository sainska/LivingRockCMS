import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Church, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSocialAuthCallback, getUserRole, getDashboardRoute } = useAuth();
  const { toast } = useToast();
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('loading');
        
        // Check for error parameters in URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          setError(errorDescription || error);
          setStatus('error');
          return;
        }

        // Determine the provider from the URL or session
        let provider = 'Social Provider';
        const providerParam = searchParams.get('provider');
        if (providerParam) {
          provider = providerParam.charAt(0).toUpperCase() + providerParam.slice(1);
        }

        // Handle the social auth callback
        const { error: authError } = await handleSocialAuthCallback(provider);
        
        if (authError) {
          setError(authError.message);
          setStatus('error');
          return;
        }

        setStatus('success');
        
        // Redirect after a short delay to show success message
        setTimeout(async () => {
          try {
            const userRole = await getUserRole();
            if (userRole) {
              const dashboardRoute = getDashboardRoute(userRole);
              navigate(dashboardRoute);
            } else {
              navigate("/user-dashboard");
            }
          } catch (redirectError) {
            console.error('Redirect error:', redirectError);
            navigate("/user-dashboard");
          }
        }, 2000);

      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, handleSocialAuthCallback, getUserRole, getDashboardRoute, navigate, toast]);

  const handleRetry = () => {
    navigate('/auth');
  };

  const handleGoHome = () => {
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">
              Living Rock Church
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">Authentication Callback</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-xiracom-blue mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Completing Sign In</h3>
                <p className="text-sm text-gray-600">Please wait while we complete your authentication...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-600">Sign In Successful!</h3>
                <p className="text-sm text-gray-600">Redirecting you to your dashboard...</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-600">Sign In Failed</h3>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={handleGoHome}>
                  Go Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback; 