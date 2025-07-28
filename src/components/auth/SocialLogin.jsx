import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SocialLogin = ({ onSuccess }) => {
  const { signInWithGoogle, signInWithFacebook, signInWithWhatsApp } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (!error && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { error } = await signInWithFacebook();
      if (!error && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Facebook sign in error:', error);
    }
  };

  const handleWhatsAppSignIn = async () => {
    try {
      const { error } = await signInWithWhatsApp();
      if (!error && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('WhatsApp sign in error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          onClick={handleFacebookSignIn}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
        >
          <FaFacebook className="mr-2 h-4 w-4" />
          Continue with Facebook
        </Button>

        <Button
          variant="outline"
          onClick={handleWhatsAppSignIn}
          className="w-full bg-green-600 text-white hover:bg-green-700 border-green-600"
        >
          <FaWhatsapp className="mr-2 h-4 w-4" />
          Continue with WhatsApp
        </Button>
      </div>

      <div className="text-xs text-center text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default SocialLogin; 