import React, { useState, useMemo } from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import { getCouleurCarburant, getCouleurBadge, calculerGallons } from '@/utils/helpers';
import { Droplets, DollarSign } from 'lucide-react';

// Phase Summary Card
const PhaseSummary = ({ totals, title, color }) => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-3 mb-4">
      <div className="flex items-center mb-3">
        <div className={`w-3 h-3 rounded-full mr-2 ${color}`} />
        <h3 className="font-medium text-gray-900">{title} Summary</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex space-x-2">
          <div className="flex-1 rounded p-2 border border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">Total Gallons</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <Droplets size={12} className="text-blue-500" />
                <p className="text-sm font-bold text-blue-900">
                  {formaterGallons(totals.totalGallons || 0)}
                </p>
              </div>
              <span className="text-xs font-medium text-blue-700">gallons</span>
            </div>
          </div>
          <div className="flex-1 bg-gray-50 rounded p-2 border border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">Ventes Total</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <DollarSign size={12} className="text-green-500" />
                <p className="text-sm font-bold text-green-900">
                  {formaterArgent(totals.totalSales || 0)}
                </p>
              </div>
              <span className="text-xs font-medium text-green-700">HTG</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-50 rounded p-2 border border-orange-100">
            <p className="text-xs font-medium text-orange-700 mb-1">Gasoline</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-xs text-orange-900 font-medium">
                  {formaterGallons(totals.totalGasoline || 0)}
                </p>
                <span className="text-xs text-orange-600">gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-orange-700">
                  {formaterArgent(totals.salesGasoline || 0)}
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
                  {formaterGallons(totals.totalDiesel || 0)}
                </p>
                <span className="text-xs text-purple-600">gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-purple-700">
                  {formaterArgent(totals.salesDiesel || 0)}
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

