// easy/StatisticCard.jsx
import React from 'react';

const StatisticCard = ({ 
  title, 
  value, 
  subtitle, 
  color = 'emerald',
  isPropane = false 
}) => {
  const getColorClasses = () => {
    const colorMap = {
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        dot: 'bg-emerald-300'
      },
      amber: {
        bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
        dot: 'bg-amber-300'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-500 to-orange-500',
        dot: 'bg-red-300'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-500 to-red-500',
        dot: 'bg-orange-300'
      },
      blue: {
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        dot: 'bg-blue-300'
      }
    };
    
    return colorMap[color] || colorMap.emerald;
  };

  const colors = getColorClasses();

  return (
    <div className={`rounded-xl p-3 shadow-lg ${colors.bg} text-white`}>
      <div className="flex items-center gap-1 mb-1">
        <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
        <p className="text-xs font-medium opacity-90">{title}</p>
      </div>
      <p className="text-lg sm:text-xl font-bold mb-0.5">{value}</p>
      <p className="text-[10px] opacity-90">{subtitle}</p>
    </div>
  );
};

export default StatisticCard;