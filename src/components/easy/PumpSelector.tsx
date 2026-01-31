import React from 'react';
import { Flame } from 'lucide-react';

const PumpSelector = ({ pompes, pompeEtendue, setPompeEtendue, showPropane = false }) => {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
      {pompes.map((pompe) => (
        <button
          key={pompe}
          onClick={() => setPompeEtendue(pompe)}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            pompeEtendue === pompe
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          {pompe}
        </button>
      ))}

      {showPropane && (
        <button
          onClick={() => setPompeEtendue('propane')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            pompeEtendue === 'propane'
              ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
              : 'text-slate-600 hover:text-red-600 hover:bg-red-50/50'
          }`}
        >
          <Flame size={14} />
          Propane
        </button>
      )}
    </div>
  );
};

export default PumpSelector;