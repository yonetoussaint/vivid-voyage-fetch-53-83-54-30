import React, { useState } from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  const [expandedPhases, setExpandedPhases] = useState({
    phaseA: true,
    phaseB: true
  });

  // Get all pistolets (excluding _vendeur) and sort them
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
      return null;
    }

    const hasDataInPhase = pistoletsArray.some(([_, donnees]) => 
      donnees.debut || donnees.fin
    );

    return (
      <div className="space-y-3">
        {/* Ultra Mobile-Friendly Collapsible Header */}
        <button
          onClick={() => togglePhase(phase)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg active:bg-gray-200 touch-manipulation transition-colors border border-gray-200"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Phase Indicator */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${phase === 'phaseA' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              <span className="font-bold text-sm">
                {phase === 'phaseA' ? 'A' : 'B'}
              </span>
            </div>
            
            {/* Title and Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900 truncate">{title}</h3>
                {hasDataInPhase && (
                  <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 truncate">
                {pistoletsArray.length} pistolet{pistoletsArray.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Collapse Icon with Touch Feedback */}
          <div className={`flex-shrink-0 ml-2 p-1.5 rounded-full ${expandedPhases[phase] ? 'bg-gray-200' : 'bg-gray-100'}`}>
            {expandedPhases[phase] ? (
              <ChevronUp className="text-gray-600" size={20} strokeWidth={2.5} />
            ) : (
              <ChevronDown className="text-gray-600" size={20} strokeWidth={2.5} />
            )}
          </div>
        </button>

        {/* Status Bar (only shows when collapsed and has data) */}
        {!expandedPhases[phase] && hasDataInPhase && (
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-700 font-medium">Données saisies</span>
              <span className="text-blue-600">↓ Cliquez pour voir</span>
            </div>
          </div>
        )}

        {/* Pistolets Cards - Only show if expanded */}
        {expandedPhases[phase] && (
          <div className="space-y-3">
            {pistoletsArray.map(([pistolet, donnees]) => {
              const gallons = calculerGallons(donnees.debut, donnees.fin);
              const prixUnitaire = donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.gasoline;
              const ventesTotal = gallons * prixUnitaire;
              const hasData = donnees.debut || donnees.fin;

              return (
                <div
                  key={pistolet}
                  className={`rounded-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)}`}
                >
                  {/* Header - EXACTLY as original */}
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

                  {/* Body - EXACTLY as original */}
                  <div className="p-3 bg-white space-y-3">
                    <div className="grid grid-cols-2 gap-2">
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
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4"> {/* Mobile-friendly spacing */}
      {Object.keys(groupedPistolets.phaseA).length > 0 && (
        <PhaseSection 
          phase="phaseA"
          title="Phase A"
          pistolets={groupedPistolets.phaseA}
        />
      )}
      
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

// Keep the exact same InputField component
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

// Keep the exact same SummaryRow component
const SummaryRow = ({ label, value, valueClassName = "text-gray-900" }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`font-semibold ${valueClassName}`}>
      {value}
    </span>
  </div>
);

export default PumpPistolets;