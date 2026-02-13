import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import MainLoginScreen from '@/components/auth/MainLoginScreen';
import { X } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show the login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
          {/* Optional close button if you want to allow closing */}
          <button 
            onClick={() => window.location.href = '/'}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={20} />
          </button>
          
          <MainLoginScreen
            selectedLanguage="en"
            setSelectedLanguage={() => {}}
            onContinueWithEmail={() => {
              // Handle email login flow
              // You might want to set a specific state in your auth context
              console.log('Continue with email');
            }}
            onContinueWithPhone={() => {
              console.log('Continue with phone');
            }}
            isCompact={false}
            showHeader={true}
          />
          
          {/* Optional footer with back to home link */}
          <div className="text-center pb-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;