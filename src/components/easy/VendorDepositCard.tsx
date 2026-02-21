// VendorDepositCard.jsx
import React from 'react';
import { formaterArgent } from '@/utils/formatters';

const VendorDepositCard = ({ 
  vendeur,
  donneesVendeur, 
  especesAttendues, 
  totalDepotHTG,
  children,
  hideStats = false,
  isReadOnly = false,
  isSummary = false // New prop for summary card styling
}) => {
  return (
    <div className={`
      bg-white rounded-lg overflow-hidden
      ${isSummary 
        ? 'border-2 border-blue-400 shadow-md' 
        : !isReadOnly 
          ? 'border-l-2 border-blue-400 pl-2' 
          : ''
      }
    `}>
      {/* Vendor Name */}
      <div className={`
        mb-1 text-xs font-medium uppercase tracking-wider
        ${isSummary ? 'text-blue-600 px-3 pt-3' : 'text-gray-500'}
      `}>
        {vendeur}
        {isSummary && (
          <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Résumé
          </span>
        )}
      </div>

      {/* Compact Stats Grid - Only show if not hidden */}
      {!hideStats && (
        <div className={`grid grid-cols-3 gap-1.5 ${isSummary ? 'px-3 pb-3' : 'mb-2'}`}>
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

      {/* Children content - Only show if not summary card */}
      {!isSummary && children && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default VendorDepositCard;