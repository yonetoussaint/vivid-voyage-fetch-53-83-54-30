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
  TAUX_DE_CHANGE,
  htgPresets,
  usdPresets,
  setVendorPresets
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            {isEditingMode ? 
              `Éditer Dépôt #${editingDeposit.index + 1}` : 
              'Ajouter Nouveau Dépôt (Séquentiel)'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEditingMode ? 
              'Modifiez les détails du dépôt existant' : 
              'Ajoutez des séquences pour créer un nouveau dépôt'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditingMode && (
            <button
              onClick={onCancelEdit}
              className="px-3 py-1.5 rounded-lg font-semibold text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 shadow-xs"
            >
              Annuler l'édition
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-3">
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
    </div>
  );
};

export default SequenceSection;