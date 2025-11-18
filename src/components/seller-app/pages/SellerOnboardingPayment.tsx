// SellerOnboardingPayment.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductHeader from '@/components/product/ProductHeader';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SellerOnboardingPaymentProps {
  applicationData: any;
  setApplicationData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  user: any;
}

const SellerOnboardingPayment: React.FC<SellerOnboardingPaymentProps> = ({
  applicationData,
  setApplicationData,
  currentStep,
  setCurrentStep,
  user
}) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    currentLanguage, 
    setLanguage, 
    supportedLanguages,
    currentLocation 
  } = useLanguageSwitcher();

  const createSellerApplicationMutation = useMutation({
    mutationFn: async (applicationData: any) => {
      if (!user?.id) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('seller_applications')
        .insert([{
          user_id: user.id,
          ...applicationData,
          status: 'pending',
          applied_at: new Date().toISOString(),
          registration_fee: 1000,
          currency: 'HTG'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('Application submitted successfully:', data);
      setCurrentStep(4);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Application submission error:', error);
      alert('Error submitting application. Please try again.');
      setIsLoading(false);
    }
  });

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
    setCurrentStep(2);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;

    if (!applicationData.agreeToTerms) {
      alert('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    console.log('Submitting seller application...');

    try {
      await createSellerApplicationMutation.mutateAsync(applicationData);
    } catch (error) {
      console.error('Error in application:', error);
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(2);
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
        <div className="p-4 space-y-4">
          <div className="mb-2">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Payment & Registration</h1>
            <p className="text-sm text-gray-600">Complete your registration</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-sm">Registration Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">One-Time Registration Fee</span>
                <span className="font-semibold">1,000 HTG</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Validity</span>
                <span>Lifetime</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>1,000 HTG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-sm">Payment Method</h3>
            <div className="space-y-3">
              {/* Mobile Money */}
              <div className="border-2 border-blue-500 rounded-lg p-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    defaultChecked
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold text-sm">Mobile Money</div>
                    <div className="text-xs text-gray-600">Pay with NatCash, MonCash, or Digicel</div>
                  </div>
                </label>
              </div>

              {/* Bank Transfer */}
              <div className="border-2 border-gray-200 rounded-lg p-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold text-sm">Bank Transfer</div>
                    <div className="text-xs text-gray-600">Transfer to our bank account</div>
                  </div>
                </label>
              </div>

              {/* Credit Card */}
              <div className="border-2 border-gray-200 rounded-lg p-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold text-sm">Credit/Debit Card</div>
                    <div className="text-xs text-gray-600">Pay with Visa, Mastercard, or American Express</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={applicationData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-medium">
                  I agree to the Seller Agreement, Terms of Service, and Privacy Policy.
                </span>
                <p className="text-gray-600 mt-1">
                  By checking this box, you agree to pay the one-time registration fee of 1,000 HTG and comply with our seller policies.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={handleSubmit}
          disabled={!applicationData.agreeToTerms || isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Processing...' : 'Pay 1,000 HTG & Register'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="hidden">
        <button type="submit">Save</button>
      </form>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Processing your registration...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOnboardingPayment;