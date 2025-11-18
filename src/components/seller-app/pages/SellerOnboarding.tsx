import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import ProductHeader from '@/components/product/ProductHeader';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguageSwitcher();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const steps = [
    {
      title: "Welcome",
      description: "Join thousands of successful sellers"
    },
    {
      title: "Business Info", 
      description: "Tell us about your business"
    },
    {
      title: "Complete",
      description: "You're all set to start selling"
    }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLanguageChange = (language: any) => {
    setLanguage(language.code);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple ProductHeader with only progress bar and language selector */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ProductHeader  
          hideBackButton={true}
          showProgressBar={true}
          currentStep={currentStep}
          totalSteps={totalSteps}
          progressBarColor="bg-blue-600"
          showLanguageSelector={true}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          showSettingsButton={false}
          showSellerInfo={false}
          actionButtons={[]}
        />  
      </div>

      {/* Content with padding for fixed header */}
      <div className="pt-20 pb-24 px-4">
        {/* Step Content */}
        {currentStep === 1 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Become a Seller</h1>
            <p className="text-gray-600">
              Start your selling journey with our simple onboarding process.
            </p>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-2">One-Time Fee: 1,000 HTG</h3>
              <p className="text-sm text-gray-600">Lifetime access, no hidden charges</p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Business Information</h1>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Business Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Business Type</option>
                <option>Individual</option>
                <option>Company</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Application Submitted!</h1>
            <p className="text-gray-600">
              Your seller application has been received. We'll review it and get back to you within 24 hours.
            </p>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                Complete your payment of 1,000 HTG to activate your seller account.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={currentStep === totalSteps ? () => navigate('/') : nextStep}
            className={`py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 ${
              currentStep > 1 ? 'flex-1' : 'w-full'
            }`}
          >
            {currentStep === totalSteps ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;