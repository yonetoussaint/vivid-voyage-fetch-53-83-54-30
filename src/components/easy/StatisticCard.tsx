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
        bg: 'bg-emerald-50',
        dot: 'bg-emerald-500',
        text: 'text-emerald-900'
      },
      amber: {
        bg: 'bg-amber-50',
        dot: 'bg-amber-500',
        text: 'text-amber-900'
      },
      red: {
        bg: 'bg-red-50',
        dot: 'bg-red-500',
        text: 'text-red-900'
      },
      orange: {
        bg: 'bg-orange-50',
        dot: 'bg-orange-500',
        text: 'text-orange-900'
      },
      blue: {
        bg: 'bg-blue-50',
        dot: 'bg-blue-500',
        text: 'text-blue-900'
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
      <p className="text-lg sm:text-xl font-bold mb-0.5">{value}</p>
      <p className="text-[10px] opacity-90">{subtitle}</p>
    </div>
  );
};

export default StatisticCard;