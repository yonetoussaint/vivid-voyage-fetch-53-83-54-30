import React from 'react';
import FlashDeals from '@/components/home/FlashDeals';
import { Package, Play } from 'lucide-react';
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";

interface SellerOverviewProps {
  isLoading?: boolean;
}

const SellerOverview: React.FC<SellerOverviewProps> = ({ isLoading = false }) => {
  // Handler function for the custom button click
  const yourCustomHandler = () => {
    console.log('Custom button clicked');
    // Add your custom logic here
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white pb-16">
        <div className="px-2 py-4 space-y-4">
          {/* Hero Banner Skeleton */}
          <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
          
          {/* Reels Section Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex-shrink-0 w-32 h-56 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Products Section Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-16">
      <div className="-mx-2 space-y-3">
        <MobileOptimizedReels 
          showCustomButton={true}
          customButtonText="Watch All"
          customButtonIcon={Play}
          onCustomButtonClick={yourCustomHandler}
        />

        <FlashDeals 
          title="Products"
          icon={Package}
        />

      </div>
    </div>
  );
};

export default SellerOverview;