import React, { useState, useMemo } from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';
import { ChevronDown, ChevronUp, DollarSign, Fuel, Droplets } from 'lucide-react';

const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  const [expandedPhases, setExpandedPhases] = useState({
    phaseA: true,
    phaseB: true
  });

  // Get all pistolets (excluding _vendeur) and sort them
  const allPistolets = Object.entries(donneesPompe)
    .filter(([key]) => key !== '_vendeur')
    .sort(([keyA], [keyB]) => {
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

  allPistolets.forEach(([pistolet, donnees], index) => {
    if (index < 3) {
      groupedPistolets.phaseA[pistolet] = donnees;
    } else {
      groupedPistolets.phaseB[pistolet] = donnees;
    }
  });

  // Helper function to calculate phase totals
  const calculatePhaseTotals = (pistolets) => {
    return Object.entries(pistolets).reduce((totals, [_, donnees]) => {
      const gallons = calculerGallons(donnees.debut, donnees.fin);
      const prixUnitaire = donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.gasoline;
      const ventesTotal = gallons * prixUnitaire;
      
      if (donnees.typeCarburant === 'Diesel') {
        totals.totalDiesel += gallons;
        totals.salesDiesel += ventesTotal;
      } else {
        totals.totalGasoline += gallons;
        totals.salesGasoline += ventesTotal;
      }
      
      totals.totalGallons += gallons;
      totals.totalSales += ventesTotal;
      
      return totals;
    }, {
      totalGallons: 0,
      totalGasoline: 0,
      totalDiesel: 0,
      totalSales: 0,
      salesGasoline: 0,
      salesDiesel: 0
    });
  };

  const phaseATotals = useMemo(() => calculatePhaseTotals(groupedPistolets.phaseA), [groupedPistolets.phaseA, prix]);
  const phaseBTotals = useMemo(() => calculatePhaseTotals(groupedPistolets.phaseB), [groupedPistolets.phaseB, prix]);

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  const PhaseSection = ({ phase, title, pistolets, totals }) => {
    const pistoletsArray = Object.entries(pistolets);
    
    if (pistoletsArray.length === 0) {
      return null;
    }

    const hasData = totals.totalGallons > 0;

    return (
      <div className="space-y-3">
        {/* Enhanced Mobile-Friendly Collapsible Header with Stats */}
        <button
          onClick={() => togglePhase(phase)}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:bg-gray-50 touch-manipulation transition-all"
        >
          {/* Header Top Section */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Phase Indicator */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${phase === 'phaseA' ? 'bg-blue-500' : 'bg-green-500'}`}>
                <span className="font-bold text-white text-sm">
                  {phase === 'phaseA' ? 'A' : 'B'}
                </span>
              </div>
              
              {/* Title and Basic Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-900 truncate">{title}</h3>
                  {hasData && (
                    <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      ✓ Actif
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {pistoletsArray.length} pistolet{pistoletsArray.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* Collapse Icon */}
            <div className="flex-shrink-0 ml-2">
              {expandedPhases[phase] ? (
                <ChevronUp className="text-gray-500" size={22} strokeWidth={2.5} />
              ) : (
                <ChevronDown className="text-gray-500" size={22} strokeWidth={2.5} />
              )}
            </div>
          </div>

          {/* Stats Grid - Always visible in header */}
          <div className="px-3 pb-3 border-t border-gray-100 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Total Gallons */}
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="flex items-center space-x-1 mb-1">
                  <Droplets size={14} className="text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Total Gallons</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {formaterGallons(totals.totalGallons)}
                </p>
              </div>

              {/* Total Sales */}
              <div className="bg-green-50 rounded-lg p-2">
                <div className="flex items-center space-x-1 mb-1">
                  <DollarSign size={14} className="text-green-600" />
                  <span className="text-xs font-medium text-green-700">Ventes Total</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {formaterArgent(totals.totalSales)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">HTG</p>
              </div>
            </div>

            {/* Breakdown Row */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {/* Gasoline */}
              <div className="bg-orange-50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Fuel size={12} className="text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">Gasoline</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-900">
                      {formaterGallons(totals.totalGasoline)}
                    </p>
                    <p className="text-xs text-orange-700 font-medium">
                      {formaterArgent(totals.salesGasoline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Diesel */}
              <div className="bg-purple-50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Fuel size={12} className="text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Diesel</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-900">
                      {formaterGallons(totals.totalDiesel)}
                    </p>
                    <p className="text-xs text-purple-700 font-medium">
                      {formaterArgent(totals.salesDiesel)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            {hasData && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Gallons par pistolet:</span>
                  <span className="font-medium text-gray-700">
                    {formaterGallons(totals.totalGallons / pistoletsArray.length)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </button>

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
    <div className="space-y-4">
      {Object.keys(groupedPistolets.phaseA).length > 0 && (
        <PhaseSection 
          phase="phaseA"
          title="Phase A"
          pistolets={groupedPistolets.phaseA}
          totals={phaseATotals}
        />
      )}
      
      {Object.keys(groupedPistolets.phaseB).length > 0 && (
        <PhaseSection 
          phase="phaseB"
          title="Phase B"
          pistolets={groupedPistolets.phaseB}
          totals={phaseBTotals}
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