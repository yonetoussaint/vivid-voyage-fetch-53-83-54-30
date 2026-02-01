import React from 'react';
import { DollarSign } from 'lucide-react';

const VendorCardHeader = ({ shift, vendeurs }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <DollarSign size={20} />
        <h3 className="text-lg font-bold">Dépôts - Shift {shift}</h3>
      </div>
      <div className="text-sm opacity-80">
        {vendeurs.length} vendeur{vendeurs.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default VendorCardHeader;