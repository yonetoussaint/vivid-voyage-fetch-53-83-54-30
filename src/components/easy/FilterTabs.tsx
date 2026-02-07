import React from 'react';

const FilterTabs = ({ activeFilter, setActiveFilter, shorts }) => {
  return (
    <div className="flex gap-1 p-3 bg-white border-b border-gray-200 overflow-x-auto">
      <button 
        onClick={() => setActiveFilter('all')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
          activeFilter === 'all' 
            ? 'bg-black text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        Tous ({shorts.length})
      </button>
      <button 
        onClick={() => setActiveFilter('pending')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
          activeFilter === 'pending' 
            ? 'bg-yellow-500 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        En attente ({shorts.filter(s => s.status === 'pending').length})
      </button>
      <button 
        onClick={() => setActiveFilter('overdue')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
          activeFilter === 'overdue' 
            ? 'bg-red-500 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        En retard ({shorts.filter(s => s.status === 'overdue').length})
      </button>
      <button 
        onClick={() => setActiveFilter('paid')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
          activeFilter === 'paid' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        Payés ({shorts.filter(s => s.status === 'paid').length})
      </button>
    </div>
  );
};

export default FilterTabs;