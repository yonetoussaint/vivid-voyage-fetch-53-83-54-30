// easy/VendorAssignment.jsx
import React from 'react';
import { User, Pencil, ChevronDown } from 'lucide-react';

const VendorAssignment = ({ 
  pompe, 
  isPropane, 
  vendeurActuel, 
  vendeurs, 
  handleVendeurChange 
}) => {
  return (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Left side - Type */}
      <div className={`px-3 py-2 flex items-center gap-2 ${isPropane ? 'bg-red-50' : 'bg-indigo-50'}`}>
        <User size={16} className={isPropane ? 'text-red-600' : 'text-indigo-600'} />
        <span className="text-sm font-medium whitespace-nowrap">
          {isPropane ? 'Propane' : pompe}
        </span>
      </div>

      {/* Right side - Selection */}
      <div className="flex-1 min-w-0 relative">
        <div className="relative flex items-center">
          <select
            value={vendeurActuel}
            onChange={(e) => handleVendeurChange(e.target.value)}
            className="w-full h-full px-3 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500 appearance-none pr-8"
          >
            <option value="">Vendeur assigné</option>
            {vendeurs.map(vendeur => (
              <option key={vendeur} value={vendeur}>{vendeur}</option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none">
            {vendeurActuel ? (
              <Pencil size={14} className="text-gray-400" />
            ) : (
              <ChevronDown size={14} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAssignment;