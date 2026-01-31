import React, { useState, useMemo } from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';
import { ChevronDown, ChevronUp, Droplets, DollarSign } from 'lucide-react';

// Phase Summary Card Component
const PhaseSummary = ({ 
  phase, 
  title, 
  pistoletsCount, 
  totals 
}) => {
  const hasData = totals.totalGallons > 0;

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Phase Indicator */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${phase === 'phaseA' ? 'bg-blue-500' : 'bg-green-500'}`}>
            <span className="font-bold text-white text-sm">
              {phase === 'phaseA' ? 'A' : 'B'}
            </span>
          </div>
          
          {/* Title and Basic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-gray-900 truncate">{title}</h3>
              {hasData && (
                <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 truncate">
              {pistoletsCount} pistolet{pistoletsCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* LEFT-ALIGNED Stats in Compact Layout */}
      <div className="mt-3 space-y-2">
        {/* First Row: Total Gallons and Total Sales */}
        <div className="flex space-x-2">
          <div className="flex-1 bg-white rounded p-2 border border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">Total Gallons</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <Droplets size={12} className="text-blue-500" />
                <p className="text-sm font-bold text-blue-900">
                  {formaterGallons(totals.totalGallons)}
                </p>
              </div>
              <span className="text-xs font-medium text-blue-700">gallons</span>
            </div>
          </div>
          <div className="flex-1 bg-white rounded p-2 border border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">Ventes Total</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <DollarSign size={12} className="text-green-500" />
                <p className="text-sm font-bold text-green-900">
                  {formaterArgent(totals.totalSales)}
                </p>
              </div>
              <span className="text-xs font-medium text-green-700">HTG</span>
            </div>
          </div>
        </div>

        {/* Second Row: Gasoline and Diesel Breakdown */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-50 rounded p-2 border border-orange-100">
            <p className="text-xs font-medium text-orange-700 mb-1">Gasoline</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-xs text-orange-900 font-medium">
                  {formaterGallons(totals.totalGasoline)}
                </p>
                <span className="text-xs text-orange-600">gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-orange-700">
                  {formaterArgent(totals.salesGasoline)}
                </p>
                <span className="text-xs text-orange-500">HTG</span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded p-2 border border-purple-100">
            <p className="text-xs font-medium text-purple-700 mb-1">Diesel</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-xs text-purple-900 font-medium">
                  {formaterGallons(totals.totalDiesel)}
                </p>
                <span className="text-xs text-purple-600">gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-purple-700">
                  {formaterArgent(totals.salesDiesel)}
                </p>
                <span className="text-xs text-purple-500">HTG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Thick Edge-to-Edge Separator
const PhaseSeparator = () => (
  <div className="my-6 -mx-3 border-t-4 border-gray-200"></div>
);

// Collapsible Pistolets Section (Clean header)
const CollapsiblePhaseSection = ({ 
  phase, 
  title, 
  pistolets, 
  totals, 
  pompe, 
  mettreAJourLecture, 
  prix,
  isExpanded, 
  onToggle 
}) => {
  const pistoletsArray = Object.entries(pistolets);
  const hasData = totals.totalGallons > 0;
  
  if (pistoletsArray.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Clean Collapsible Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 touch-manipulation transition-colors rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${phase === 'phaseA' ? 'bg-blue-500' : 'bg-green-500'}`} />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {isExpanded ? 'Masquer' : 'Afficher'}
          </span>
          {isExpanded ? (
            <ChevronUp className="text-gray-600" size={18} />
          ) : (
            <ChevronDown className="text-gray-600" size={18} />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Phase Summary Card */}
          <PhaseSummary
            phase={phase}
            title={title}
            pistoletsCount={pistoletsArray.length}
            totals={totals}
          />

          {/* Pistolets Cards */}
          {pistoletsArray.map(([pistolet, donnees]) => {
            const gallons = calculerGallons(donnees.debut, donnees.fin);
            const prixUnitaire = donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.gasoline;
            const ventesTotal = gallons * prixUnitaire;
            const hasPistoletData = donnees.debut || donnees.fin;

            return (
              <div
                key={pistolet}
                className={`rounded-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)}`}
              >
                {/* Header - ORIGINAL */}
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

                {/* Body - ORIGINAL */}
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

                  {hasPistoletData && (
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

// Original InputField component
const InputField = ({ label, value, onChange }) => (
  <div className="text-left">
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

// Original SummaryRow component
const SummaryRow = ({ label, value, valueClassName = "text-gray-900" }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`font-semibold ${valueClassName}`}>
      {value}
    </span>
  </div>
);

// Main PumpPistolets Component
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

  return (
    <div> {/* Removed px-3 padding */}
      {Object.keys(groupedPistolets.phaseA).length > 0 && (
        <>
          <CollapsiblePhaseSection
            phase="phaseA"
            title="Phase A"
            pistolets={groupedPistolets.phaseA}
            totals={phaseATotals}
            pompe={pompe}
            mettreAJourLecture={mettreAJourLecture}
            prix={prix}
            isExpanded={expandedPhases.phaseA}
            onToggle={() => togglePhase('phaseA')}
          />
          
          {Object.keys(groupedPistolets.phaseB).length > 0 && <PhaseSeparator />}
        </>
      )}
      
      {Object.keys(groupedPistolets.phaseB).length > 0 && (
        <CollapsiblePhaseSection
          phase="phaseB"
          title="Phase B"
          pistolets={groupedPistolets.phaseB}
          totals={phaseBTotals}
          pompe={pompe}
          mettreAJourLecture={mettreAJourLecture}
          prix={prix}
          isExpanded={expandedPhases.phaseB}
          onToggle={() => togglePhase('phaseB')}
        />
      )}
    </div>
  );
};

export default PumpPistolets;