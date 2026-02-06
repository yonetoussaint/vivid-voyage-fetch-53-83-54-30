// components/easy/VendorTabSelector.jsx
import React from 'react';
import { User, Users, Filter } from 'lucide-react';

const VendorTabSelector = ({ vendeurs, vendeurActif, setVendeurActif }) => {
  console.log('VendorTabSelector received:', { vendeurs, vendeurActif });

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-2 no-scrollbar">
      {/* "All" tab */}
      <button
        onClick={() => setVendeurActif(null)}
        className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 rounded-full ${
          vendeurActif === null
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
        }`}
        style={{ borderRadius: '20px !important' }}
      >
        <Users size={14} />
        Tous les Vendeurs
      </button>
      
      {/* Individual vendor tabs */}
      {vendeurs && vendeurs.length > 0 ? (
        vendeurs.map((vendeur) => (
          <button
            key={vendeur}
            onClick={() => setVendeurActif(vendeur)}
            className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 rounded-full ${
              vendeurActif === vendeur
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            style={{ borderRadius: '20px !important' }}
          >
            <User size={14} />
            {vendeur}
          </button>
        ))
      ) : (
        <div className="px-3 py-1 font-medium text-sm whitespace-nowrap border flex items-center gap-1.5 bg-transparent text-slate-400 border-slate-200 rounded-full">
          <Users size={14} />
          Aucun vendeur
        </div>
      )}
    </div>
  );
};

export default VendorTabSelector;