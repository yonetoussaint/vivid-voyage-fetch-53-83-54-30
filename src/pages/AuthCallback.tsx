import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus, setIsAuthOverlayOpen } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const minDisplayTime = 1500; // Minimum 1.5 seconds
    const maxWaitTime = 10000; // Maximum 10 seconds timeout
    const startTime = Date.now();

    const handleCallback = async () => {
      try {
        console.log('🔗 OAuth Callback - Processing...');

        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Authentication timeout')), maxWaitTime)
        );

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
            throw new Error('Failed to set session: ' + sessionError.message);
          }

          console.log('✅ Session set, updating auth context...');

          // Update auth state
          await checkAuthStatus();

          console.log('✅ Auth context updated, waiting for minimum display time...');

          // Calculate remaining time to meet minimum display
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

          // Wait for remaining time before redirecting
          await Promise.race([
            new Promise(resolve => setTimeout(resolve, remainingTime)),
            timeoutPromise
          ]);

          if (isMounted) {
            console.log('✅ Redirecting to homepage...');
            setIsProcessing(false);
            // Close auth overlay and redirect to home
            setIsAuthOverlayOpen(false);
            navigate('/', { replace: true });
          }

        } else {
          throw new Error('Missing authentication parameters. Please try again.');
        }

      } catch (error: any) {
        console.error('❌ OAuth callback error:', error);
        
        if (isMounted) {
          // Ensure minimum display time even for errors
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          await new Promise(resolve => setTimeout(resolve, remainingTime));
          
          setIsProcessing(false);
          setError(error.message);
          
          // Wait a bit more to show error message, then redirect
          setTimeout(() => {
            if (isMounted) {
              navigate('/auth/error', { 
                replace: true,
                state: { error: error.message }
              });
            }
          }, 1000);
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, searchParams, checkAuthStatus, setIsAuthOverlayOpen]);

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <img 
            src="/20251125_090458.png" 
            alt="Brand Logo" 
            className="h-16 w-auto mx-auto mb-8"
          />
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Failed</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to error page...</p>
        </div>
      </div>
    );
  }

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
        <p className="mt-4 text-gray-600">
          {isProcessing ? 'Completing authentication...' : 'Redirecting...'}
        </p>
        
        {/* Optional: Add a progress bar for longer waits */}
        <div className="mt-6 w-48 mx-auto bg-gray-200 rounded-full h-1">
          <div 
            className="bg-red-500 h-1 rounded-full transition-all duration-300"
            style={{
              width: isProcessing ? '60%' : '100%'
            }}
          />
        </div>

        {/* Timeout warning for long waits */}
        <p className="mt-4 text-sm text-gray-500">
          This should only take a moment...
        </p>
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