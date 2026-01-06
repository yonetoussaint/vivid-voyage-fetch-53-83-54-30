import React from 'react';
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

      {/* Render content based on selected tab */}
      {pompeEtendue === 'propane' ? (
        <>
          {/* PumpHeader for Propane mode */}
         <PumpHeader
  pompe="Propane"
  shift={shift}
  isPropane={true}
  propaneData={propaneDonneesCourantes}
  prixPropane={prixPropane}
  vendeurs={vendeurs}
  vendeurDepots={depotsActuels}
  // Pass the vendeur assignment function
  mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
  // Pass dummy data for unused props
  donneesPompe={{}}
  prix={prix}
/>

          {/* Your existing PropaneManager component */}
          <PropaneManager
            shift={shift}
            propaneDonnees={propaneDonneesCourantes}
            mettreAJourPropane={(field, value) => mettreAJourPropane(field, value, shift)}
            prixPropane={prixPropane}
          />
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