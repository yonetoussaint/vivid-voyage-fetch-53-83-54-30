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
        {/* Logo */}
       <img 
  src="/Logo.svg"  // Capital L to match actual filename
  alt="Brand Logo" 
  className="h-16 w-auto mx-auto mb-8"
  style={{
    animation: 'fadeIn 0.5s ease-out'
  }}
/>
        
        {/* Spinner */}
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"></div>
      </div>
      
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