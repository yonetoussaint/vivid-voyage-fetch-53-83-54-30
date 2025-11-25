import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus, setIsAuthOverlayOpen } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let hasRun = false;

    const handleCallback = async () => {
      // Prevent multiple executions
      if (hasRun) {
        console.log('⚠️ Callback already processed, skipping...');
        return;
      }
      hasRun = true;

      const startTime = Date.now();
      const MIN_DISPLAY_TIME = 1500; // Show loading screen for at least 1.5 seconds

      try {
        console.log('🔗 OAuth Callback - Processing...');

        const success = searchParams.get('success');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');

        // Handle OAuth errors from provider
        if (error) {
          throw new Error(`Authentication failed: ${error}`);
        }

        if (success === 'true' && accessToken && refreshToken) {
          console.log('✅ Setting Supabase session...');

          // Set the session with Supabase
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            throw new Error('Failed to set session');
          }

          console.log('✅ Session set, updating auth context...');

          // Update auth state
          await checkAuthStatus();

          console.log('✅ Redirecting to homepage...');

          // Ensure minimum display time before redirecting
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

          await new Promise(resolve => setTimeout(resolve, remainingTime));

          if (isMounted) {
            // Close auth overlay and redirect to home
            setIsAuthOverlayOpen(false);
            navigate('/', { replace: true });
          }

        } else {
          throw new Error('Missing authentication parameters');
        }

      } catch (error: any) {
        console.error('❌ OAuth callback error:', error);
        if (isMounted) {
          navigate('/auth/error', { 
            replace: true,
            state: { error: error.message }
          });
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo from public folder */}
        <img 
          src="/20251125_090458.png" 
          alt="Brand Logo" 
          className="h-16 w-auto mx-auto mb-8"
          style={{
            animation: 'fadeIn 0.5s ease-out'
          }}
        />

        {/* Loading spinner */}
        <div 
          className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"
          role="status"
          aria-label="Loading authentication"
        />
      </div>

      {/* Inline styles for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;