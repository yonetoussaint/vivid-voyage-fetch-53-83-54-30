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
    <div className="bg-white">
      {/* Profile Section - Centered */}
      <div className="flex flex-col items-center mb-3">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-2">
          <User size={20} className="text-blue-600" />
        </div>
        <span className="font-semibold text-gray-900 text-base text-center">{vendeur}</span>
        
        {/* Mobile-friendly total display */}
        <div className="mt-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium">Total Dépôts</span>
            <span className="text-base font-bold text-gray-900">
              {formaterArgent(totalDepotHTG)}
              <span className="text-xs text-gray-500 ml-1">HTG</span>
            </span>
          </div>
        </div>
      </div>

      {/* Compact Stats Grid - 3 in a row */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
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

      {/* Alternative: Vertical Stack for even more compact view */}
      {/* Uncomment this and comment the grid above for vertical layout */}
      {/* 
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500 font-medium">Ventes</span>
          <span className="font-semibold text-gray-900 text-sm">
            {formaterArgent(donneesVendeur?.ventesTotales || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500 font-medium">Dépôts</span>
          <span className="font-semibold text-gray-900 text-sm">
            {formaterArgent(totalDepotHTG)}
          </span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500 font-medium">Attendues</span>
          <span className={`font-semibold text-sm ${
            especesAttendues > 100 ? 'text-green-600' 
            : especesAttendues > 0 ? 'text-yellow-600' 
            : especesAttendues < -100 ? 'text-red-600' 
            : 'text-orange-600'
          }`}>
            {formaterArgent(especesAttendues)}
          </span>
        </div>
      </div>
      */}

      {/* Children content - Compact */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default VendorDepositCard;