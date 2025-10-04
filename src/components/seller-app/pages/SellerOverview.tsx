import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FlashDeals from '@/components/home/FlashDeals';
import { Package, Play } from 'lucide-react';
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";

const SellerOverview = () => {
  // Handler function for the custom button click
  const yourCustomHandler = () => {
    console.log('Custom button clicked');
    // Add your custom logic here
  };

  return (
    <div className="w-full bg-white pb-16">
      <div className="-mx-2 space-y-3">
        {/* Empty component */}
        <HeroBanner asCarousel={true} showCarouselBottomRow={false} />

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