import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const VendorDepositCard = ({ 
  vendeur, 
  donneesVendeur, 
  especesAttendues, 
  totalDepotHTG,
  children 
}) => {
  return (
    <div className="bg-white bg-opacity-15 rounded-lg space-y-3">
      {/* En-tête Vendeur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="font-bold">{vendeur}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold text-center ${
          especesAttendues > 0 
            ? 'bg-green-500' 
            : especesAttendues < 0 
            ? 'bg-red-500' 
            : 'bg-gray-500'
        }`}>
          Espèces: {formaterArgent(especesAttendues)} HTG
        </div>
      </div>

      {/* Info Ventes */}
      <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Ventes Total</span>
          <span className="font-bold">{formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Total Dépôts</span>
          <span className="font-bold">{formaterArgent(totalDepotHTG)} HTG</span>
        </div>
      </div>

      {/* Children content (deposit inputs, sequences, etc.) */}
      {children}
    </div>
  );
};

export default VendorDepositCard;