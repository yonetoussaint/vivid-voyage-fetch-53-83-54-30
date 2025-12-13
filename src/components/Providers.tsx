// components/Providers.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { HeaderFilterProvider } from '../contexts/HeaderFilterContext';
import { queryClient } from "../utils/queryClient";

// Auth Context (inlined)
interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

type ScreenType = 'main' | 'email' | 'verification' | 'password' | 'success' | 'account-creation' | 'reset-password' | 'otp-reset' | 'new-password';

interface AuthContextType {
  // Core auth state
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Basic auth functions
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;

  // OTP sign-in function
  handleOTPSignIn: (userData: any) => Promise<void>;

  // Follow functionality
  checkIfFollowing: (sellerId: string) => Promise<boolean>;
  toggleFollowSeller: (sellerId: string, sellerName: string, currentFollowStatus: boolean) => Promise<{ success: boolean; error?: string }>;
  followedSellers: string[];

  // Auth overlay state and navigation
  isAuthOverlayOpen: boolean;
  setIsAuthOverlayOpen: (open: boolean) => void;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;

  // Shared state between screens
  userEmail: string;
  setUserEmail: (email: string) => void;
  resetOTP: string;
  setResetOTP: (otp: string) => void;

  // Account creation state
  accountCreationStep: 'name' | 'password' | 'success';
  setAccountCreationStep: (step: 'name' | 'password' | 'success') => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;

  // Navigation handlers
  handleContinueWithEmail: () => void;
  handleBackToMain: () => void;
  handleContinueWithPassword: (email: string) => void;
  handleContinueWithCode: (email: string) => void;
  handleCreateAccount: (email: string) => void;
  handleSignUpClick: () => void;
  handleNameStepContinue: (newFirstName: string, newLastName: string) => void;
  handlePasswordStepContinue: () => Promise<void>;
  handleAccountCreated: () => void;
  handleBackFromAccountCreation: () => void;
  handleChangeEmail: () => void;
  handleBackFromVerification: () => void;
  handleBackFromPassword: () => void;
  handleVerificationSuccess: () => void;
  handleSignInSuccess: () => void;
  handleForgotPasswordClick: () => void;
  handleContinueToApp: () => void;

  // Utility methods
  getFaviconUrl: (emailValue: string) => string | null;
  validateName: (name: string, fieldName: string, options?: any) => string;
  validatePassword: (pwd: string) => string | null;

