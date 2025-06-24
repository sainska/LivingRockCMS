import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

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
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
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

      // If registration is successful, assign 'member' role
      if (data?.user?.id) {
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'member',
          is_active: true
        });
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

  const login = (userData, userRole) => {
    setUser(userData);
    setSession(userData.session);
  };

  const logout = () => {
    setUser(null);
    setSession(null);
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
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
