import React from 'react';

const Header = ({ 
  date, 
  shift, 
  activeTab, 
  onMenuToggle,
  onDateChange,
  onShiftChange 
}) => {
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
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="py-3 px-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu button */}
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Center: Date selector */}
          <div className="flex items-center space-x-2">
            {/* Previous day */}
            <button
              onClick={() => navigateDate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Jour précédent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Date display and picker */}
            <div className="flex flex-col items-center min-w-[140px]">
              <button
                onClick={() => document.getElementById('datePicker')?.showPicker()}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-gray-50"
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
              <div className="text-xs text-gray-500">
                {date === new Date().toISOString().split('T')[0] ? 'Aujourd\'hui' : ''}
              </div>
            </div>

            {/* Next day */}
            <button
              onClick={() => navigateDate(1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Jour suivant"
              disabled={date === new Date().toISOString().split('T')[0]}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${date === new Date().toISOString().split('T')[0] ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right: AM/PM switch */}
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => onShiftChange('AM')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${shift === 'AM' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              AM
            </button>
            <button
              onClick={() => onShiftChange('PM')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${shift === 'PM' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Quick today button - only visible on desktop */}
        {date !== new Date().toISOString().split('T')[0] && (
          <div className="hidden sm:flex justify-center mt-2">
            <button
              onClick={handleTodayClick}
              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            >
              ← Retour à aujourd'hui
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;