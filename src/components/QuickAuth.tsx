import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuickAuthProps {
  onClose?: () => void;
}

export function QuickAuth({ onClose }: QuickAuthProps) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await login(email, password);
        if (error) throw new Error(error);
        setSuccess('Login successful!');
        setTimeout(() => onClose?.(), 1500);
      } else {
        // Signup
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        const { error } = await signup(email, password, fullName);
        if (error) throw new Error(error);
        
        setSuccess('Account created! Please check your email for verification.');
        setTimeout(() => {
          setIsLogin(true); // Switch to login after signup
          setEmail('');
          setPassword('');
          setFullName('');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(5px)',
    },
    modal: {
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '16px',
      padding: '32px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#fff',
      marginBottom: '8px',
      textAlign: 'center' as const,
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '24px',
      textAlign: 'center' as const,
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: '#111',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '14px',
      marginBottom: '16px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: '#4285f4',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: '12px',
      transition: 'background 0.2s',
    },
    googleButton: {
      width: '100%',
      padding: '12px',
      background: '#111',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'background 0.2s',
    },
    toggleText: {
      textAlign: 'center' as const,
      color: '#666',
      fontSize: '14px',
      marginTop: '16px',
    },
    toggleLink: {
      color: '#4285f4',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    error: {
      background: '#2d1a1a',
      color: '#ef5350',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '13px',
      marginBottom: '16px',
      border: '1px solid #442222',
    },
    success: {
      background: '#1a2d1a',
      color: '#4caf50',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '13px',
      marginBottom: '16px',
      border: '1px solid #224422',
    },
    closeButton: {
      position: 'absolute' as const,
      top: '16px',
      right: '16px',
      background: 'transparent',
      border: 'none',
      color: '#666',
      fontSize: '24px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {onClose && (
          <button style={styles.closeButton} onClick={onClose}>×</button>
        )}
        
        <h2 style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={styles.subtitle}>
          {isLogin 
            ? 'Sign in to access your notes' 
            : 'Sign up to start taking notes'}
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
            minLength={6}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            ...styles.googleButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            style={styles.toggleLink}
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>

        {isLogin && (
          <p style={{ ...styles.toggleText, marginTop: '8px' }}>
            <span
              style={styles.toggleLink}
              onClick={() => {
                // Handle password reset
                if (email) {
                  supabase.auth.resetPasswordForEmail(email);
                  setSuccess('Password reset email sent!');
                } else {
                  setError('Please enter your email first');
                }
              }}
            >
              Forgot password?
            </span>
          </p>
        )}
      </div>
    </div>
  );
}