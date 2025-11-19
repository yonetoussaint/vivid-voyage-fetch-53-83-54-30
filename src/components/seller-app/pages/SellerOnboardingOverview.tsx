// SellerOnboardingOverview.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, Shield, TrendingUp, Zap, BadgeCheck, UserPlus, Package, CreditCard, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import HeroBanner from '@/components/home/HeroBanner';
import ProductHeader from '@/components/product/ProductHeader';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

interface SellerOnboardingOverviewProps {
  applicationData: any;
  setApplicationData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const SellerOnboardingOverview: React.FC<SellerOnboardingOverviewProps> = ({
  currentStep,
  setCurrentStep
}) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const logosContainerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const { 
    currentLanguage, 
    setLanguage, 
    supportedLanguages,
    currentLocation 
  } = useLanguageSwitcher();

  // Trusted sellers logos data
  const trustedSellerLogos = [
    { id: 1, logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&crop=center' },
    { id: 2, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop&crop=center' },
    { id: 3, logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=120&h=60&fit=crop&crop=center' },
    { id: 4, logo: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=120&h=60&fit=crop&crop=center' },
    { id: 5, logo: 'https://images.unsplash.com/photo-1556742049-bebda4e3858f?w=120&h=60&fit=crop&crop=center' },
    { id: 6, logo: 'https://images.unsplash.com/photo-1564419320-6870880221ad?w=120&h=60&fit=crop&crop=center' },
  ];

  // Feature cards data with large images
  const featureCards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1556742049-bebda4e3858f?w=400&h=300&fit=crop&crop=center',
      title: 'Global Market Access',
      description: 'Reach customers worldwide with our international shipping and multi-language support. Expand your business beyond local boundaries.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e3858f?w=400&h=300&fit=crop&crop=center',
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

  // Seller reviews data
  const sellerReviews = [
    {
      id: 1,
      name: 'Marie Jean-Baptiste',
      business: 'Fashion & Accessories',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
      rating: 5,
      review: 'The platform has completely transformed my business. I went from selling locally to reaching customers across Haiti. The analytics tools help me understand what my customers want.',
      date: '3 months ago',
      verified: true
    },
    {
      id: 2,
      name: 'Jean-Pierre Duval',
      business: 'Electronics Store',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      rating: 5,
      review: 'Best decision for my electronics business. The secure payment system and customer support are top-notch. I\'ve tripled my revenue in just 6 months!',
      date: '2 months ago',
      verified: true
    },
    {
      id: 3,
      name: 'Claudette Pierre',
      business: 'Home & Kitchen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      rating: 5,
      review: 'Amazing platform! The setup was so easy, and I started getting orders within the first week. The logistics support makes shipping hassle-free.',
      date: '4 months ago',
      verified: true
    },
    {
      id: 4,
      name: 'Robert Laurent',
      business: 'Sports & Outdoors',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      rating: 5,
      review: 'The multi-region store feature is a game-changer. I can now manage different locations effortlessly and the real-time inventory tracking is incredible.',
      date: '1 month ago',
      verified: true
    },
    {
      id: 5,
      name: 'Sylvie Augustin',
      business: 'Beauty & Health',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
      rating: 5,
      review: 'Professional tools at an affordable price. The one-time fee was worth every gourde. My beauty products are now reaching customers I never thought possible.',
      date: '5 months ago',
      verified: true
    },
    {
      id: 6,
      name: 'Jacques Michel',
      business: 'Books & Stationery',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      rating: 5,
      review: 'The 24/7 support team is incredibly responsive. They helped me optimize my listings and now my sales have increased by 200%. Highly recommend!',
      date: '2 months ago',
      verified: true
    }
  ];

  // Ben 10 Cartoon Video from Wikimedia
  const onboardingVideoBanner = {
    id: 'seller-onboarding-video',
    image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    alt: 'Sample Video',
    title: 'Power Up Your Business!',
    subtitle: 'Transform your selling potential with super-powered tools and reach',
    type: 'video' as const,
  };

  const journeySteps = [
    {
      id: 1,
      icon: UserPlus,
      title: 'Become a Seller',
      description: 'Complete a quick registration and pay the one-time fee of 1,000 HTG',
      details: ['Fill out seller application', 'Verify your identity', 'Pay registration fee', 'Get seller account access'],
      color: 'blue'
    },
    {
      id: 2,
      icon: Package,
      title: 'List Your Products',
      description: 'Add your products with photos, descriptions, and pricing',
      details: ['Upload product images', 'Write compelling descriptions', 'Set competitive prices', 'Organize into categories'],
      color: 'green'
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Receive Payments',
      description: 'Get paid securely when customers purchase your products',
      details: ['Accept multiple payment methods', 'Automatic payment processing', 'Instant fund transfers', 'Track all transactions'],
      color: 'purple'
    },
    {
      id: 4,
      icon: Truck,
      title: 'Ship & Deliver',
      description: 'Fulfill orders using our integrated logistics partners',
      details: ['Print shipping labels', 'Track deliveries in real-time', 'Automated customer updates', 'Handle returns easily'],
      color: 'orange'
    }
  ];

  useEffect(() => {
    if (!logosContainerRef.current) return;

    const container = logosContainerRef.current;
    let animationFrameId: number;
    let scrollPosition = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPosition += speed;
      container.style.transform = `translateX(-${scrollPosition}px)`;
      const singleSetWidth = container.scrollWidth / 3;
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

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
    console.log('Language changed in SellerOnboarding:', language);
    setLanguage(language.code);
  };

  const handleOpenLocationScreen = () => {
    console.log('Open location screen from SellerOnboarding');
  };

  const handleBackClick = () => {
    navigate('/seller-dashboard/products');
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

  const nextStep = () => {
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-white">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        <ProductHeader  
          onCloseClick={handleBackClick}  
          onShareClick={handleShareClick}  
          title={undefined}
          actionButtons={[]}
          forceScrolledState={true}
          hideSearch={true}
          showSellerInfo={false}
          showProgressBar={false}
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
        <div className="space-y-0">
          {/* Hero Section */}
          <div className="text-center px-4 py-6">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Become a Seller</h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Join thousands of successful sellers in Haiti. Start your business today with a one-time registration fee.
            </p>
          </div>

          {/* Hero Banner with Video */}
          <div className="w-full">
            <HeroBanner
              customBanners={[onboardingVideoBanner]}
              showNewsTicker={false}
              showCarouselBottomRow={false}
              asCarousel={false}
              className="rounded-none"
            />
          </div>

          {/* Trusted Sellers Logos Section */}
          <div className="py-8">
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
                  whiteSpace: 'nowrap',
                  willChange: 'transform'
                }}
              >
                {[...trustedSellerLogos, ...trustedSellerLogos, ...trustedSellerLogos].map((seller, index) => (
                  <div 
                    key={`logo-${index}`}
                    className="inline-flex flex-shrink-0"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={seller.logo || "/placeholder.svg"} 
                        alt="Trusted seller" 
                        className="w-24 h-12 object-cover rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Cards Section */}
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
                        src={card.image || "/placeholder.svg"} 
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

          {/* Seller Reviews Section */}
          <div className="bg-white py-10 px-4 border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">What Our Sellers Say</h2>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  Join thousands of successful sellers who have grown their businesses with us
                </p>
              </div>

              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex space-x-4 pb-2">
                    {sellerReviews.map((review) => (
                      <div 
                        key={review.id}
                        className="flex-shrink-0 w-80 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all"
                      >
                        {/* Header with avatar and info */}
                        <div className="flex items-start space-x-3 mb-4">
                          <img 
                            src={review.avatar || "/placeholder.svg"} 
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-0.5">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {review.name}
                              </h4>
                              {review.verified && (
                                <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{review.business}</p>
                          </div>
                        </div>

                        {/* Star rating */}
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review text */}
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                          "{review.review}"
                        </p>

                        {/* Date */}
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scroll indicator hint */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-400">← Scroll to see more reviews →</p>
              </div>
            </div>
          </div>

          {/* Your Journey on Mima Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Journey on Mima</h2>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  Four simple steps to start selling and growing your business
                </p>
              </div>

              <div className="space-y-6">
                {journeySteps.map((step, index) => {
                  const Icon = step.icon;
                  const colorClasses = {
                    blue: { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-600' },
                    green: { bg: 'bg-green-100', icon: 'text-green-600', border: 'border-green-200', badge: 'bg-green-600' },
                    purple: { bg: 'bg-purple-100', icon: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-600' },
                    orange: { bg: 'bg-orange-100', icon: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-600' }
                  }[step.color];

                  return (
                    <div key={step.id} className="relative">
                      <div className={`bg-white rounded-xl border-2 ${colorClasses.border} p-6 hover:shadow-lg transition-all`}>
                        <div className="flex items-start space-x-4">
                          {/* Step number badge */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 ${colorClasses.badge} rounded-full flex items-center justify-center shadow-md`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`${colorClasses.badge} text-white text-xs font-bold px-2 py-1 rounded`}>
                                Step {step.id}
                              </span>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {step.title}
                              </h3>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                              {step.description}
                            </p>

                            {/* Details list */}
                            <div className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <CheckCircle2 className={`w-4 h-4 ${colorClasses.icon} flex-shrink-0`} />
                                  <span className="text-xs text-gray-700">{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connector arrow */}
                      {index < journeySteps.length - 1 && (
                        <div className="flex justify-center py-3">
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Call to action */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-200">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-semibold">Start your journey today and join 10,000+ sellers!</span>
                </div>
              </div>
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
      </div>

      {/* Bottom Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.1)] p-3">
        <button
          onClick={nextStep}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SellerOnboardingOverview;
