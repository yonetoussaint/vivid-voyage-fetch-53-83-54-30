import React, { useState } from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  const [expandedPhases, setExpandedPhases] = useState({
    phaseA: true,
    phaseB: true
  });

  // Debug: log what we're receiving
  console.log('PumpPistolets received:', { 
    pompe, 
    donneesPompeKeys: Object.keys(donneesPompe),
    donneesPompe 
  });

  // First, get all pistolets (excluding _vendeur)
  const allPistolets = Object.entries(donneesPompe)
    .filter(([key]) => key !== '_vendeur');
  
  console.log('All pistolets:', allPistolets);

  // Simple grouping logic for now - adjust based on your actual data
  const groupedPistolets = {
    phaseA: {},
    phaseB: {}
  };

  // Group based on simple rules
  allPistolets.forEach(([pistolet, donnees]) => {
    const lowerKey = pistolet.toLowerCase();
    
    if (lowerKey.includes('diesel')) {
      // Put first diesel in phaseA, second in phaseB
      if (Object.keys(groupedPistolets.phaseA).filter(k => k.toLowerCase().includes('diesel')).length === 0) {
        groupedPistolets.phaseA[pistolet] = donnees;
      } else {
        groupedPistolets.phaseB[pistolet] = donnees;
      }
    } else if (lowerKey.includes('gasoline') || lowerKey.includes('gas')) {
      // Check if it's gasoline1 or gasoline2
      const numMatch = pistolet.match(/\d+/);
      const num = numMatch ? parseInt(numMatch[0]) : 0;
      
      if (num <= 2) {
        groupedPistolets.phaseA[pistolet] = donnees;
      } else {
        groupedPistolets.phaseB[pistolet] = donnees;
      }
    } else {
      // Default to phaseA
      groupedPistolets.phaseA[pistolet] = donnees;
    }
  });

  console.log('Grouped pistolets:', groupedPistolets);

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  const PhaseSection = ({ phase, title, pistolets }) => {
    const pistoletsArray = Object.entries(pistolets);
    
    if (pistoletsArray.length === 0) {
      return (
        <div className="border border-gray-200 rounded-lg p-4 text-gray-500 text-center">
          Aucun pistolet dans {title}
        </div>
      );
    }

    const hasDataInPhase = pistoletsArray.some(([_, donnees]) => 
      donnees.debut || donnees.fin
    );

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => togglePhase(phase)}
          className={`flex items-center justify-between w-full p-4 ${hasDataInPhase ? 'bg-blue-50' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${phase === 'phaseA' ? 'bg-blue-500' : 'bg-green-500'}`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {pistoletsArray.length} pistolet(s)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasDataInPhase && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Données saisies
              </span>
            )}
            {expandedPhases[phase] ? (
              <ChevronUp className="text-gray-500" size={20} />
            ) : (
              <ChevronDown className="text-gray-500" size={20} />
            )}
          </div>
        </button>

        {expandedPhases[phase] && (
          <div className="p-4 space-y-3">
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
                  {/* Header */}
                  <div className={`${getCouleurBadge(donnees.typeCarburant)} px-3 py-2 text-white`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {pistolet.replace('pistolet', 'Pistolet ').replace(/([A-Z])/g, ' $1')}
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
    <div className="space-y-4">
      <PhaseSection 
        phase="phaseA"
        title="Phase A"
        pistolets={groupedPistolets.phaseA}
      />
      
      <PhaseSection 
        phase="phaseB"
        title="Phase B"
        pistolets={groupedPistolets.phaseB}
      />
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