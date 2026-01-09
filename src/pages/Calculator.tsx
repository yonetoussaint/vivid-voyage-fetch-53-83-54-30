import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, X } from 'lucide-react';

export default function MoneyCounter() {
  const [deposits, setDeposits] = useState([
    { id: 1, number: 1, sellerName: '', bills: { 1000: 0, 500: 0, 250: 0, 100: 0, 50: 0, 25: 0, 10: 0, 5: 0 }, timestamp: new Date().toISOString() }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const billColors = {
    1000: 'bg-purple-500',
    500: 'bg-blue-500',
    250: 'bg-red-500',
    100: 'bg-green-500',
    50: 'bg-orange-500',
    25: 'bg-pink-500',
    10: 'bg-yellow-500',
    5: 'bg-teal-500'
  };

  // Audio functions
  const playSound = (frequency, duration = 0.1, type = 'sine') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const playLargeAmountSound = () => {
    playSound(800, 0.15);
    setTimeout(() => playSound(1000, 0.15), 100);
  };

  const playCompleteSound = () => {
    playSound(523, 0.1); // C
    setTimeout(() => playSound(659, 0.1), 100); // E
    setTimeout(() => playSound(784, 0.2), 200); // G
  };

  // Check if deposit has all denominations filled
  const isDepositComplete = (bills) => {
    return Object.values(bills).every(count => count > 0);
  };

  const hasAnyData = (bills) => {
    return Object.values(bills).some(count => count > 0);
  };

  const getDepositTotal = (bills) => {
    return Object.entries(bills).reduce((sum, [denom, count]) => 
      sum + (parseFloat(denom) * count), 0);
  };

  const getGrandTotal = () => {
    return deposits.reduce((sum, deposit) => sum + getDepositTotal(deposit.bills), 0);
  };

  const getAllBills = () => {
    const combined = { 1000: 0, 500: 0, 250: 0, 100: 0, 50: 0, 25: 0, 10: 0, 5: 0 };
    deposits.forEach(deposit => {
      Object.entries(deposit.bills).forEach(([denom, count]) => {
        combined[denom] += count;
      });
    });
    return combined;
  };

  const calculateLiasses = () => {
    const allBills = getAllBills();
    const liasses = {};
    Object.entries(allBills).forEach(([denom, count]) => {
      liasses[denom] = Math.floor(count / 100);
    });
    return liasses;
  };

  const updateBill = (depositId, denomination, value) => {
    const numValue = parseInt(value) || 0;
    const oldBills = deposits.find(d => d.id === depositId).bills;
    
    setDeposits(prev => prev.map(dep => 
      dep.id === depositId 
        ? { ...dep, bills: { ...dep.bills, [denomination]: Math.max(0, numValue) }, timestamp: new Date().toISOString() }
        : dep
    ));

    // Play sound for large amounts (100+ bills or high denomination with 50+ bills)
    if (numValue >= 100 || (parseInt(denomination) >= 100 && numValue >= 50)) {
      playLargeAmountSound();
    }

    // Check if deposit is now complete
    const newBills = { ...oldBills, [denomination]: numValue };
    const wasComplete = isDepositComplete(oldBills);
    const isComplete = isDepositComplete(newBills);
    
    if (!wasComplete && isComplete) {
      setTimeout(() => playCompleteSound(), 100);
    }
  };

  const addDeposit = () => {
    const newNumber = deposits.length + 1;
    const newId = Math.max(...deposits.map(d => d.id)) + 1;
    setDeposits(prev => [...prev, {
      id: newId,
      number: newNumber,
      sellerName: '',
      bills: { 1000: 0, 500: 0, 250: 0, 100: 0, 50: 0, 25: 0, 10: 0, 5: 0 },
      timestamp: new Date().toISOString()
    }]);
    setActiveTab(newId);
  };

  const deleteDeposit = (id) => {
    if (deposits.length === 1) return;
    
    const depositToDelete = deposits.find(d => d.id === id);
    
    // Check if deposit has data and show confirmation
    if (hasAnyData(depositToDelete.bills)) {
      setShowDeleteConfirm(id);
      return;
    }
    
    performDelete(id);
  };

  const performDelete = (id) => {
    const filtered = deposits.filter(d => d.id !== id);
    const renumbered = filtered.map((dep, idx) => ({ ...dep, number: idx + 1 }));
    setDeposits(renumbered);
    if (activeTab === id) {
      setActiveTab(renumbered[0].id);
    }
    setShowDeleteConfirm(null);
  };

  const resetDeposit = (id) => {
    setDeposits(prev => prev.map(dep => 
      dep.id === id 
        ? { ...dep, bills: { 1000: 0, 500: 0, 250: 0, 100: 0, 50: 0, 25: 0, 10: 0, 5: 0 } }
        : dep
    ));
  };

  const updateSellerName = (id, name) => {
    setDeposits(prev => prev.map(dep => 
      dep.id === id ? { ...dep, sellerName: name } : dep
    ));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const activeDeposit = deposits.find(d => d.id === activeTab);
  const liasses = calculateLiasses();
  const totalLiasses = Object.values(liasses).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Deposit?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This deposit has data. Are you sure you want to delete it?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => performDelete(showDeleteConfirm)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Display - Fixed */}
      <div className="bg-green-500 sticky top-0 z-20 shadow">
        <div className="max-w-lg mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-green-100 text-xs">GRAND TOTAL</p>
              <p className="text-lg font-bold text-white">
                {getGrandTotal().toLocaleString()} HTG
              </p>
            </div>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="bg-white text-green-600 px-3 py-1.5 rounded text-xs font-bold"
            >
              {showSummary ? 'Hide' : 'Liasses'}
            </button>
          </div>
          
          {showSummary && (
            <div className="bg-white/20 rounded p-2 mb-2">
              <p className="text-white text-xs font-bold mb-1">Total Liasses: {totalLiasses}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(liasses).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).map(([denom, count]) => (
                  count > 0 && (
                    <div key={denom} className="bg-white/30 rounded px-2 py-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-xs font-bold">{denom} HTG</p>
                        <p className="text-white text-xs font-bold">×{count}</p>
                      </div>
                      <p className="text-white text-xs mt-0.5">
                        = {(parseFloat(denom) * 100 * count).toLocaleString()} HTG
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-lg mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto">
          {deposits.map(deposit => (
            <button
              key={deposit.id}
              onClick={() => setActiveTab(deposit.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap ${
                activeTab === deposit.id 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>Deposit {deposit.number}</span>
              <span className="text-xs opacity-70">
                ({getDepositTotal(deposit.bills).toLocaleString()})
              </span>
              {deposits.length > 1 && (
                <X 
                  className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDeposit(deposit.id);
                  }}
                />
              )}
            </button>
          ))}
          <button
            onClick={addDeposit}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-bold bg-blue-500 text-white flex-shrink-0"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-3">
        {/* Seller Name & Current Deposit Total */}
        <div className="bg-blue-50 rounded-lg p-2 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <label className="text-blue-600 text-xs font-medium block mb-1">Seller Name</label>
              <input
                type="text"
                value={activeDeposit.sellerName}
                onChange={(e) => updateSellerName(activeTab, e.target.value)}
                placeholder="Enter seller name..."
                className="w-full text-sm font-medium text-gray-900 bg-white px-2 py-1.5 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="ml-2 text-right">
              <p className="text-blue-600 text-xs font-medium">Time</p>
              <p className="text-blue-900 text-xs font-bold">{formatTimestamp(activeDeposit.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-medium">Deposit Total</p>
              <p className="text-blue-900 font-bold">
                {getDepositTotal(activeDeposit.bills).toLocaleString()} HTG
              </p>
              {isDepositComplete(activeDeposit.bills) && (
                <p className="text-green-600 text-xs font-bold mt-0.5">✓ Complete</p>
              )}
            </div>
            <button
              onClick={() => resetDeposit(activeTab)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Bills Grid */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(activeDeposit.bills).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).map(([denom, count]) => (
            <div key={denom} className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <div className={`${billColors[denom]} px-1.5 py-0.5 rounded flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">{denom}</span>
                  </div>
                  <span className="text-xs text-gray-600">Gourdes</span>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">HTG</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={count === 0 ? '' : count}
                onChange={(e) => updateBill(activeDeposit.id, denom, e.target.value)}
                className="w-full text-base font-bold text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-300 focus:border-green-500 focus:outline-none text-center mb-1"
                placeholder="0"
              />
              <div className="text-xs font-bold text-gray-500 text-center">
                {count > 0 ? (parseFloat(denom) * count).toLocaleString() : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}