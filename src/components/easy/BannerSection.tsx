import React from 'react';

const BannerSection = ({ bannerImage }) => {
  return (
    <div className="h-[120px] relative bg-gray-200">
      <img 
        src={bannerImage}
        alt="Cover"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default BannerSection;