import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  type: string;
  field: string;
  prompt: string | null;
  tags: string[];
  is_custom: boolean;
  created_at: string;
  updated_at: string;
  // UI-only flags (not in DB)
  _custom?: boolean;
  _static?: boolean;
  wordGoal?: number;
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

  // Notes
  notes: Note[];
  notesLoading: boolean;
  notesError: string | null;
  refetchNotes: () => Promise<void>;
  addNote: (data: Partial<Note>) => Promise<{ data: Note | null; error: string | null }>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<{ data: Note | null; error: string | null }>;
  deleteNote: (id: string) => Promise<{ error: string | null }>;

  // Validation
  validatePassword: (pwd: string) => string | null;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ error: 'AuthProvider not mounted' }),
  signup: async () => ({ error: 'AuthProvider not mounted' }),
  logout: async () => {},
  checkAuthStatus: async () => {},
  handleOTPSignIn: async () => {},
  checkIfFollowing: async () => false,
  toggleFollowSeller: async () => ({ success: false, error: 'AuthProvider not mounted' }),
  followedSellers: [],
  notes: [],
  notesLoading: false,
  notesError: null,
  refetchNotes: async () => {},
  addNote: async () => ({ data: null, error: 'AuthProvider not mounted' }),
  updateNote: async () => ({ data: null, error: 'AuthProvider not mounted' }),
  deleteNote: async () => ({ error: 'AuthProvider not mounted' }),
  validatePassword: () => null,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,            setUser]            = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,       setIsLoading]       = useState(true);
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);

  // ── Notes state ─────────────────────────────────────────────────────────────
  const [notes,        setNotes]        = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError,   setNotesError]   = useState<string | null>(null);
  const notesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Validate password ────────────────────────────────────────────────────────
  const validatePassword = useCallback((pwd: string): string | null => {
    if (pwd.length < 8)              return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(pwd))   return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(pwd))   return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(pwd))      return 'Password must contain at least one number';
    return null;
  }, []);

  // ── Map Supabase user ────────────────────────────────────────────────────────
  const mapSupabaseUser = useCallback((supabaseUser: SupabaseUser): User => ({
    id:              supabaseUser.id,
    email:           supabaseUser.email || '',
    full_name:       supabaseUser.user_metadata?.full_name,
    profile_picture: supabaseUser.user_metadata?.profile_picture,
  }), []);

  // ── Follow helpers ───────────────────────────────────────────────────────────
  const loadFollowedSellers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('seller_follows')
        .select('seller_id')
        .eq('user_id', userId);
      if (error) { console.error('Error loading followed sellers:', error); return; }
      setFollowedSellers(data?.map(item => item.seller_id) || []);
    } catch (error) {
      console.error('Error loading followed sellers:', error);
      setFollowedSellers([]);
    }
  };

  const checkIfFollowing = async (sellerId: string): Promise<boolean> => {
    if (!user) return false;
    return followedSellers.includes(sellerId);
  };

  const toggleFollowSeller = async (sellerId: string, sellerName: string, currentFollowStatus: boolean) => {
    if (!user) return { success: false, error: 'User not logged in' };
    try {
      if (currentFollowStatus) {
        const { error } = await supabase.from('seller_follows').delete().eq('user_id', user.id).eq('seller_id', sellerId);
        if (error) throw error;
        setFollowedSellers(prev => prev.filter(id => id !== sellerId));
      } else {
        const { error } = await supabase.from('seller_follows').insert([{ user_id: user.id, seller_id: sellerId }]);
        if (error) {
          if (error.code === '23505') { setFollowedSellers(prev => [...prev, sellerId]); return { success: true }; }
          throw error;
        }
        setFollowedSellers(prev => [...prev, sellerId]);
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error toggling follow status:', error);
      return { success: false, error: error.message };
    }
  };

  // ── Notes: fetch ─────────────────────────────────────────────────────────────
  const fetchNotes = useCallback(async (userId?: string) => {
    const uid = userId || user?.id;
    if (!uid || uid.startsWith('otp_')) {
      // OTP users may have fake IDs — skip DB fetch
      setNotes([]);
      setNotesLoading(false);
      return;
    }

    setNotesLoading(true);
    setNotesError(null);

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes((data as Note[]) || []);
    } catch (err: any) {
      console.error('[notes] fetch error:', err);
      setNotesError(err.message);
    } finally {
      setNotesLoading(false);
    }
  }, [user]);

  // ── Notes: realtime subscription (starts when user is set) ───────────────────
  const subscribeToNotes = useCallback((userId: string) => {
    // Clean up existing channel
    if (notesChannelRef.current) {
      supabase.removeChannel(notesChannelRef.current);
    }

    const channel = supabase
      .channel(`notes_${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotes(prev => {
              const exists = prev.some(n => n.id === (payload.new as Note).id);
              return exists ? prev : [payload.new as Note, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setNotes(prev => prev.map(n => n.id === (payload.new as Note).id ? payload.new as Note : n));
          } else if (payload.eventType === 'DELETE') {
            setNotes(prev => prev.filter(n => n.id !== (payload.old as Note).id));
          }
        }
      )
      .subscribe();

    notesChannelRef.current = channel;
  }, []);

  const unsubscribeFromNotes = useCallback(() => {
    if (notesChannelRef.current) {
      supabase.removeChannel(notesChannelRef.current);
      notesChannelRef.current = null;
    }
  }, []);

  // ── Notes: CRUD ──────────────────────────────────────────────────────────────
  const addNote = useCallback(async (noteData: Partial<Note>) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id:   user.id,
          title:     noteData.title   || 'Untitled',
          type:      noteData.type    || 'note',
          field:     noteData.field   || 'personal',
          prompt:    noteData.prompt  || null,
          tags:      noteData.tags    || [],
          content:   noteData.content || null,
          is_custom: true,
        })
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data as Note, ...prev.filter(n => n.id !== (data as Note).id)]);
      return { data: data as Note, error: null };
    } catch (err: any) {
      console.error('[notes] addNote error:', err);
      return { data: null, error: err.message };
    }
  }, [user]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      const payload: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.title   !== undefined) payload.title   = updates.title;
      if (updates.type    !== undefined) payload.type    = updates.type;
      if (updates.field   !== undefined) payload.field   = updates.field;
      if (updates.prompt  !== undefined) payload.prompt  = updates.prompt;
      if (updates.tags    !== undefined) payload.tags    = updates.tags;
      if (updates.content !== undefined) payload.content = updates.content;

      const { data, error } = await supabase
        .from('notes')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === id ? data as Note : n));
      return { data: data as Note, error: null };
    } catch (err: any) {
      console.error('[notes] updateNote error:', err);
      return { data: null, error: err.message };
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id)); // optimistic
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) { fetchNotes(); throw error; }
      return { error: null };
    } catch (err: any) {
      console.error('[notes] deleteNote error:', err);
      return { error: err.message };
    }
  }, [fetchNotes]);

  // ── OTP sign-in ──────────────────────────────────────────────────────────────
  const handleOTPSignIn = async (userData: any) => {
    try {
      const otpUser: User = {
        id:              userData.id || `otp_${userData.email}`,
        email:           userData.email,
        full_name:       userData.full_name || userData.email.split('@')[0],
        profile_picture: userData.profile_picture,
      };
      setUser(otpUser);
      setIsAuthenticated(true);
      localStorage.setItem('otp_user', JSON.stringify(otpUser));
      localStorage.setItem('otp_auth', 'true');
      localStorage.setItem('auth_method', 'otp');
      // Load notes for OTP user
      fetchNotes(otpUser.id);
      subscribeToNotes(otpUser.id);
    } catch (error) {
      console.error('Error handling OTP sign-in:', error);
      throw error;
    }
  };

  // ── Check auth status ────────────────────────────────────────────────────────
  const checkAuthStatus = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        const otpUser = localStorage.getItem('otp_auth') === 'true' ? localStorage.getItem('otp_user') : null;
        if (otpUser) {
          const userData = JSON.parse(otpUser);
          setUser(userData); setIsAuthenticated(true);
          loadFollowedSellers(userData.id);
          fetchNotes(userData.id);
          subscribeToNotes(userData.id);
        } else {
          setUser(null); setIsAuthenticated(false); setFollowedSellers([]); setNotes([]);
        }
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        const userData = mapSupabaseUser(session.user);
        setUser(userData); setIsAuthenticated(true);
        loadFollowedSellers(session.user.id);
        fetchNotes(session.user.id);
        subscribeToNotes(session.user.id);
      } else {
        const otpUser = localStorage.getItem('otp_auth') === 'true' ? localStorage.getItem('otp_user') : null;
        if (otpUser) {
          const userData = JSON.parse(otpUser);
          setUser(userData); setIsAuthenticated(true);
          fetchNotes(userData.id);
          subscribeToNotes(userData.id);
        } else {
          setUser(null); setIsAuthenticated(false); setFollowedSellers([]); setNotes([]);
          unsubscribeFromNotes();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null); setIsAuthenticated(false); setFollowedSellers([]); setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Signup ───────────────────────────────────────────────────────────────────
  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes('already registered') || error.message.includes('already exists'))
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        else if (error.message.includes('Password should be'))
          errorMessage = 'Password must be at least 6 characters long.';
        return { error: errorMessage };
      }

      if (data.user) return { user: mapSupabaseUser(data.user) };
      return {};
    } catch (error: any) {
      return { error: error.message || 'An error occurred during signup' };
    }
  };

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials'))
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        else if (error.message.includes('Email not confirmed'))
          errorMessage = 'Please verify your email address before logging in.';
        else if (error.message.includes('network'))
          errorMessage = 'Network error. Please check your internet connection.';
        else if (error.message.includes('User not found'))
          errorMessage = 'No account found with this email. Please sign up first.';
        return { error: errorMessage };
      }

      if (data.user) {
        const userData = mapSupabaseUser(data.user);
        setUser(userData); setIsAuthenticated(true);
        loadFollowedSellers(data.user.id);
        fetchNotes(data.user.id);
        subscribeToNotes(data.user.id);
        return { user: userData };
      }

      return { error: 'Login failed. Please try again.' };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during login.' };
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      localStorage.removeItem('otp_auth');
      localStorage.removeItem('otp_user');
      localStorage.removeItem('auth_method');

      const { error } = await supabase.auth.signOut();
      if (error) console.error('Logout error:', error);

      setUser(null); setIsAuthenticated(false);
      setFollowedSellers([]); setNotes([]);
      unsubscribeFromNotes();
    } catch (error) {
      console.error('Logout exception:', error);
    }
  };

  // ── Restore OTP auth on mount ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const otpAuth = localStorage.getItem('otp_auth');
      const otpUser = localStorage.getItem('otp_user');
      if (otpAuth === 'true' && otpUser) {
        const userData = JSON.parse(otpUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error restoring OTP auth:', error);
    }
  }, []);

  // ── Auth state listener ──────────────────────────────────────────────────────
  useEffect(() => {
    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = mapSupabaseUser(session.user);
        setUser(userData); setIsAuthenticated(true);
        loadFollowedSellers(session.user.id);
        fetchNotes(session.user.id);
        subscribeToNotes(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('otp_auth');
        localStorage.removeItem('otp_user');
        localStorage.removeItem('auth_method');
        setUser(null); setIsAuthenticated(false);
        setFollowedSellers([]); setNotes([]);
        unsubscribeFromNotes();
      }
      setIsLoading(false);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // ── Cleanup notes channel on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => { unsubscribeFromNotes(); };
  }, [unsubscribeFromNotes]);

  const value: AuthContextType = {
    user, isAuthenticated, isLoading,
    login, signup, logout, checkAuthStatus,
    handleOTPSignIn,
    checkIfFollowing, toggleFollowSeller, followedSellers,
    notes, notesLoading, notesError,
    refetchNotes: () => fetchNotes(),
    addNote, updateNote, deleteNote,
    validatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