  // Reset and close
  resetAuthOverlay: () => void;
  handleClose: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAVICON_OVERRIDES: Record<string, string> = {
  'gmail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  'outlook.com': 'https://outlook.live.com/favicon.ico',
  'yahoo.com': 'https://s.yimg.com/rz/l/favicon.ico',
};

const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);

  // Auth overlay state
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');

  // Account creation state
  const [accountCreationStep, setAccountCreationStep] = useState<'name' | 'password' | 'success'>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // OTP sign-in function
  const handleOTPSignIn = async (userData: any) => {
    try {
      console.log('🔄 Handling OTP sign-in for user:', userData);

      const otpUser: AuthUser = {
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

      console.log('✅ OTP user signed in and auth state updated:', otpUser);
    } catch (error) {
      console.error('Error handling OTP sign-in:', error);
      throw error;
    }
  };

  // Reset overlay state when opening
  useEffect(() => {
    if (isAuthOverlayOpen) {
      setCurrentScreen('main');
      setUserEmail('');
      setResetOTP('');
    }
  }, [isAuthOverlayOpen]);

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

  // Utility functions
  const extractDomain = useCallback((emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  }, []);

  const getFaviconUrl = useCallback((emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      return FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
    }
    return null;
  }, [extractDomain]);

  const validateName = useCallback((name: string, fieldName: string, options: any = {}) => {
    const {
      minLength = 2,
      maxLength = 50,
      allowNumbers = false,
      allowUnicode = true,
      allowAllCaps = false,
    } = options;

    let basePattern = allowUnicode ? '\\p{L}' : 'a-zA-Z';
    if (allowNumbers) basePattern += '0-9';

    const nameRegex = new RegExp(
      `^[${basePattern}\\s\\-'."]+$`, 
      allowUnicode ? 'u' : ''
    );

    const trimmedName = name.trim();

    if (!trimmedName) {
      return `${fieldName} is required`;
    }

    if (trimmedName.length < minLength) {
      return `${fieldName} must be at least ${minLength} character${minLength === 1 ? '' : 's'}`;
    }
    if (trimmedName.length > maxLength) {
      return `${fieldName} must be less than ${maxLength} characters`;
    }

    if (!nameRegex.test(trimmedName)) {
      const allowedChars = [
        'letters (including accented ones like é, ü, ñ)',
        allowNumbers && 'numbers',
        'spaces',
        'hyphens (-)',
        'apostrophes (\')',
        'periods (.)'
      ].filter(Boolean).join(', ');
      return `${fieldName} can only contain ${allowedChars}`;
    }

    if (!allowAllCaps && trimmedName === trimmedName.toUpperCase()) {
      return `${fieldName} should not be in all capital letters`;
    }

    if (/(['\-."])\1/.test(trimmedName)) {
      return `${fieldName} contains repeated special characters`;
    }

    if (/^['\-."]|['\-."]$/.test(trimmedName)) {
      return `${fieldName} cannot start or end with a special character`;
    }

    if (/\s{2,}/.test(trimmedName)) {
      return `${fieldName} cannot contain multiple consecutive spaces`;
    }

    return '';
  }, []);

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

  // Convert Supabase user to our AuthUser type
  const mapSupabaseUser = useCallback((supabaseUser: SupabaseUser): AuthUser => {
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
        const { error } = await supabase
          .from('seller_follows')
          .delete()
          .eq('user_id', user.id)
          .eq('seller_id', sellerId);

        if (error) throw error;

        setFollowedSellers(prev => prev.filter(id => id !== sellerId));
        return { success: true, newFollowStatus: false };
      } else {
        const { error } = await supabase
          .from('seller_follows')
          .insert([{ user_id: user.id, seller_id: sellerId }]);

        if (error) {
          if (error.code === '23505') {
            setFollowedSellers(prev => [...prev, sellerId]);
            return { success: true, newFollowStatus: true };
          }
          throw error;
        }

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
          setIsLoading(false);
          return;
        }

        setUser(null);
        setIsAuthenticated(false);
        setFollowedSellers([]);
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

  // Auth overlay navigation handlers
  const handleContinueWithEmail = () => setCurrentScreen('email');
  const handleBackToMain = () => setCurrentScreen('main');

  const handleContinueWithPassword = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('password');
  };

  const handleContinueWithCode = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('verification');
  };

  const handleCreateAccount = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('account-creation');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
  };

  const handleSignUpClick = () => {
    setCurrentScreen('account-creation');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
  };

  const handleNameStepContinue = (newFirstName: string, newLastName: string) => {
    setAuthError(null);

    if (!newFirstName.trim() || !newLastName.trim()) {
      setAuthError('First name and last name are required');
      return;
    }

    setFirstName(newFirstName.trim());
    setLastName(newLastName.trim());
    setAccountCreationStep('password');
  };

  const handlePasswordStepContinue = async () => {
    console.log('AuthContext: Starting account creation process');
    setIsLoading(true);
    setAuthError(null);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      console.log('Calling signup with:', { email: userEmail, fullName });

      const result = await signup(userEmail, password, fullName);

      if (result.error) {
        console.error('Signup error:', result.error);
        setAuthError(result.error);
        return;
      }

      console.log('AuthContext: Account created successfully, moving to success step');
      setAccountCreationStep('success');
    } catch (error: any) {
      console.error('Account creation error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountCreated = () => {
    setCurrentScreen('success');
  };

  const handleBackFromAccountCreation = () => {
    if (accountCreationStep === 'name') {
      setCurrentScreen('email');
    } else if (accountCreationStep === 'password') {
      setAccountCreationStep('name');
    } else if (accountCreationStep === 'success') {
      setAccountCreationStep('password');
    }
    setAuthError(null);
  };

  const handleChangeEmail = () => setCurrentScreen('email');
  const handleBackFromVerification = () => setCurrentScreen('email');
  const handleBackFromPassword = () => setCurrentScreen('email');
  const handleVerificationSuccess = () => setCurrentScreen('success');

  const handleSignInSuccess = () => {
    setCurrentScreen('success');
    setTimeout(() => {
      setIsAuthOverlayOpen(false);
    }, 2000);
  };

  const handleForgotPasswordClick = () => setCurrentScreen('reset-password');
  const handleContinueToApp = () => {
    setIsAuthOverlayOpen(false);
    resetAuthOverlay();
  };

  const handleClose = () => {
    setIsAuthOverlayOpen(false);
    resetAuthOverlay();
  };

  const resetAuthOverlay = () => {
    setCurrentScreen('main');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUserEmail('');
    setResetOTP('');
  };

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
    setResetOTP,

    // Account creation state
    accountCreationStep,
    setAccountCreationStep,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    authError,
    setAuthError,

    // Auth overlay handlers
    handleContinueWithEmail,
    handleBackToMain,
    handleContinueWithPassword,
    handleContinueWithCode,
    handleCreateAccount,
    handleSignUpClick,
    handleNameStepContinue,
    handlePasswordStepContinue,
    handleAccountCreated,
    handleBackFromAccountCreation,
    handleChangeEmail,
    handleBackFromVerification,
    handleBackFromPassword,
    handleVerificationSuccess,
    handleSignInSuccess,
    handleForgotPasswordClick,
    handleContinueToApp,
    handleClose,

    // Utility methods
    getFaviconUrl,
    validateName,
    validatePassword,

    // Reset method
    resetAuthOverlay,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthOverlay Context (inlined)
interface AuthOverlayContextType {
  isAuthOverlayOpen: boolean;
  setIsAuthOverlayOpen: (value: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  openAuthOverlay: () => void;
}

const AuthOverlayContext = createContext<AuthOverlayContextType | undefined>(undefined);

const AuthOverlayProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthOverlay = () => {
    setIsAuthOverlayOpen(true);
  };

  return (
    <AuthOverlayContext.Provider 
      value={{ 
        isAuthOverlayOpen, 
        setIsAuthOverlayOpen, 
        authMode, 
        setAuthMode,
        openAuthOverlay
      }}
    >
      {children}
    </AuthOverlayContext.Provider>
  );
};

export const useAuthOverlay = () => {
  const context = useContext(AuthOverlayContext);
  if (!context) {
    throw new Error('useAuthOverlay must be used within an AuthOverlayProvider');
  }
  return context;
};

// RouteCache Context (inlined)
interface CachedRoute {
  component: React.ReactNode;
  timestamp: number;
  scrollPosition?: number;
}

interface RouteCacheContextType {
  cache: React.MutableRefObject<Map<string, CachedRoute>>;
  clearCache: () => void;
  removeFromCache: (key: string) => void;
  getCacheSize: () => number;
}

const RouteCacheContext = createContext<RouteCacheContextType | undefined>(undefined);

const RouteCacheProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cache = useRef(new Map<string, CachedRoute>());

  // Maximum cache size to prevent memory issues
  const MAX_CACHE_SIZE = 50;

  const clearCache = () => {
    cache.current.clear();
    console.log('Route cache cleared');
  };

  const removeFromCache = (key: string) => {
    cache.current.delete(key);
  };

  const getCacheSize = () => {
    return cache.current.size;
  };

  // Clean up old cache entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      cache.current.forEach((value, key) => {
        if (now - value.timestamp > oneHour) {
          cache.current.delete(key);
        }
      });

      // If cache is too large, remove oldest entries
      if (cache.current.size > MAX_CACHE_SIZE) {
        const entries = Array.from(cache.current.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        const toRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.3)); // Remove 30% of oldest
        toRemove.forEach(([key]) => cache.current.delete(key));
      }
    }, 5 * 60 * 1000); // Clean every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const value: RouteCacheContextType = {
    cache,
    clearCache,
    removeFromCache,
    getCacheSize,
  };

  return (
    <RouteCacheContext.Provider value={value}>
      {children}
    </RouteCacheContext.Provider>
  );
};

