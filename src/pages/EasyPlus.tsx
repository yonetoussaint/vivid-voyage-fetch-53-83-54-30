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

  // State for completed liasses with their used bills
  const [completedLiassesByDenom, setCompletedLiassesByDenom] = useState(() => {
    try {
      const saved = localStorage.getItem('liasseCounterCompletedByDenom');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted residual sequences per denom-shift key.
  // Stores the sequence array AFTER liasse completions, so it survives re-renders.
  // Shape: { "denom_500_AM": [46, 2, 17, ...], ... }
  const [residualSequencesByDenom, setResidualSequencesByDenom] = useState(() => {
    try {
      const saved = localStorage.getItem('residualSequencesByDenom');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('liasseCounterCompletedByDenom', JSON.stringify(completedLiassesByDenom));
    } catch (error) {
      console.error('Error saving completed liasses:', error);
    }
  }, [completedLiassesByDenom]);

  useEffect(() => {
    try {
      localStorage.setItem('residualSequencesByDenom', JSON.stringify(residualSequencesByDenom));
    } catch (error) {
      console.error('Error saving residual sequences:', error);
    }
  }, [residualSequencesByDenom]);

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

  // Parse raw bill counts from deposits for current denom+shift.
  // This is the FULL unmodified list — residuals are applied on top.
  const rawBillSequencesFromDeposits = useMemo(() => {
    const amounts = [];
    const currentShiftDepots = tousDepots[shift] || {};

    Object.values(currentShiftDepots).forEach((vendorDepots) => {
      vendorDepots.forEach((depot) => {
        if (depot && typeof depot === 'object' && depot.breakdown) {
          const parts = depot.breakdown.split(',');
          parts.forEach((part) => {
            const trimmed = part.trim();
            const multiplierMatch = trimmed.match(/(\d+)\s*×\s*(\d+)\s*HTG/i);
            if (multiplierMatch) {
              const multiplier = parseInt(multiplierMatch[1]);
              const billValue = parseInt(multiplierMatch[2]);
              if (billValue === conditionnementDenom) amounts.push(multiplier);
            } else {
              const singleMatch = trimmed.match(/(\d+)\s*HTG/i);
              if (singleMatch && parseInt(singleMatch[1]) === conditionnementDenom) {
                amounts.push(1);
              }
            }
          });
        }
      });
    });

    return amounts;
  }, [tousDepots, shift, conditionnementDenom]);

  // The sequence array fed to LiasseCounter.
  // If residuals exist for this denom+shift, use those (post-completion state).
  // If raw deposits changed (new deposit added), merge: append new bills to residuals.
  const billSequenceAmounts = useMemo(() => {
    const denomKey = `denom_${conditionnementDenom}_${shift}`;
    const residuals = residualSequencesByDenom[denomKey];

    if (!residuals) {
      // No completions yet — use raw deposit amounts directly
      return rawBillSequencesFromDeposits;
    }

    // Check if raw deposits grew (new deposit added after completions).
    // Residuals can only be <= raw since completions subtract from raw.
    const residualTotal = residuals.reduce((a, b) => a + b, 0);
    const rawTotal = rawBillSequencesFromDeposits.reduce((a, b) => a + b, 0);
    const completedTotal = (completedLiassesByDenom[`denom_${conditionnementDenom}`] || []).length * 100;
    const expectedResidualTotal = rawTotal - completedTotal;

    if (Math.abs(residualTotal - expectedResidualTotal) > 0) {
      // Deposits changed — recompute residuals by subtracting completed bills
      // from the new raw totals
      let rebuiltSequences = [...rawBillSequencesFromDeposits];
      const completedLiasses = completedLiassesByDenom[`denom_${conditionnementDenom}`] || [];
      
      // Re-apply each completed liasse's subtractions in order
      completedLiasses.forEach((liasse) => {
        const piles = rebuiltSequences.map((amount, i) => ({ originalIndex: i, amount }));
        liasse.steps.forEach((step) => {
          const pile = piles.find(p => p.originalIndex === step.sequenceNum - 1);
          if (pile) pile.amount = Math.max(0, pile.amount - step.take);
        });
        rebuiltSequences = piles.map(p => p.amount).filter(a => a > 0);
      });

      return rebuiltSequences;
    }

    return residuals;
  }, [rawBillSequencesFromDeposits, residualSequencesByDenom, conditionnementDenom, shift, completedLiassesByDenom]);

  // Full sequence list with used/available status for display purposes.
  // Uses positional index mapping so partial usage is always accurate.
  // Rebuilds the full per-index remaining state from completed liasse steps.
  const allSequencesWithStatus = useMemo(() => {
    const raw = rawBillSequencesFromDeposits;

    // Build a map of originalIndex -> remaining amount by replaying all completed liasses
    // Start with each raw sequence at full amount, then subtract each completed step
    const remainingByIndex = {};
    raw.forEach((amount, i) => { remainingByIndex[i] = amount; });

    const completedLiasses = completedLiassesByDenom[`denom_${conditionnementDenom}`] || [];
    // We need to replay against the index space of the sequences that existed
    // at each completion. Since steps use sequenceNum (1-based into the available
    // array AT THAT TIME), and the available array shrinks as sequences hit 0,
    // we track the live index mapping the same way getInstructions does.
    
    // Simpler and correct: use billSequenceAmounts (the current residuals) which
    // already reflects all completed subtractions. We just need to map each raw
    // sequence to its current remaining value by original position.
    //
    // The residuals array is the raw array with completed amounts subtracted and
    // zeros filtered out — but we need per-index values. So instead of using
    // the filtered residuals array, replay subtractions directly on per-index state.
    
    const completedStepsFlat = completedLiasses.flatMap(l => l.steps);
    // steps use sequenceNum which is originalIndex+1 relative to sequences AT COMPLETION TIME
    // We can't reliably replay these without knowing the exact sequence state at each step.
    // Instead: derive remaining per index from (raw - what billSequenceAmounts accounts for).
    //
    // The correct approach: billSequenceAmounts is already the right available list.
    // Map it back to original indices using the raw array with positional tracking.
    
    // Walk raw sequences in order. For each, check if it still exists in billSequenceAmounts
    // by consuming from a positional copy of billSequenceAmounts in raw order.
    // Since billSequenceAmounts preserves relative order of surviving sequences,
    // we can match them positionally.
    const availableQueue = [...billSequenceAmounts]; // ordered survivors
    
    return raw.map((amount, rawIdx) => {
      if (availableQueue.length > 0) {
        const headRemaining = availableQueue[0];
        
        if (headRemaining === amount) {
          // Fully intact — consume from queue
          availableQueue.shift();
          return { amount, remaining: amount, usedAmount: 0, used: false };
        }
        
        if (headRemaining < amount) {
          // Partially consumed — this raw sequence was split, head is its remainder
          availableQueue.shift();
          return { amount, remaining: headRemaining, usedAmount: amount - headRemaining, used: 'partial' };
        }
        
        // headRemaining > amount — impossible if data is consistent, treat as fully used
      }
      
      // Nothing left in queue for this raw sequence — fully consumed
      return { amount, remaining: 0, usedAmount: amount, used: true };
    });
  }, [rawBillSequencesFromDeposits, billSequenceAmounts, completedLiassesByDenom, conditionnementDenom]);

  // Handle liasse completion.
  // LiasseCounter already computed the correct post-completion sequence array
  // internally (step.remaining values). We persist that as residuals so it
  // survives re-renders and new deposit additions don't overwrite it.
  const handleLiasseComplete = useCallback((completedLiasse, postCompletionSequences) => {
    const denomKey = `denom_${conditionnementDenom}`;
    const residualKey = `denom_${conditionnementDenom}_${shift}`;

    // Store completed liasse
    setCompletedLiassesByDenom(prev => {
      const currentLiasses = prev[denomKey] || [];
      return {
        ...prev,
        [denomKey]: [{
          ...completedLiasse,
          timestamp: completedLiasse.timestamp || Date.now()
        }, ...currentLiasses]
      };
    });

    // Persist the post-completion sequence array as residuals
    if (postCompletionSequences) {
      setResidualSequencesByDenom(prev => ({
        ...prev,
        [residualKey]: postCompletionSequences
      }));
    }
  }, [conditionnementDenom, shift]);

  // Handle liasse undo — LiasseCounter passes back the restored sequence array.
  const handleLiasseUndo = useCallback((liasseToUndo, restoredSequences) => {
    const denomKey = `denom_${conditionnementDenom}`;
    const residualKey = `denom_${conditionnementDenom}_${shift}`;

    // Remove completed liasse record
    setCompletedLiassesByDenom(prev => ({
      ...prev,
      [denomKey]: (prev[denomKey] || []).filter(l => l.timestamp !== liasseToUndo.timestamp)
    }));

    // Update residuals with the restored sequence array
    if (restoredSequences) {
      setResidualSequencesByDenom(prev => ({
        ...prev,
        [residualKey]: restoredSequences
      }));
    } else {
      // No more completed liasses — clear residuals entirely so raw deposits take over
      setResidualSequencesByDenom(prev => {
        const next = { ...prev };
        delete next[residualKey];
        return next;
      });
    }
  }, [conditionnementDenom, shift]);

  // Clear all completed liasses and residuals for current denomination
  const handleClearCompleted = useCallback(() => {
    if (window.confirm('Voulez-vous effacer toutes les liasses complétées pour cette dénomination ?')) {
      const denomKey = `denom_${conditionnementDenom}`;
      const residualKey = `denom_${conditionnementDenom}_${shift}`;

      setCompletedLiassesByDenom(prev => {
        const next = { ...prev };
        delete next[denomKey];
        return next;
      });

      setResidualSequencesByDenom(prev => {
        const next = { ...prev };
        delete next[residualKey];
        return next;
      });
    }
  }, [conditionnementDenom, shift]);

  const handlePompeSelection = (selection) => {
    setPompeEtendue(selection);
  };

  const handleReinitialiserShift = () => {
    reinitialiserShift(shift);
    setPompeEtendue('P1');
    
    if (window.confirm('Voulez-vous aussi effacer les liasses complétées ?')) {
      setResidualSequencesByDenom({});
      setCompletedLiassesByDenom({});
    }
  };

  const handleReinitialiserJour = () => {
    reinitialiserJour();
    setPompeEtendue('P1');
    
    if (window.confirm('Voulez-vous aussi effacer toutes les liasses complétées ?')) {
      setResidualSequencesByDenom({});
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
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Compteur de Liasses - {conditionnementDenom} Gdes
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {billSequenceAmounts.reduce((a, b) => a + b, 0)} billets disponibles
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(completedLiassesByDenom[`denom_${conditionnementDenom}`] || []).length * 100} billets utilisés dans les liasses complétées
                </p>
              </div>
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
              key={`liasse-counter-${conditionnementDenom}-${date}-${shift}`}
              denomination={conditionnementDenom}
              externalSequences={billSequenceAmounts}
              allSequencesWithStatus={allSequencesWithStatus}
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