import React from 'react';

const BannerSection = ({ bannerImage }) => {
  return (
    <div className="h-[120px] relative bg-gray-200">
      <img 
        src={bannerImage}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      {/* Overlay gradient for better button visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  );
};

export default BannerSection;