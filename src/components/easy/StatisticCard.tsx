// easy/StatisticCard.jsx
import React from 'react';

const StatisticCard = ({ 
  title, 
  value, 
  subtitle, 
  color = 'emerald',
  unit = 'gallons' // New prop for dynamic unit text
}) => {
  const getColorClasses = () => {
    const colorMap = {
      emerald: {
        bg: 'bg-emerald-50',
        dot: 'bg-emerald-500',
        text: 'text-emerald-900',
        badgeBg: 'bg-emerald-100'
      },
      amber: {
        bg: 'bg-amber-50',
        dot: 'bg-amber-500',
        text: 'text-amber-900',
        badgeBg: 'bg-amber-100'
      },
      red: {
        bg: 'bg-red-50',
        dot: 'bg-red-500',
        text: 'text-red-900',
        badgeBg: 'bg-red-100'
      },
      orange: {
        bg: 'bg-orange-50',
        dot: 'bg-orange-500',
        text: 'text-orange-900',
        badgeBg: 'bg-orange-100'
      },
      blue: {
        bg: 'bg-blue-50',
        dot: 'bg-blue-500',
        text: 'text-blue-900',
        badgeBg: 'bg-blue-100'
      }
    };

    return colorMap[color] || colorMap.emerald;
  };

  const colors = getColorClasses();

  return (
    <div className={`rounded-xl p-3 border ${colors.bg} ${colors.text}`}>
      <div className="flex items-center gap-1 mb-1">
        <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
        <p className="text-xs font-medium opacity-90">{title}</p>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-lg sm:text-xl font-bold">{value}</p>
        <div 
          className={`!rounded-[20px] !px-2 !py-0.5 ${colors.badgeBg} ${colors.text}`}
          style={{ borderRadius: '20px !important' }}
        >
          <p className="text-[10px] font-medium !important">{unit}</p>
        </div>
      </div>
      <p className="text-[10px] opacity-90 mt-0.5">
        {subtitle && subtitle.replace(new RegExp(`\\s*${unit}\\s*`, 'gi'), '').trim()}
      </p>
    </div>
  );
};

export default StatisticCard;