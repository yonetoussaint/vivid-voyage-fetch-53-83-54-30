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

  // Auto-select first vendor if none selected
  useEffect(() => {
    if (vendeurs.length > 0 && !vendeurActif) {
      setVendeurActif(vendeurs[0]);
    }
  }, [vendeurs, vendeurActif]);

  // Initialize vendor state if not exists
  useEffect(() => {
    vendeurs.forEach(vendeur => {
      if (!vendorPresets[vendeur]) {
        initializeVendorState(vendeur, 'HTG');
      }
    });
  }, [vendeurs]);

  // Filter to show only active vendor if vendeurActif is set
  const displayVendeurs = vendeurActif 
    ? vendeurs.filter(v => v === vendeurActif)
    : vendeurs;

  return (
    <div className="space-y-2"> {/* Reduced from space-y-6 */}
      {/* Vendor cards section */}
      <div className="space-y-2"> {/* Reduced from space-y-3 */}
        {displayVendeurs.length === 0 ? (
          <div className="text-center py-6 text-gray-500"> {/* Reduced py-8 to py-6 */}
            Aucun vendeur ajouté
          </div>
        ) : (
          displayVendeurs.map(vendeur => {
            const donneesVendeur = totauxVendeurs[vendeur];
            const totalDepotHTG = calculateTotalDepotsHTG(vendeur);
            const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;
            const depots = depotsActuels[vendeur] || [];

            // Initialize vendor state if not exists
            if (!vendorPresets[vendeur]) {
              initializeVendorState(vendeur, 'HTG');
            }

            const vendorState = vendorPresets[vendeur];
            const currentPresets = getCurrentPresets(vendeur);
            const sequences = depositSequences[vendeur] || [];
            const sequencesTotal = calculateSequencesTotal(vendeur);
            const sequencesTotalByCurrency = calculateSequencesTotalByCurrency(vendeur);
            const totalSequencesHTG = calculateTotalSequencesHTG(vendeur);
            const isEditingMode = editingDeposit?.vendeur === vendeur;

            return (
              <VendorDepositCard
                key={vendeur}
                vendeur={vendeur}
                donneesVendeur={donneesVendeur}
                especesAttendues={especesAttendues}
                totalDepotHTG={totalDepotHTG}
              >
                {/* Always show the content - reduced spacing */}
                
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