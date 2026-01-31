import React from 'react';
import { Flame } from 'lucide-react';

const PumpSelector = ({ pompes, pompeEtendue, setPompeEtendue, showPropane = false }) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
      {pompes.map((pompe) => (
        <button
          key={pompe}
          onClick={() => setPompeEtendue(pompe)}
          className={`px-3 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 border ${
            pompeEtendue === pompe
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {pompe}
        </button>
      ))}

      {showPropane && (
        <button
          onClick={() => setPompeEtendue('propane')}
          className={`px-3 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            pompeEtendue === 'propane'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
          }`}
        >
          <Flame size={13} />
          Propane
        </button>
      )}
    </div>
  );
};

// Add this to your global CSS or Tailwind config
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

export default PumpSelector;