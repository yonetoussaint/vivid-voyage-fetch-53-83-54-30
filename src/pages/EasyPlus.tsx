// SystemeStationService.jsx (complete with "Daily" tab)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import Daily from '@/pages/Daily';
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
  const [reportShift, setReportShift] = useState('full');

  // State for completed liasses across denominations
  const [completedLiassesByDenom, setCompletedLiassesByDenom] = useState(() => {
    // Load from localStorage on initial render
    try {
      const saved = localStorage.getItem('liasseCounterCompletedByDenom');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track the last sequence hash to detect changes
  const [lastSequenceHash, setLastSequenceHash] = useState({});

  // Save completed liasses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('liasseCounterCompletedByDenom', JSON.stringify(completedLiassesByDenom));
    } catch (error) {
      console.error('Error saving completed liasses:', error);
    }
  }, [completedLiassesByDenom]);

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
        return [null, ...vendeurs];
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

  // Endless/Circular navigation handlers
  const handlePreviousSecondary = () => {
    const items = getSecondaryItems();
    const currentIndex = getCurrentSecondaryIndex();

    if (items.length > 0) {
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      const newValue = items[previousIndex];

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

    if (items.length > 0) {
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      const newValue = items[nextIndex];

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

  // Extract bill sequences from deposits for the current shift
  const extractBillSequencesFromDeposits = useCallback(() => {
    const sequences = [];
    const currentShiftDepots = tousDepots[shift] || {};

    Object.values(currentShiftDepots).forEach(vendorDepots => {
      vendorDepots.forEach(depot => {
        if (depot && typeof depot === 'object' && depot.breakdown) {
          const breakdown = depot.breakdown;
          if (typeof breakdown === 'string') {
            const parts = breakdown.split(',');
            parts.forEach(part => {
              const trimmed = part.trim();

              const multiplierMatch = trimmed.match(/(\d+)\s*×\s*(\d+)\s*HTG/i);
              if (multiplierMatch) {
                const multiplier = parseInt(multiplierMatch[1]);
                const billValue = parseInt(multiplierMatch[2]);

                if (billValue === conditionnementDenom) {
                  sequences.push(multiplier);
                }
              } else {
                const singleMatch = trimmed.match(/(\d+)\s*HTG/i);
                if (singleMatch) {
                  const billValue = parseInt(singleMatch[1]);
                  if (billValue === conditionnementDenom) {
                    sequences.push(1);
                  }
                }
              }
            });
          }
        }
      });
    });

    return sequences;
  }, [tousDepots, shift, conditionnementDenom]);

  // Memoize the bill sequences to prevent unnecessary recalculations
  const billSequences = useMemo(() => {
    return extractBillSequencesFromDeposits();
  }, [extractBillSequencesFromDeposits]);

  // Generate a hash of the sequences to detect changes
  const sequencesHash = useMemo(() => {
    return billSequences.join(',');
  }, [billSequences]);

  // Check if sequences have changed and clear completed liasses if they don't match
  useEffect(() => {
    const denomKey = `denom_${conditionnementDenom}`;
    const currentHash = lastSequenceHash[denomKey];
    
    // If sequences have changed and there are completed liasses
    if (currentHash && currentHash !== sequencesHash) {
      const completedCount = completedLiassesByDenom[denomKey]?.length || 0;
      
      if (completedCount > 0) {
        // Ask user if they want to keep completed liasses
        const shouldKeep = window.confirm(
          'De nouveaux dépôts ont été ajoutés. Voulez-vous conserver les liasses complétées précédentes ? ' +
          'Cliquez sur "Annuler" pour les effacer.'
        );
        
        if (!shouldKeep) {
          // Clear completed liasses for this denomination
          setCompletedLiassesByDenom(prev => {
            const newState = { ...prev };
            delete newState[denomKey];
            return newState;
          });
        }
      }
    }
    
    // Update the hash
    setLastSequenceHash(prev => ({
      ...prev,
      [denomKey]: sequencesHash
    }));
  }, [sequencesHash, conditionnementDenom, completedLiassesByDenom]);

  // Handle liasse completion from child component
  const handleLiasseComplete = useCallback((completedLiasse) => {
    setCompletedLiassesByDenom(prev => {
      const denomKey = `denom_${conditionnementDenom}`;
      const currentLiasses = prev[denomKey] || [];
      
      // Add timestamp if not present
      const liasseWithTimestamp = {
        ...completedLiasse,
        timestamp: completedLiasse.timestamp || Date.now()
      };
      
      return {
        ...prev,
        [denomKey]: [liasseWithTimestamp, ...currentLiasses]
      };
    });
  }, [conditionnementDenom]);

  // Handle liasse undo from child component
  const handleLiasseUndo = useCallback((liasseToUndo) => {
    setCompletedLiassesByDenom(prev => {
      const denomKey = `denom_${conditionnementDenom}`;
      const currentLiasses = prev[denomKey] || [];
      return {
        ...prev,
        [denomKey]: currentLiasses.filter(l => l.timestamp !== liasseToUndo.timestamp)
      };
    });
  }, [conditionnementDenom]);

  // Clear completed liasses for current denomination
  const handleClearCompleted = useCallback(() => {
    if (window.confirm('Voulez-vous effacer toutes les liasses complétées pour cette dénomination ?')) {
      setCompletedLiassesByDenom(prev => {
        const denomKey = `denom_${conditionnementDenom}`;
        const newState = { ...prev };
        delete newState[denomKey];
        return newState;
      });
    }
  }, [conditionnementDenom]);

  const handlePompeSelection = (selection) => {
    setPompeEtendue(selection);
  };

  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
    setPompeEtendue('P1');
    
    // Clear completed liasses for the current shift when resetting
    if (window.confirm('Voulez-vous aussi effacer les liasses complétées ?')) {
      setCompletedLiassesByDenom({});
    }
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setPompeEtendue('P1');
    
    // Clear completed liasses for the day when resetting
    if (window.confirm('Voulez-vous aussi effacer toutes les liasses complétées ?')) {
      setCompletedLiassesByDenom({});
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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
              shift={reportShift}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Compteur de Liasses - {conditionnementDenom} Gdes
              </h2>
              {completedLiassesByDenom[`denom_${conditionnementDenom}`]?.length > 0 && (
                <button
                  onClick={handleClearCompleted}
                  className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Effacer les complétées
                </button>
              )}
            </div>
            <LiasseCounter
              key={`liasse-counter-${conditionnementDenom}-${date}-${shift}-${sequencesHash}`}
              denomination={conditionnementDenom}
              externalSequences={billSequences}
              isExternal={true}
              completedLiasses={completedLiassesByDenom[`denom_${conditionnementDenom}`] || []}
              onLiasseComplete={handleLiasseComplete}
              onLiasseUndo={handleLiasseUndo}
            />
          </div>
        );

      case 'proforma':
        return (
          <div className="p-2 sm:p-6">
            <ProForma />
          </div>
        );

      case 'daily':
        return (
          <div className="">
            <Daily
              date={date}
              shift={shift}
              vendeurs={vendeurs}
              toutesDonnees={toutesDonnees}
              propaneDonnees={propaneDonnees}
              tousDepots={tousDepots}
              ventesUSD={ventesUSD}
              totauxAM={totauxAM}
              totauxPM={totauxPM}
              totauxQuotidiens={totauxQuotidiens}
              prix={prix}
              tauxUSD={tauxUSD}
              prixPropane={prixPropane}
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
        pompes={pompes}
        pompeEtendue={pompeEtendue}
        setPompeEtendue={setPompeEtendue}
        showPropane={true}
        filterType={filterType}
        setFilterType={setFilterType}
        vendeurs={vendeurs}
        vendeurActif={vendeurActif}
        setVendeurActif={setVendeurActif}
        vendorStats={vendorStats}
        conditionnementDenom={conditionnementDenom}
        setConditionnementDenom={setConditionnementDenom}
        reportShift={reportShift}
        setReportShift={setReportShift}
        onResetShift={handleReinitialiserShift}
        onResetDay={handleReinitialiserJour}
        tasksStats={tasksStats}
        onPreviousSecondary={handlePreviousSecondary}
        onNextSecondary={handleNextSecondary}
        showPreviousSecondary={true}
        showNextSecondary={true}
        secondaryNavLabel={getSecondaryLabel()}
      >
        {renderActiveTabContent()}
      </MainLayout>

      <ContactModal showContact={showContact} setShowContact={setShowContact} />
    </>
  );
};

export default SystemeStationService;