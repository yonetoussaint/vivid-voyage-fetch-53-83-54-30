import React from 'react';

const ShiftManager = ({ shift }) => {
  return (
    <div className="bg-slate-800 text-white rounded-lg p-3 text-center mx-4 mb-4 max-w-2xl mx-auto">
      <div className="text-sm opacity-90">Shift Actuel</div>
      <div className="text-xl font-bold">SHIFT {shift}</div>
    </div>
  );
};

export default ShiftManager;