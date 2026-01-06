import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import PumpHeader from '@/components/easy/PumpHeader';
import PumpSelector from '@/components/easy/PumpSelector';
import PumpPistolets from '@/components/easy/PumpPistolets';
import StatsCards from '@/components/easy/StatsCards';
import PropaneManager from '@/components/easy/PropaneManager';

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
  // Add propane-related props
  propaneDonnees,
  mettreAJourPropane,
  prixPropane
}) => {
  const lecturesCourantes = toutesDonnees[shift];
  const propaneDonneesCourantes = propaneDonnees?.[shift] || { debut: '', fin: '' };

  // Get deposits for the current shift
  const depotsActuels = tousDepots[shift] || {};

  return (
    <div className="space-y-3">
      <StatsCards 
        shift={shift}
        totaux={totaux}
        tauxUSD={tauxUSD}
      />

      <PumpSelector 
        pompes={pompes}
        pompeEtendue={pompeEtendue}
        setPompeEtendue={setPompeEtendue}
        showPropane={showPropane}
      />

      {/* Render PumpHeader for ALL tabs */}
      {pompeEtendue === 'propane' ? (
        <>
          {/* PumpHeader for Propane */}
          <PumpHeader
            pompe="Propane"
            shift={shift}
            isPropane={true}
            propaneData={propaneDonneesCourantes}
            propaneTotaux={totaux}
            prixPropane={prixPropane}
            vendeurs={vendeurs}
            vendeurDepots={depotsActuels}
            // These props are not used for propane but kept for consistency
            donneesPompe={{}}
            mettreAJourAffectationVendeur={() => {}}
            prix={prix}
          />

          {/* Propane input manager */}
          <PropaneManager
            shift={shift}
            propaneDonnees={propaneDonneesCourantes}
            mettreAJourPropane={mettreAJourPropane}
            prixPropane={prixPropane}
          />
          
          {/* Propane report card with detailed readings */}
          <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
            <h3 className="text-lg font-bold mb-3">Lectures Propane</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Début Shift</p>
                  <p className="text-xl font-bold">{propaneDonneesCourantes.debut || '0.000'}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Fin Shift</p>
                  <p className="text-xl font-bold">{propaneDonneesCourantes.fin || '0.000'}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-xs opacity-90 mb-1">Différence (Gallons)</p>
                  <p className="text-2xl font-bold">
                    {propaneDonneesCourantes.debut && propaneDonneesCourantes.fin 
                      ? (parseFloat(propaneDonneesCourantes.fin) - parseFloat(propaneDonneesCourantes.debut)).toFixed(3)
                      : '0.000'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Render pump pistolets for regular pump tabs
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
    </div>
  );
};

export default PumpInputView;