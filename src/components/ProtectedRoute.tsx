import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import MainLoginScreen from '@/components/auth/MainLoginScreen';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Inner component that uses language context
const LoginContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>
      )}
      
      <MainLoginScreen
        selectedLanguage={language}
        setSelectedLanguage={setLanguage}
        onContinueWithEmail={() => {
          // Handle email login flow
          // You'll need to integrate this with your auth context
          console.log('Continue with email');
        }}
        onContinueWithPhone={() => {
          console.log('Continue with phone');
        }}
        isCompact={false}
        showHeader={true}
      />
      
      <div className="text-center pb-6">
        <button
          onClick={() => window.location.href = '/'}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  // If not authenticated, show the login screen with LanguageProvider
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LanguageProvider>
          <LoginContent onClose={() => window.location.href = '/'} />
        </LanguageProvider>
      </div>
    );
  }

  // If authenticated, render the protected content wrapped in LanguageProvider
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
};

export default ProtectedRoute;