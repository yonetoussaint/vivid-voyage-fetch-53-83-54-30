import React, { useState } from 'react';
import Navbar from '@/components/easy/Navbar';
import ShiftManager from '@/components/easy/ShiftManager';
import VendeursManager from '@/components/easy/VendeursManager';
import DepotsManager from '@/components/easy/DepotsManager';
import USDManager from '@/components/easy/USDManager';
import StockRestant from '@/components/easy/StockRestant';
import PropaneManager from '@/components/easy/PropaneManager';
import ReportView from '@/components/easy/ReportView';
import PumpInputView from '@/components/easy/PumpInputView';
import { useStationData } from '@/hooks/useStationData';
import { Flame } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeView, setActiveView] = useState('pumps'); // pumps, stock, report, vendeurs, depots, usd, propane
  const [pompeEtendue, setPompeEtendue] = useState('P1');

  const {
    toutesDonnees,
    propaneDonnees,
    vendeurs,
    tousDepots,
    ventesUSD,
    nouveauVendeur,
    setNouveauVendeur,
    reinitialiserShift,
    reinitialiserJour,
    ajouterVendeur,
    supprimerVendeur,
    mettreAJourLecture,
    mettreAJourAffectationVendeur,
    mettreAJourPropane,
    mettreAJourDepot,
    ajouterDepot,
    supprimerDepot,
    ajouterUSD,
    mettreAJourUSD,
    supprimerUSD,
    getNombreAffectations,
    totaux,
    totauxVendeurs,
    totauxVendeursCourants,
    totauxAM,
    totauxPM,
    totauxQuotidiens,
    calculerGallons,
    obtenirLecturesCourantes,
    prix,
    tauxUSD,
    prixPropane
  } = useStationData(date, shift);

  const pompes = ['P1', 'P2', 'P3', 'P4', 'P5'];

  // Get current propane data for the shift
  const propaneDonneesCourantes = propaneDonnees[shift] || { debut: '', fin: '' };

  // Fonction pour changer de vue
  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'pumps') {
      setPompeEtendue('P1');
    }
  };

  // Fonctions de réinitialisation
  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setActiveView('pumps');
  };

  // Rendu conditionnel selon la vue active
  const renderView = () => {
    switch (activeView) {
      case 'vendeurs':
        return (
          <VendeursManager
            vendeurs={vendeurs}
            nouveauVendeur={nouveauVendeur}
            setNouveauVendeur={setNouveauVendeur}
            ajouterVendeur={ajouterVendeur}
            supprimerVendeur={supprimerVendeur}
            getNombreAffectations={getNombreAffectations}
          />
        );
      case 'depots':
        return (
          <DepotsManager
            shift={shift}
            vendeurs={vendeurs}
            totauxVendeurs={totauxVendeursCourants}
            tousDepots={tousDepots}
            mettreAJourDepot={mettreAJourDepot}
            ajouterDepot={ajouterDepot}
            supprimerDepot={supprimerDepot}
          />
        );
      case 'stock':
        return (
          <StockRestant
            date={date}
            shift={shift}
            toutesDonnees={toutesDonnees}
            propaneDonnees={propaneDonnees}
            pompes={pompes}
            prix={prix}
          />
        );
      case 'usd':
        return (
          <USDManager
            shift={shift}
            usdVentes={ventesUSD}
            ajouterUSD={ajouterUSD}
            mettreAJourUSD={mettreAJourUSD}
            supprimerUSD={supprimerUSD}
            tauxUSD={tauxUSD}
          />
        );
      case 'propane':
        return (
          <div className="space-y-4">
            <PropaneManager
              shift={shift}
              propaneDonnees={propaneDonneesCourantes}
              mettreAJourPropane={mettreAJourPropane}
              prixPropane={prixPropane}
            />
            {/* Separate propane report card */}
            <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Flame size={20} />
                Rapport Propane - Shift {shift}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-xs opacity-90">Total Gallons</p>
                    <p className="text-xl font-bold">{totaux.propaneGallons.toFixed(3)}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-xs opacity-90">Prix/Gallon</p>
                    <p className="text-xl font-bold">{prixPropane} HTG</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Ventes Propane:</span>
                    <span className="text-2xl font-bold">{formaterArgent(totaux.propaneVentes)} HTG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'report':
        return (
          <ReportView
            date={date}
            totauxAM={totauxAM}
            totauxPM={totauxPM}
            totauxQuotidiens={totauxQuotidiens}
            toutesDonnees={toutesDonnees}
            propaneDonnees={propaneDonnees}
            ventesUSD={ventesUSD}
            vendeurs={vendeurs}
            totauxVendeurs={totauxVendeurs}
            tauxUSD={tauxUSD}
            prix={prix}
            prixPropane={prixPropane}
            pompes={pompes}
          />
        );
      case 'pumps':
      default:
        return (
          <PumpInputView
            shift={shift}
            pompeEtendue={pompeEtendue}
            setPompeEtendue={setPompeEtendue}
            pompes={pompes}
            toutesDonnees={toutesDonnees}
            vendeurs={vendeurs}
            totaux={totaux}
            tauxUSD={tauxUSD}
            mettreAJourLecture={mettreAJourLecture}
            mettreAJourAffectationVendeur={mettreAJourAffectationVendeur}
            prix={prix}
            calculerGallons={calculerGallons}
            obtenirLecturesCourantes={obtenirLecturesCourantes}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
      <Navbar
        date={date}
        setDate={setDate}
        shift={shift}
        setShift={setShift}
        activeView={activeView}
        onViewChange={handleViewChange}
        onResetShift={handleReinitialiserShift}
        onResetDay={handleReinitialiserJour}
      />

      <ShiftManager shift={shift} />

      <div className="p-4 max-w-2xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default SystemeStationService;