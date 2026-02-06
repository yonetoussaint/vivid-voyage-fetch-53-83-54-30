import React from 'react';

const tabs = [
  { id: 'retards', label: 'Retards' },
  { id: 'ventes', label: 'Ventes' },
  { id: 'meters', label: 'Meters' },
  { id: 'shorts', label: 'Shorts' }
];

const TabsSection = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="flex-1 relative hover:bg-gray-50 transition-colors"
        >
          <div className="py-2 text-[15px] font-medium">
            <span className={activeTab === tab.id ? 'text-black' : 'text-gray-500'}>
              {tab.label}
            </span>
          </div>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-blue-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabsSection;