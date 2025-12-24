import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "@/components/home/HeroBanner";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import Footer from "@/components/Footer";
import { 
  Wallet, 
  Award, 
  Star, 
  Zap, 
  Tag, 
  Gift, 
  Clock, 
  TrendingUp, 
  Shield,
  Percent,
  Crown,
  ShoppingBag,
  Heart,
  DollarSign,
  BadgeCheck
} from "lucide-react";

const ForYou: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('recommendations');
  const [isAnimating, setIsAnimating] = useState(false);
  const [gridKey, setGridKey] = useState(Date.now()); // Key to force remount

  // Define feature channels with icons instead of images
  const featureChannels: ChannelItem[] = [
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <Wallet className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-white'
    },
    {
      id: 'choice',
      name: 'CHOICE',
      icon: <Crown className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      textColor: 'text-white'
    },
    {
      id: 'bestsellers',
      name: 'Bestsellers',
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'deals',
      name: 'Deals',
      icon: <Percent className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      textColor: 'text-white'
    },
    {
      id: 'flash-sales',
      name: 'Flash Sales',
      icon: <Zap className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      textColor: 'text-white'
    },
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      icon: <Tag className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-white'
    },
    {
      id: 'recommended',
      name: 'Recommended',
      icon: <Heart className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      textColor: 'text-white'
    },
    {
      id: 'free-shipping',
      name: 'Free Shipping',
      icon: <ShoppingBag className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      textColor: 'text-white'
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      icon: <Award className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      textColor: 'text-white'
    },
    {
      id: 'top-rated',
      name: 'Top Rated',
      icon: <Star className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-white'
    },
    {
      id: 'gift-cards',
      name: 'Gift Cards',
      icon: <Gift className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-rose-500 to-rose-600',
      textColor: 'text-white'
    },
    {
      id: 'limited-time',
      name: 'Limited Time',
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
      textColor: 'text-white'
    },
    {
      id: 'secure-payment',
      name: 'Secure Payment',
      icon: <Shield className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-white'
    },
    {
      id: 'budget-friendly',
      name: 'Budget Friendly',
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-lime-500 to-lime-600',
      textColor: 'text-white'
    },
    {
      id: 'verified',
      name: 'Verified',
      icon: <BadgeCheck className="w-6 h-6" />,
      bgColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
      textColor: 'text-white'
    }
  ];

  const handleChannelSelect = (channelId: string) => {
    console.log(`Selected channel: ${channelId}`);
    // Add your channel selection logic here
  };

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setIsAnimating(true);
      setActiveCategory(event.detail.category);
      // Force remount of grid with new key
      setGridKey(Date.now());
      // Small delay to allow animation to complete
      setTimeout(() => setIsAnimating(false), 300);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Header Section Only */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`header-${activeCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="overflow-hidden">
            <div className="pb-2">
              <div className="mb-2">
                <HeroBanner showNewsTicker={true} />
              </div>

              <div className="">
                <FavouriteChannels 
                  channels={featureChannels}
                  onChannelSelect={handleChannelSelect}
                />
              </div>

              <div className="w-full bg-gray-100 h-1 mb-2"></div>

              <div className="mb-2">
                <FlashDeals
                  showCountdown={true}
                  showTitleChevron={true}
                />
              </div>

              <div className="w-full bg-gray-100 h-1 mb-2"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* InfiniteContentGrid OUTSIDE of all animations */}
      {/* No animation wrapper - this is critical for video loading */}
      <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-70' : 'opacity-100'}`}>
        <InfiniteContentGrid 
          key={gridKey} // Force remount when category changes
          category={activeCategory} 
        />
      </div>

      {/* Hidden Footer */}
      <div 
        className="sr-only" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
        aria-hidden="true"
      >
        <Footer />
      </div>
    </div>
  );
};

export default ForYou;