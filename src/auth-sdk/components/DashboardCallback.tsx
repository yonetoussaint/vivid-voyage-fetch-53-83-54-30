
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const DashboardCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Dashboard callback - checking authentication status...');
      
      try {
        // Check authentication status with backend
        const authStatus = await authService.checkAuthStatus();
        
        if (authStatus.authenticated) {
          console.log('Google OAuth successful, user data received:', authStatus.user);
          
          // Check if user already exists in your database
          const userExists = await checkUserExists(authStatus.user.email);
          
          if (userExists) {
            console.log('Existing user found, logging in...');
            
            // Store authentication data for existing user
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(authStatus.user));
            localStorage.setItem('authToken', 'authenticated_' + Date.now());
            
            // Trigger auth state change event
            window.dispatchEvent(new Event('authStateChanged'));
            
            // Redirect to dashboard
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 100);
          } else {
            console.log('New user, redirecting to sign-up...');
            
            // Store the Google user data temporarily for the sign-up process
            localStorage.setItem('googleUserData', JSON.stringify(authStatus.user));
            
            // Redirect to sign-up page to complete registration
            setTimeout(() => {
              navigate('/signin', { replace: true });
            }, 100);
          }
        } else {
          console.error('Authentication failed - user not authenticated');
          navigate('/signin?error=auth_failed', { replace: true });
        }
      } catch (error) {
        console.error('Error handling dashboard callback:', error);
        navigate('/signin?error=callback_error', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  // Function to check if user exists in your database
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('https://google-oauth-backend-2uta.onrender.com/api/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User check response:', data);
        return data.exists;
      }
      
      // If check fails, assume user doesn't exist (safer to redirect to signup)
      console.log('User check failed, assuming new user');
      return false;
    } catch (error) {
      console.error('Error checking user existence:', error);
      // If check fails, assume user doesn't exist
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Google Sign In</h2>
        <p className="text-gray-600">Please wait while we check your account...</p>
      </div>
    </div>
  );
};

export default DashboardCallback;
