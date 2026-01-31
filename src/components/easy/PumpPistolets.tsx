import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  return (
    <div className="space-y-4">
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
              className={`rounded-lg overflow-hidden border ${getCouleurCarburant(donnees.typeCarburant)}`}
            >
              {/* Header */}
              <div className={`${getCouleurBadge(donnees.typeCarburant)} px-4 py-3 flex justify-between items-center text-white`}>
                <div>
                  <h3 className="font-semibold">{pistolet.replace('pistolet', 'Pistolet ')}</h3>
                  <p className="text-sm opacity-90">{donnees.typeCarburant}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Prix</p>
                  <p className="font-semibold">{prixUnitaire} HTG</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 bg-white space-y-3">
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
                  <div className="pt-3 border-t space-y-2">
                    <SummaryRow label="Gallons" value={formaterGallons(gallons)} />
                    <SummaryRow 
                      label="Ventes Total" 
                      value={`${formaterArgent(ventesTotal)} HTG`}
                      valueClassName="text-green-600"
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
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="0.000"
    />
  </div>
);

const SummaryRow = ({ label, value, valueClassName = "text-gray-900" }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`font-semibold ${valueClassName}`}>{value}</span>
  </div>
);

export default PumpPistolets;