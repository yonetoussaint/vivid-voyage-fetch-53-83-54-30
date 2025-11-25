import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus, setIsAuthOverlayOpen } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔗 OAuth Callback - Processing...');

        const success = searchParams.get('success');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const email = searchParams.get('email');
        const fullName = searchParams.get('full_name');

        if (success === 'true' && accessToken && refreshToken) {
          console.log('✅ Setting Supabase session...');

          // Set the session
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

          // Force close overlay and redirect
          setIsAuthOverlayOpen(false);
          navigate('/', { replace: true });

        } else {
          throw new Error('Missing authentication parameters');
        }

      } catch (error: any) {
        console.error('❌ OAuth callback error:', error);
        navigate('/auth/error', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, searchParams, checkAuthStatus, setIsAuthOverlayOpen]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-600 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
};

export default AuthCallback;