const BACKEND_URL = 'https://supabase-y8ak.onrender.com/api';

export const authService = {
  // Check if user is authenticated using stored token
  async checkAuthStatus() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { authenticated: false };
      }

      const response = await fetch(`${BACKEND_URL}/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth status check (token-based):', data);
        return { authenticated: true, user: data.user };
      } else {
        console.log('Auth status check failed:', response.status);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        return { authenticated: false };
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { authenticated: false };
    }
  },

  // Logout user - clear local storage and optionally notify backend
  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      
      // Clear local storage first
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      
      // Optionally notify backend about logout
      if (token) {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      console.log('Logout successful - token cleared from localStorage');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },

  // Sign in with token storage
  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign in successful - storing token in localStorage');
        
        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user || { email }));
        
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.message || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }
};