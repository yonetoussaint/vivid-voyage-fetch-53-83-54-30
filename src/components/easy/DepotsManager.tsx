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

  return (
    <div className="space-y-2">
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