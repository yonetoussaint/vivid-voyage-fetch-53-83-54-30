import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus, setIsAuthOverlayOpen } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Handling OAuth callback...');
        console.log('📦 Search params:', Object.fromEntries([...searchParams]));

        const success = searchParams.get('success');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userId = searchParams.get('user_id');
        const email = searchParams.get('email');
        const fullName = searchParams.get('full_name');
        const avatarUrl = searchParams.get('avatar_url');
        const isNewUser = searchParams.get('is_new_user') === 'true';

        console.log('🔍 Checking OAuth parameters...');
        console.log('   Success:', success);
        console.log('   Access Token present:', !!accessToken);
        console.log('   Refresh Token present:', !!refreshToken);
        console.log('   User ID:', userId);
        console.log('   Email:', email);

        // Check if this is a successful OAuth callback
        if (success === 'true' && accessToken && refreshToken) {
          console.log('✅ OAuth success detected - setting session...');

          // Set the session with tokens from server
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            throw new Error('Failed to set user session: ' + sessionError.message);
          }

          console.log('✅ Session set successfully');

          // Verify the session was set
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          console.log('🔍 Current session after setting:', currentSession ? 'Session exists' : 'No session');

          if (!currentSession) {
            throw new Error('Session not set properly after OAuth');
          }

          console.log('✅ Session verified, updating auth context...');

          // Update auth context
          await checkAuthStatus();

          setStatus('success');

          // Show success message
          if (isNewUser) {
            toast.success(`Welcome to Mimaht, ${fullName || email}!`);
          } else {
            toast.success(`Welcome back, ${fullName || email}!`);
          }

          console.log('✅ Auth context updated, closing overlay and redirecting...');

          // Close auth overlay and redirect to home
          setTimeout(() => {
            setIsAuthOverlayOpen(false);
            navigate('/', { replace: true });
          }, 1500);

        } else {
          console.log('🔄 No OAuth params, checking existing session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('✅ Existing session found');
            await checkAuthStatus();
            setStatus('success');
            
            setTimeout(() => {
              setIsAuthOverlayOpen(false);
              navigate('/', { replace: true });
            }, 1000);
          } else {
            console.error('❌ No valid session found');
            throw new Error('No valid authentication session found');
          }
        }

      } catch (error: any) {
        console.error('💥 OAuth callback error:', error);
        toast.error(error.message || 'Authentication failed');
        setStatus('error');
        
        // Redirect to error page after a delay
        setTimeout(() => {
          navigate('/auth/error?message=' + encodeURIComponent(error.message || 'Authentication failed'), { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, searchParams, checkAuthStatus, setIsAuthOverlayOpen]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Authentication...
            </h2>
            <p className="text-gray-600">
              Please wait while we sign you in.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Debug Info:</p>
              <p>URL: {window.location.href}</p>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Successfully Signed In!
            </h2>
            
            <p className="text-gray-600 mb-4">
              You are being redirected to the homepage...
            </p>
            
            <div className="animate-pulse text-green-600 font-medium">
              ✓ Authentication Successful
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecting to error page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;