import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus, setIsAuthOverlayOpen } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const minDisplayTime = 1500; // Minimum 1.5 seconds
    const startTime = Date.now();

    const handleCallback = async () => {
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

          // Calculate remaining time to meet minimum display
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

          // Wait for remaining time before redirecting
          await new Promise(resolve => setTimeout(resolve, remainingTime));

          if (isMounted) {
            setIsProcessing(false);
            // Close auth overlay and redirect to home
            setIsAuthOverlayOpen(false);
            navigate('/', { replace: true });
          }

        } else {
          throw new Error('Missing authentication parameters');
        }

      } catch (error: any) {
        console.error('❌ OAuth callback error:', error);
        
        // Ensure minimum display time even for errors
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        if (isMounted) {
          setIsProcessing(false);
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
  }, [navigate, searchParams, checkAuthStatus, setIsAuthOverlayOpen]);

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