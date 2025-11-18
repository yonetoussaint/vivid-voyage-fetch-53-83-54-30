import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, Users, BarChart3, CreditCard, 
  BadgeCheck, TrendingUp, Shield, Zap, CheckCircle,
  MapPin, Phone, Mail, Play, UserCheck, Star,
  ShoppingBag, Globe, Truck, Headphones
} from 'lucide-react';
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
  const headerRef = useRef<HTMLDivElement>(null);
  const logosContainerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64); // Default fallback

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

  // Trusted sellers logos data - simple images/emojis for auto-scroll
  const trustedSellerLogos = [
    { id: 1, logo: '🛒', name: 'TechHaiti' },
    { id: 2, logo: '👗', name: 'FashionHT' },
    { id: 3, logo: '📱', name: 'ElectroPlus' },
    { id: 4, logo: '🏠', name: 'HomeStyle' },
    { id: 5, logo: '💄', name: 'BeautyCreole' },
    { id: 6, logo: '🚗', name: 'AutoPartsHT' },
    { id: 7, logo: '⚽', name: 'SportHaiti' },
    { id: 8, logo: '📚', name: 'BookWorld' },
    { id: 9, logo: '🍎', name: 'FoodMarket' },
    { id: 10, logo: '🎨', name: 'ArtisanCo' },
    { id: 11, logo: '💎', name: 'JewelHT' },
    { id: 12, logo: '🧸', name: 'KidZone' },
  ];

  // Feature cards data
  const featureCards = [
    {
      id: 1,
      image: '🛍️',
      title: 'Global Market Access',
      description: 'Reach customers worldwide with our international shipping and multi-language support. Expand your business beyond local boundaries.'
    },
    {
      id: 2,
      image: '📊',
      title: 'Advanced Analytics',
      description: 'Track your sales performance, customer behavior, and inventory with real-time analytics and detailed reporting.'
    },
    {
      id: 3,
      image: '🔒',
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-level security. Get paid instantly with our trusted payment processing system.'
    },
    {
      id: 4,
      image: '🚚',
      title: 'Logistics Support',
      description: 'Integrated shipping solutions with major carriers. Real-time tracking and automated fulfillment processes.'
    },
    {
      id: 5,
      image: '🌐',
      title: 'Multi-Region Stores',
      description: 'Get a store that flexes to fit multiple regions, retail locations, and B2B buyers. Each market gets its own customized shopping experience.'
    },
    {
      id: 6,
      image: '💬',
      title: '24/7 Seller Support',
      description: 'Dedicated support team available round the clock. Get help with listings, orders, and business growth strategies.'
    }
  ];

  // Auto-scroll logos - simplified for image band
  useEffect(() => {
    if (currentStep !== 1 || !logosContainerRef.current) return;

    const container = logosContainerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame

    const scrollLogos = () => {
      if (!container) return;

      scrollPosition += scrollSpeed;
      
      // Reset to start when reaching end for infinite scroll
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
    };

    const scrollInterval = setInterval(scrollLogos, 30); // Smooth scrolling

    return () => {
      clearInterval(scrollInterval);
    };
  }, [currentStep]);

  // Calculate header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        console.log('Header height:', height);
      }
    };

    // Initial calculation
    updateHeaderHeight();

    // Recalculate on window resize
    window.addEventListener('resize', updateHeaderHeight);

    // Recalculate after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, [currentStep, currentLanguage, currentLocation]); // Recalculate when these change

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
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    const next = currentStep + 1;
    setCurrentStep(next);
  };

  const prevStep = () => {
    if (currentStep === 1) {
      handleBackClick();
      return;
    }
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

  const validateStep2 = () => {
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
    return true;
  };

  const validateForm = () => {
    if (currentStep === 2) {
      return validateStep2();
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

  const getBottomButtonAction = () => {
    switch (currentStep) {
      case 1: return nextStep;
      case 2: return nextStep;
      case 3: return handleSubmit;
      default: return () => {};
    }
  };

  const getBottomButtonText = () => {
    switch (currentStep) {
      case 1: return 'Get Started';
      case 2: return 'Continue to Payment';
      case 3: return isLoading ? 'Processing...' : 'Pay 1,000 HTG & Register';
      default: return 'Continue';
    }
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ProductHeader for Onboarding with ref for height measurement */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        <ProductHeader  
          onCloseClick={handleBackClick}  
          onShareClick={handleShareClick}  
          // Hide title and action buttons on step 1 (overview)
          title={currentStep === 1 ? undefined : "Become a Seller"}
          actionButtons={[]}
          forceScrolledState={true}
          hideSearch={true}
          showSellerInfo={false}
          // Progress Bar - Only show from step 2 onwards
          showProgressBar={currentStep > 1}
          currentStep={currentStep}
          totalSteps={4}
          progressBarColor="bg-blue-600"
          // Language Context
          currentLanguage={currentLanguage}
          currentLocation={currentLocation}
          supportedLanguages={supportedLanguages}
          onLanguageChange={handleLanguageChange}
          onOpenLocationScreen={handleOpenLocationScreen}
          // Show language selector, hide settings button
          showLanguageSelector={true}
          showSettingsButton={false}
        />  
      </div>

      {/* Content with dynamic padding based on header height */}
      <div style={{ paddingTop: `${headerHeight}px` }} className="pb-24">
        {/* Step 1: Overview */}
        {currentStep === 1 && (
          <div className="space-y-0">
            {/* Hero Section - Centered and no background */}
            <div className="text-center px-4 py-6">
              <h1 className="text-2xl font-bold mb-2 text-gray-900">Become a Seller</h1>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Join thousands of successful sellers in Haiti. Start your business today with a one-time registration fee.
              </p>
            </div>

            {/* Hero Banner with Video - Full width and no curves */}
            <div className="w-full">
              <HeroBanner
                customBanners={[onboardingVideoBanner]}
                showNewsTicker={false}
                showCarouselBottomRow={false}
                asCarousel={false}
                className="rounded-none"
              />
            </div>

            {/* Trusted Sellers Logos Section - Auto-scroll image band */}
            <div className="bg-white py-6 border-y border-gray-200">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Trusted by Top Sellers in Haiti
                </h3>
                <p className="text-xs text-gray-500">
                  Join these successful businesses already selling on our platform
                </p>
              </div>
              
              <div className="relative overflow-hidden">
                <div 
                  ref={logosContainerRef}
                  className="flex space-x-8 py-2"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {[...trustedSellerLogos, ...trustedSellerLogos].map((seller, index) => (
                    <div 
                      key={`${seller.id}-${index}`}
                      className="flex-shrink-0 flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-200">
                        {seller.logo}
                      </div>
                      <span className="text-xs text-gray-600 mt-2 font-medium">
                        {seller.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
              </div>
            </div>

            {/* Feature Cards Section - Vertical List */}
            <div className="bg-gray-50 py-8 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Everything You Need to Succeed</h2>
                  <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                    Powerful tools and features designed to help your business grow and reach new heights
                  </p>
                </div>

                <div className="space-y-6">
                  {featureCards.map((card) => (
                    <div 
                      key={card.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl">
                          {card.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee Card */}
            <div className="px-4 mt-6">
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
            <div className="px-4 mt-6">
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
            <div className="px-4 mt-6 pb-4">
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
                    placeholder="Tax identification number"
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
                    <option value="">Select years</option>
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
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
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
        )}
      </div>

      {/* Bottom Sticky Button */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <button
            onClick={getBottomButtonAction()}
            disabled={(currentStep === 3 && !applicationData.agreeToTerms) || isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {getBottomButtonText()}
          </button>
        </div>
      )}

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

export default SellerOnboarding;