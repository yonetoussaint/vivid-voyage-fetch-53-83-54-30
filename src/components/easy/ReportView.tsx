import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const ResumeFinancierVendeurs = ({ shift, vendeurs, totauxVendeurs }) => {
  const donneesShift = totauxVendeurs[shift];
  if (!donneesShift) return null;

  const shiftColors = {
    AM: { bg: 'from-blue-500 to-blue-600', accent: 'bg-blue-300' },
    PM: { bg: 'from-purple-500 to-purple-600', accent: 'bg-purple-300' }
  };
  const currentShift = shiftColors[shift] || shiftColors.AM;

  return (
    <div className="mb-6">
      <div className={`bg-gradient-to-br ${currentShift.bg} text-white rounded-xl p-4 shadow-xl mb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${currentShift.accent}`}></div>
            <h4 className="font-bold text-base">Vendeurs - Shift {shift}</h4>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {vendeurs.length} vendeurs
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {vendeurs.map(vendeur => {
          const donneesVendeur = donneesShift[vendeur];
          if (!donneesVendeur || donneesVendeur.ventesTotales === 0) return null;

          return (
            <div key={`${shift}-${vendeur}`} className="bg-white rounded-xl p-3 space-y-2 shadow-lg">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${shift === 'AM' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    <User size={14} />
                  </div>
                  <span className="font-bold text-gray-900 truncate">{vendeur}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold text-center min-w-[120px] text-white ${
                  donneesVendeur.especesAttendues > 0 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : donneesVendeur.especesAttendues < 0 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  Espèces: {formaterArgent(donneesVendeur.especesAttendues)}
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 rounded-lg p-2">
                  <p className="text-blue-700 text-xs font-medium">Ventes Total</p>
                  <p className="font-bold text-base text-blue-900">{formaterArgent(donneesVendeur.ventesTotales)} HTG</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 rounded-lg p-2">
                  <p className="text-emerald-700 text-xs font-medium">Total Dépôts</p>
                  <p className="font-bold text-base text-emerald-900">{formaterArgent(donneesVendeur.depot)} HTG</p>
                </div>
              </div>

              {/* Individual Deposits */}
              {donneesVendeur.depots && donneesVendeur.depots.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-600 text-xs font-medium mb-2">Dépôts individuels:</p>
                  <div className="flex flex-wrap gap-2">
                    {donneesVendeur.depots.map((depot, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 px-3 py-2 rounded-lg text-xs"
                      >
                        <span className="text-gray-700 font-medium">{idx + 1}.</span>
                        <span className="text-gray-900 font-bold">{formaterArgent(depot)}</span>
                        <span className="text-gray-500 text-[10px] ml-1">HTG</span>
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