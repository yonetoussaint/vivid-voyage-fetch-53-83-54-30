import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, Users, BarChart3, CreditCard, 
  BadgeCheck, TrendingUp, Shield, Zap, CheckCircle,
  MapPin, Phone, Mail, UserCheck, ArrowRight, ArrowLeft,
  Star, Clock, Globe, Smartphone, Building, Store,
  FileText, Percent, Target, Award, Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  const formDataRef = useRef({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;

  const setCurrentStep = (step: number) => {
    if (externalCurrentStep !== undefined && onStepChange) {
      onStepChange(step);
    } else {
      setInternalCurrentStep(step);
    }
  };

  // Enhanced application form state
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
    businessDescription: '',
    shippingMethods: [] as string[],
    returnPolicy: '',
    agreeToTerms: false,
    marketingEmails: false
  });

  // Enhanced benefits with icons and colors
  const sellerBenefits = [
    {
      icon: Users,
      title: 'Reach Millions of Customers',
      description: 'Access our large customer base and grow your business exponentially',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights and performance metrics to optimize your sales',
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Protected transactions with escrow and fraud prevention',
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth Tools',
      description: 'Marketing tools and promotions to boost your visibility',
      color: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-500'
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Get started in minutes with our streamlined onboarding',
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      icon: BadgeCheck,
      title: 'Verified Status',
      description: 'Build trust with customers through verified seller badge',
      color: 'from-indigo-500 to-indigo-600',
      iconColor: 'text-indigo-500'
    },
    {
      icon: Target,
      title: 'Targeted Marketing',
      description: 'Reach the right customers with AI-powered recommendations',
      color: 'from-pink-500 to-pink-600',
      iconColor: 'text-pink-500'
    },
    {
      icon: Globe,
      title: 'Multi-Channel Sales',
      description: 'Sell across web, mobile, and social media platforms',
      color: 'from-teal-500 to-teal-600',
      iconColor: 'text-teal-500'
    }
  ];

  // Enhanced product categories with icons
  const productCategories = [
    { name: 'Electronics', icon: Smartphone },
    { name: 'Fashion & Apparel', icon: UserCheck },
    { name: 'Home & Garden', icon: Building },
    { name: 'Beauty & Personal Care', icon: Heart },
    { name: 'Sports & Outdoors', icon: Award },
    { name: 'Toys & Games', icon: Package },
    { name: 'Automotive', icon: TrendingUp },
    { name: 'Books & Media', icon: FileText },
    { name: 'Food & Beverages', icon: Star },
    { name: 'Health & Wellness', icon: Shield },
    { name: 'Jewelry & Accessories', icon: BadgeCheck },
    { name: 'Arts & Crafts', icon: Zap }
  ];

  // Shipping methods
  const shippingMethods = [
    'Standard Delivery',
    'Express Shipping',
    'Same-Day Delivery',
    'Pickup Points',
    'International Shipping'
  ];

  // Stats data
  const stats = [
    { value: '10K+', label: 'Active Sellers', sublabel: 'Growing community' },
    { value: '500K+', label: 'Products', sublabel: 'Wide variety' },
    { value: '2M+', label: 'Customers', sublabel: 'Active buyers' },
    { value: '24/7', label: 'Support', sublabel: 'Always here to help' }
  ];

  // Progress calculation
  useEffect(() => {
    const calculateProgress = () => {
      switch (currentStep) {
        case 1: return 25;
        case 2: return 60;
        case 3: return 85;
        case 4: return 100;
        default: return 0;
      }
    };
    setProgress(calculateProgress());
  }, [currentStep]);

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
      setCurrentStep(4);
    },
    onError: (error) => {
      console.error('Application submission error:', error);
      alert('Error submitting application. Please try again.');
      setIsLoading(false);
    }
  });

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

  const handleShippingToggle = (method: string) => {
    setApplicationData(prev => ({
      ...prev,
      shippingMethods: prev.shippingMethods.includes(method)
        ? prev.shippingMethods.filter(m => m !== method)
        : [...prev.shippingMethods, method]
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      const next = currentStep + 1;
      setCurrentStep(next);
    }
  };

  const prevStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 2:
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
        break;
      case 3:
        if (!applicationData.agreeToTerms) {
          alert('You must agree to the terms and conditions');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (!validateCurrentStep()) return;

    setIsLoading(true);
    try {
      await createSellerApplicationMutation.mutateAsync(applicationData);
    } catch (error) {
      console.error('Error in application:', error);
      setIsLoading(false);
    }
  };

  // Progress Steps Component
  const ProgressSteps = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            <span className={`text-xs mt-2 font-medium ${
              currentStep >= step ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step === 1 && 'Overview'}
              {step === 2 && 'Business Info'}
              {step === 3 && 'Payment'}
              {step === 4 && 'Complete'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced Sticky Button Component
  const StickyButton = () => {
    if (currentStep === 4) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-2xl z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex-1">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            {currentStep === 1 && (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span>Start Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 2 && (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                disabled={!applicationData.agreeToTerms || isLoading}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isLoading ? 'Processing...' : 'Pay 1,000 HTG & Register'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your seller profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-32">
      {/* Header with Progress */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Become a Seller
            </h1>
            <p className="text-gray-600 mt-2">
              Join Haiti's fastest growing marketplace. Start selling in minutes.
            </p>
          </div>
          <ProgressSteps />
        </div>
      </div>

      {/* Step 1: Enhanced Overview */}
      {currentStep === 1 && (
        <div className="p-4 space-y-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/25">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-bold mb-4">Start Your Selling Journey</h2>
                <p className="text-xl text-blue-100 mb-6">
                  Join thousands of successful Haitian entrepreneurs. One-time fee, lifetime access.
                </p>
                
                {/* Registration Fee Card */}
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">1,000 HTG</div>
                      <div className="text-blue-100">One-Time Registration</div>
                    </div>
                    <div className="flex items-center space-x-2 text-green-300">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">No Monthly Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="font-semibold text-gray-800 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Benefits Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Everything You Need to Succeed
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                JM
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 font-medium italic mb-2">
                  "Since joining this platform, my sales have increased by 300%. The one-time fee is the best investment I've made!"
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Jean Michel</span> • Fashion Store Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Enhanced Business Information */}
      {currentStep === 2 && (
        <div className="p-4 space-y-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Business Information
            </h2>
            <p className="text-gray-600 text-lg">
              Tell us about your business to get started
            </p>
          </div>

          <form className="space-y-8">
            {/* Business Basics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Business Basics</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={applicationData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={applicationData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-600" />
                <span>Contact Information</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+509 XX XX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your@business.com"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Business Location</span>
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Business Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={applicationData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={applicationData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Department
                    </label>
                    <select
                      name="country"
                      value={applicationData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              </div>
            </div>

            {/* Product Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span>Product Categories</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productCategories.map(({ name, icon: Icon }) => (
                  <label 
                    key={name} 
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      applicationData.productCategories.includes(name)
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={applicationData.productCategories.includes(name)}
                      onChange={() => handleCategoryToggle(name)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span>Additional Information</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    NIF (Tax ID)
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={applicationData.taxId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tax identification number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Years in Business
                  </label>
                  <select
                    name="yearsInBusiness"
                    value={applicationData.yearsInBusiness}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Business Description
                </label>
                <textarea
                  name="businessDescription"
                  value={applicationData.businessDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your business, products, and mission..."
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Enhanced Payment */}
      {currentStep === 3 && (
        <div className="p-4 space-y-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Payment & Registration
            </h2>
            <p className="text-gray-600 text-lg">
              Complete your registration with secure payment
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Summary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/25">
                <h3 className="text-xl font-bold mb-6 text-center">Registration Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-blue-500/30">
                    <span>One-Time Registration Fee</span>
                    <span className="font-bold text-lg">1,000 HTG</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-100">
                    <span>Validity Period</span>
                    <span className="font-semibold">Lifetime</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-100">
                    <span>Platform Access</span>
                    <span className="font-semibold">Full Features</span>
                  </div>
                  <div className="border-t border-blue-500/30 pt-4">
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span>Total Amount</span>
                      <span>1,000 HTG</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Included */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
                <div className="space-y-3">
                  {[
                    'Full seller dashboard access',
                    'Product listing management',
                    'Sales analytics & reports',
                    'Customer management tools',
                    'Marketing & promotion features',
                    '24/7 seller support',
                    'Secure payment processing',
                    'Mobile app access'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
                <div className="space-y-4">
                  {/* Mobile Money */}
                  <label className="block cursor-pointer group">
                    <div className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                      true ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 group-hover:border-gray-300'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          defaultChecked
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Mobile Money</div>
                          <div className="text-sm text-gray-600">Pay with NatCash, MonCash, or Digicel</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className="block cursor-pointer group">
                    <div className="border-2 border-gray-200 rounded-xl p-4 transition-all duration-200 group-hover:border-gray-300">
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Bank Transfer</div>
                          <div className="text-sm text-gray-600">Transfer to our bank account</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Credit Card */}
                  <label className="block cursor-pointer group">
                    <div className="border-2 border-gray-200 rounded-xl p-4 transition-all duration-200 group-hover:border-gray-300">
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">Pay with Visa, Mastercard, or American Express</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <label className="flex items-start space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={applicationData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                      I agree to the Seller Agreement, Terms of Service, and Privacy Policy.
                    </span>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      By checking this box, you agree to pay the one-time registration fee of 1,000 HTG and comply with our seller policies, community guidelines, and business standards.
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-4 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={applicationData.marketingEmails}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      Send me marketing tips and business insights
                    </span>
                    <p className="text-gray-600 mt-1">
                      Get weekly tips to grow your business (optional)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Enhanced Success */}
      {currentStep === 4 && (
        <div className="p-4 space-y-8 max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Welcome to our seller community! Your journey to business growth starts now. 
            We're reviewing your application and you'll hear from us within 24 hours.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-left">
            <h3 className="font-bold text-xl mb-6 text-center">What happens next?</h3>
            <div className="space-y-4">
              {[
                { icon: CreditCard, text: 'Complete your payment of 1,000 HTG', color: 'text-blue-500' },
                { icon: UserCheck, text: 'Verification team reviews your application', color: 'text-green-500' },
                { icon: Mail, text: 'You'll receive confirmation within 24 hours', color: 'text-purple-500' },
                { icon: Clock, text: 'Start selling immediately after approval', color: 'text-orange-500' },
                { icon: Zap, text: 'Set up your store and add products', color: 'text-yellow-500' }
              ].map(({ icon: Icon, text, color }, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <button
              onClick={() => navigate('/seller-dashboard/products')}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Go to Seller Dashboard
            </button>
            <button
              onClick={() => navigate('/help')}
              className="w-full px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Need Help? Contact Support
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Sticky Button */}
      <StickyButton />

      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div>
              <div className="font-semibold text-gray-900">Processing Registration</div>
              <div className="text-sm text-gray-600">Please wait while we set up your seller account...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOnboarding;