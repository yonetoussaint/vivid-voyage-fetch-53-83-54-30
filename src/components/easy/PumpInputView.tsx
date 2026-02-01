import React, { useState, useEffect } from 'react';
import PumpHeader from '@/components/easy/PumpHeader';
import PumpPistolets from '@/components/easy/PumpPistolets';
import StatsCards from '@/components/easy/StatsCards';
import PropaneManager from '@/components/easy/PropaneManager';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Enhanced separator with more control
const Separator = ({ className = "", topMargin = "my-8", bottomMargin = "" }) => (
  <div className={`${topMargin} ${bottomMargin} w-full border-t-4 border-gray-200 ${className}`}></div>
);

const PumpInputView = ({ 
  shift, 
  pompeEtendue,
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
  const [showStatsCards, setShowStatsCards] = useState(false);

  const lecturesCourantes = toutesDonnees[shift];
  const propaneDonneesCourantes = propaneDonnees?.[shift] || { debut: '', fin: '' };
  const depotsActuels = tousDepots[shift] || {};

  return (
    <div className="mt-4 px-3"> {/* Added px-3 to match PumpPistolets container */}
      {/* Stats Cards Section - Collapsible */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setShowStatsCards(!showStatsCards)}
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Statistiques du Shift {shift}</h3>
            <p className="text-sm text-gray-500">Cliquez pour afficher les détails</p>
          </div>
          {showStatsCards ? (
            <ChevronUp className="text-gray-500" size={20} />
          ) : (
            <ChevronDown className="text-gray-500" size={20} />
          )}
        </button>

        {showStatsCards && (
          <div className="pb-4">
            <div className="border-t border-gray-200 pt-4">
              <StatsCards 
                shift={shift}
                totaux={totaux}
                tauxUSD={tauxUSD}
              />
            </div>
          </div>
        )}
      </div>

      <Separator topMargin="mt-6 mb-6" />

      {/* Render content based on selected pump */}
      <div className="overflow-hidden">
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

            <Separator topMargin="mt-6 mb-6" />

            <div className="pt-2"> {/* Added padding top */}
              <PropaneManager
                shift={shift}
                propaneDonnees={propaneDonneesCourantes}
                mettreAJourPropane={(field, value) => mettreAJourPropane(field, value, shift)}
                prixPropane={prixPropane}
              />
            </div>
          </>
        ) : (
          Object.entries(lecturesCourantes).map(([pompe, donneesPompe]) => {
            if (pompe !== pompeEtendue) return null;

            return (
              <div key={pompe}>
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
              </div>
            );
          })
        )}
      </div>

      <Separator topMargin="mt-6 mb-6" />

      {/* PumpPistolets rendered outside the main wrapper */}
      {pompeEtendue !== 'propane' && Object.entries(lecturesCourantes).map(([pompe, donneesPompe]) => {
        if (pompe !== pompeEtendue) return null;

        return (
          <div key={pompe} className="mt-0">
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