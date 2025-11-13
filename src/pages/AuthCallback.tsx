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
  const [userInfo, setUserInfo] = useState<{
    email: string;
    full_name: string;
    avatar_url: string;
    is_new_user: boolean;
  } | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Handling OAuth callback...');
        
        const success = searchParams.get('success');
        const errorMessage = searchParams.get('message');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (errorMessage) {
          console.error('❌ OAuth error:', errorMessage);
          toast.error(decodeURIComponent(errorMessage));
          setStatus('error');
          return;
        }

        if (success === 'true' && accessToken && refreshToken) {
          // Set the session with tokens from server
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            throw new Error('Failed to set user session');
          }

          // Get user info from URL parameters
          const userData = {
            email: searchParams.get('email') || '',
            full_name: searchParams.get('full_name') || '',
            avatar_url: searchParams.get('avatar_url') || '',
            is_new_user: searchParams.get('is_new_user') === 'true',
          };

          setUserInfo(userData);
          
          // Update auth context
          await checkAuthStatus();
          
          setStatus('success');
          
          // Show success message
          if (userData.is_new_user) {
            toast.success(`Welcome to Mimaht, ${userData.full_name || userData.email}!`);
          } else {
            toast.success(`Welcome back, ${userData.full_name || userData.email}!`);
          }

          // Close auth overlay and redirect
          setTimeout(() => {
            setIsAuthOverlayOpen(false);
            navigate('/', { replace: true });
          }, 2000);

        } else {
          // Fallback to Supabase session check
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            await checkAuthStatus();
            setStatus('success');
            setTimeout(() => {
              setIsAuthOverlayOpen(false);
              navigate('/', { replace: true });
            }, 1000);
          } else {
            throw new Error('No valid session found');
          }
        }

      } catch (error: any) {
        console.error('💥 OAuth callback error:', error);
        toast.error(error.message || 'Authentication failed');
        setStatus('error');
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
          </>
        )}
        
        {status === 'success' && userInfo && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {userInfo.avatar_url && (
              <img 
                src={userInfo.avatar_url} 
                alt="Profile" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-green-500"
              />
            )}
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {userInfo.is_new_user ? 'Welcome to Mimaht!' : 'Welcome Back!'}
            </h2>
            
            <p className="text-gray-600 mb-2">
              {userInfo.full_name && <strong>{userInfo.full_name}</strong>}
              {userInfo.full_name && <br />}
              {userInfo.email}
            </p>
            
            <p className="text-green-600 font-medium">
              {userInfo.is_new_user ? 'Your account has been created!' : 'Successfully signed in!'}
            </p>
            
            <p className="text-gray-500 text-sm mt-4">
              Redirecting to homepage...
            </p>
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
              We couldn't sign you in. Please try again.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;