import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, BarChart3, CheckCircle, CreditCard,Zap, UserCheck, Mail, Package, Store, TrendingUp, Shield, Users, Clock, Headphones } from 'lucide-react';

import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroBanner from '@/components/home/HeroBanner';
import ProductHeader from '@/components/product/ProductHeader';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

interface SellerOnboardingProps {
  onStepChange?: (step: number) => void;
  currentStep?: number;
}

const SellerOnboarding: React.FC<SellerOnboardingProps> = ({
  onStepChange,
  currentStep: externalCurrentStep
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Language context
  const { 
    currentLanguage, 
    setLanguage, 
    supportedLanguages,
    currentLocation 
  } = useLanguageSwitcher();

  const formDataRef = useRef({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Ben 10 Cartoon Video from Wikimedia - Fixed video configuration
  const onboardingVideoBanner = {
    id: 'seller-onboarding-video',
    image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    alt: 'Sample Video',
    title: 'Power Up Your Business!',
    subtitle: 'Transform your selling potential with super-powered tools and reach',
    type: 'video' as const,
  };

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
    },
    onError: (error) => {
      console.error('Application submission error:', error);
      alert('Error submitting application. Please try again.');
      setIsLoading(false);
    }
  });

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
    const next = currentStep + 1;
    setCurrentStep(next);
  };

  const prevStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
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

  // Language change handler
  const handleLanguageChange = (language: any) => {
    console.log('Language changed in SellerOnboarding:', language);
    setLanguage(language.code);
  };

  // Location screen handler
  const handleOpenLocationScreen = () => {
    console.log('Open location screen from SellerOnboarding');
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/seller-dashboard/products');
  };

  // Handle share click
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

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={handleBack} className="text-gray-600 text-sm font-medium">
              {currentStep > 1 ? '← Back' : '× Close'}
            </button>
            {currentStep > 1 && currentStep < 4 && (
              <span className="text-sm font-medium text-gray-900">
                Step {currentStep - 1} of 3
              </span>
            )}
            <div className="w-12"></div>
          </div>
          {currentStep > 1 && currentStep < 4 && (
            <div className="mt-3">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-24">
        {/* Step 1: Overview */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-8">
              <h1 className="text-2xl font-bold mb-2">Become a Seller</h1>
              <p className="text-blue-100 text-sm">
                Join thousands of successful sellers in Haiti. Start your business today with a one-time registration fee.
              </p>
            </div>

            {/* Video Banner */}
            <div className="px-4">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  poster="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop"
                >
                  <source src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Fee Card */}
            <div className="px-4">
              <div className="bg-white rounded-lg border-2 border-blue-500 p-5 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">One-Time Registration Fee</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">1,000 HTG</div>
                <p className="text-gray-600 text-xs">
                  Pay once and start selling forever. No monthly fees, no hidden charges.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="px-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Why Sell With Us?</h3>
              <div className="grid grid-cols-2 gap-3">
                {sellerBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="bg-white rounded-lg border p-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-xs mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-xs leading-snug">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 pb-4">
              <div className="bg-white rounded-lg border p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">10K+</div>
                    <div className="text-xs text-gray-600">Sellers</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">500K+</div>
                    <div className="text-xs text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">24/7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Information */}
        {currentStep === 2 && (
          <div className="p-4 space-y-4">
            <div className="mb-2">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Business Information</h1>
              <p className="text-sm text-gray-600">Tell us about your business</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={applicationData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={applicationData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+509"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Business Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={applicationData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={applicationData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Department
                  </label>
                  <select
                    name="country"
                    value={applicationData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="ouest">Ouest</option>
                    <option value="nord">Nord</option>
                    <option value="nord-est">Nord-Est</option>
                    <option value="artibonite">Artibonite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product Categories (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {productCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer bg-white border rounded-lg px-3 py-2">
                      <input
                        type="checkbox"
                        checked={applicationData.productCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-xs">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    NIF (Tax ID)
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={applicationData.taxId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Years in Business
                  </label>
                  <select
                    name="yearsInBusiness"
                    value={applicationData.yearsInBusiness}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="p-4 space-y-4">
            <div className="mb-2">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Payment & Registration</h1>
              <p className="text-sm text-gray-600">Complete your registration</p>
            </div>

            {/* Payment Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-sm">Registration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Registration Fee</span>
                  <span className="font-semibold">1,000 HTG</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Validity</span>
                  <span>Lifetime</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">1,000 HTG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-start space-x-3 bg-white border-2 border-blue-500 rounded-lg p-3 cursor-pointer">
                  <input type="radio" name="paymentMethod" defaultChecked className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Mobile Money</div>
                    <div className="text-xs text-gray-600">NatCash, MonCash, Digicel</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 bg-white border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                  <input type="radio" name="paymentMethod" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Bank Transfer</div>
                    <div className="text-xs text-gray-600">Transfer to our account</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 bg-white border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                  <input type="radio" name="paymentMethod" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Credit/Debit Card</div>
                    <div className="text-xs text-gray-600">Visa, Mastercard, Amex</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start space-x-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={applicationData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-medium">I agree to the Terms of Service and Privacy Policy.</span>
                <p className="text-gray-600 mt-1">
                  By checking this box, you agree to pay 1,000 HTG and comply with our seller policies.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="p-4 space-y-4 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
              <p className="text-sm text-gray-600">
                Your registration will be reviewed within 24 hours. You'll receive a confirmation email.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-3 text-sm">What's Next?</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Complete payment of 1,000 HTG</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Team reviews your application</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Receive confirmation within 24hrs</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Package className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Start selling after approval</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm">
                Return to Dashboard
              </button>
              <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <button
            onClick={handleNext}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm active:bg-blue-700"
          >
            {currentStep === 1 && 'Get Started'}
            {currentStep === 2 && 'Continue to Payment'}
            {currentStep === 3 && 'Submit Application'}
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 mx-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};


export default SellerOnboarding;