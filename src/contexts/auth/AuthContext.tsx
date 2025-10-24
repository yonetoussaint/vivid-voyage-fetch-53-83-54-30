import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

type ScreenType = 'main' | 'email' | 'verification' | 'password' | 'success' | 'account-creation' | 'reset-password' | 'otp-reset' | 'new-password';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  checkIfFollowing: (sellerId: string) => Promise<boolean>;
  toggleFollowSeller: (sellerId: string, sellerName: string, currentFollowStatus: boolean) => Promise<{ success: boolean; error?: string }>;
  followedSellers: string[];
  // Auth overlay state
  isAuthOverlayOpen: boolean;
  setIsAuthOverlayOpen: (open: boolean) => void;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  resetOTP: string;
  setResetOTP: (otp: string) => void;
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
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  
  // Auth overlay state
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');

  // Reset overlay state when opening
  useEffect(() => {
    if (isAuthOverlayOpen) {
      setCurrentScreen('main');
      setUserEmail('');
      setResetOTP('');
    }
  }, [isAuthOverlayOpen]);

  // Convert Supabase user to our User type
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: supabaseUser.user_metadata?.full_name,
      profile_picture: supabaseUser.user_metadata?.profile_picture,
    };
  };

  // Load followed sellers when user logs in
  const loadFollowedSellers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('seller_follows')
        .select('seller_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading followed sellers:', error);
        return;
      }

      setFollowedSellers(data?.map(item => item.seller_id) || []);
    } catch (error) {
      console.error('Error loading followed sellers:', error);
      setFollowedSellers([]);
    }
  };

  // Check if user is following a seller - SIMPLIFIED VERSION
  const checkIfFollowing = async (sellerId: string): Promise<boolean> => {
    if (!user) return false;

    // Check cache first - this is the main optimization
    return followedSellers.includes(sellerId);
  };

  // Toggle follow status for a seller
  const toggleFollowSeller = async (sellerId: string, sellerName: string, currentFollowStatus: boolean) => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }

    try {
      if (currentFollowStatus) {
        // Unfollow
        const { error } = await supabase
          .from('seller_follows')
          .delete()
          .eq('user_id', user.id)
          .eq('seller_id', sellerId);

        if (error) throw error;

        // Update cache
        setFollowedSellers(prev => prev.filter(id => id !== sellerId));

        return { success: true, newFollowStatus: false };
      } else {
        // Follow
        const { error } = await supabase
          .from('seller_follows')
          .insert([{ user_id: user.id, seller_id: sellerId }]);

        if (error) {
          if (error.code === '23505') {
            // Already following, update cache
            setFollowedSellers(prev => [...prev, sellerId]);
            return { success: true, newFollowStatus: true };
          }
          throw error;
        }

        // Update cache
        setFollowedSellers(prev => [...prev, sellerId]);

        return { success: true, newFollowStatus: true };
      }
    } catch (error: any) {
      console.error('Error toggling follow status:', error);
      return { success: false, error: error.message };
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setIsAuthenticated(false);
        setFollowedSellers([]);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        console.log('Session found for user:', session.user.email);
        const userData = mapSupabaseUser(session.user);
        setUser(userData);
        setIsAuthenticated(true);
        // Load followed sellers in background, don't wait for it
        loadFollowedSellers(session.user.id);
      } else {
        console.log('No active session');
        setUser(null);
        setIsAuthenticated(false);
        setFollowedSellers([]);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
      setFollowedSellers([]);
    } finally {
      setIsLoading(false);
    }
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
          // Load followed sellers in background
          loadFollowedSellers(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setFollowedSellers([]);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Attempting to signup with email:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Signup error:', error);

        let errorMessage = error.message;
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Password must be at least 6 characters long.';
        }

        return { error: errorMessage };
      }

      if (data.user) {
        console.log('User signed up successfully:', data.user.email);
        console.log('Confirmation required:', !data.session);

        if (!data.session) {
          console.log('Email confirmation required - check your inbox');
        }
      }

      return {};
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { error: error.message || 'An error occurred during signup' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting to login with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Login error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });

        // Provide more specific error messages
        let errorMessage = error.message;

        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed') || error.message.includes('not confirmed')) {
          errorMessage = 'Please verify your email address before logging in. Check your inbox for a confirmation email.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'No account found with this email. Please sign up first.';
        }

        return { error: errorMessage };
      }

      if (data.user) {
        console.log('User logged in successfully:', data.user.email);
        const userData = mapSupabaseUser(data.user);
        setUser(userData);
        setIsAuthenticated(true);
        // Load followed sellers in background
        loadFollowedSellers(data.user.id);
      } else {
        console.warn('Login succeeded but no user data returned');
        return { error: 'Login failed. Please try again.' };
      }

      return {};
    } catch (error: any) {
      console.error('Login exception:', error);
      return { error: error.message || 'An error occurred during login. Please try again.' };
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
      setFollowedSellers([]);
    } catch (error) {
      console.error('Logout exception:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
    checkIfFollowing,
    toggleFollowSeller,
    followedSellers,
    // Auth overlay state
    isAuthOverlayOpen,
    setIsAuthOverlayOpen,
    currentScreen,
    setCurrentScreen,
    selectedLanguage,
    setSelectedLanguage,
    userEmail,
    setUserEmail,
    resetOTP,
    setResetOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};