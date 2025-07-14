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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session on mount
    const sessionCheck = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    sessionCheck();

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async () => {
    if (!user) return null;

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Role fetch timeout')), 3000)
      );

      const rolePromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      const { data, error } = await Promise.race([rolePromise, timeoutPromise]);

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
      system_admin: '/admin/dashboard',
      clergy: '/clergy/dashboard',
      treasurer: '/treasurer/dashboard',
      secretary: '/secretary/dashboard',
      member: '/welcome',
    };

    console.log('AuthContext: Getting dashboard route for role:', role);
    const route = dashboardRoutes[role] || '/welcome';
    console.log('AuthContext: Dashboard route:', route);
    return route;
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