export const useRouteCache = () => {
  const context = useContext(RouteCacheContext);
  if (context === undefined) {
    throw new Error('useRouteCache must be used within a RouteCacheProvider');
  }
  return context;
};

// Currency Context (inlined)
export type Currency = 'HTG' | 'HTD' | 'USD';

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (price: number, bundlePrice?: number) => string;
  convertPrice: (price: number, bundlePrice?: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencies = {
  HTG: 'HTG',
  HTD: 'HTD', 
  USD: 'USD'
};

const currencyToCountry = {
  HTG: 'ht',
  HTD: 'ht',
  USD: 'us'
};

const formatNumber = (num: number) => {
  return parseFloat(num.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const CurrencyProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('HTG');

  const setCurrency = useCallback((currency: Currency) => {
    setCurrentCurrency(currency);
  }, []);

  const toggleCurrency = useCallback(() => {
    const currencyOrder: Currency[] = ['HTG', 'HTD', 'USD'];
    const currentIndex = currencyOrder.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyOrder.length;
    setCurrentCurrency(currencyOrder[nextIndex]);
  }, [currentCurrency]);

  const convertPrice = useCallback((price: number, bundlePrice?: number) => {
    const basePrice = bundlePrice || parseFloat(price.toString()) || 0;

    switch (currentCurrency) {
      case 'HTG':
        return bundlePrice ? basePrice : basePrice * 132;
      case 'HTD':
        const htgPrice = bundlePrice ? basePrice : basePrice * 132;
        return htgPrice / 5;
      case 'USD':
        return bundlePrice ? basePrice / 132 : basePrice;
      default:
        return basePrice;
    }
  }, [currentCurrency]);

  const formatPrice = useCallback((price: number, bundlePrice?: number) => {
    const convertedPrice = convertPrice(price, bundlePrice);
    return formatNumber(convertedPrice);
  }, [convertPrice]);

  const contextValue: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    toggleCurrency,
    formatPrice,
    convertPrice
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// RedirectAuth Context (inlined)
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
}

interface RedirectAuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

const RedirectAuthContext = createContext<RedirectAuthContextType | undefined>(undefined);

const AUTH_BASE_URL = "https://account.mimaht.com";
const LOCAL_STORAGE_KEY = "redirect_auth_user";

const RedirectAuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle auth callback from external service
  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        toast.error(`Authentication failed: ${error}`);
        navigate('/');
        return;
      }

      if (token && userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          toast.success("Successfully signed in!");
          navigate('/for-you');
        } catch (error) {
          console.error("Failed to parse user data:", error);
          toast.error("Authentication failed - invalid user data");
          navigate('/');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const signIn = () => {
    const currentUrl = window.location.origin + window.location.pathname;
    const redirectUrl = `${AUTH_BASE_URL}/signin?returnUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  };

  const signUp = () => {
    const currentUrl = window.location.origin + window.location.pathname;
    const redirectUrl = `${AUTH_BASE_URL}/signin?returnUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      // Optional: notify external auth service of logout
      const logoutUrl = `${AUTH_BASE_URL}/logout`;

      // Create a hidden iframe to call logout endpoint
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = logoutUrl;
      document.body.appendChild(iframe);

      // Remove iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);

      toast.success("Signed out successfully!");
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <RedirectAuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </RedirectAuthContext.Provider>
  );
};

export const useRedirectAuth = () => {
  const context = useContext(RedirectAuthContext);
  if (context === undefined) {
    throw new Error("useRedirectAuth must be used within a RedirectAuthProvider");
  }
  return context;
};

// ScreenOverlay Context (inlined)
interface ScreenOverlayContextType {
  isLanguageScreenOpen: boolean;
  isLocationScreenOpen: boolean;
  isLocationListScreenOpen: boolean;
  isGenericOverlayOpen: boolean;
  locationListScreenData: {
    title: string;
    items: Array<{ code: string; name: string }>;
    onSelect: (item: any) => void;
    searchPlaceholder?: string;
  } | null;
  setLanguageScreenOpen: (open: boolean) => void;
  setLocationScreenOpen: (open: boolean) => void;
  setLocationListScreenOpen: (open: boolean, data?: any) => void;
  setGenericOverlayOpen: (open: boolean) => void;
  setHasActiveOverlay: (hasOverlay: boolean) => void;
  hasActiveOverlay: boolean;
}

const ScreenOverlayContext = createContext<ScreenOverlayContextType | undefined>(undefined);

const ScreenOverlayProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLanguageScreenOpen, setIsLanguageScreenOpen] = useState(false);
  const [isLocationScreenOpen, setIsLocationScreenOpen] = useState(false);
  const [isLocationListScreenOpen, setIsLocationListScreenOpen] = useState(false);
  const [isGenericOverlayOpen, setIsGenericOverlayOpen] = useState(false);
  const [locationListScreenData, setLocationListScreenData] = useState<any>(null);

  const setLanguageScreenOpen = (open: boolean) => {
    setIsLanguageScreenOpen(open);
  };

  const setLocationScreenOpen = (open: boolean) => {
    setIsLocationScreenOpen(open);
  };

  const setLocationListScreenOpen = (open: boolean, data?: any) => {
    setIsLocationListScreenOpen(open);
    setLocationListScreenData(open ? data : null);
  };

  const setGenericOverlayOpen = (open: boolean) => {
    setIsGenericOverlayOpen(open);
  };

  const setHasActiveOverlay = (hasOverlay: boolean) => {
    setIsGenericOverlayOpen(hasOverlay);
  };

  const hasActiveOverlay = isLanguageScreenOpen || isLocationScreenOpen || isLocationListScreenOpen || isGenericOverlayOpen;

  return (
    <ScreenOverlayContext.Provider
      value={{
        isLanguageScreenOpen,
        isLocationScreenOpen,
        isLocationListScreenOpen,
        isGenericOverlayOpen,
        locationListScreenData,
        setLanguageScreenOpen,
        setLocationScreenOpen,
        setLocationListScreenOpen,
        setGenericOverlayOpen,
        setHasActiveOverlay,
        hasActiveOverlay,
      }}
    >
      {children}
    </ScreenOverlayContext.Provider>
  );
};

export const useScreenOverlay = () => {
  const context = useContext(ScreenOverlayContext);
  if (context === undefined) {
    throw new Error('useScreenOverlay must be used within a ScreenOverlayProvider');
  }
  return context;
};

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <CurrencyProviderComponent>
            <RouteCacheProviderComponent>
              <Router>
                <RedirectAuthProviderComponent>
                  <AuthProviderComponent>
                    <AuthOverlayProviderComponent>
                      <ScreenOverlayProviderComponent>
                        <HeaderFilterProvider>
                          {children}
                        </HeaderFilterProvider>
                      </ScreenOverlayProviderComponent>
                    </AuthOverlayProviderComponent>
                  </AuthProviderComponent>
                </RedirectAuthProviderComponent>
              </Router>
            </RouteCacheProviderComponent>
          </CurrencyProviderComponent>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Export the currency constants for external use
export { currencies, currencyToCountry };