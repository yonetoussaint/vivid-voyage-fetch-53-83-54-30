import React from 'react';
import SequenceManager from './SequenceManager';

const SequenceSection = ({
  vendeur,
  isEditingMode,
  editingDeposit,
  vendorState,
  sequences,
  sequencesTotal,
  sequencesTotalByCurrency,
  totalSequencesHTG,
  vendorInputs,
  currentPresets,
  handleClearSequences,
  handleRemoveSequence,
  handleUpdateSequence,
  handlePresetSelect,
  handleInputChange,
  handleAddSequence,
  handleAddCompleteDeposit,
  calculatePresetAmount,
  onCancelEdit,
  TAUX_DE_CHANGE
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">
          {isEditingMode ? 
            `Éditer Dépôt #${editingDeposit.index + 1}` : 
            'Ajouter Nouveau Dépôt (Séquentiel)'}
        </span>
        <div className="flex flex-wrap gap-1">
          {isEditingMode && (
            <button
              onClick={onCancelEdit}
              className="px-2 py-1.5 rounded-lg font-bold text-xs bg-red-500 text-white active:scale-95 transition"
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      <SequenceManager
        vendeur={vendeur}
        vendorState={vendorState}
        sequences={sequences}
        sequencesTotal={sequencesTotal}
        sequencesTotalByCurrency={sequencesTotalByCurrency}
        totalSequencesHTG={totalSequencesHTG}
        vendorInputs={vendorInputs}
        currentPresets={currentPresets}
        handleClearSequences={handleClearSequences}
        handleRemoveSequence={handleRemoveSequence}
        handleUpdateSequence={(sequenceId, updatedSequence) => 
          handleUpdateSequence(vendeur, sequenceId, updatedSequence)
        }
        handlePresetSelect={handlePresetSelect}
        handleInputChange={handleInputChange}
        handleAddSequence={handleAddSequence}
        handleAddCompleteDeposit={handleAddCompleteDeposit}
        calculatePresetAmount={calculatePresetAmount}
        htgPresets={htgPresets}
        usdPresets={usdPresets}
        setVendorPresets={setVendorPresets}
        TAUX_DE_CHANGE={TAUX_DE_CHANGE}
        editingMode={isEditingMode}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};

export default SequenceSection;