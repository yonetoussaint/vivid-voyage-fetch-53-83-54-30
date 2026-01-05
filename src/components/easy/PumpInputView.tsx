import React from 'react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import PumpHeader from '@/components/easy/PumpHeader';
import PumpSelector from '@/components/easy/PumpSelector';
import PumpPistolets from '@/components/easy/PumpPistolets';
import StatsCards from '@/components/easy/StatsCards';

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
  tousDepots // ADD THIS PROP
}) => {
  const lecturesCourantes = toutesDonnees[shift];

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
      />

      {/* Pistolets pour Pompe Sélectionnée */}
      {Object.entries(lecturesCourantes).map(([pompe, donneesPompe]) => {
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
              // PASS THE DEPOSITS DATA HERE
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
      })}
    </div>
  );
};

export default PumpInputView;