import React, { useState, useEffect } from 'react';
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
    showAddModal,
    showEditModal,
    showSettingsModal,
    showStatsModal,
    showExportModal,
    showPartialPaymentModal,
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
    generateStatistics
  } = useShortsLogic(vendeurActif);

  const [selectedShortForEdit, setSelectedShortForEdit] = useState(null);
  const [selectedShortForPartial, setSelectedShortForPartial] = useState(null);

  const handleEditClick = (short) => {
    setSelectedShortForEdit(short);
  };

  const handlePartialClick = (short) => {
    setSelectedShortForPartial(short);
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
          onSave={addNewShort}
        />
      )}

      {showEditModal && selectedShortForEdit && (
        <EditShortModal
          short={selectedShortForEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedShortForEdit(null);
          }}
          onSave={updateShort}
          onDelete={deleteShort}
        />
      )}

      {showPartialPaymentModal && selectedShortForPartial && (
        <PartialPaymentModal
          short={selectedShortForPartial}
          onClose={() => {
            setShowPartialPaymentModal(false);
            setSelectedShortForPartial(null);
          }}
          onSave={handlePartialPayment}
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
          onExport={exportShorts}
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