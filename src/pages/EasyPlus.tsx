// SystemeStationService.jsx
import React, { useState, useEffect } from 'react';
import ShiftManager from '@/components/easy/ShiftManager';
import ConditionnementManager from '@/components/easy/ConditionnementManager';
import VendeursManager from '@/components/easy/VendeursManager';
import DepotsManager from '@/components/easy/DepotsManager';
import USDManager from '@/components/easy/USDManager';
import StockRestant from '@/components/easy/StockRestant';
import ReportView from '@/components/easy/ReportView';
import PumpInputView from '@/components/easy/PumpInputView';
import Rapport from '@/components/easy/Rapport';
import TasksManager from '@/components/easy/TasksManager';
import { useStationData } from '@/hooks/useStationData';

// Import the new components
import MainLayout from '@/components/easy/MainLayout';
import VerticalTabs from '@/components/easy/VerticalTabs';
import SidePanel from '@/components/easy/SidePanel';
import ContactModal from '@/components/easy/ContactModal';

const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
  const [conditionnements, setConditionnements] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('pumps');
  const [pompeEtendue, setPompeEtendue] = useState('P1');
  const [showContact, setShowContact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [vendeurActif, setVendeurActif] = useState(null); // New state for active vendor

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

  // Reset active vendor when vendeurs change
  useEffect(() => {
    if (vendeurs.length > 0 && (!vendeurActif || !vendeurs.includes(vendeurActif))) {
      setVendeurActif(vendeurs[0]);
    } else if (vendeurs.length === 0) {
      setVendeurActif(null);
    }
  }, [vendeurs]);

  const handlePompeSelection = (selection) => {
    setPompeEtendue(selection);
  };

  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
    setPompeEtendue('P1');
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setPompeEtendue('P1');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) { // Close menu on mobile after selection
      setIsMenuOpen(false);
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'pumps':
        return (
          <div className="p-2 sm:p-4">
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
              propaneDonnees={propaneDonnees}
              mettreAJourPropane={mettreAJourPropane}
              prixPropane={prixPropane}
              showPropane={true}
              tousDepots={tousDepots}
            />
          </div>
        );
      case 'tasks':
        return (
          <div className="p-2 sm:p-4">
            <TasksManager
              shift={shift}
              date={date}
              vendeurs={vendeurs}
            />
          </div>
        );
      case 'vendeurs':
        return (
          <div className="p-2 sm:p-4">
            <VendeursManager
              vendeurs={vendeurs}
              nouveauVendeur={nouveauVendeur}
              setNouveauVendeur={setNouveauVendeur}
              ajouterVendeur={ajouterVendeur}
              supprimerVendeur={supprimerVendeur}
              getNombreAffectations={getNombreAffectations}
            />
          </div>
        );
      case 'conditionnement':
        return (
          <div className="p-2 sm:p-6">
            <ConditionnementManager
              shift={shift}
              date={date}
              vendeurs={vendeurs}
              tousDepots={tousDepots}
              onConditionnementUpdate={setConditionnements}
            />
          </div>
        );
      case 'depots':
        return (
          <div className="p-2 sm:p-6">
            <DepotsManager
              shift={shift}
              vendeurs={vendeurs}
              totauxVendeurs={totauxVendeursCourants}
              tousDepots={tousDepots}
              mettreAJourDepot={mettreAJourDepot}
              ajouterDepot={ajouterDepot}
              supprimerDepot={supprimerDepot}
              vendeurActif={vendeurActif}
              setVendeurActif={setVendeurActif}
            />
          </div>
        );
      case 'stock':
        return (
          <div className="p-2 sm:p-6">
            <StockRestant
              date={date}
              shift={shift}
              toutesDonnees={toutesDonnees}
              propaneDonnees={propaneDonnees}
              pompes={pompes}
              prix={prix}
            />
          </div>
        );
      case 'usd':
        return (
          <div className="p-2 sm:p-6">
            <USDManager
              shift={shift}
              usdVentes={ventesUSD}
              ajouterUSD={ajouterUSD}
              mettreAJourUSD={mettreAJourUSD}
              supprimerUSD={supprimerUSD}
              tauxUSD={tauxUSD}
            />
          </div>
        );
      case 'report':
        return (
          <div className="p-2 sm:p-6">
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
          </div>
        );
      case 'rapport':
        return (
          <div className="p-2 sm:p-6">
            <Rapport
              date={date}
              shift={shift}
              toutesDonnees={toutesDonnees}
            />
          </div>
        );
      default:
        return (
          <div className="p-2 sm:p-6">
            <p className="text-gray-600 text-sm sm:text-base">Sélectionnez une application</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Mobile Side Panel */}
      <SidePanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isMobile={true}>
        <VerticalTabs activeTab={activeTab} onTabChange={handleTabChange} isMobile={true} />
      </SidePanel>

      {/* Main Layout */}
      <MainLayout
        date={date}
        shift={shift}
        activeTab={activeTab}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        onDateChange={(newDate) => setDate(newDate)}
        onShiftChange={(newShift) => setShift(newShift)}
        // Pump props
        pompes={pompes}
        pompeEtendue={pompeEtendue}
        setPompeEtendue={setPompeEtendue}
        showPropane={true}
        // Vendor props for depots tab
        vendeurs={vendeurs}
        vendeurActif={vendeurActif}
        setVendeurActif={setVendeurActif}
        // Reset functions
        onResetShift={handleReinitialiserShift}
        onResetDay={handleReinitialiserJour}
        // Tasks stats props (you might want to add these later)
        // tasksStats={tasksStats}
      >
        {renderActiveTabContent()}
      </MainLayout>

      <ContactModal showContact={showContact} setShowContact={setShowContact} />
    </>
  );
};

export default SystemeStationService;