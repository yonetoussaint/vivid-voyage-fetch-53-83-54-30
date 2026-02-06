// components/easy/VendorTabSelector.jsx
import React from 'react';
import TabSelector from './TabSelector';
import { Users, User } from 'lucide-react';

const VendorTabSelector = ({ vendeurs, vendeurActif, setVendeurActif, vendorStats = {} }) => {
  // Color palette for vendor tabs
  const colorPalette = [
    { color: 'bg-blue-600 text-white', borderColor: 'border-blue-600' },
    { color: 'bg-purple-600 text-white', borderColor: 'border-purple-600' },
    { color: 'bg-orange-600 text-white', borderColor: 'border-orange-600' },
    { color: 'bg-green-600 text-white', borderColor: 'border-green-600' },
    { color: 'bg-indigo-600 text-white', borderColor: 'border-indigo-600' },
    { color: 'bg-yellow-600 text-white', borderColor: 'border-yellow-600' },
    { color: 'bg-emerald-600 text-white', borderColor: 'border-emerald-600' },
    { color: 'bg-red-600 text-white', borderColor: 'border-red-600' },
  ];

  // Create vendor tabs array
  const vendorTabs = [];

  // Always include "All" tab
  vendorTabs.push({
    id: null,
    label: 'Tous les Vendeurs',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-blue-600 text-white',
    borderColor: 'border-blue-600',
    badge: vendeurs?.length || 0
  });

  // Add individual vendor tabs
  if (vendeurs && vendeurs.length > 0) {
    vendeurs.forEach((vendeur, index) => {
      const colorIndex = index % colorPalette.length;
      const stats = vendorStats[vendeur] || {};
      
      vendorTabs.push({
        id: vendeur,
        label: vendeur,
        icon: <User className="w-4 h-4" />,
        color: colorPalette[colorIndex].color,
        borderColor: colorPalette[colorIndex].borderColor,
        badge: stats.affectations || 0
      });
    });
  }

  return (
    <TabSelector
      tabs={vendorTabs}
      activeTab={vendeurActif}
      onTabChange={setVendeurActif}
    />
  );
};

export default VendorTabSelector;