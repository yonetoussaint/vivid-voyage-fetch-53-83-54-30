import React from 'react';
import { Flame, Droplets, Zap, Fuel, Gauge, Circle } from 'lucide-react';

// Icon mapping for pump types
const getPumpIcon = (pompe) => {
  const pumpIcons = {
    'Pompe 1': <Droplets size={14} />,
    'Pompe 2': <Fuel size={14} />,
    'Pompe 3': <Gauge size={14} />,
    'Pompe 4': <Zap size={14} />,
    'propane': <Flame size={14} />,
  };
  
  // Default icon if specific not found
  return pumpIcons[pompe] || <Circle size={14} />;
};

const PumpSelector = ({ pompes, pompeEtendue, setPompeEtendue, showPropane = false }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {pompes.map((pompe) => (
        <button
          key={pompe}
          onClick={() => setPompeEtendue(pompe)}
          className={`px-3 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            pompeEtendue === pompe
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {getPumpIcon(pompe)}
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
          <Flame size={14} />
          Propane
        </button>
      )}
    </div>
  );
};

export default PumpSelector;