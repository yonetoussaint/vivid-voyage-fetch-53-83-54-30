// SellerOnboardingSuccess.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, UserCheck, Mail, Package } from 'lucide-react';
import ProductHeader from '@/components/product/ProductHeader';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

interface SellerOnboardingSuccessProps {
  applicationData: any;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const SellerOnboardingSuccess: React.FC<SellerOnboardingSuccessProps> = ({
  currentStep
}) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const { 
    currentLanguage, 
    setLanguage, 
    supportedLanguages,
    currentLocation 
  } = useLanguageSwitcher();

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, [currentStep, currentLanguage, currentLocation]);

  const handleLanguageChange = (language: any) => {
    setLanguage(language.code);
  };

  const handleOpenLocationScreen = () => {
    console.log('Open location screen from SellerOnboarding');
  };

  const handleBackClick = () => {
    navigate('/seller-dashboard/products');
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Become a Seller',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        <ProductHeader  
          onCloseClick={handleBackClick}  
          onShareClick={handleShareClick}  
          title="Become a Seller"
          actionButtons={[]}
          forceScrolledState={true}
          hideSearch={true}
          showSellerInfo={false}
          showProgressBar={true}
          currentStep={currentStep}
          totalSteps={4}
          progressBarColor="bg-blue-600"
          currentLanguage={currentLanguage}
          currentLocation={currentLocation}
          supportedLanguages={supportedLanguages}
          onLanguageChange={handleLanguageChange}
          onOpenLocationScreen={handleOpenLocationScreen}
          showLanguageSelector={true}
          showSettingsButton={false}
        />  
      </div>

      <div style={{ paddingTop: `${headerHeight}px` }} className="pb-24">
        <div className="p-4 space-y-6 text-center">
          <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Thank you for your application to become a seller. Your registration fee of 1,000 HTG will be processed and our team will review your information.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold mb-3 text-sm">What happens next?</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Complete your payment of 1,000 HTG</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-4 h-4 text-blue-500" />
                <span>Verification team reviews your application</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>You'll receive confirmation within 24 hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-blue-500" />
                <span>Start selling immediately after approval</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => navigate('/seller-dashboard/products')}
              className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/help')}
              className="w-full px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
            >
              Need Help? Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboardingSuccess;