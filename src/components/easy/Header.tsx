import React, { useState } from 'react';

const Header = ({ 
  date, 
  shift, 
  activeTab, 
  onMenuToggle,
  onDateChange,
  onShiftChange 
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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

  const openDatePicker = () => {
    const dateInput = document.getElementById('datePicker');
    if (dateInput) {
      dateInput.showPicker();
      setIsDatePickerOpen(true);
      // Listen for when the picker closes
      setTimeout(() => {
        const checkPickerClosed = () => {
          if (document.activeElement !== dateInput) {
            setIsDatePickerOpen(false);
          } else {
            setTimeout(checkPickerClosed, 100);
          }
        };
        checkPickerClosed();
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="py-3 px-3">
        <div className="flex items-center justify-between">
          {/* Left side: Menu icon and date picker */}
          <div className="flex items-center space-x-2">
            {/* Menu button */}
            <button
              onClick={onMenuToggle}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              aria-label="Ouvrir le menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Date picker button */}
            <button
              onClick={openDatePicker}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <span>{formatDateForDisplay(date)}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Hidden date input */}
            <input
              type="date"
              id="datePicker"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="hidden"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Right side: AM/PM switch */}
          <div className="flex bg-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onShiftChange('AM')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${shift === 'AM' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-300'}`}
            >
              AM
            </button>
            <button
              onClick={() => onShiftChange('PM')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${shift === 'PM' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-300'}`}
            >
              PM
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;