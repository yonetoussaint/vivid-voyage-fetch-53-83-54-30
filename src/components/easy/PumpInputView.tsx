import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import PumpHeader from '@/components/easy/PumpHeader';
import PumpSelector from '@/components/easy/PumpSelector';
import PumpPistolets from '@/components/easy/PumpPistolets';
import StatsCards from '@/components/easy/StatsCards';
import PropaneManager from '@/components/easy/PropaneManager';
import { Flame } from 'lucide-react';

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

      {/* Render propane view when propane tab is selected */}
      {pompeEtendue === 'propane' ? (
        <div className="space-y-4">
          <PropaneManager
            shift={shift}
            propaneDonnees={propaneDonneesCourantes}
            mettreAJourPropane={mettreAJourPropane}
            prixPropane={prixPropane}
          />
          
          {/* Propane report card */}
          <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Flame size={20} />
              Rapport Propane - Shift {shift}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Total Gallons</p>
                  <p className="text-xl font-bold">{totaux.propaneGallons?.toFixed(3) || '0.000'}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Prix/Gallon</p>
                  <p className="text-xl font-bold">{prixPropane} HTG</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Ventes Propane:</span>
                  <span className="text-2xl font-bold">{formaterArgent(totaux.propaneVentes || 0)} HTG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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