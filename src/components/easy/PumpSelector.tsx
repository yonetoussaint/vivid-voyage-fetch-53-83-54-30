import React from 'react';
import { Flame, Droplets, Fuel, Zap, Gauge, Circle } from 'lucide-react';

// Icon mapping for pump types
const getPumpIcon = (index) => {
  const icons = [<Droplets size={14} />, <Fuel size={14} />, <Gauge size={14} />, <Zap size={14} />];
  return icons[index] || <Circle size={14} />;
};

const PumpSelector = ({ pompes, pompeEtendue, setPompeEtendue, showPropane = false }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-2 no-scrollbar">
      {pompes.map((pompe, index) => (
        <button
          key={pompe}
          onClick={() => setPompeEtendue(pompe)}
          className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            pompeEtendue === pompe
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          style={{ borderRadius: '16px' }}
        >
          {getPumpIcon(index)}
          Pompe {index + 1}
        </button>
      ))}

      {showPropane && (
        <button
          onClick={() => setPompeEtendue('propane')}
          className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            pompeEtendue === 'propane'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
          }`}
          style={{ borderRadius: '16px' }}
        >
          <Flame size={14} />
          Propane
        </button>
      )}
    </div>
  );
};

export default PumpSelector;