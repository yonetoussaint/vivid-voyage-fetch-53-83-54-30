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
  // Get all data and handlers from the custom hook
  const { activeCategory, featureChannels, handleChannelSelect } = useForYou();

  // Example channels with icons (you can move this to your hook or a separate file)
  const channelsWithIcons: ChannelItem[] = [
    {
      id: "electronics",
      name: "Electronics",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: "fashion",
      name: "Fashion",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      id: "home",
      name: "Home",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "sports",
      name: "Sports",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "beauty",
      name: "Beauty",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "food",
      name: "Food",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    },
    {
      id: "books",
      name: "Books",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: "travel",
      name: "Travel",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
  ];

  // Use either the channels from hook or the ones with icons
  const displayChannels = featureChannels.length > 0 ? featureChannels : channelsWithIcons;

  return (
    <div className="min-h-screen bg-white">
      {/* NO ANIMATIONS AT ALL - This is critical */}
      <div className="overflow-hidden">
        <div className="pb-2">
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