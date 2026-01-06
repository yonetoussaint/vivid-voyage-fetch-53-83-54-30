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

  // Create mock pump data for propane to use with PumpHeader
  const mockPropanePumpData = {
    P1: { debut: 0, fin: 0, vendeurId: '' }, // Empty pump data for propane
  };

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

      {/* Render PumpHeader for ALL tabs (pumps and propane) */}
      {pompeEtendue === 'propane' ? (
        <>
          {/* PumpHeader for Propane tab */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame size={24} className="text-white" />
                <h2 className="text-lg font-bold text-white">Propane</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-white opacity-90">Shift {shift}</p>
                <p className="text-sm font-bold text-white">
                  {formaterArgent(totaux.propaneVentes || 0)} HTG
                </p>
              </div>
            </div>
            
            {/* Vendeur assignment section - similar to PumpHeader */}
            <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Vendeur Assigné:</span>
                <select
                  className="px-3 py-1 bg-white text-gray-900 rounded-lg font-semibold text-sm"
                  value=""
                  onChange={(e) => {
                    // Since propane doesn't have a specific vendeur, we can show a message
                    // or handle it differently
                  }}
                >
                  <option value="">Propane - Pas de vendeur spécifique</option>
                  {vendeurs.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Propane input manager */}
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
                  <p className="text-xs opacity-90">Lectures Début</p>
                  <p className="text-xl font-bold">{propaneDonneesCourantes.debut || '0.000'}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Lectures Fin</p>
                  <p className="text-xl font-bold">{propaneDonneesCourantes.fin || '0.000'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Gallons Vendus</p>
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