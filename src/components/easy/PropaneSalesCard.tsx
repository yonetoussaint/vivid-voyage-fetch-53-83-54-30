// easy/PropaneSalesCard.jsx
import React from 'react';
import { Flame } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const PropaneSalesCard = ({ 
  gallonsPropane, 
  ventesTotales, 
  prixPropane 
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-3 shadow-lg mb-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <Flame size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold">VENTES PROPANE</p>
          <p className="text-[10px] opacity-80">Total des ventes propane</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl sm:text-3xl font-bold mb-0.5">{formaterArgent(ventesTotales)}</p>
          <p className="text-[10px] opacity-90">HTG total</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80">Calcul:</p>
          <p className="text-xs opacity-90">
            {gallonsPropane.toFixed(3)} gal × {prixPropane} HTG
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropaneSalesCard;