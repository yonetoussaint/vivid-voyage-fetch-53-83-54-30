// easy/TotalGallonsCard.jsx
import React from 'react';
import { Fuel, Flame } from 'lucide-react';
import { formaterGallons } from '@/utils/formatters';

const TotalGallonsCard = ({ 
  gallonsEssence, 
  gallonsDiesel, 
  isPropane = false,
  pompe = '' 
}) => {
  const productIcon = isPropane ? 
    <Flame size={20} className="text-white" /> : 
    <Fuel size={20} className="text-white" />;
  
  const totalGallons = isPropane ? gallonsDiesel : gallonsEssence + gallonsDiesel;
  const gallonsLabel = isPropane ? 'Gallons Propane' : 'TOTAL GALLONS';
  const gallonsSubtitle = isPropane ? 'Propane vendu' : 'Essence + Diesel';

  return (
    <div className={`rounded-xl p-3 shadow-lg mb-3 ${
      isPropane 
        ? 'bg-gradient-to-br from-red-600 to-orange-600' 
        : 'bg-gradient-to-br from-blue-500 to-blue-600'
    } text-white`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          {productIcon}
        </div>
        <div>
          <p className="text-sm font-bold">{gallonsLabel}</p>
          <p className="text-[10px] opacity-80">{gallonsSubtitle}</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl sm:text-3xl font-bold mb-0.5">
            {isPropane ? gallonsDiesel.toFixed(3) : formaterGallons(totalGallons)}
          </p>
          <p className="text-[10px] opacity-90">
            {isPropane ? 'gallons propane' : 'gallons totaux'}
          </p>
        </div>
        {!isPropane && (
          <div className="text-right">
            <div className="text-xs opacity-80 mb-1">Détail:</div>
            <div className="text-xs opacity-90">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                <span>Essence: {formaterGallons(gallonsEssence)}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                <span>Diesel: {formaterGallons(gallonsDiesel)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalGallonsCard;