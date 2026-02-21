import React from 'react';
import { formaterArgent } from '@/utils/formatters';

const VendorDepositCard = ({ 
  vendeur, // Add vendeur prop
  donneesVendeur, 
  especesAttendues, 
  totalDepotHTG,
  children,
  hideStats = false, // New prop to hide stats cards
  isReadOnly = false // Add isReadOnly prop for styling if needed
}) => {
  return (
    <div className={`bg-white ${!isReadOnly ? 'border-l-2 border-blue-400 pl-2' : ''}`}>
      {/* Vendor Name - Always show */}
      <div className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {vendeur}
      </div>

      {/* Compact Stats Grid - Only show if not hidden */}
      {!hideStats && (
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-gray-500 font-medium truncate">Ventes</div>
            <div className="font-semibold text-gray-900 text-sm truncate">
              {formaterArgent(donneesVendeur?.ventesTotales || 0)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-gray-500 font-medium truncate">Dépôts</div>
            <div className="font-semibold text-gray-900 text-sm truncate">
              {formaterArgent(totalDepotHTG)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-gray-500 font-medium truncate">Attendues</div>
            <div className={`font-semibold text-sm truncate ${
              especesAttendues > 100 
                ? 'text-green-600' 
                : especesAttendues > 0 
                ? 'text-yellow-600' 
                : especesAttendues < -100 
                ? 'text-red-600' 
                : 'text-orange-600'
            }`}>
              {formaterArgent(especesAttendues)}
            </div>
          </div>
        </div>
      )}

      {/* Children content - Compact */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default VendorDepositCard;