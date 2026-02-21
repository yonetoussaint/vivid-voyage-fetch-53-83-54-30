// DepotsManager.jsx
import React, { useState, useEffect } from 'react';
import VendorDepositCard from './VendorDepositCard';
import DepositsSummary from './DepositsSummary';
import SequenceSection from './SequenceSection';
import { useDepositLogic } from './useDepositLogic';

const DepotsManager = ({ 
  shift, 
  vendeurs, 
  totauxVendeurs, 
  tousDepots, 
  mettreAJourDepot, 
  ajouterDepot, 
  supprimerDepot,
  vendeurActif,
  setVendeurActif
}) => {
  const TAUX_DE_CHANGE = 132;
  const depotsActuels = tousDepots[shift] || {};

  const {
    vendorInputs,
    vendorPresets,
    depositSequences,
    recentlyAdded,
    editingDeposit,
    expandedVendor,
    handleToggleVendor,
    initializeVendorState,
    calculateTotalDepotsHTG,
    isRecentlyAdded,
    isEditingThisDeposit,
    handleEditDeposit,
    cancelEdit,
    saveEditedDeposit,
    handleUpdateSequence,
    handlePresetSelect,
    calculatePresetAmount,
    getCurrentPresets,
    isDirectAmount,
    handleInputChange,
    handleAddSequence,
    handleRemoveSequence,
    handleClearSequences,
    calculateSequencesTotal,
    calculateSequencesTotalByCurrency,
    calculateTotalSequencesHTG,
    handleAddCompleteDeposit,
    getMontantHTG,
    isUSDDepot,
    getOriginalDepotAmount,
    getDepositDisplay
  } = useDepositLogic({
    TAUX_DE_CHANGE,
    depotsActuels,
    vendeurs,
    mettreAJourDepot,
    supprimerDepot
  });

  // Auto-select first vendor if none selected AND we're not in "Tous" mode
  useEffect(() => {
    if (vendeurs.length > 0 && vendeurActif === undefined) {
      setVendeurActif(vendeurs[0]);
    }
  }, [vendeurs, vendeurActif]);

  // Initialize vendor state if not exists (only needed for single vendor mode)
  useEffect(() => {
    // Only initialize state for vendors when in single vendor mode or for existing presets
    if (vendeurActif !== null) {
      vendeurs.forEach(vendeur => {
        if (!vendorPresets[vendeur]) {
          initializeVendorState(vendeur, 'HTG');
        }
      });
    }
  }, [vendeurs, vendeurActif]);

  // Determine which vendors to display
  // If vendeurActif is null, show ALL vendors (Tous mode)
  // If vendeurActif is a specific vendor, show only that vendor
  const displayVendeurs = vendeurActif === null 
    ? vendeurs  // Show all vendors when "Tous" is selected
    : vendeurs.filter(v => v === vendeurActif);  // Show only specific vendor

  // Check if we're in "Tous" mode (read-only)
  const isTousMode = vendeurActif === null;

  // Calculate totals for all vendors (for Tous mode)
  const calculateTotalsForAllVendors = () => {
    let totalVentes = 0;
    let totalDepots = 0;
    let totalAttendues = 0;

    vendeurs.forEach(vendeur => {
      const donneesVendeur = totauxVendeurs[vendeur];
      if (donneesVendeur) {
        totalVentes += donneesVendeur.totalVentes || 0;
        totalAttendues += donneesVendeur.especesAttendues || 0;
      }
      
      // Calculate total deposits for this vendor
      const vendorDepots = depotsActuels[vendeur] || [];
      vendorDepots.forEach(depot => {
        if (isUSDDepot(depot)) {
          const usdAmount = getOriginalDepotAmount(depot) || 0;
          totalDepots += usdAmount * TAUX_DE_CHANGE;
        } else {
          totalDepots += getMontantHTG(depot) || 0;
        }
      });
    });

    return { totalVentes, totalDepots, totalAttendues };
  };

  const totals = calculateTotalsForAllVendors();

  return (
    <div className="space-y-4">
      {/* Global Summary Cards - Only show in Tous mode */}
      {isTousMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Ventes Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Ventes Totales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('fr-FR').format(totals.totalVentes)} Gdes
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dépôts Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Dépôts Totaux</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('fr-FR').format(totals.totalDepots)} Gdes
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Attendues Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Attendu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('fr-FR').format(totals.totalAttendues)} Gdes
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Difference indicator */}
            <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-700 dark:text-amber-300">Différence</span>
                <span className={`font-semibold ${totals.totalDepots >= totals.totalAttendues ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('fr-FR').format(totals.totalDepots - totals.totalAttendues)} Gdes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor cards section */}
      <div className="space-y-2">
        {displayVendeurs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Aucun vendeur ajouté
          </div>
        ) : (
          displayVendeurs.map(vendeur => {
            const donneesVendeur = totauxVendeurs[vendeur];
            const totalDepotHTG = calculateTotalDepotsHTG(vendeur);
            const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;
            const depots = depotsActuels[vendeur] || [];

            // Only initialize state if not in Tous mode and state doesn't exist
            if (!isTousMode && !vendorPresets[vendeur]) {
              initializeVendorState(vendeur, 'HTG');
            }

            const vendorState = !isTousMode ? vendorPresets[vendeur] : null;
            const currentPresets = !isTousMode ? getCurrentPresets(vendeur) : [];
            const sequences = !isTousMode ? (depositSequences[vendeur] || []) : [];
            const sequencesTotal = !isTousMode ? calculateSequencesTotal(vendeur) : 0;
            const sequencesTotalByCurrency = !isTousMode ? calculateSequencesTotalByCurrency(vendeur) : { usd: 0, htg: 0 };
            const totalSequencesHTG = !isTousMode ? calculateTotalSequencesHTG(vendeur) : 0;
            const isEditingMode = !isTousMode && editingDeposit?.vendeur === vendeur;

            return (
              <VendorDepositCard
                key={vendeur}
                vendeur={vendeur}
                donneesVendeur={donneesVendeur}
                especesAttendues={especesAttendues}
                totalDepotHTG={totalDepotHTG}
                isReadOnly={isTousMode} // Pass this prop to adjust card styling if needed
                hideSummaryCards={isTousMode} // New prop to hide individual vendor summary cards
              >
                {/* Only show SequenceSection (input section) when NOT in Tous mode */}
                {!isTousMode && (
                  <SequenceSection
                    vendeur={vendeur}
                    isEditingMode={isEditingMode}
                    editingDeposit={editingDeposit}
                    vendorState={vendorState}
                    sequences={sequences}
                    sequencesTotal={sequencesTotal}
                    sequencesTotalByCurrency={sequencesTotalByCurrency}
                    totalSequencesHTG={totalSequencesHTG}
                    vendorInputs={vendorInputs}
                    currentPresets={currentPresets}
                    handleClearSequences={handleClearSequences}
                    handleRemoveSequence={handleRemoveSequence}
                    handleUpdateSequence={handleUpdateSequence}
                    handlePresetSelect={handlePresetSelect}
                    handleInputChange={handleInputChange}
                    handleAddSequence={handleAddSequence}
                    handleAddCompleteDeposit={isEditingMode ? 
                      () => saveEditedDeposit(vendeur) : 
                      () => handleAddCompleteDeposit(vendeur)}
                    calculatePresetAmount={calculatePresetAmount}
                    onCancelEdit={() => cancelEdit(vendeur)}
                    TAUX_DE_CHANGE={TAUX_DE_CHANGE}
                  />
                )}

                {/* Deposits Summary - always show */}
                <DepositsSummary
                  vendeur={vendeur}
                  depots={depots}
                  isRecentlyAdded={isRecentlyAdded}
                  getMontantHTG={getMontantHTG}
                  isUSDDepot={isUSDDepot}
                  getOriginalDepotAmount={getOriginalDepotAmount}
                  getDepositDisplay={getDepositDisplay}
                  onEditDeposit={handleEditDeposit}
                  onDeleteDeposit={supprimerDepot}
                  editingDeposit={editingDeposit}
                  isEditingThisDeposit={isEditingThisDeposit}
                  exchangeRate={TAUX_DE_CHANGE}
                  isReadOnly={isTousMode} // Pass this to disable edit/delete buttons in Tous mode
                />
              </VendorDepositCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DepotsManager;