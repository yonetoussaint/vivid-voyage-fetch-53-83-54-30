import React from 'react';
import { User } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const ResumeFinancierVendeurs = ({ shift, vendeurs, totauxVendeurs }) => {
  const donneesShift = totauxVendeurs[shift];
  if (!donneesShift) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${shift === 'AM' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
        <h4 className="font-bold text-base">Vendeurs - Shift {shift}</h4>
      </div>
      <div className="space-y-3">
        {vendeurs.map(vendeur => {
          const donneesVendeur = donneesShift[vendeur];
          if (!donneesVendeur || donneesVendeur.ventesTotales === 0) return null;

          return (
            <div key={`${shift}-${vendeur}`} className="bg-white bg-opacity-15 rounded-lg p-3 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-bold truncate">{vendeur}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold text-center min-w-[120px] ${
                  donneesVendeur.especesAttendues > 0 
                    ? 'bg-green-500' 
                    : donneesVendeur.especesAttendues < 0 
                    ? 'bg-red-500' 
                    : 'bg-gray-500'
                }`}>
                  Espèces: {formaterArgent(donneesVendeur.especesAttendues)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <p className="opacity-90 text-xs">Ventes Total</p>
                  <p className="font-bold text-base">{formaterArgent(donneesVendeur.ventesTotales)} HTG</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <p className="opacity-90 text-xs">Total Dépôts</p>
                  <p className="font-bold text-base">{formaterArgent(donneesVendeur.depot)} HTG</p>
                </div>
              </div>

              {donneesVendeur.depots && donneesVendeur.depots.length > 0 && (
                <div className="pt-2 border-t border-white border-opacity-30">
                  <p className="text-xs opacity-90 mb-1">Dépôts individuels:</p>
                  <div className="flex flex-wrap gap-1">
                    {donneesVendeur.depots.map((depot, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        <span>{idx + 1}.</span>
                        <span>{formaterArgent(depot)}</span>
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