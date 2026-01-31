import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  return (
    <div className="space-y-3 px-2 sm:px-0">
      {Object.entries(donneesPompe)
        .filter(([key]) => key !== '_vendeur')
        .map(([pistolet, donnees]) => {
          const gallons = calculerGallons(donnees.debut, donnees.fin);
          const prixUnitaire = donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.essence;
          const ventesTotal = gallons * prixUnitaire;
          const hasData = donnees.debut || donnees.fin;

          return (
            <div
              key={pistolet}
              className={`rounded-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)} shadow-sm`}
            >
              {/* Header */}
              <div className={`${getCouleurBadge(donnees.typeCarburant)} px-3 py-2.5 sm:px-4 sm:py-3 text-white`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">
                      {pistolet.replace('pistolet', 'Pistolet ')}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90">{donnees.typeCarburant}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs opacity-75 mb-0.5">Prix</p>
                    <p className="font-bold text-sm sm:text-base whitespace-nowrap">
                      {prixUnitaire} HTG
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-3 sm:p-4 bg-white space-y-3">
                <InputField
                  label="Index Début"
                  value={donnees.debut}
                  onChange={(e) => mettreAJourLecture(pompe, pistolet, 'debut', e.target.value)}
                />

                <InputField
                  label="Index Fin"
                  value={donnees.fin}
                  onChange={(e) => mettreAJourLecture(pompe, pistolet, 'fin', e.target.value)}
                />

                {hasData && (
                  <div className="pt-3 mt-1 border-t border-gray-200 space-y-2.5">
                    <SummaryRow 
                      label="Gallons" 
                      value={formaterGallons(gallons)}
                      valueClassName="text-gray-900"
                    />
                    <SummaryRow 
                      label="Ventes Total" 
                      value={`${formaterArgent(ventesTotal)} HTG`}
                      valueClassName="text-green-600 font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <input
      type="number"
      step="0.001"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2.5 sm:py-3 text-base sm:text-lg font-medium border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      placeholder="0.000"
      inputMode="decimal"
    />
  </div>
);

const SummaryRow = ({ label, value, valueClassName = "text-gray-900" }) => (
  <div className="flex justify-between items-center gap-2">
    <span className="text-sm sm:text-base text-gray-600 font-medium">{label}</span>
    <span className={`text-base sm:text-lg font-semibold ${valueClassName} text-right`}>
      {value}
    </span>
  </div>
);

export default PumpPistolets;
