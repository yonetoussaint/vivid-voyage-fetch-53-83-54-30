import React from 'react';
import ShiftManager from '@/components/easy/ShiftManager';

const Header = ({ 
  date, 
  shift, 
  activeTab, 
  onMenuToggle,
  onDateChange,
  onShiftChange 
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

  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format date string for comparison
    const formatForComparison = (d) => d.toISOString().split('T')[0];
    
    if (formatForComparison(date) === formatForComparison(today)) {
      return "Aujourd'hui";
    } else if (formatForComparison(date) === formatForComparison(yesterday)) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const navigateDate = (direction) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + direction);
    const newDate = currentDate.toISOString().split('T')[0];
    onDateChange(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
      <div className="py-3 px-2 sm:px-4">
        {/* Top row: Menu button and app info */}
        <div className="flex items-center justify-between mb-2">
          {/* Left: Menu button */}
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* App info - centered on mobile, left on desktop */}
          <div className="flex-1 flex items-center space-x-3 lg:flex-none">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">{getTabIcon(activeTab)}</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">{getTabLabel(activeTab)}</h1>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>{formatDateForDisplay(date)}</span>
                <span className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1 ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                  Shift {shift}
                </span>
              </div>
            </div>
          </div>

          {/* Shift Manager - hidden on mobile (will be shown below) */}
          <div className="hidden sm:block">
            <ShiftManager shift={shift} />
          </div>
        </div>

        {/* Mobile app name - only shown on mobile */}
        <div className="sm:hidden flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-gray-900">{getTabLabel(activeTab)}</h1>
          <ShiftManager shift={shift} compact={true} />
        </div>

        {/* Date Navigation - Mobile Optimized */}
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="flex items-center justify-between">
            {/* Date Navigation */}
            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Jour précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex-1 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => document.getElementById('datePicker')?.showPicker()}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {formatDateForDisplay(date)}
                  </button>
                  <input
                    type="date"
                    id="datePicker"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="hidden"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {date === new Date().toISOString().split('T')[0] ? 'Date actuelle' : 'Date sélectionnée'}
                </div>
              </div>

              <button
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Jour suivant"
                disabled={date === new Date().toISOString().split('T')[0]}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${date === new Date().toISOString().split('T')[0] ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Today Button - only on mobile */}
            <button
              onClick={handleTodayClick}
              className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors sm:hidden"
            >
              Aujourd'hui
            </button>
          </div>

          {/* Shift Selector and Today Button (Desktop) */}
          <div className="mt-2 flex items-center justify-between">
            {/* Shift Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Shift:</span>
              <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onShiftChange('AM')}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${shift === 'AM' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  AM
                </button>
                <button
                  onClick={() => onShiftChange('PM')}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${shift === 'PM' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Today Button - Desktop */}
            <button
              onClick={handleTodayClick}
              className="hidden sm:block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
            >
              Retour à aujourd'hui
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;