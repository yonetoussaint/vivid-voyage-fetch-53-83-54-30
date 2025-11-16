import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, Users, BarChart3, ArrowLeft, Check, Star, 
  Shield, Zap, Crown, CreditCard, Clock, BadgeCheck, TrendingUp,
  MapPin, Phone, Mail, Building, FileText, UserCheck, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroBanner from '@/components/home/HeroBanner';

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use ref to always have latest formData in event listener
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

  const handleBackClick = () => {
    navigate('/seller-dashboard/products');
  };

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
    if (currentStep === 4) return null; // Don't show on success step

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
    <div className="min-h-screen bg-background pb-24"> {/* Added padding bottom for sticky button */}
      {/* Banner Section */}
      <div className="relative">
        <HeroBanner 
          asCarousel={false} 
          showNewsTicker={false} 
          customHeight="180px" 
          sellerId={sellerData?.id}
          showEditButton={false}
          editButtonPosition="top-right"
          dataSource="seller_banners"
        />
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-6 bg-white border-b">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              <span className="text-xs mt-2 text-gray-600">
                {step === 1 && 'Overview'}
                {step === 2 && 'Business Info'}
                {step === 3 && 'Payment'}
                {step === 4 && 'Complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={applicationData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+509 XX XX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={applicationData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@business.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                name="address"
                value={applicationData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={applicationData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="country"
                  value={applicationData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  <option value="ouest">Ouest (Port-au-Prince)</option>
                  <option value="nord">Nord</option>
                  <option value="nord-est">Nord-Est</option>
                  <option value="nord-ouest">Nord-Ouest</option>
                  <option value="artibonite">Artibonite</option>
                  <option value="centre">Centre</option>
                  <option value="sud">Sud</option>
                  <option value="sud-est">Sud-Est</option>
                  <option value="grandanse">Grand'Anse</option>
                  <option value="nippes">Nippes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {productCategories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applicationData.productCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIF (Tax ID)
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={applicationData.taxId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tax identification number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business
                </label>
                <select
                  name="yearsInBusiness"
                  value={applicationData.yearsInBusiness}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select years</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>
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

          {/* Payment Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Registration Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">One-Time Registration Fee</span>
                <span className="font-semibold">1,000 HTG</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Validity</span>
                <span>Lifetime</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>1,000 HTG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-4">
              {/* Mobile Money */}
              <div className="border-2 border-blue-500 rounded-lg p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    defaultChecked
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold">Mobile Money</div>
                    <div className="text-sm text-gray-600">Pay with NatCash, MonCash, or Digicel</div>
                  </div>
                </label>
              </div>

              {/* Bank Transfer */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-gray-600">Transfer to our bank account</div>
                  </div>
                </label>
              </div>

              {/* Credit Card */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Pay with Visa, Mastercard, or American Express</div>
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
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
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
                <UserCheck className="w-5 h-5 text-blue-500" />
                <span>Verification team reviews your application</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>You'll receive confirmation within 24 hours</span>
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