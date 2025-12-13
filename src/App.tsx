import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { HeaderFilterProvider } from '@/contexts/HeaderFilterContext';
import { Toasters } from "./components/Toasters";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import CouponsPage from "./pages/CouponsPage";
import "./App.css";

// Create query client
const queryClient = new QueryClient();

// ========== AUTH CONTEXT ==========
interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

type ScreenType = 'main' | 'email' | 'verification' | 'password' | 'success' | 'account-creation' | 'reset-password' | 'otp-reset' | 'new-password';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  handleOTPSignIn: (userData: any) => Promise<void>;
  checkIfFollowing: (sellerId: string) => Promise<boolean>;
  toggleFollowSeller: (sellerId: string, sellerName: string, currentFollowStatus: boolean) => Promise<{ success: boolean; error?: string }>;
  followedSellers: string[];
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
  resetAuthOverlay: () => void;
  handleClose: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');

  // Simplified AuthProvider - just the essentials
  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
        });
        setIsAuthenticated(true);
      } else {
        // Check for OTP auth
        const otpAuth = localStorage.getItem('otp_auth');
        const otpUser = localStorage.getItem('otp_user');
        if (otpAuth === 'true' && otpUser) {
          setUser(JSON.parse(otpUser));
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await checkAuthStatus();
    return {};
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    return { error: error?.message };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('otp_auth');
    localStorage.removeItem('otp_user');
    setUser(null);
    setIsAuthenticated(false);
    setFollowedSellers([]);
  };

  const handleOTPSignIn = async (userData: any) => {
    const otpUser: AuthUser = {
      id: userData.id || `otp_${userData.email}`,
      email: userData.email,
      full_name: userData.full_name || userData.email.split('@')[0],
    };
    setUser(otpUser);
    setIsAuthenticated(true);
    localStorage.setItem('otp_user', JSON.stringify(otpUser));
    localStorage.setItem('otp_auth', 'true');
  };

  const checkIfFollowing = async (sellerId: string) => followedSellers.includes(sellerId);

  const toggleFollowSeller = async (sellerId: string, sellerName: string, currentFollowStatus: boolean) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      if (currentFollowStatus) {
        // Unfollow
        setFollowedSellers(prev => prev.filter(id => id !== sellerId));
      } else {
        // Follow
        setFollowedSellers(prev => [...prev, sellerId]);
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const resetAuthOverlay = () => {
    setCurrentScreen('main');
    setUserEmail('');
    setResetOTP('');
  };

  const handleClose = () => {
    setIsAuthOverlayOpen(false);
    resetAuthOverlay();
  };

  useEffect(() => {
    checkAuthStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
        });
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setFollowedSellers([]);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
    handleOTPSignIn,
    checkIfFollowing,
    toggleFollowSeller,
    followedSellers,
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
    resetAuthOverlay,
    handleClose,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ========== SCREEN OVERLAY CONTEXT ==========
interface ScreenOverlayContextType {
  isLanguageScreenOpen: boolean;
  isLocationScreenOpen: boolean;
  isLocationListScreenOpen: boolean;
  isGenericOverlayOpen: boolean;
  setLanguageScreenOpen: (open: boolean) => void;
  setLocationScreenOpen: (open: boolean) => void;
  setLocationListScreenOpen: (open: boolean, data?: any) => void;
  setGenericOverlayOpen: (open: boolean) => void;
  setHasActiveOverlay: (hasOverlay: boolean) => void;
  hasActiveOverlay: boolean;
}

const ScreenOverlayContext = createContext<ScreenOverlayContextType | undefined>(undefined);

const ScreenOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLanguageScreenOpen, setIsLanguageScreenOpen] = useState(false);
  const [isLocationScreenOpen, setIsLocationScreenOpen] = useState(false);
  const [isLocationListScreenOpen, setIsLocationListScreenOpen] = useState(false);
  const [isGenericOverlayOpen, setIsGenericOverlayOpen] = useState(false);

  const setLanguageScreenOpen = (open: boolean) => setIsLanguageScreenOpen(open);
  const setLocationScreenOpen = (open: boolean) => setIsLocationScreenOpen(open);
  const setLocationListScreenOpen = (open: boolean) => setIsLocationListScreenOpen(open);
  const setGenericOverlayOpen = (open: boolean) => setIsGenericOverlayOpen(open);
  const setHasActiveOverlay = (hasOverlay: boolean) => setIsGenericOverlayOpen(hasOverlay);

  const hasActiveOverlay = isLanguageScreenOpen || isLocationScreenOpen || isLocationListScreenOpen || isGenericOverlayOpen;

  const value = {
    isLanguageScreenOpen,
    isLocationScreenOpen,
    isLocationListScreenOpen,
    isGenericOverlayOpen,
    setLanguageScreenOpen,
    setLocationScreenOpen,
    setLocationListScreenOpen,
    setGenericOverlayOpen,
    setHasActiveOverlay,
    hasActiveOverlay,
  };

  return <ScreenOverlayContext.Provider value={value}>{children}</ScreenOverlayContext.Provider>;
};

export const useScreenOverlay = () => {
  const context = useContext(ScreenOverlayContext);
  if (!context) throw new Error('useScreenOverlay must be used within ScreenOverlayProvider');
  return context;
};

// ========== AUTH OVERLAY CONTEXT ==========
interface AuthOverlayContextType {
  isAuthOverlayOpen: boolean;
  setIsAuthOverlayOpen: (value: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  openAuthOverlay: () => void;
}

const AuthOverlayContext = createContext<AuthOverlayContextType | undefined>(undefined);

const AuthOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthOverlay = () => {
    setIsAuthOverlayOpen(true);
    setAuthMode('login');
  };

  const value = {
    isAuthOverlayOpen,
    setIsAuthOverlayOpen,
    authMode,
    setAuthMode,
    openAuthOverlay,
  };

  return <AuthOverlayContext.Provider value={value}>{children}</AuthOverlayContext.Provider>;
};

export const useAuthOverlay = () => {
  const context = useContext(AuthOverlayContext);
  if (!context) throw new Error('useAuthOverlay must be used within AuthOverlayProvider');
  return context;
};

// ========== CURRENCY CONTEXT ==========
type Currency = 'HTG' | 'HTD' | 'USD';

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (price: number, bundlePrice?: number) => string;
  convertPrice: (price: number, bundlePrice?: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      case 'HTG': return bundlePrice ? basePrice : basePrice * 132;
      case 'HTD': return (bundlePrice ? basePrice : basePrice * 132) / 5;
      case 'USD': return bundlePrice ? basePrice / 132 : basePrice;
      default: return basePrice;
    }
  }, [currentCurrency]);

  const formatPrice = useCallback((price: number, bundlePrice?: number) => {
    const convertedPrice = convertPrice(price, bundlePrice);
    return parseFloat(convertedPrice.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }, [convertPrice]);

  const value = {
    currentCurrency,
    setCurrency,
    toggleCurrency,
    formatPrice,
    convertPrice
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};

// ========== MAIN APP COMPONENT ==========
function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <CurrencyProvider>
              <AuthProvider>
                <AuthOverlayProvider>
                  <ScreenOverlayProvider>
                    <HeaderFilterProvider>
                      <div className="App min-h-screen h-full bg-background text-foreground flex flex-col">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/coupons" element={<CouponsPage />} />
                        </Routes>
                        <Toasters />
                      </div>
                    </HeaderFilterProvider>
                  </ScreenOverlayProvider>
                </AuthOverlayProvider>
              </AuthProvider>
            </CurrencyProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;