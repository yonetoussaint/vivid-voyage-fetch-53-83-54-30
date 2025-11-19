remove the cards around the logos, keep them clean without cards

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
                    <img 
                      src={seller.logo || "/placeholder.svg"} 
                      alt="Trusted seller" 
                      className="w-24 h-12 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="py-8 px-4">
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
                        className="flex-shrink-0 w-80 bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all"
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
          <div className="bg-white py-12 px-4 overflow-hidden">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Journey on Mima</h2>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  Four simple steps to start selling and growing your business
                </p>
              </div>

              <div className="relative">
                {/* Animated vertical line connector */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-green-200 via-purple-200 to-orange-200 opacity-30" />

                <div className="space-y-8">
                  {journeySteps.map((step, index) => {
                    const Icon = step.icon;
                    const colorClasses = {
                      blue: { 
                        gradient: 'from-blue-500 to-blue-600',
                        glow: 'shadow-blue-200',
                        light: 'bg-blue-50',
                        text: 'text-blue-600',
                        ring: 'ring-blue-100'
                      },
                      green: { 
                        gradient: 'from-green-500 to-green-600',
                        glow: 'shadow-green-200',
                        light: 'bg-green-50',
                        text: 'text-green-600',
                        ring: 'ring-green-100'
                      },
                      purple: { 
                        gradient: 'from-purple-500 to-purple-600',
                        glow: 'shadow-purple-200',
                        light: 'bg-purple-50',
                        text: 'text-purple-600',
                        ring: 'ring-purple-100'
                      },
                      orange: { 
                        gradient: 'from-orange-500 to-orange-600',
                        glow: 'shadow-orange-200',
                        light: 'bg-orange-50',
                        text: 'text-orange-600',
                        ring: 'ring-orange-100'
                      }
                    }[step.color];

                    return (
                      <div 
                        key={step.id} 
                        className="relative group"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                        }}
                      >
                        <style>{`
                          @keyframes fadeInUp {
                            from {
                              opacity: 0;
                              transform: translateY(20px);
                            }
                            to {
                              opacity: 1;
                              transform: translateY(0);
                            }
                          }
                          @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                          }
                          @keyframes slideInRight {
                            from {
                              opacity: 0;
                              transform: translateX(-10px);
                            }
                            to {
                              opacity: 1;
                              transform: translateX(0);
                            }
                          }
                        `}</style>

                        <div className="flex items-start space-x-6">
                          {/* Icon container with animated glow */}
                          <div className="relative flex-shrink-0 z-10">
                            <div 
                              className={`w-12 h-12 bg-gradient-to-br ${colorClasses.gradient} rounded-full flex items-center justify-center shadow-lg ${colorClasses.glow} transition-all duration-300 group-hover:scale-110`}
                              style={{
                                animation: `pulse 2s ease-in-out ${index * 0.2}s infinite`
                              }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            
                            {/* Animated ring */}
                            <div 
                              className={`absolute inset-0 rounded-full ring-4 ${colorClasses.ring} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                              style={{
                                animation: 'pulse 1.5s ease-in-out infinite'
                              }}
                            />
                            
                            {/* Step badge */}
                            <div className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br ${colorClasses.gradient} rounded-full flex items-center justify-center shadow-md`}>
                              <span className="text-white text-xs font-bold">{step.id}</span>
                            </div>
                          </div>

                          {/* Content card */}
                          <div 
                            className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:translate-x-1"
                            style={{
                              animation: `slideInRight 0.6s ease-out ${index * 0.15 + 0.1}s both`
                            }}
                          >
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-gray-700 transition-colors">
                                {step.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {step.description}
                              </p>
                            </div>

                            {/* Details with staggered animation */}
                            <div className="space-y-2.5 mt-4">
                              {step.details.map((detail, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-start space-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  style={{
                                    animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both`,
                                    animationPlayState: 'paused'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.animationPlayState = 'running';
                                  }}
                                >
                                  <div className={`${colorClasses.light} rounded-full p-1 flex-shrink-0 mt-0.5`}>
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${colorClasses.text}`} />
                                  </div>
                                  <span className="text-xs text-gray-700 leading-relaxed">{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Call to action with animated gradient */}
              <div className="mt-12 text-center">
                <div 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-6 py-4 rounded-2xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.8s both'
                  }}
                >
                  <Zap className="w-5 h-5 text-blue-600" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
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