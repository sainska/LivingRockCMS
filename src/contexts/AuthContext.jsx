
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { role, profile, loading: roleLoading } = useUserRole();

  useEffect(() => {
    let mounted = true;
    
    console.log('AuthProvider: Setting up auth listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('AuthProvider: Auth state changed:', { event, user: session?.user?.email });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          console.log('AuthProvider: User signed out');
          setUser(null);
          setSession(null);
        }
        
        if (!authInitialized) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('AuthProvider: Initial session check:', { user: session?.user?.email });
        setSession(session);
        setUser(session?.user ?? null);
        setAuthInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('AuthProvider: Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent re-initialization

  const signUp = async (email, password, userData = {}) => {
    console.log('AuthProvider: Signing up user:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    console.log('AuthProvider: Sign up result:', { user: data?.user?.email, error });
    return { data, error };
  };

  const signIn = async (email, password) => {
    console.log('AuthProvider: Signing in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('AuthProvider: Sign in result:', { user: data?.user?.email, error });
    return { data, error };
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out user');
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  };

  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  };

  const isAuthenticated = !!user;
  const isLoading = loading || roleLoading;

  console.log('AuthProvider: Current auth state:', { 
    isAuthenticated, 
    isLoading, 
    user: user?.email, 
    role,
    authInitialized 
  });

  const value = {
    user,
    session,
    profile,
    role,
    loading: isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
