import React, { useState } from 'react';
import SummaryCards from './SummaryCards';
import FilterTabs from './FilterTabs';
import ShortsList from './ShortsList';
import PinModal from './PinModal';
import PrintModal from './PrintModal';
import ReceiptModal from './ReceiptModal';
import AddShortModal from './AddShortModal';
import EditShortModal from './EditShortModal';
import SettingsModal from './SettingsModal';
import StatsModal from './StatsModal';
import ExportModal from './ExportModal';
import PartialPaymentModal from './PartialPaymentModal';
import { useShortsLogic } from './useShortsLogic';
import { Plus, Settings, BarChart, Download } from 'lucide-react';

const ShortsTab = ({ vendeurActif }) => {
  const {
    shorts,
    setShorts,
    filteredShorts,
    totalShort,
    pendingShort,
    overdueShort,
    monthlySalary,
    payrollDeductions,
    remainingPayroll,
    activeFilter,
    setActiveFilter,
    formatNumber,
    currentAction,
    currentShortId,
    currentReceipt,
    showPinModal,
    showPrintModal,
    showReceiptModal,
    pin,
    setPin,
    pinError,
    setPinError,
    activePinIndex,
    setActivePinIndex,
    signStep,
    setSignStep,
    printing,
    setPrinting,
    printError,
    setPrintError,
    paymentMethod,
    setPaymentMethod,
    handleActionClick,
    handlePrintReceipt,
    handlePinSubmit,
    handleConfirmVendorSign,
    handleConfirmManagerSign,
    handleConfirmArchive,
    addNewShort,
    updateShort,
    deleteShort,
    handlePartialPayment,
    exportShorts,
    appSettings,
    updateSettings,
    generateStatistics,
    // Modal controllers from hook
    setShowPinModal,
    setShowPrintModal,
    setShowReceiptModal,
    setShowAddModal,
    setShowEditModal,
    setShowSettingsModal,
    setShowStatsModal,
    setShowExportModal,
    setShowPartialPaymentModal,
    setCurrentReceipt,
    setCurrentShortId,
    setCurrentAction
  } = useShortsLogic(vendeurActif);

  // Local states for modals that aren't in the hook
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPartialPaymentModal, setShowPartialPaymentModal] = useState(false);
  
  const [selectedShortForEdit, setSelectedShortForEdit] = useState(null);
  const [selectedShortForPartial, setSelectedShortForPartial] = useState(null);

  const handleEditClick = (short) => {
    setSelectedShortForEdit(short);
    setShowEditModal(true);
  };

  const handlePartialClick = (short) => {
    setSelectedShortForPartial(short);
    setShowPartialPaymentModal(true);
  };

  const handleAddNewShort = (newShort) => {
    addNewShort(newShort);
  };

  const handleUpdateShort = (updatedShort) => {
    updateShort(updatedShort);
  };

  const handleDeleteShort = (shortId) => {
    deleteShort(shortId);
  };

  const handleSavePartialPayment = (shortId, amount, notes) => {
    handlePartialPayment(shortId, amount, notes);
  };

  const handleExport = (filteredShorts, format) => {
    exportShorts(filteredShorts, format);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Summary Cards */}
      <SummaryCards
        totalShort={totalShort}
        pendingShort={pendingShort}
        overdueShort={overdueShort}
        monthlySalary={monthlySalary}
        payrollDeductions={payrollDeductions}
        remainingPayroll={remainingPayroll}
        formatNumber={formatNumber}
      />

      {/* Filter Tabs */}
      <FilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        shorts={shorts}
      />

      {/* Shorts List */}
      <ShortsList
        filteredShorts={filteredShorts}
        formatNumber={formatNumber}
        handleActionClick={handleActionClick}
        handleEditClick={handleEditClick}
        handlePartialClick={handlePartialClick}
        monthlySalary={monthlySalary}
        remainingPayroll={remainingPayroll}
      />

      {/* Modals */}
      {showPrintModal && currentReceipt && (
        <PrintModal
          currentReceipt={currentReceipt}
          signStep={signStep}
          printing={printing}
          printError={printError}
          paymentMethod={paymentMethod}
          vendeurActif={vendeurActif}
          formatNumber={formatNumber}
          onClose={() => {
            setShowPrintModal(false);
            setCurrentReceipt(null);
          }}
          onPrint={handlePrintReceipt}
          onConfirmVendorSign={handleConfirmVendorSign}
          onConfirmManagerSign={handleConfirmManagerSign}
          onConfirmArchive={handleConfirmArchive}
        />
      )}

      {showPinModal && (
        <PinModal
          currentAction={currentAction}
          pin={pin}
          setPin={setPin}
          pinError={pinError}
          activePinIndex={activePinIndex}
          setActivePinIndex={setActivePinIndex}
          onClose={() => setShowPinModal(false)}
          onSubmit={handlePinSubmit}
        />
      )}

      {showReceiptModal && currentReceipt && (
        <ReceiptModal
          currentReceipt={currentReceipt}
          formatNumber={formatNumber}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {showAddModal && (
        <AddShortModal
          vendeurActif={vendeurActif}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddNewShort}
        />
      )}

      {showEditModal && selectedShortForEdit && (
        <EditShortModal
          short={selectedShortForEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedShortForEdit(null);
          }}
          onSave={handleUpdateShort}
          onDelete={handleDeleteShort}
        />
      )}

      {showPartialPaymentModal && selectedShortForPartial && (
        <PartialPaymentModal
          short={selectedShortForPartial}
          onClose={() => {
            setShowPartialPaymentModal(false);
            setSelectedShortForPartial(null);
          }}
          onSave={handleSavePartialPayment}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          appSettings={appSettings}
          onClose={() => setShowSettingsModal(false)}
          onSave={updateSettings}
        />
      )}

      {showStatsModal && (
        <StatsModal
          shorts={shorts}
          vendeurActif={vendeurActif}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {showExportModal && (
        <ExportModal
          shorts={shorts}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end">
        <div className="flex gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center active:bg-blue-700 active:scale-95 transition-all shadow-lg"
            title="Exporter"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center active:bg-purple-700 active:scale-95 transition-all shadow-lg"
            title="Statistiques"
          >
            <BarChart className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center active:bg-gray-800 active:scale-95 transition-all shadow-lg"
            title="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center active:bg-gray-800 active:scale-95 transition-all shadow-lg"
          title="Ajouter déficit"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ShortsTab;