import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, Users, BarChart3, CreditCard, 
  BadgeCheck, TrendingUp, Shield, Zap, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProgressBar from '@/components/shared/ProgressBar';

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const formDataRef = useRef({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Application form state
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

  // Progress steps configuration
  const progressSteps = [
    { number: 1, label: 'Overview' },
    { number: 2, label: 'Business Info' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Complete' }
  ];

  // Benefits of becoming a seller
  const sellerBenefits = [
    {
      icon: Users,
      title: 'Reach Millions of Customers',
      description: 'Access our large customer base and grow your business'
    },
    {
      icon: BarChart3,
      title: 'Powerful Analytics',
      description: 'Track your sales and understand customer behavior'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Get paid securely with our trusted payment system'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth',
      description: 'Scale your business with our seller tools and support'
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Start selling in minutes with our easy setup process'
    },
    {
      icon: BadgeCheck,
      title: 'Verified Badge',
      description: 'Build trust with customers with verified seller status'
    }
  ];

  // Product categories
  const productCategories = [
    'Electronics',
    'Fashion & Apparel',
    'Home & Garden',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Books & Media',
    'Food & Beverages',
    'Health & Wellness',
    'Jewelry & Accessories',
    'Arts & Crafts'
  ];

  // Fetch current seller data
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

  // Mutation for creating seller application
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
      setCurrentStep(4); // Move to success step
    },
    onError: (error) => {
      console.error('Application submission error:', error);
      alert('Error submitting application. Please try again.');
      setIsLoading(false);
    }
  });

  // Listen for save event from header
  useEffect(() => {
    const handleSave = () => {
      console.log('Save event received');
      handleSubmit();
    };

    window.addEventListener('saveEditProfile', handleSave);
    return () => {
      window.removeEventListener('saveEditProfile', handleSave);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setApplicationData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setApplicationData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;
    
    if (!validateForm()) {
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

  const validateForm = () => {
    if (currentStep === 2) {
      if (!applicationData.businessName.trim()) {
        alert('Business name is required');
        return false;
      }
      if (!applicationData.businessType.trim()) {
        alert('Business type is required');
        return false;
      }
      if (!applicationData.phone.trim()) {
        alert('Phone number is required');
        return false;
      }
      if (!applicationData.email.trim()) {
        alert('Email is required');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!applicationData.agreeToTerms) {
        alert('You must agree to the terms and conditions');
        return false;
      }
    }
    
    return true;
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sticky button component
  const StickyButton = () => {
    if (currentStep === 4) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          {currentStep > 1 ? (
            <>
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              {currentStep === 2 && (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              )}
              {currentStep === 3 && (
                <button
                  onClick={handleSubmit}
                  disabled={!applicationData.agreeToTerms || isLoading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{isLoading ? 'Processing...' : 'Pay 1,000 HTG & Register'}</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={nextStep}
              className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Start Application
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={progressSteps.length}
        steps={progressSteps}
        showStepText={true}
      />

      {/* Step 1: Overview */}
      {currentStep === 1 && (
        <div className="p-4 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Become a Seller
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful sellers in Haiti. Start your business today with a one-time registration fee.
            </p>
          </div>

          {/* Registration Fee Card */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">One-Time Registration Fee</h3>
            <div className="text-3xl font-bold mb-2">1,000 HTG</div>
            <p className="text-blue-100 text-sm">
              Pay once and start selling forever. No monthly fees, no hidden charges.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Why Sell With Us?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Active Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">500K+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Business Information */}
      {currentStep === 2 && (
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Business Information
            </h1>
            <p className="text-base text-gray-600">
              Tell us about your business to complete your registration.
            </p>
          </div>

          <form className="space-y-6">
            {/* ... (rest of the business form remains the same) ... */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={applicationData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={applicationData.businessType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select business type</option>
                  <option value="individual">Individual Seller</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </div>
            </div>

            {/* ... (rest of the form fields) ... */}
          </form>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment & Registration
            </h1>
            <p className="text-base text-gray-600">
              Complete your registration by paying the one-time fee.
            </p>
          </div>

          {/* ... (payment content remains the same) ... */}
        </div>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && (
        <div className="p-4 space-y-6 max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h1>
          
          <p className="text-base text-gray-600 mb-8">
            Thank you for your application to become a seller. Your registration fee of 1,000 HTG will be processed and our team will review your information.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span>Complete your payment of 1,000 HTG</span>
              </div>
              <div className="flex items-center space-x-3">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
                <span>Verification team reviews your application</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-blue-500" />
                <span>Start selling immediately after approval</span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={() => navigate('/seller-dashboard/products')}
              className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/help')}
              className="w-full px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Need Help? Contact Support
            </button>
          </div>
        </div>
      )}

      {/* Sticky Continue Button */}
      <StickyButton />

      {/* Hidden form for save event */}
      <form onSubmit={handleSubmit} className="hidden">
        <button type="submit">Save</button>
      </form>

      {/* Loading overlay */}
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

export default SellerOnboarding;