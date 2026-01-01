import React from 'react';
import { FileText, Trash2, Fuel, Users, DollarSign, Globe, Flame } from 'lucide-react';

const Navbar = ({ date, setDate, shift, setShift, activeView, onViewChange, onResetShift, onResetDay }) => {
  const navItems = [
    { id: 'pumps', label: 'Données', icon: FileText, color: 'bg-white text-blue-600' },
    { id: 'report', label: 'Rapport', icon: FileText, color: 'bg-white text-blue-600' },
    { id: 'vendeurs', label: 'Vendeurs', icon: Users, color: 'bg-purple-500 text-white' },
    { id: 'depots', label: 'Dépôts', icon: DollarSign, color: 'bg-green-500 text-white' },
    { id: 'usd', label: 'USD', icon: Globe, color: 'bg-amber-500 text-white' },
    { id: 'propane', label: 'Propane', icon: Flame, color: 'bg-red-500 text-white' },
    { id: 'resetShift', label: `Reset ${shift}`, icon: Trash2, color: 'bg-orange-500 text-white', onClick: onResetShift },
    { id: 'resetDay', label: 'Reset Jour', icon: Trash2, color: 'bg-red-500 text-white', onClick: onResetDay }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Fuel size={28} />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">Station Service</h1>
          <p className="text-xs text-blue-100 truncate">Gestion Ventes & Vendeurs</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 text-sm bg-white text-gray-900 rounded-lg font-semibold w-full"
        />

        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="px-3 py-2 text-sm bg-white text-gray-900 rounded-lg font-semibold w-full"
        >
          <option value="AM">Shift Matin</option>
          <option value="PM">Shift Soir</option>
        </select>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.onClick ? item.onClick() : onViewChange(item.id)}
              className={`px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px] ${
                activeView === item.id ? 'ring-2 ring-white ring-opacity-50' : ''
              } ${item.color}`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;