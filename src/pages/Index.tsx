// src/pages/ForYou.tsx
import React from "react";
import NewsTicker from "@/components/home/hero/NewsTicker";
import FlashDeals from "@/components/home/FlashDeals";
import FavouriteChannels, { ChannelItem } from "@/components/FavouriteChannels";
import InfiniteContentGrid from "@/components/InfiniteContentGrid";
import Footer from "@/components/Footer";
import { useForYou } from "@/hooks/foryou.hooks";
import Separator from "@/components/shared/Separator";

const ForYou: React.FC = () => {
  const { activeCategory, featureChannels, handleChannelSelect } = useForYou();

  // ... channelsWithIcons array (keep as is) ...

  const displayChannels = featureChannels.length > 0 ? featureChannels : channelsWithIcons;

  return (
    <div className="min-h-screen bg-white">
      {/* NO ANIMATIONS AT ALL - This is critical */}
      <div className="overflow-hidden">
        {/* NewsTicker directly */}
        <div className="mb-2">
          <NewsTicker />
        </div>

        <div className="">
          <FavouriteChannels 
            channels={displayChannels}
            onChannelSelect={handleChannelSelect}
          />
        </div>

        {/* Use Separator component */}
        <Separator />

        <div className="mb-2">
          <FlashDeals
            showCountdown={true}
            showTitleChevron={true}
          />
        </div>

        {/* Use Separator component */}
        <Separator />
      </div>

      {/* InfiniteContentGrid - NO animations, NO opacity transitions */}
      <InfiniteContentGrid 
        key={activeCategory} // Key based on category only
        category={activeCategory} 
      />

      {/* Hidden Footer */}
      <FooterWrapper />
    </div>
  );
};

// Optional: You can extract this to a separate component if needed
const FooterWrapper = () => (
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
);

export default ForYou;