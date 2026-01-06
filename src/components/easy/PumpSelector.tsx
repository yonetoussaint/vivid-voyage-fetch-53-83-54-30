import React from 'react';
import { Flame } from 'lucide-react';

const PumpSelector = ({ pompes, pompeEtendue, setPompeEtendue, showPropane = false }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {pompes.map((pompe) => (
        <button
          key={pompe}
          onClick={() => setPompeEtendue(pompe)}
          className={`px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition ${
            pompeEtendue === pompe
              ? 'bg-white text-blue-600 shadow-lg'
              : 'bg-slate-700 text-white'
          }`}
        >
          {pompe}
        </button>
      ))}
      
      {/* Add propane tab if showPropane is true */}
      {showPropane && (
        <button
          key="propane"
          onClick={() => setPompeEtendue('propane')}
          className={`px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition flex items-center gap-2 ${
            pompeEtendue === 'propane'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-slate-700 text-white'
          }`}
        >
          <Flame size={16} />
          Propane
        </button>
      )}
    </div>
  );
};

export default PumpSelector;