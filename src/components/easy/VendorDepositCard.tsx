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
  const remainingBalance = especesAttendues - totalDepotHTG;

  return (
    <div className="bg-white bg-opacity-15 rounded-lg p-2 space-y-0">
      {/* Collapsible Header */}
      <div 
        className="cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all rounded-lg p-2"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold">{vendeur}</span>
              <span className="text-xs opacity-80">
                Ventes: {formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Balance indicator */}
            <div className={`px-3 py-1 rounded-full text-sm font-bold text-center min-w-[120px] ${
              remainingBalance > 100 
                ? 'bg-green-500' 
                : remainingBalance > 0 
                ? 'bg-yellow-500' 
                : remainingBalance < -100 
                ? 'bg-red-500' 
                : 'bg-orange-500'
            }`}>
              <div className="flex flex-col items-center">
                <span className="text-[10px] opacity-90">Balance</span>
                <span>{formaterArgent(remainingBalance)} HTG</span>
              </div>
            </div>
            
            {/* Chevron icon */}
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown size={20} className="opacity-70" />
              ) : (
                <ChevronRight size={20} className="opacity-70" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Content with animation */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`pt-3 ${isExpanded ? 'block' : 'hidden'}`}>
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-xs opacity-80 mb-1">Ventes Total</div>
              <div className="font-bold text-sm">{formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-xs opacity-80 mb-1">Total Dépôts</div>
              <div className="font-bold text-sm">{formaterArgent(totalDepotHTG)} HTG</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-xs opacity-80 mb-1">Espèces Attendues</div>
              <div className="font-bold text-sm">{formaterArgent(especesAttendues)} HTG</div>
            </div>
          </div>

          {/* Children content (deposit inputs, sequences, etc.) */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default VendorDepositCard;