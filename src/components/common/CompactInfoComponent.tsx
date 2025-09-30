import React from 'react';

export default function CompactInfoComponent() {
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Text Information */}
      <div className="text-center mb-6 sm:mb-8 space-y-2">
        <p className="text-base sm:text-lg font-light text-gray-900 tracking-wide">
          Made in <span className="font-medium">Désarmes</span> with <span className="text-red-500">❤️</span>
        </p>
      </div>

      {/* Trusted Partners Section */}
      <div className="text-center">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 tracking-wide">TRUSTED PARTNERS</h3>
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
          {/* First Row */}
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">MCI</span>
          </div>
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">SOGE</span>
          </div>
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <img src="images/brt-logo.png" alt="BRH Logo" className="h-6 sm:h-8 object-contain" />
          </div>
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">KPD</span>
          </div>
          {/* Second Row */}
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">Wise</span>
          </div>
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">PayPal</span>
          </div>
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">Zelle</span>
          </div>
          <div className="w-full h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-gray-400">KAPOSOV</span>
          </div>
        </div>
      </div>
    </div>
  );
}
