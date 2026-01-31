import React from 'react';
import ShiftManager from '@/components/easy/ShiftManager';

const Header = ({ 
  date, 
  shift, 
  activeTab, 
  onMenuToggle, 
  handleReinitialiserShift, 
  handleReinitialiserJour 
}) => {
  const getTabIcon = (tabId) => {
    const icons = {
      pumps: '⛽',
      vendeurs: '👥',
      conditionnement: '📦',
      depots: '🏪',
      stock: '📊',
      usd: '💵',
      report: '📋',
      rapport: '🔥'
    };
    return icons[tabId] || '📱';
  };

  const getTabLabel = (tabId) => {
    const labels = {
      pumps: 'Pompes',
      vendeurs: 'Vendeurs',
      conditionnement: 'Conditionnement',
      depots: 'Dépôts',
      stock: 'Stock',
      usd: 'USD',
      report: 'Rapports',
      rapport: 'Gaz'
    };
    return labels[tabId] || 'App';
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
      <div className="py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu button and current app */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">{getTabIcon(activeTab)}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{getTabLabel(activeTab)}</h1>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <span>{date}</span>
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-1 ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    Shift {shift}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <ShiftManager shift={shift} />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleReinitialiserShift}
                className="px-3 py-2 text-xs sm:text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Réinit. Shift
              </button>
              <button
                onClick={handleReinitialiserJour}
                className="px-3 py-2 text-xs sm:text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Réinit. Jour
              </button>
            </div>
          </div>
        </div>

        {/* Shift Manager for mobile */}
        <div className="mt-3 sm:hidden">
          <ShiftManager shift={shift} />
        </div>
      </div>
    </header>
  );
};

export default Header;