
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email, 'Session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    console.log('AuthProvider: Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: Session check result:', { session, error });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { user_uuid: user.id });

      if (error) {
        console.error('Error fetching user role:', error);
        return 'member';
      }

      return data || 'member';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'member';
    }
  };

  const getDashboardRoute = (role) => {
    const dashboardRoutes = {
      system_admin: '/admin-dashboard',
      clergy: '/clergy-dashboard',
      treasurer: '/treasurer-dashboard',
      secretary: '/secretary-dashboard',
      member: '/user-dashboard'
    };

    return dashboardRoutes[role] || '/user-dashboard';
  };

  const signIn = async (email, password) => {
    console.log('AuthContext: Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthContext: Sign in result:', { data, error });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('AuthContext: Sign in successful, user:', data.user);
        toast({
          title: "Login Successful",
          description: "Welcome to Living Rock Church Management System!",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Unexpected sign in error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email, password, firstName, lastName) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      return { error: null };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const resetPassword = async (email) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      }

      return { error };
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getUserRole,
    getDashboardRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
