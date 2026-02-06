import React from 'react';

const ShortCard = ({ short }) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      <img 
        src={short.image}
        alt={short.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-3 left-3 right-3 z-20 text-white">
        <p className="text-sm font-semibold line-clamp-2">{short.title}</p>
        <p className="text-xs text-gray-300 mt-1">{short.views}</p>
      </div>
      <div className="absolute top-3 right-3 z-20">
        <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ShortCard;