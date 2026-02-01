import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import VendorDepositCard from './VendorDepositCard';
import SequenceManager from './SequenceManager';
import DepositsSummary from './DepositsSummary';
import ExchangeRateBanner from './ExchangeRateBanner';
import { useDepositLogic } from './useDepositLogic';
import VendorCardHeader from './VendorCardHeader';

const DepotsManager = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot }) => {
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
    handleCurrencyButtonClick,
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

  // Auto-expand the first vendor if none is expanded and there are vendors
  useEffect(() => {
    if (vendeurs.length > 0 && expandedVendor === null && !editingDeposit) {
      handleToggleVendor(vendeurs[0]);
    }
  }, [vendeurs, editingDeposit]);

  // Auto-collapse when editing starts
  useEffect(() => {
    if (editingDeposit && expandedVendor !== editingDeposit.vendeur) {
      handleToggleVendor(editingDeposit.vendeur);
    }
  }, [editingDeposit]);

  return (
    <div className="space-y-4">
      <ExchangeRateBanner tauxDeChange={TAUX_DE_CHANGE} />

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-2 shadow-xl">
        <VendorCardHeader shift={shift} vendeurs={vendeurs} />

        <div className="space-y-4">
          {vendeurs.length === 0 ? (
            <div className="text-center py-6 text-white text-opacity-70">
              Aucun vendeur ajouté
            </div>
          ) : (
            vendeurs.map(vendeur => {
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
              const isDirectMode = isDirectAmount(vendeur);
              const sequences = depositSequences[vendeur] || [];
              const sequencesTotal = calculateSequencesTotal(vendeur);
              const sequencesTotalByCurrency = calculateSequencesTotalByCurrency(vendeur);
              const totalSequencesHTG = calculateTotalSequencesHTG(vendeur);
              const isEditingMode = editingDeposit?.vendeur === vendeur;
              const isExpanded = expandedVendor === vendeur;

              return (
                <VendorDepositCard
                  key={vendeur}
                  vendeur={vendeur}
                  donneesVendeur={donneesVendeur}
                  especesAttendues={especesAttendues}
                  totalDepotHTG={totalDepotHTG}
                  isExpanded={isExpanded}
                  onToggle={() => handleToggleVendor(vendeur)}
                >
                  {/* Only render children if expanded or editing */}
                  {(isExpanded || isEditingMode) && (
                    <>
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
                    </>
                  )}
                </VendorDepositCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DepotsManager;