import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // OTP Functions
  sendCustomOTPEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyCustomOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string; user?: any }>;
  resendOTPEmail: (email: string) => Promise<{ success: boolean; error?: string }>;

  // Auth overlay state and methods
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

  // Account creation state and methods
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
  nameErrors: { firstName: string; lastName: string };

  // Auth overlay handlers
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
  handleFirstNameChange: (value: string) => void;
  handleLastNameChange: (value: string) => void;

  // Utility methods
  getFaviconUrl: (emailValue: string) => string | null;
  isNameFormValid: boolean;
  isPasswordFormValid: boolean;
  validateName: (name: string, fieldName: string, options?: any) => string;
  validatePassword: (pwd: string) => string | null;

  // Reset auth overlay
  resetAuthOverlay: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Favicon overrides constant
const FAVICON_OVERRIDES: Record<string, string> = {
  'gmail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  'outlook.com': 'https://outlook.live.com/favicon.ico',
  'yahoo.com': 'https://s.yimg.com/rz/l/favicon.ico',
};

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

  // Account creation state
  const [accountCreationStep, setAccountCreationStep] = useState<'name' | 'password' | 'success'>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [nameErrors, setNameErrors] = useState({
    firstName: '',
    lastName: ''
  });

  // Backend URL - using your Render.com server
  const BACKEND_URL = 'https://resend-u11p.onrender.com';

  // OTP Functions
  const sendCustomOTPEmail = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification code');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send verification code' 
      };
    }
  };

  const sendPasswordResetOTP = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/send-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send password reset code');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to send password reset OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send password reset code' 
      };
    }
  };

  const verifyCustomOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code');
      }

      // If we get a session back, set it in Supabase client
      if (result.session) {
        const { error: sessionError } = await supabase.auth.setSession(result.session);
        if (sessionError) throw sessionError;
        
        // Update auth state
        const userData = mapSupabaseUser(result.user);
        setUser(userData);
        setIsAuthenticated(true);
      }

      return { 
        success: true, 
        user: result.user,
        message: result.message 
      };
    } catch (error: any) {
      console.error('Failed to verify OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid verification code' 
      };
    }
  };

  const resendOTPEmail = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend verification code');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to resend verification code' 
      };
    }
  };

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

  const isPasswordFormValid = useCallback(() => {
    return (
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword &&
      validatePassword(password) === null
    );
  }, [password, confirmPassword, validatePassword]);

  const isNameFormValid = useCallback(() => {
    return firstName.trim() !== '' && 
           lastName.trim() !== '' && 
           !nameErrors.firstName && 
           !nameErrors.lastName;
  }, [firstName, lastName, nameErrors]);

  // Reset overlay state when opening
  useEffect(() => {
    if (isAuthOverlayOpen) {
      setCurrentScreen('main');
      setUserEmail('');
      setResetOTP('');
    }
  }, [isAuthOverlayOpen]);

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

  // Check if user is following a seller - SIMPLIFIED VERSION
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

  // Auth overlay handlers
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
    setNameErrors({ firstName: '', lastName: '' });
  };

  const handleSignUpClick = () => {
    setCurrentScreen('account-creation');
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
    setNameErrors({ firstName: '', lastName: '' });
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
    if (!isPasswordFormValid()) return;

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

  const handleChangeEmail = () => {
    setCurrentScreen('email');
  };

  const handleBackFromVerification = () => setCurrentScreen('email');
  const handleBackFromPassword = () => setCurrentScreen('email');
  const handleVerificationSuccess = () => setCurrentScreen('success');

  const handleSignInSuccess = () => {
    setCurrentScreen('success');
    // Close overlay after a brief delay to show success message
    setTimeout(() => {
      setIsAuthOverlayOpen(false);
    }, 2000);
  };

  const handleForgotPasswordClick = () => setCurrentScreen('reset-password');

  const handleContinueToApp = () => {
    setIsAuthOverlayOpen(false);
    resetAuthOverlay();
  };

  // Name step handlers
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    const error = validateName(value, 'First name');
    setNameErrors(prev => ({ ...prev, firstName: error }));
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    const error = validateName(value, 'Last name');
    setNameErrors(prev => ({ ...prev, lastName: error }));
  };

  const resetAuthOverlay = () => {
    setAccountCreationStep('name');
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setAuthError(null);
    setNameErrors({ firstName: '', lastName: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
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

    // OTP Functions
    sendCustomOTPEmail,
    sendPasswordResetOTP,
    verifyCustomOTP,
    resendOTPEmail,

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
    nameErrors,

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
    handleFirstNameChange,
    handleLastNameChange,

    // Utility methods
    getFaviconUrl,
    isNameFormValid: isNameFormValid(),
    isPasswordFormValid: isPasswordFormValid(),
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