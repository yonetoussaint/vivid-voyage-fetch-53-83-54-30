
// easy/QuickSummaryRow.jsx
import React from 'react';
import { formaterGallons } from '@/utils/formatters';

const QuickSummaryRow = ({ 
  gallonsEssence, 
  gallonsDiesel, 
  isPropane = false,
  prixPropane = 0 
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className={`rounded-lg p-2 ${isPropane ? 'bg-red-800' : 'bg-slate-800'} text-white`}>
        <p className="text-[10px] opacity-90 mb-0.5">
          {isPropane ? 'Prix/Gallon' : 'Gallons Essence'}
        </p>
        <p className="text-sm font-bold">
          {isPropane ? `${prixPropane} HTG` : formaterGallons(gallonsEssence)}
        </p>
      </div>
      <div className={`rounded-lg p-2 ${isPropane ? 'bg-orange-800' : 'bg-slate-800'} text-white`}>
        <p className="text-[10px] opacity-90 mb-0.5">
          {isPropane ? 'Gallons Propane' : 'Gallons Diesel'}
        </p>
        <p className="text-sm font-bold">
          {isPropane ? gallonsDiesel.toFixed(3) : formaterGallons(gallonsDiesel)}
        </p>
      </div>
    </div>
  );
};

export default QuickSummaryRow;