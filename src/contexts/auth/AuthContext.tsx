import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User type
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: supabaseUser.user_metadata?.full_name,
      profile_picture: supabaseUser.user_metadata?.profile_picture,
    };
  };

  useEffect(() => {
    // Check initial session
    checkAuthStatus();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
          const userData = mapSupabaseUser(session.user);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (session?.user) {
        console.log('Session found for user:', session.user.email);
        const userData = mapSupabaseUser(session.user);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('No active session');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('User signed up successfully:', data.user.email);
        // Note: User may need to verify email depending on your Supabase settings
      }

      return {};
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { error: error.message || 'An error occurred during signup' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('User logged in successfully:', data.user.email);
        const userData = mapSupabaseUser(data.user);
        setUser(userData);
        setIsAuthenticated(true);
      }

      return {};
    } catch (error: any) {
      console.error('Login exception:', error);
      return { error: error.message || 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
      }

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout exception:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};