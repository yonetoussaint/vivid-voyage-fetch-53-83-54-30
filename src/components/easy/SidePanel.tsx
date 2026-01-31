import React from 'react';

const SidePanel = ({ isOpen, onClose, children, isMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        w-64 bg-white shadow-lg
        flex flex-col
        ${isMobile 
          ? `transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'border-r border-gray-200'
        }
      `}>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
            aria-label="Fermer le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {children}
      </div>
    </>
  );
};

export default SidePanel;