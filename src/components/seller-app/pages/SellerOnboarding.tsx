// SellerOnboardingWrapper.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SellerOnboardingOverview from './SellerOnboardingOverview';
import SellerOnboardingBusinessInfo from './SellerOnboardingBusinessInfo';
import SellerOnboardingPayment from './SellerOnboardingPayment';
import SellerOnboardingSuccess from './SellerOnboardingSuccess';

interface SellerOnboardingWrapperProps {
  onStepChange?: (step: number) => void;
  currentStep?: number;
}

const SellerOnboardingWrapper: React.FC<SellerOnboardingWrapperProps> = ({
  onStepChange,
  currentStep: externalCurrentStep
}) => {
  const { user } = useAuth();
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;

  const setCurrentStep = (step: number) => {
    if (externalCurrentStep !== undefined && onStepChange) {
      onStepChange(step);
    } else {
      setInternalCurrentStep(step);
    }
  };

  const [applicationData, setApplicationData] = useState({
    businessName: '',
    businessType: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    taxId: '',
    businessRegistration: '',
    yearsInBusiness: '',
    annualRevenue: '',
    productCategories: [] as string[],
    website: '',
    socialMedia: '',
    references: '',
    agreeToTerms: false
  });

  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching seller data:', error);
        return null;
      }
      return data;
    },
  });

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {currentStep === 1 && (
        <SellerOnboardingOverview
          applicationData={applicationData}
          setApplicationData={setApplicationData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <SellerOnboardingBusinessInfo
          applicationData={applicationData}
          setApplicationData={setApplicationData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 3 && (
        <SellerOnboardingPayment
          applicationData={applicationData}
          setApplicationData={setApplicationData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          user={user}
        />
      )}
      {currentStep === 4 && (
        <SellerOnboardingSuccess
          applicationData={applicationData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
    </>
  );
};

export default SellerOnboardingWrapper;