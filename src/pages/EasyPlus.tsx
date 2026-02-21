// SystemeStationService.jsx (updated with secondary navigation)
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
import LiasseCounter from '@/components/easy/LiasseCounter';
import ProForma from '@/components/easy/ProForma'; 
import { useStationData } from '@/hooks/useStationData';

// Import the layout components
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
  const [vendeurActif, setVendeurActif] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [conditionnementDenom, setConditionnementDenom] = useState(1000);
  const [tasksStats, setTasksStats] = useState(null);

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
  const denominationValues = [1000, 500, 250, 100, 50, 25, 10, 5];
  const taskFilters = ['all', 'pending', 'completed', 'critical'];

  // Secondary navigation based on active tab
  const getSecondaryItems = () => {
    switch (activeTab) {
      case 'pumps':
        return [...pompes, 'propane'];
      case 'vendeurs':
      case 'depots':
        return [null, ...vendeurs]; // null represents "Tous les Vendeurs"
      case 'conditionnement':
        return denominationValues;
      case 'tasks':
        return taskFilters;
      default:
        return [];
    }
  };

  const getCurrentSecondaryIndex = () => {
    const items = getSecondaryItems();
    let currentValue;
    
    switch (activeTab) {
      case 'pumps':
        currentValue = pompeEtendue;
        break;
      case 'vendeurs':
      case 'depots':
        currentValue = vendeurActif;
        break;
      case 'conditionnement':
        currentValue = conditionnementDenom;
        break;
      case 'tasks':
        currentValue = filterType;
        break;
      default:
        return -1;
    }
    
    return items.indexOf(currentValue);
  };

  const getSecondaryLabel = () => {
    const currentIndex = getCurrentSecondaryIndex();
    const items = getSecondaryItems();
    
    if (currentIndex === -1 || !items.length) return '';
    
    switch (activeTab) {
      case 'pumps':
        return items[currentIndex] === 'propane' ? 'Propane' : `Pompe ${items[currentIndex].replace('P', '')}`;
      case 'vendeurs':
      case 'depots':
        return items[currentIndex] === null ? 'Tous les Vendeurs' : items[currentIndex];
      case 'conditionnement':
        return `${items[currentIndex]} Gdes`;
      case 'tasks':
        const taskLabels = {
          all: 'Toutes',
          pending: 'En attente',
          completed: 'Terminées',
          critical: 'Critiques'
        };
        return taskLabels[items[currentIndex]];
      default:
        return '';
    }
  };

  const handlePreviousSecondary = () => {
    const items = getSecondaryItems();
    const currentIndex = getCurrentSecondaryIndex();
    
    if (currentIndex > 0) {
      const newValue = items[currentIndex - 1];
      
      switch (activeTab) {
        case 'pumps':
          setPompeEtendue(newValue);
          break;
        case 'vendeurs':
        case 'depots':
          setVendeurActif(newValue);
          break;
        case 'conditionnement':
          setConditionnementDenom(newValue);
          break;
        case 'tasks':
          setFilterType(newValue);
          break;
      }
    }
  };

  const handleNextSecondary = () => {
    const items = getSecondaryItems();
    const currentIndex = getCurrentSecondaryIndex();
    
    if (currentIndex < items.length - 1) {
      const newValue = items[currentIndex + 1];
      
      switch (activeTab) {
        case 'pumps':
          setPompeEtendue(newValue);
          break;
        case 'vendeurs':
        case 'depots':
          setVendeurActif(newValue);
          break;
        case 'conditionnement':
          setConditionnementDenom(newValue);
          break;
        case 'tasks':
          setFilterType(newValue);
          break;
      }
    }
  };

  const showPreviousSecondary = getCurrentSecondaryIndex() > 0;
  const showNextSecondary = getCurrentSecondaryIndex() < getSecondaryItems().length - 1;

  // Reset active vendor when vendeurs change
  useEffect(() => {
    if (vendeurs.length > 0 && (!vendeurActif || !vendeurs.includes(vendeurActif))) {
      setVendeurActif(vendeurs[0]);
    } else if (vendeurs.length === 0) {
      setVendeurActif(null);
    }
  }, [vendeurs]);

  // Load tasks stats
  useEffect(() => {
    const savedTasks = localStorage.getItem(`gasStationTasks_${date}`);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        critical: tasks.filter(t => t.priority === 'critical').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => new Date(t.dueDate) < new Date(date) && t.status !== 'completed').length
      };
      setTasksStats(stats);
    } else {
      setTasksStats({
        total: 0,
        pending: 0,
        critical: 0,
        completed: 0,
        overdue: 0
      });
    }
  }, [date, activeTab]);

  // Build vendor stats for badges
  const vendorStats = vendeurs.reduce((acc, vendeur) => {
    acc[vendeur] = {
      affectations: getNombreAffectations(vendeur, shift)
    };
    return acc;
  }, {});

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
    // Reset filter when changing tabs
    setFilterType('all');
    if (window.innerWidth < 1024) {
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
              filterType={filterType}
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
              vendeurActif={vendeurActif}
            />
          </div>
        );

      case 'liasse':
        return (
          <div className="p-2 sm:p-6">
            <ConditionnementManager
              shift={shift}
              date={date}
              vendeurs={vendeurs}
              tousDepots={tousDepots}
              onConditionnementUpdate={setConditionnements}
              selectedDenomination={conditionnementDenom}
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

      case 'conditionnement':
        return (
          <div className="p-2 sm:p-6">
            <LiasseCounter
              denomination={conditionnementDenom}
            />
          </div>
        );

      case 'proforma':
        return (
          <div className="p-2 sm:p-6">
            <ProForma />
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
        // Filter props
        filterType={filterType}
        setFilterType={setFilterType}
        // Vendor props
        vendeurs={vendeurs}
        vendeurActif={vendeurActif}
        setVendeurActif={setVendeurActif}
        vendorStats={vendorStats}
        // Conditionnement props
        conditionnementDenom={conditionnementDenom}
        setConditionnementDenom={setConditionnementDenom}
        // Reset functions
        onResetShift={handleReinitialiserShift}
        onResetDay={handleReinitialiserJour}
        // Tasks stats
        tasksStats={tasksStats}
        // Secondary navigation props
        onPreviousSecondary={handlePreviousSecondary}
        onNextSecondary={handleNextSecondary}
        showPreviousSecondary={showPreviousSecondary}
        showNextSecondary={showNextSecondary}
        secondaryNavLabel={getSecondaryLabel()}
      >
        {renderActiveTabContent()}
      </MainLayout>

      <ContactModal showContact={showContact} setShowContact={setShowContact} />
    </>
  );
};

export default SystemeStationService;