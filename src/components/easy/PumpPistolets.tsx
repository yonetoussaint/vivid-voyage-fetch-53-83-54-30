import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  return (
    <div className="space-y-3">
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
              className={`rounded-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)}`}
            >
              {/* Header */}
              <div className={`${getCouleurBadge(donnees.typeCarburant)} px-3 py-2 text-white`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {pistolet.replace('pistolet', 'Pistolet ')}
                    </h3>
                    <p className="text-xs opacity-90">{donnees.typeCarburant}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs opacity-75">Prix</p>
                    <p className="font-bold text-sm whitespace-nowrap">
                      {prixUnitaire} HTG
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-3 bg-white space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Meter Début"
                    value={donnees.debut}
                    onChange={(e) => mettreAJourLecture(pompe, pistolet, 'debut', e.target.value)}
                  />

                  <InputField
                    label="Meter Fin"
                    value={donnees.fin}
                    onChange={(e) => mettreAJourLecture(pompe, pistolet, 'fin', e.target.value)}
                  />
                </div>

                {hasData && (
                  <div className="pt-3 border-t space-y-2">
                    <SummaryRow 
                      label="Gallons" 
                      value={formaterGallons(gallons)}
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
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type="number"
      step="0.001"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder="0.000"
      inputMode="decimal"
    />
  </div>
);

const SummaryRow = ({ label, value, valueClassName = "text-gray-900" }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`font-semibold ${valueClassName}`}>
      {value}
    </span>
  </div>
);

export default PumpPistolets;
