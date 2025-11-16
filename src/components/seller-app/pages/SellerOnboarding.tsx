import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, Users, BarChart3, ArrowLeft, Check, Star, 
  Shield, Zap, Crown, CreditCard, Clock, BadgeCheck, TrendingUp,
  MapPin, Phone, Mail, Building, FileText, UserCheck
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

  // Payment plans
  const sellerPlans = [
    {
      id: 'basic',
      name: 'Starter',
      price: 49,
      period: 'month',
      popular: false,
      features: [
        'Up to 50 products',
        'Basic analytics',
        'Standard support',
        'Mobile app access',
        'Payment processing'
      ],
      icon: Package,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      period: 'month',
      popular: true,
      features: [
        'Up to 500 products',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access',
        'Bulk product upload'
      ],
      icon: Zap,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      popular: false,
      features: [
        'Unlimited products',
        'Premium analytics',
        '24/7 dedicated support',
        'White-label solutions',
        'Advanced API',
        'Custom integrations',
        'Dedicated account manager'
      ],
      icon: Crown,
      color: 'orange'
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
          selected_plan: selectedPlan
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

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
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
    if (currentStep === 1 && !selectedPlan) {
      alert('Please select a seller plan');
      return false;
    }
    
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

  const getPlanColor = (color: string) => {
    const colors: any = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                {step === 1 && 'Choose Plan'}
                {step === 2 && 'Business Info'}
                {step === 3 && 'Review & Pay'}
                {step === 4 && 'Complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Plan Selection */}
      {currentStep === 1 && (
        <div className="p-4 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Choose Your Seller Plan
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your business needs. You can upgrade anytime.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sellerPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-xl border-2 p-6 transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 ${getPlanColor(plan.color)} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">Secure</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">Grow Fast</div>
              </div>
              <div className="text-center">
                <BadgeCheck className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">Verified</div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">24/7 Support</div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="text-center mt-8">
            <button
              onClick={nextStep}
              disabled={!selectedPlan}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue to Business Information
            </button>
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
              Tell us about your business to get started.
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
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="nonprofit">Non-Profit</option>
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
                  placeholder="+1 (555) 123-4567"
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
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={applicationData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Country"
                />
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
                  Tax ID / EIN
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

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Payment */}
      {currentStep === 3 && (
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Review & Payment
            </h1>
            <p className="text-base text-gray-600">
              Review your information and complete payment to start selling.
            </p>
          </div>

          {/* Selected Plan Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Selected Plan</h3>
            {selectedPlan && (() => {
              const plan = sellerPlans.find(p => p.id === selectedPlan);
              if (!plan) return null;
              const Icon = plan.icon;
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getPlanColor(plan.color)} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{plan.name} Plan</div>
                      <div className="text-gray-600">${plan.price}/{plan.period}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${plan.price}</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Business Information Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Business Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Business Name</div>
                <div>{applicationData.businessName}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Business Type</div>
                <div>{applicationData.businessType}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Contact</div>
                <div>{applicationData.phone} • {applicationData.email}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Location</div>
                <div>{applicationData.city}, {applicationData.country}</div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                  By checking this box, you agree to pay the monthly subscription fee and comply with our seller policies.
                </p>
              </div>
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!applicationData.agreeToTerms || isLoading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isLoading ? 'Processing...' : 'Complete Payment & Apply'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && (
        <div className="p-4 space-y-6 max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h1>
          
          <p className="text-base text-gray-600 mb-8">
            Thank you for your application to become a seller. Our team will review your information and get back to you within 2-3 business days.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <span>Verification team reviews your application</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>You'll receive an email with next steps</span>
              </div>
              <div className="flex items-center space-x-3">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
                <span>Get approved and start selling immediately</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate('/seller-dashboard/products')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Hidden form for save event */}
      <form onSubmit={handleSubmit} className="hidden">
        <button type="submit">Save</button>
      </form>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Processing your application...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOnboarding;