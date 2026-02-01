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
        border: 'border-emerald-200',
        accent: 'text-emerald-600',
        bg: 'bg-emerald-50'
      },
      amber: {
        border: 'border-amber-200',
        accent: 'text-amber-600',
        bg: 'bg-amber-50'
      },
      red: {
        border: 'border-red-200',
        accent: 'text-red-600',
        bg: 'bg-red-50'
      },
      orange: {
        border: 'border-orange-200',
        accent: 'text-orange-600',
        bg: 'bg-orange-50'
      },
      blue: {
        border: 'border-blue-200',
        accent: 'text-blue-600',
        bg: 'bg-blue-50'
      }
    };

    return colorMap[color] || colorMap.emerald;
  };

  const colors = getColorClasses();

  return (
    <div className={`
      rounded-lg p-4 
      border ${colors.border} 
      ${colors.bg}
      hover:shadow-md transition-shadow duration-200
    `}>
      <div className="mb-2">
        <p className={`text-xs font-medium uppercase tracking-wide ${colors.accent} opacity-80`}>
          {title}
        </p>
      </div>
      
      <p className={`text-2xl sm:text-3xl font-bold mb-1 ${colors.accent}`}>
        {value}
      </p>
      
      <p className="text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default StatisticCard;