import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const ResumeFinancierVendeurs = ({ shift, vendeurs, totauxVendeurs }) => {
  const donneesShift = totauxVendeurs[shift];
  if (!donneesShift) return null;

  const shiftColors = {
    AM: { bg: 'bg-blue-600', text: 'text-blue-100', accent: 'bg-blue-500' },
    PM: { bg: 'bg-purple-600', text: 'text-purple-100', accent: 'bg-purple-500' }
  };
  const currentShift = shiftColors[shift] || shiftColors.AM;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-800">
        <div className={`w-4 h-4 rounded-full ${currentShift.accent}`}></div>
        <h4 className="font-bold text-lg text-white">Vendeurs - Shift {shift}</h4>
      </div>
      
      <div className="space-y-4">
        {vendeurs.map(vendeur => {
          const donneesVendeur = donneesShift[vendeur];
          if (!donneesVendeur || donneesVendeur.ventesTotales === 0) return null;

          const especesColor = donneesVendeur.especesAttendues > 0 
            ? 'bg-green-600 text-white' 
            : donneesVendeur.especesAttendues < 0 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-600 text-white';

          return (
            <div key={`${shift}-${vendeur}`} className="bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-700 shadow-lg">
              {/* Header with seller name and cash status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-full">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-white text-lg truncate">{vendeur}</span>
                </div>
                <div className={`px-4 py-2.5 rounded-full font-bold text-center min-w-[140px] shadow-sm ${especesColor}`}>
                  Espèces: {formaterArgent(donneesVendeur.especesAttendues)}
                </div>
              </div>

              {/* Sales and deposit totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                  <p className="text-gray-300 text-sm mb-1">Ventes Total</p>
                  <p className="font-bold text-white text-xl">{formaterArgent(donneesVendeur.ventesTotales)} HTG</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                  <p className="text-gray-300 text-sm mb-1">Total Dépôts</p>
                  <p className="font-bold text-white text-xl">{formaterArgent(donneesVendeur.depot)} HTG</p>
                </div>
              </div>

              {/* Individual deposits */}
              {donneesVendeur.depots && donneesVendeur.depots.length > 0 && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-gray-300 text-sm font-medium mb-2">Dépôts individuels:</p>
                  <div className="flex flex-wrap gap-2">
                    {donneesVendeur.depots.map((depot, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-lg border border-gray-700 text-white"
                      >
                        <span className="text-gray-400 text-xs font-medium">{idx + 1}.</span>
                        <span className="font-medium">{formaterArgent(depot)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeFinancierVendeurs;