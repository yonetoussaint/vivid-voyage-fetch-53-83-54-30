import React, { useState, useEffect } from 'react';
import PumpHeader from '@/components/easy/PumpHeader';
import PumpSelector from '@/components/easy/PumpSelector';
import PumpPistolets from '@/components/easy/PumpPistolets';
import StatsCards from '@/components/easy/StatsCards';
import PropaneManager from '@/components/easy/PropaneManager';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PumpInputView = ({ 
  shift, 
  pompeEtendue, 
  setPompeEtendue, 
  pompes, 
  toutesDonnees, 
  vendeurs, 
  totaux, 
  tauxUSD, 
  mettreAJourLecture, 
  mettreAJourAffectationVendeur, 
  prix,
  tousDepots,
  showPropane,
  propaneDonnees,
  mettreAJourPropane,
  prixPropane
}) => {
  const [showDataContext, setShowDataContext] = useState(false);
  const [quickAnalytics, setQuickAnalytics] = useState(null);

  const lecturesCourantes = toutesDonnees[shift];
  const propaneDonneesCourantes = propaneDonnees?.[shift] || { debut: '', fin: '' };
  const depotsActuels = tousDepots[shift] || {};

  // Calculate totals for current shift
  const calculateShiftTotals = () => {
    let totalVolume = 0;
    let totalSales = 0;
    let fuelTypes = {};

    if (lecturesCourantes) {
      Object.entries(lecturesCourantes).forEach(([pump, pumpData]) => {
        Object.entries(pumpData || {}).forEach(([gun, gunData]) => {
          if (gunData && gunData.lectureDebut !== undefined && gunData.lectureFin !== undefined) {
            const volume = gunData.lectureFin - gunData.lectureDebut;
            totalVolume += volume;

            const fuelPrice = prix?.[gunData.carburant] || 0;
            const sales = volume * fuelPrice;
            totalSales += sales;

            // Track fuel types
            if (gunData.carburant) {
              fuelTypes[gunData.carburant] = (fuelTypes[gunData.carburant] || 0) + volume;
            }
          }
        });
      });
    }

    // Add propane if available
    if (propaneDonneesCourantes && propaneDonneesCourantes.debut && propaneDonneesCourantes.fin) {
      const propaneVolume = propaneDonneesCourantes.fin - propaneDonneesCourantes.debut;
      totalVolume += propaneVolume;
      totalSales += propaneVolume * (prixPropane || 0);
      fuelTypes['propane'] = propaneVolume;
    }

    return { totalVolume, totalSales, fuelTypes };
  };

  // Generate quick analytics on data change
  useEffect(() => {
    const generateQuickAnalytics = () => {
      const { totalVolume, totalSales, fuelTypes } = calculateShiftTotals();

      // Find most active pump
      let mostActivePump = null;
      let maxVolume = 0;

      if (lecturesCourantes) {
        Object.entries(lecturesCourantes).forEach(([pump, pumpData]) => {
          let pumpVolume = 0;
          Object.entries(pumpData || {}).forEach(([gun, gunData]) => {
            if (gunData && gunData.lectureDebut !== undefined && gunData.lectureFin !== undefined) {
              pumpVolume += gunData.lectureFin - gunData.lectureDebut;
            }
          });

          if (pumpVolume > maxVolume) {
            maxVolume = pumpVolume;
            mostActivePump = pump;
          }
        });
      }

      // Find most sold fuel type
      let mostSoldFuel = null;
      let maxFuelVolume = 0;
      Object.entries(fuelTypes).forEach(([fuel, volume]) => {
        if (volume > maxFuelVolume) {
          maxFuelVolume = volume;
          mostSoldFuel = fuel;
        }
      });

      setQuickAnalytics({
        totalVolume: totalVolume.toFixed(2),
        totalSales: totalSales.toFixed(2),
        mostActivePump,
        mostSoldFuel,
        fuelTypes,
        pumpCount: Object.keys(lecturesCourantes || {}).length,
        activeGuns: Object.values(lecturesCourantes || {}).reduce((acc, pump) => 
          acc + Object.keys(pump || {}).length, 0
        )
      });
    };

    generateQuickAnalytics();
  }, [lecturesCourantes, propaneDonneesCourantes, shift]);

  return (
    <div className="space-y-3">
      {/* Stats Cards */}
      <StatsCards 
        shift={shift}
        totaux={totaux}
        tauxUSD={tauxUSD}
      />

      {/* Quick Analytics Summary */}
      {quickAnalytics && (
        <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Résumé du Shift {shift}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Volume Total</div>
              <div className="text-xl font-bold text-white">{quickAnalytics.totalVolume} L</div>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Ventes Total</div>
              <div className="text-xl font-bold text-white">{quickAnalytics.totalSales} USD</div>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Pompe la plus Active</div>
              <div className="text-xl font-bold text-white">
                {quickAnalytics.mostActivePump || 'N/A'}
              </div>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Carburant Principal</div>
              <div className="text-xl font-bold text-white">
                {quickAnalytics.mostSoldFuel || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pump Selector */}
      <PumpSelector 
        pompes={pompes}
        pompeEtendue={pompeEtendue}
        setPompeEtendue={setPompeEtendue}
        showPropane={showPropane}
      />

      {/* Render content based on selected tab */}
      {pompeEtendue === 'propane' ? (
        <>
          <PumpHeader
            pompe="Propane"
            shift={shift}
            isPropane={true}
            propaneData={propaneDonneesCourantes}
            prixPropane={prixPropane}
            vendeurs={vendeurs}
            vendeurDepots={depotsActuels}
            tauxUSD={tauxUSD}
            mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
            donneesPompe={{}}
            prix={prix}
          />

          <PropaneManager
            shift={shift}
            propaneDonnees={propaneDonneesCourantes}
            mettreAJourPropane={(field, value) => mettreAJourPropane(field, value, shift)}
            prixPropane={prixPropane}
          />
        </>
      ) : (
        Object.entries(lecturesCourantes).map(([pompe, donneesPompe]) => {
          if (pompe !== pompeEtendue) return null;

          return (
            <div key={pompe} className="space-y-3">
              <PumpHeader
                pompe={pompe}
                shift={shift}
                donneesPompe={donneesPompe}
                vendeurs={vendeurs}
                mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
                prix={prix}
                vendeurDepots={depotsActuels}
                tauxUSD={tauxUSD}
              />

              <PumpPistolets
                pompe={pompe}
                donneesPompe={donneesPompe}
                mettreAJourLecture={mettreAJourLecture}
                prix={prix}
              />
            </div>
          );
        })
      )}

      {/* Data Context Panel (Collapsible) */}
      <div className="mt-6">
        <button
          onClick={() => setShowDataContext(!showDataContext)}
          className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
        >
          <span className="text-white font-medium">Aperçu des Données</span>
          {showDataContext ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showDataContext && quickAnalytics && (
          <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Données Shift {shift}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pompes:</span>
                    <span className="text-white">{quickAnalytics.pumpCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pistolets Actifs:</span>
                    <span className="text-white">{quickAnalytics.activeGuns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Vendeurs:</span>
                    <span className="text-white">{vendeurs?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Volume Total:</span>
                    <span className="text-white">{quickAnalytics.totalVolume} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Ventes Total:</span>
                    <span className="text-white">{quickAnalytics.totalSales} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Taux USD:</span>
                    <span className="text-white">{tauxUSD}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Répartition par Carburant</h4>
              <div className="space-y-1">
                {Object.entries(quickAnalytics.fuelTypes).map(([fuel, volume]) => (
                  <div key={fuel} className="flex justify-between">
                    <span className="text-gray-300">{fuel}:</span>
                    <span className="text-white">{volume.toFixed(2)} L</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PumpInputView;