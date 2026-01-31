import React from 'react';

const VerticalTabs = ({ activeTab, onTabChange, isMobile }) => {
  const tabs = [
    { id: 'pumps', label: 'Pompes & Propane', icon: '⛽', color: 'bg-blue-100 text-blue-700' },
    { id: 'vendeurs', label: 'Vendeurs', icon: '👥', color: 'bg-green-100 text-green-700' },
    { id: 'conditionnement', label: 'Conditionnement', icon: '📦', color: 'bg-purple-100 text-purple-700' },
    { id: 'depots', label: 'Dépôts', icon: '🏪', color: 'bg-orange-100 text-orange-700' },
    { id: 'stock', label: 'Stock Restant', icon: '📊', color: 'bg-red-100 text-red-700' },
    { id: 'usd', label: 'Ventes USD', icon: '💵', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'report', label: 'Rapports', icon: '📋', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'rapport', label: 'Rapport Gaz', icon: '🔥', color: 'bg-teal-100 text-teal-700' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header for Mobile */}
      {isMobile && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <p className="text-sm text-gray-600 mt-1">Sélectionnez une application</p>
        </div>
      )}

      {/* Tab List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (isMobile) onTabChange(tab.id); // Auto-close on mobile if needed
              }}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg text-left
                transition-all duration-200
                ${activeTab === tab.id 
                  ? `${tab.color} shadow-sm border-l-4 ${tab.color.includes('blue') ? 'border-blue-500' : 
                     tab.color.includes('green') ? 'border-green-500' :
                     tab.color.includes('purple') ? 'border-purple-500' :
                     tab.color.includes('orange') ? 'border-orange-500' :
                     tab.color.includes('red') ? 'border-red-500' :
                     tab.color.includes('yellow') ? 'border-yellow-500' :
                     tab.color.includes('indigo') ? 'border-indigo-500' : 'border-teal-500'}`
                  : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg
                ${activeTab === tab.id 
                  ? tab.color.includes('blue') ? 'bg-blue-500' : 
                    tab.color.includes('green') ? 'bg-green-500' :
                    tab.color.includes('purple') ? 'bg-purple-500' :
                    tab.color.includes('orange') ? 'bg-orange-500' :
                    tab.color.includes('red') ? 'bg-red-500' :
                    tab.color.includes('yellow') ? 'bg-yellow-500' :
                    tab.color.includes('indigo') ? 'bg-indigo-500' : 'bg-teal-500'
                  : 'bg-gray-100 text-gray-600'
                } text-white
              `}>
                {tab.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm md:text-base">{tab.label}</div>
                <div className="text-xs text-gray-500 truncate">
                  {activeTab === tab.id ? 'Actif' : 'Cliquer pour ouvrir'}
                </div>
              </div>
              {activeTab === tab.id && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Station Service</div>
          <div>Système de gestion v1.0</div>
        </div>
      </div>
    </div>
  );
};

export default VerticalTabs;