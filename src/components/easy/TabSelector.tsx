// components/easy/TabSelector.jsx
import React from 'react';

const TabSelector = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`flex gap-1.5 overflow-x-auto pb-1 px-2 no-scrollbar ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            activeTab === tab.id
              ? `${tab.color} ${tab.borderColor}`
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          style={{ borderRadius: '20px !important' }}
        >
          {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full min-w-[20px] text-center ${
              activeTab === tab.id 
                ? 'bg-white text-gray-800' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;