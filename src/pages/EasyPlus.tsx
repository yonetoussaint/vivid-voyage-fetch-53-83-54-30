import React, { useState } from 'react';
import Navbar from '@/components/easy/Navbar';
import ShiftManager from '@/components/easy/ShiftManager';
import VendeursManager from '@/components/easy/VendeursManager';
import DepotsManager from '@/components/easy/DepotsManager';
import USDManager from '@/components/easy/USDManager';
import StockRestant from '@/components/easy/StockRestant';
import ReportView from '@/components/easy/ReportView';
import PumpInputView from '@/components/easy/PumpInputView';
import { useStationData } from '@/hooks/useStationData';

const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeView, setActiveView] = useState('pumps'); // pumps, stock, report, vendeurs, depots, usd
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

  // Fonction pour changer de vue
  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'pumps') {
      setPompeEtendue('P1');
    }
  };

  // Handle pump/propane tab selection - ONLY for pump selector tabs
  const handlePompeSelection = (selection) => {
    setActiveView('pumps'); // Always set to 'pumps' view when using pump selector
    setPompeEtendue(selection);
  };

  // Fonctions de réinitialisation
  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
    if (activeView === 'pumps') {
      setPompeEtendue('P1');
    }
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setActiveView('pumps');
    setPompeEtendue('P1');
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
            setPompeEtendue={handlePompeSelection}
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
            // Pass propane data
            propaneDonnees={propaneDonnees}
            mettreAJourPropane={mettreAJourPropane}
            prixPropane={prixPropane}
            showPropane={true}
            tousDepots={tousDepots}
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

      <div className="p-2 max-w-2xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default SystemeStationService;