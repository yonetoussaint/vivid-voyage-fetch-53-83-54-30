import React, { useState } from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  const [expandedPhases, setExpandedPhases] = useState({
    phaseA: true,
    phaseB: true
  });

  // Get all pistolets (excluding _vendeur)
  const allPistolets = Object.entries(donneesPompe)
    .filter(([key]) => key !== '_vendeur')
    .sort(([keyA], [keyB]) => {
      // Sort by type then by number
      const getSortValue = (key) => {
        const lower = key.toLowerCase();
        if (lower.includes('gasoline') || lower.includes('gas')) return 1;
        if (lower.includes('diesel')) return 2;
        return 3;
      };
      return getSortValue(keyA) - getSortValue(keyB);
    });

  // Group into 2 phases with 3 pistolets each
  const groupedPistolets = {
    phaseA: {},
    phaseB: {}
  };

  // Distribute pistolets: first 3 to Phase A, next 3 to Phase B
  allPistolets.forEach(([pistolet, donnees], index) => {
    if (index < 3) {
      groupedPistolets.phaseA[pistolet] = donnees;
    } else {
      groupedPistolets.phaseB[pistolet] = donnees;
    }
  });

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  const PhaseSection = ({ phase, title, pistolets }) => {
    const pistoletsArray = Object.entries(pistolets);
    
    if (pistoletsArray.length === 0) {
      return null; // Don't show empty phases
    }

    const hasDataInPhase = pistoletsArray.some(([_, donnees]) => 
      donnees.debut || donnees.fin
    );

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePhase(phase)}
          className={`flex items-center justify-between w-full p-3 ${hasDataInPhase ? 'bg-blue-50' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${phase === 'phaseA' ? 'bg-blue-500' : 'bg-green-500'}`} />
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">
                {pistoletsArray.length} pistolet(s)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {hasDataInPhase && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                Données
              </span>
            )}
            {expandedPhases[phase] ? (
              <ChevronUp className="text-gray-500" size={18} />
            ) : (
              <ChevronDown className="text-gray-500" size={18} />
            )}
          </div>
        </button>

        {expandedPhases[phase] && (
          <div className="space-y-2">
            {pistoletsArray.map(([pistolet, donnees]) => {
              const gallons = calculerGallons(donnees.debut, donnees.fin);
              const prixUnitaire = donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.gasoline;
              const ventesTotal = gallons * prixUnitaire;
              const hasData = donnees.debut || donnees.fin;

              return (
                <div
                  key={pistolet}
                  className={`border-t border-gray-100 ${getCouleurCarburant(donnees.typeCarburant)}`}
                >
                  {/* Header */}
                  <div className={`${getCouleurBadge(donnees.typeCarburant)} px-3 py-2 text-white`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {pistolet.replace('pistolet', 'Pistolet ').replace(/([A-Z])/g, ' $1').trim()}
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
                  <div className="bg-white space-y-2">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      <InputField
                        label="Meter Ouverture"
                        value={donnees.debut}
                        onChange={(e) => mettreAJourLecture(pompe, pistolet, 'debut', e.target.value)}
                      />

                      <InputField
                        label="Meter Fermeture"
                        value={donnees.fin}
                        onChange={(e) => mettreAJourLecture(pompe, pistolet, 'fin', e.target.value)}
                      />
                    </div>

                    {hasData && (
                      <div className="px-2 pb-2 space-y-1 border-t border-gray-100 pt-2">
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
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <PhaseSection 
        phase="phaseA"
        title="Phase A"
        pistolets={groupedPistolets.phaseA}
      />
      
      {Object.keys(groupedPistolets.phaseB).length > 0 && (
        <PhaseSection 
          phase="phaseB"
          title="Phase B"
          pistolets={groupedPistolets.phaseB}
        />
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-0.5">
      {label}
    </label>
    <input
      type="number"
      step="0.001"
      value={value}
      onChange={onChange}
      className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
      placeholder="0.000"
      inputMode="decimal"
    />
  </div>
);

const SummaryRow = ({ label, value, valueClassName = "text-gray-900" }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-gray-600">{label}</span>
    <span className={`font-medium text-sm ${valueClassName}`}>
      {value}
    </span>
  </div>
);

export default PumpPistolets;