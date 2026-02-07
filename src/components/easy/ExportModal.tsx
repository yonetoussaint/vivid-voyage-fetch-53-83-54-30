import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';

const ExportModal = ({ shorts, onClose, onExport }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exportStatus, setExportStatus] = useState('');

  const handleExport = () => {
    setExportStatus('processing');
    
    // Filter shorts based on date range
    let filteredShorts = shorts;
    
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      
      filteredShorts = shorts.filter(short => {
        const shortDate = new Date(short.date);
        return shortDate >= startDate && shortDate <= endDate;
      });
    } else if (dateRange === 'last7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      filteredShorts = shorts.filter(short => {
        const shortDate = new Date(short.date);
        return shortDate >= sevenDaysAgo;
      });
    } else if (dateRange === 'last30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filteredShorts = shorts.filter(short => {
        const shortDate = new Date(short.date);
        return shortDate >= thirtyDaysAgo;
      });
    } else if (dateRange === 'pending') {
      filteredShorts = shorts.filter(short => short.status === 'pending');
    } else if (dateRange === 'overdue') {
      filteredShorts = shorts.filter(short => short.status === 'overdue');
    }

    if (filteredShorts.length === 0) {
      setExportStatus('empty');
      return;
    }

    // Call the export function
    onExport(filteredShorts, exportFormat);
    
    // Simulate processing
    setTimeout(() => {
      setExportStatus('success');
      
      // Reset status after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  const totalAmount = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
  const pendingAmount = shorts
    .filter(short => short.status === 'pending')
    .reduce((sum, short) => sum + short.shortAmount, 0);
  const overdueAmount = shorts
    .filter(short => short.status === 'overdue')
    .reduce((sum, short) => sum + short.shortAmount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-black" />
            <h3 className="text-lg font-bold text-black">Exporter les Déficits</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-sm font-bold text-black">{shorts.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-600">En attente</p>
              <p className="text-sm font-bold text-yellow-600">
                {shorts.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-600">En retard</p>
              <p className="text-sm font-bold text-red-600">
                {shorts.filter(s => s.status === 'overdue').length}
              </p>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="font-bold text-black flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Format d'export
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                  exportFormat === 'csv'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-medium">CSV</span>
              </button>
              <button
                onClick={() => setExportFormat('excel')}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                  exportFormat === 'excel'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-medium">Excel</span>
              </button>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-3">
            <h4 className="font-bold text-black flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Période
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDateRange('all')}
                className={`p-2 rounded-lg border text-sm ${
                  dateRange === 'all'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setDateRange('last7days')}
                className={`p-2 rounded-lg border text-sm ${
                  dateRange === 'last7days'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                7 derniers jours
              </button>
              <button
                onClick={() => setDateRange('last30days')}
                className={`p-2 rounded-lg border text-sm ${
                  dateRange === 'last30days'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                30 derniers jours
              </button>
              <button
                onClick={() => setDateRange('custom')}
                className={`p-2 rounded-lg border text-sm ${
                  dateRange === 'custom'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Personnalisée
              </button>
              <button
                onClick={() => setDateRange('pending')}
                className={`p-2 rounded-lg border text-sm ${
                  dateRange === 'pending'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                En attente
              </button>
              <button
                onClick={() => setDateRange('overdue')}
                className={`p-2 rounded-lg border text-sm ${
                  dateRange === 'overdue'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                En retard
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-black flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Sélectionner la période
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date début
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Status */}
          {exportStatus === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-blue-700">Préparation de l'export...</p>
              </div>
            </div>
          )}

          {exportStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700">Export terminé avec succès!</p>
              </div>
            </div>
          )}

          {exportStatus === 'empty' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">Aucune donnée à exporter pour cette période.</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={exportStatus === 'processing' || (dateRange === 'custom' && (!customStartDate || !customEndDate))}
              className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;