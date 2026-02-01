import React from 'react';
import { User, ChevronDown, ChevronRight } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const VendorDepositCard = ({ 
  vendeur, 
  donneesVendeur, 
  especesAttendues, 
  totalDepotHTG,
  children,
  isExpanded = false,
  onToggle = () => {}
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      {/* Collapsible Header - Ultra Clean */}
      <div 
        className="cursor-pointer active:bg-gray-50/80 transition-all p-4"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Vendor Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-gray-900 truncate text-sm sm:text-base">{vendeur}</span>
            </div>
          </div>

          {/* Total Deposits + Chevron */}
          <div className="flex items-center gap-2">
            {/* Total Deposits - Compact on mobile */}
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 font-medium hidden xs:inline">
                Total Dépôts
              </span>
              <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">
                {formaterArgent(totalDepotHTG)}
                <span className="text-xs text-gray-500 ml-1">HTG</span>
              </span>
            </div>
            
            {/* Chevron icon */}
            <div className="ml-1">
              {isExpanded ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-200 ease-out border-t border-gray-100 ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`p-4 bg-gray-50/50 ${isExpanded ? 'block' : 'hidden'}`}>
          {/* Compact Stats Grid - Better for mobile */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium mb-1">Ventes</div>
              <div className="font-semibold text-gray-900 text-sm">
                {formaterArgent(donneesVendeur?.ventesTotales || 0)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium mb-1">Dépôts</div>
              <div className="font-semibold text-gray-900 text-sm">
                {formaterArgent(totalDepotHTG)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium mb-1">Attendues</div>
              <div className={`font-semibold text-sm ${
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

          {/* Children content */}
          <div className="mt-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDepositCard;