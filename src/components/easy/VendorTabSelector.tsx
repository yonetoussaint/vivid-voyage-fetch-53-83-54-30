// components/easy/VendorTabSelector.jsx
import React from 'react';
import { Users, User } from 'lucide-react';

const VendorTabSelector = ({ vendeurs, vendeurActif, setVendeurActif }) => {
  // Always include "All" option
  const allVendor = {
    id: null,
    label: 'Tous les Vendeurs',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-blue-600 text-white',
    borderColor: 'border-blue-600'
  };

  // Create vendor tabs
  const vendorTabs = [allVendor];
  
  // Add individual vendor tabs
  if (vendeurs && vendeurs.length > 0) {
    vendeurs.forEach((vendeur, index) => {
      // Different colors for different vendors
      const colors = [
        { color: 'bg-purple-600 text-white', borderColor: 'border-purple-600' },
        { color: 'bg-green-600 text-white', borderColor: 'border-green-600' },
        { color: 'bg-orange-600 text-white', borderColor: 'border-orange-600' },
        { color: 'bg-red-600 text-white', borderColor: 'border-red-600' },
        { color: 'bg-teal-600 text-white', borderColor: 'border-teal-600' },
        { color: 'bg-pink-600 text-white', borderColor: 'border-pink-600' },
        { color: 'bg-indigo-600 text-white', borderColor: 'border-indigo-600' },
        { color: 'bg-amber-600 text-white', borderColor: 'border-amber-600' },
      ];
      
      const colorIndex = index % colors.length;
      
      vendorTabs.push({
        id: vendeur,
        label: vendeur,
        icon: <User className="w-4 h-4" />,
        color: colors[colorIndex].color,
        borderColor: colors[colorIndex].borderColor
      });
    });
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-2 no-scrollbar">
      {vendorTabs.map((vendor) => (
        <button
          key={vendor.id || 'all'}
          onClick={() => setVendeurActif(vendor.id)}
          className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 rounded-full ${
            vendeurActif === vendor.id
              ? `${vendor.color} ${vendor.borderColor}`
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {vendor.icon}
          {vendor.label}
        </button>
      ))}
      
      {/* Show "No vendors" only if there are no vendors */}
      {(!vendeurs || vendeurs.length === 0) && (
        <div className="px-3 py-1 font-medium text-sm whitespace-nowrap border flex items-center gap-1.5 bg-transparent text-slate-400 border-slate-200 rounded-full">
          <Users className="w-4 h-4" />
          Aucun vendeur
        </div>
      )}
    </div>
  );
};

export default VendorTabSelector;