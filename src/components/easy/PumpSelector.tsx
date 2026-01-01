import React from 'react';

const PumpSelector = ({ pompes, pompeEtendue, setPompeEtendue }) => {
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
    </div>
  );
};

export default PumpSelector;