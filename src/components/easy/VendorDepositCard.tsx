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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Collapsible Header */}
      <div 
        className="cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-all p-3"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-gray-900 truncate">{vendeur}</span>
              <span className="text-sm text-gray-500">
                Ventes: {formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Espèces Attendues indicator */}
            <div className={`px-3 py-1.5 rounded-full text-sm font-semibold text-center min-w-[130px] ${
              especesAttendues > 100 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : especesAttendues > 0 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                : especesAttendues < -100 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}>
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium">Espèces Attendues</span>
                <span>{formaterArgent(especesAttendues)} HTG</span>
              </div>
            </div>

            {/* Chevron icon */}
            <div className="ml-1">
              {isExpanded ? (
                <ChevronDown size={20} className="text-gray-400" />
              ) : (
                <ChevronRight size={20} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Content with animation */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`p-3 bg-gray-50 ${isExpanded ? 'block' : 'hidden'}`}>
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
              <div className="text-xs text-gray-500 font-medium mb-1">Ventes Total</div>
              <div className="font-bold text-gray-900">{formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
              <div className="text-xs text-gray-500 font-medium mb-1">Total Dépôts</div>
              <div className="font-bold text-gray-900">{formaterArgent(totalDepotHTG)} HTG</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
              <div className="text-xs text-gray-500 font-medium mb-1">Espèces Attendues</div>
              <div className="font-bold text-gray-900">{formaterArgent(especesAttendues)} HTG</div>
            </div>
          </div>

          {/* Children content (deposit inputs, sequences, etc.) */}
          <div className="mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDepositCard;