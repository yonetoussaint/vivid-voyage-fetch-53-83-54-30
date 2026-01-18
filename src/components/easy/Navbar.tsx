import React from 'react';
import { FileText, Trash2, Fuel, Users, DollarSign, Globe, Database } from 'lucide-react';

const Navbar = ({ date, setDate, shift, setShift, activeView, onViewChange, onResetShift, onResetDay }) => {
  
const navItems = [
  { id: 'pumps', label: 'Données', icon: FileText },
  { id: 'stock', label: 'Stock', icon: Database },
  { id: 'report', label: 'Rapport', icon: FileText },
  { id: 'vendeurs', label: 'Vendeurs', icon: Users },
  { id: 'depots', label: 'Dépôts', icon: DollarSign },
  { id: 'usd', label: 'USD', icon: Globe },
  { id: 'conditionnement', label: 'Conditionnement', icon: DollarSign }, // Add this line
  { id: 'resetShift', label: `Reset ${shift}`, icon: Trash2, onClick: onResetShift },
  { id: 'resetDay', label: 'Reset Jour', icon: Trash2, onClick: onResetDay }
];

  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-4">
        <Fuel className="text-blue-600" size={28} />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900">Station Service</h1>
          <p className="text-sm text-gray-500">Gestion Ventes & Vendeurs</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="AM">Shift Matin</option>
            <option value="PM">Shift Soir</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.onClick ? item.onClick() : onViewChange(item.id)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm flex flex-col items-center justify-center min-h-[60px] min-w-[80px] transition-colors ${
                activeView === item.id 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              } ${
                item.id.includes('reset') 
                  ? 'hover:bg-red-50 hover:text-red-600' 
                  : ''
              }`}
            >
              <item.icon size={18} className="mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;