// Pistolet Card
const PistoletCard = ({ pistoletKey, donnees, pompe, mettreAJourLecture, prix }) => {
  const gallons = calculerGallons(donnees.debut, donnees.fin);
  const prixUnitaire = donnees.typeCarburant?.includes('Diesel') ? prix.diesel : prix.gasoline;
  const ventesTotal = gallons * prixUnitaire;
  const hasData = donnees.debut || donnees.fin;

  return (
    <div className={`rounded-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)} mb-4`}>
      {/* Header */}
      <div className={`${getCouleurBadge(donnees.typeCarburant)} px-4 py-3 text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm">
              {pistoletKey.replace('pistolet', 'Pistolet ')}
            </h3>
            <p className="text-xs opacity-90">{donnees.typeCarburant}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">Prix</p>
            <p className="font-bold text-sm">
              {prixUnitaire} HTG
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-white space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-left">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Meter Ouverture
            </label>
            <input
              type="number"
              step="0.001"
              value={donnees.debut || ''}
              onChange={(e) => mettreAJourLecture(pompe, pistoletKey, 'debut', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.000"
              inputMode="decimal"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Meter Fermeture
            </label>
            <input
              type="number"
              step="0.001"
              value={donnees.fin || ''}
              onChange={(e) => mettreAJourLecture(pompe, pistoletKey, 'fin', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.000"
              inputMode="decimal"
            />
          </div>
        </div>

        {hasData && (
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gallons</span>
              <span className="font-semibold text-gray-900">
                {formaterGallons(gallons)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ventes Total</span>
              <span className="font-bold text-green-600">
                {formaterArgent(ventesTotal)} HTG
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main PumpPistolets Component
const PumpPistolets = ({ pompe, donneesPompe, mettreAJourLecture, prix }) => {
  const [activeTab, setActiveTab] = useState('phaseA');

  // Filter to get only pistolet keys (excluding _vendeur)
  const pistoletsKeys = Object.keys(donneesPompe || {})
    .filter(key => key.startsWith('pistolet'))
    .sort((a, b) => {
      // Sort by pistolet number: pistolet1, pistolet2, etc.
      const numA = parseInt(a.replace('pistolet', ''));
      const numB = parseInt(b.replace('pistolet', ''));
      return numA - numB;
    });

  // Group pistolets into phases (3 per phase)
  const groupedPistolets = {
    phaseA: {},
    phaseB: {}
  };

  pistoletsKeys.forEach((key, index) => {
    if (index < 3) {
      groupedPistolets.phaseA[key] = donneesPompe[key];
    } else {
      groupedPistolets.phaseB[key] = donneesPompe[key];
    }
  });

  // Calculate totals for each phase
  const calculatePhaseTotals = (pistolets) => {
    return Object.values(pistolets).reduce((totals, donnees) => {
      if (!donnees) return totals;

      const gallons = calculerGallons(donnees.debut, donnees.fin);
      const prixUnitaire = donnees.typeCarburant?.includes('Diesel') ? prix.diesel : prix.gasoline;
      const ventesTotal = gallons * prixUnitaire;

      totals.totalGallons += gallons;
      totals.totalSales += ventesTotal;

      if (donnees.typeCarburant?.includes('Diesel')) {
        totals.totalDiesel += gallons;
        totals.salesDiesel += ventesTotal;
      } else {
        totals.totalGasoline += gallons;
        totals.salesGasoline += ventesTotal;
      }

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

  const hasPhaseB = Object.keys(groupedPistolets.phaseB).length > 0;

  // Handle P5 which only has 1 pistolet - show it in Phase A only
  if (pompe === 'P5') {
    return (
      <div className="px-3">
        <PhaseSummary 
          totals={phaseATotals} 
          title="Phase A" 
          color="bg-blue-500" 
        />
        <div className="space-y-4">
          {pistoletsKeys.map(key => (
            <PistoletCard
              key={key}
              pistoletKey={key}
              donnees={donneesPompe[key]}
              pompe={pompe}
              mettreAJourLecture={mettreAJourLecture}
              prix={prix}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Segmented Control Tab Bar */}
      <div className="mb-6">
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('phaseA')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 min-w-[100px] ${
              activeTab === 'phaseA'
                ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Phase A</span>
            </div>
          </button>
          
          {hasPhaseB && (
            <button
              onClick={() => setActiveTab('phaseB')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 min-w-[100px] ${
                activeTab === 'phaseB'
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Phase B</span>
              </div>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <div>
            Phase A: <span className="font-medium text-blue-600">{formaterGallons(phaseATotals.totalGallons)}</span> gallons
          </div>
          {hasPhaseB && (
            <div>
              Phase B: <span className="font-medium text-green-600">{formaterGallons(phaseBTotals.totalGallons)}</span> gallons
            </div>
          )}
        </div>
      </div>

      {/* Phase A Content */}
      {activeTab === 'phaseA' && (
        <>
          <PhaseSummary 
            totals={phaseATotals} 
            title="Phase A" 
            color="bg-blue-500" 
          />
          <div className="space-y-4">
            {Object.entries(groupedPistolets.phaseA).map(([key, donnees]) => (
              <PistoletCard
                key={key}
                pistoletKey={key}
                donnees={donnees}
                pompe={pompe}
                mettreAJourLecture={mettreAJourLecture}
                prix={prix}
              />
            ))}
          </div>
        </>
      )}

      {/* Phase B Content */}
      {activeTab === 'phaseB' && hasPhaseB && (
        <>
          <PhaseSummary 
            totals={phaseBTotals} 
            title="Phase B" 
            color="bg-green-500" 
          />
          <div className="space-y-4">
            {Object.entries(groupedPistolets.phaseB).map(([key, donnees]) => (
              <PistoletCard
                key={key}
                pistoletKey={key}
                donnees={donnees}
                pompe={pompe}
                mettreAJourLecture={mettreAJourLecture}
                prix={prix}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PumpPistolets;