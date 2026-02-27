import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

interface AuthContextType {
  // Core auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Core auth functions
  login: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ error?: string; user?: User }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;

  // OTP sign-in
  handleOTPSignIn: (userData: any) => Promise<void>;

  // Follow functionality
  checkIfFollowing: (sellerId: string) => Promise<boolean>;
  toggleFollowSeller: (sellerId: string, sellerName: string, currentFollowStatus: boolean) => Promise<{ success: boolean; error?: string }>;
  followedSellers: string[];

  // Validation methods
  validatePassword: (pwd: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);

  // Validate password
  const validatePassword = useCallback((pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  }, []);

  // Convert Supabase user to our User type
  const mapSupabaseUser = useCallback((supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: supabaseUser.user_metadata?.full_name,
      profile_picture: supabaseUser.user_metadata?.profile_picture,
    };
  }, []);

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

  // Check if user is following a seller
  const checkIfFollowing = async (sellerId: string): Promise<boolean> => {
    if (!user) return false;
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

        setFollowedSellers(prev => prev.filter(id => id !== sellerId));
        return { success: true };
      } else {
        // Follow
        const { error } = await supabase
          .from('seller_follows')
          .insert([{ user_id: user.id, seller_id: sellerId }]);

        if (error) {
          if (error.code === '23505') {
            setFollowedSellers(prev => [...prev, sellerId]);
            return { success: true };
          }
          throw error;
        }

        setFollowedSellers(prev => [...prev, sellerId]);
        return { success: true };
      }
    } catch (error: any) {
      console.error('Error toggling follow status:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle OTP sign-in
  const handleOTPSignIn = async (userData: any) => {
    try {
      console.log('🔄 Handling OTP sign-in for user:', userData);

      const otpUser: User = {
        id: userData.id || `otp_${userData.email}`,
        email: userData.email,
        full_name: userData.full_name || userData.email.split('@')[0],
        profile_picture: userData.profile_picture,
      };

      setUser(otpUser);
      setIsAuthenticated(true);

      localStorage.setItem('otp_user', JSON.stringify(otpUser));
      localStorage.setItem('otp_auth', 'true');
      localStorage.setItem('auth_method', 'otp');

      console.log('✅ OTP user signed in');
    } catch (error) {
      console.error('Error handling OTP sign-in:', error);
      throw error;
    }
  };

  // Check auth status
  const checkAuthStatus = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        const otpAuth = localStorage.getItem('otp_auth');
        const otpUser = localStorage.getItem('otp_user');

        if (otpAuth === 'true' && otpUser) {
          const userData = JSON.parse(otpUser);
          setUser(userData);
          setIsAuthenticated(true);
          loadFollowedSellers(userData.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setFollowedSellers([]);
        }
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        const userData = mapSupabaseUser(session.user);
        setUser(userData);
        setIsAuthenticated(true);
        loadFollowedSellers(session.user.id);
      } else {
        const otpAuth = localStorage.getItem('otp_auth');
        const otpUser = localStorage.getItem('otp_user');

        if (otpAuth === 'true' && otpUser) {
          const userData = JSON.parse(otpUser);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setFollowedSellers([]);
        }
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

  // Sign up
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
        const userData = mapSupabaseUser(data.user);
        return { user: userData };
      }

      return {};
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { error: error.message || 'An error occurred during signup' };
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting to login with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Login error:', error);

        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email address before logging in.';
        } else if (error.message.includes('network')) {
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
        loadFollowedSellers(data.user.id);
        return { user: userData };
      }

      return { error: 'Login failed. Please try again.' };
    } catch (error: any) {
      console.error('Login exception:', error);
      return { error: error.message || 'An error occurred during login.' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log('Logging out user');

      localStorage.removeItem('otp_auth');
      localStorage.removeItem('otp_user');
      localStorage.removeItem('auth_method');

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

  // Check for OTP auth on initial load
  useEffect(() => {
    const checkOTPAuth = () => {
      try {
        const otpAuth = localStorage.getItem('otp_auth');
        const otpUser = localStorage.getItem('otp_user');

        if (otpAuth === 'true' && otpUser) {
          const userData = JSON.parse(otpUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ OTP auth restored from storage');
        }
      } catch (error) {
        console.error('Error restoring OTP auth:', error);
      }
    };

    checkOTPAuth();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
          const userData = mapSupabaseUser(session.user);
          setUser(userData);
          setIsAuthenticated(true);
          loadFollowedSellers(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('otp_auth');
          localStorage.removeItem('otp_user');
          localStorage.removeItem('auth_method');
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

  const value: AuthContextType = {
    // Core auth state
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
    handleOTPSignIn,

    // Follow functionality
    checkIfFollowing,
    toggleFollowSeller,
    followedSellers,

    // Validation
    validatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};