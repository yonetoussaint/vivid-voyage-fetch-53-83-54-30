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

  // Trusted sellers logos data - rectangular logos for horizontal cards
  const trustedSellerLogos = [
    { id: 1, logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&crop=center' },
    { id: 2, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop&crop=center' },
    { id: 3, logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=120&h=60&fit=crop&crop=center' },
    { id: 4, logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop&crop=center' },
    { id: 5, logo: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=120&h=60&fit=crop&crop=center' },
    { id: 6, logo: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=120&h=60&fit=crop&crop=center' },
    { id: 7, logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop&crop=center' },
    { id: 8, logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&crop=center' },
  ];

  // Feature cards data with large images
  const featureCards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center',
      title: 'Global Market Access',
      description: 'Reach customers worldwide with our international shipping and multi-language support. Expand your business beyond local boundaries.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
      title: 'Advanced Analytics',
      description: 'Track your sales performance, customer behavior, and inventory with real-time analytics and detailed reporting.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-level security. Get paid instantly with our trusted payment processing system.'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=400&h=300&fit=crop&crop=center',
      title: 'Logistics Support',
      description: 'Integrated shipping solutions with major carriers. Real-time tracking and automated fulfillment processes.'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&crop=center',
      title: 'Multi-Region Stores',
      description: 'Get a store that flexes to fit multiple regions, retail locations, and B2B buyers. Each market gets its own customized shopping experience.'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
      title: '24/7 Seller Support',
      description: 'Dedicated support team available round the clock. Get help with listings, orders, and business growth strategies.'
    }
  ];

  // Auto-scroll logos - proper newsband style
  useEffect(() => {
    if (currentStep !== 1 || !logosContainerRef.current) return;

    const container = logosContainerRef.current;
    let animationId: number;
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
      animationId = requestAnimationFrame(scrollLogos);
    };

    // Start the animation
    animationId = requestAnimationFrame(scrollLogos);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
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

            {/* Trusted Sellers Logos Section - Horizontal cards with incessant auto-scroll */}
            <div className="bg-white py-8 border-y border-gray-200">
              <div className="text-center mb-6">
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
                  className="flex space-x-8 py-4"
                  style={{ 
                    scrollBehavior: 'auto',
                    width: 'max-content'
                  }}
                >
                  {[...trustedSellerLogos, ...trustedSellerLogos, ...trustedSellerLogos].map((seller, index) => (
                    <div 
                      key={`${seller.id}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <img 
                          src={seller.logo} 
                          alt="Trusted seller" 
                          className="w-24 h-12 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
              </div>
            </div>

            {/* Feature Cards Section - Vertical List with Large Images */}
            <div className="bg-gray-50 py-8 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Everything You Need to Succeed</h2>
                  <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                    Powerful tools and features designed to help your business grow and reach new heights
                  </p>
                </div>

                <div className="space-y-8">
                  {featureCards.map((card) => (
                    <div 
                      key={card.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="w-full">
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-3 text-lg">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {card.description}
                        </p>
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

        {/* Rest of the code remains the same for steps 2, 3, and 4 */}
        {/* Step 2: Business Information */}
        {currentStep === 2 && (
          <div className="p-4 space-y-4">
            {/* ... (step 2 content remains unchanged) ... */}
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="p-4 space-y-4">
            {/* ... (step 3 content remains unchanged) ... */}
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="p-4 space-y-6 text-center">
            {/* ... (step 4 content remains unchanged) ... */}
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