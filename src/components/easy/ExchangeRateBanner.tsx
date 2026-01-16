import React from 'react';
import { Globe } from 'lucide-react';

const ExchangeRateBanner = ({ tauxDeChange = 132 }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <Globe size={18} />
        <div className="text-center">
          <div className="font-bold">Taux de Change</div>
          <div className="text-sm opacity-90">1 USD = {tauxDeChange} HTG</div>
        </div>
        <Globe size={18} />
      </div>
    </div>
  );
};

export default ExchangeRateBanner;