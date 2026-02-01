import React from 'react';
import VendorDepositCard from './VendorDepositCard';
import SequenceSection from './SequenceSection';
import DepositsSummary from './DepositsSummary';

const VendorRow = ({
  vendeur,
  donneesVendeur,
  depotsActuels,
  vendorPresets,
  vendorInputs,
  depositSequences,
  expandedVendor,
  editingDeposit,
  calculateTotalDepotsHTG,
  calculateSequencesTotal,
  calculateSequencesTotalByCurrency,
  calculateTotalSequencesHTG,
  getCurrentPresets,
  isDirectAmount,
  initializeVendorState,
  handleToggleVendor,
  handleEditDeposit,
  supprimerDepot,
  cancelEdit,
  saveEditedDeposit,
  handleUpdateSequence,
  handleClearSequences,
  handleRemoveSequence,
  handlePresetSelect,
  handleInputChange,
  handleAddSequence,
  handleAddCompleteDeposit,
  calculatePresetAmount,
  isRecentlyAdded,
  getMontantHTG,
  isUSDDepot,
  getOriginalDepotAmount,
  getDepositDisplay,
  isEditingThisDeposit,
  TAUX_DE_CHANGE
}) => {
  const totalDepotHTG = calculateTotalDepotsHTG(vendeur);
  const especesAttendues = donneesVendeur ? donneesVendeur.especesAttendues : 0;
  const depots = depotsActuels[vendeur] || [];

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
  const isExpanded = expandedVendor === vendeur;

  return (
    <VendorDepositCard
      vendeur={vendeur}
      donneesVendeur={donneesVendeur}
      especesAttendues={especesAttendues}
      totalDepotHTG={totalDepotHTG}
      isExpanded={isExpanded}
      onToggle={() => handleToggleVendor(vendeur)}
    >
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
};

export default VendorRow;