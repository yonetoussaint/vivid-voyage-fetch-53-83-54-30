import React, { useState } from 'react';
import { User } from 'lucide-react';
import BannerSection from './BannerSection';
import ActionButtons from './ActionButtons';
import ProfileSection from './ProfileSection';
import TabsSection from './TabsSection';
import TabContent from './TabContent';
import { getHashFromString, bannerImages, profileImages } from './imageUtils';
import { getSellerData } from './sellerData';

const VendeursManager = ({ 
  vendeurs, 
  vendeurActif,
  getNombreAffectations 
}) => {
  const [activeTab, setActiveTab] = useState('retards');
  const [sellerData, setSellerData] = useState({});

  if (!vendeurActif) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">
            Aucun vendeur sélectionné
          </h2>
          <p className="text-gray-500">
            Sélectionnez un vendeur pour voir son profil
          </p>
        </div>
      </div>
    );
  }

  const sellerHash = getHashFromString(vendeurActif);
  const bannerImage = bannerImages[sellerHash % bannerImages.length];
  const profileImage = profileImages[sellerHash % profileImages.length];

  const currentSeller = getSellerData(vendeurActif, sellerData);
  const affectations = getNombreAffectations ? getNombreAffectations(vendeurActif) : 0;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-[600px] mx-auto">
        {/* Banner only */}
        <BannerSection bannerImage={bannerImage} />
        
        {/* Action Buttons - Positioned right below the banner */}
        <div className="px-4">
          <div className="flex justify-end -mt-2 mb-2">
            <ActionButtons />
          </div>
        </div>

        <ProfileSection 
          vendeurActif={vendeurActif}
          profileImage={profileImage}
          currentSeller={currentSeller}
        />

        <TabsSection 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <TabContent 
          activeTab={activeTab}
          vendeurActif={vendeurActif}
          currentSeller={currentSeller}
          affectations={affectations}
        />
      </div>
    </div>
  );
};

export default VendeursManager;