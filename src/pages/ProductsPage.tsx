import React from "react";
import { useLocation } from "react-router-dom";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProductsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const title = searchParams.get('title') || 'Products';
  const productType = searchParams.get('type');
  const showCountdown = searchParams.get('showCountdown') === 'true' || productType === 'flash';
  const countdown = searchParams.get('countdown') || undefined;
  const showProfiles = searchParams.get('showProfiles') === 'true';
  const profilesText = searchParams.get('profilesText') || 'Handpicked by';
  const showSponsorCount = searchParams.get('showSponsorCount') === 'true';
  const showVerifiedSellers = searchParams.get('showVerifiedSellers') === 'true';
  const verifiedSellersText = searchParams.get('verifiedSellersText') || 'Verified Sellers';

  // Determine if we should show stacked profiles (not for Flash Deals)
  const shouldShowStackedProfiles = showProfiles && title !== 'Flash Deals' && title !== 'FLASH DEALS';
  
  // Sample stacked profiles data
  const stackedProfiles = shouldShowStackedProfiles ? [
    { 
      id: '1', 
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 
      alt: 'Sarah Johnson' 
    },
    { 
      id: '2', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 
      alt: 'Mike Chen' 
    },
    { 
      id: '3', 
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 
      alt: 'Emma Davis' 
    }
  ] : [];

  return (
    <PageContainer padding="none" className="min-h-screen bg-gray-50">
      <BookGenreFlashDeals
        title={title}
        productType={productType || undefined}
        showSectionHeader={false}
        showSummary={false}
        showFilters={false}
        showCountdown={showCountdown}
        countdown={countdown}
        showStackedProfiles={shouldShowStackedProfiles}
        stackedProfiles={stackedProfiles}
        stackedProfilesText={profilesText}
        showSponsorCount={showSponsorCount}
        showVerifiedSellers={showVerifiedSellers}
        verifiedSellersText={verifiedSellersText}
      />
    </PageContainer>
  );
}
