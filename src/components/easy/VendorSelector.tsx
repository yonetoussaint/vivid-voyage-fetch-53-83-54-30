// components/easy/VendorSelector.jsx
import React from 'react';

const VendorSelector = ({ vendeurs, vendeurActif, setVendeurActif }) => {
  if (!vendeurs || vendeurs.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100">
      <div className="flex space-x-1 overflow-x-auto pb-2">
        {vendeurs.map((vendeur) => (
          <button
            key={vendeur}
            onClick={() => setVendeurActif(vendeur)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              vendeurActif === vendeur
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {vendeur}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VendorSelector;