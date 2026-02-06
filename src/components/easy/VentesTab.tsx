import React from 'react';

const VentesTab = () => {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-black mb-2">Données de ventes</h3>
      <p className="text-gray-500">Les données de ventes seront bientôt disponibles</p>
    </div>
  );
};

export default VentesTab;