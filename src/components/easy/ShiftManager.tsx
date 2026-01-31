// Updated ShiftManager.jsx with compact mode
import React, { useState } from 'react';

const ShiftManager = ({ shift, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShiftChange = (newShift) => {
    // You'll need to pass the shift change handler from parent
    console.log(`Shift changed to: ${newShift}`);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg font-medium ${
            shift === 'AM' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
          <span>Shift {shift}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
              <button
                onClick={() => handleShiftChange('AM')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                  shift === 'AM' ? 'bg-green-50 text-green-700' : 'text-gray-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Shift AM</span>
              </button>
              <button
                onClick={() => handleShiftChange('PM')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                  shift === 'PM' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Shift PM</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Original full version
  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm text-gray-600">Shift actuel:</div>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full font-medium ${
          shift === 'AM' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${shift === 'AM' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
          <span>Shift {shift}</span>
        </div>
      </div>
    </div>
  );
};

export default ShiftManager;