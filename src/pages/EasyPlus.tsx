import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Trash2, Fuel, User, DollarSign, Users } from 'lucide-react';

const GasStationSystem = () => {
  const [shift, setShift] = useState('AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Initialize pump readings structure
  const initializePumpReadings = () => {
    const pumps = {};

    // Pumps 1-4: 6 pistols with specific fuel types
    for (let p = 1; p <= 4; p++) {
      pumps[`P${p}`] = {
        pistol1: { fuelType: 'Gasoline 1', start: '', end: '', seller: '' },
        pistol2: { fuelType: 'Gasoline 2', start: '', end: '', seller: '' },
        pistol3: { fuelType: 'Diesel', start: '', end: '', seller: '' },
        pistol4: { fuelType: 'Gasoline 1', start: '', end: '', seller: '' },
        pistol5: { fuelType: 'Gasoline 2', start: '', end: '', seller: '' },
        pistol6: { fuelType: 'Diesel', start: '', end: '', seller: '' }
      };
    }

    // Pump 5: Only 1 pistol - Gasoline only
    pumps['P5'] = {
      pistol1: { fuelType: 'Gasoline', start: '', end: '', seller: '' }
    };

    return pumps;
  };

  // Initialize storage structure for all shifts
  const initializeAllShifts = () => {
    const storageKey = `gasStationData_${date}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure all pistols have seller field
        Object.keys(parsed).forEach(shiftKey => {
          Object.keys(parsed[shiftKey]).forEach(pump => {
            Object.keys(parsed[shiftKey][pump]).forEach(pistol => {
              if (!parsed[shiftKey][pump][pistol].seller) {
                parsed[shiftKey][pump][pistol].seller = '';
              }
            });
          });
        });
        return parsed;
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    
    return {
      AM: initializePumpReadings(),
      PM: initializePumpReadings()
    };
  };

  // Initialize sellers
  const initializeSellers = () => {
    const storageKey = 'gasStationSellers';
    const savedSellers = localStorage.getItem(storageKey);
    return savedSellers ? JSON.parse(savedSellers) : [];
  };

  // Initialize deposits
  const initializeDeposits = () => {
    const storageKey = `gasStationDeposits_${date}`;
    const savedDeposits = localStorage.getItem(storageKey);
    
    if (savedDeposits) {
      try {
        return JSON.parse(savedDeposits);
      } catch (e) {
        console.error('Error parsing saved deposits:', e);
      }
    }
    
    return {
      AM: {},
      PM: {}
    };
  };

  // State to hold ALL shifts data
  const [allShiftsData, setAllShiftsData] = useState(initializeAllShifts());
  const [sellers, setSellers] = useState(initializeSellers());
  const [newSellerName, setNewSellerName] = useState('');
  const [allDeposits, setAllDeposits] = useState(initializeDeposits());
  const [showReport, setShowReport] = useState(false);
  const [showSellers, setShowSellers] = useState(false);
  const [expandedPump, setExpandedPump] = useState('P1');

  const prices = {
    gasoline: 600,
    diesel: 650
  };

  // Format number to show full decimals without rounding
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    // Convert to number if it's a string
    const number = typeof num === 'string' ? parseFloat(num) : num;
    
    if (isNaN(number)) return '0';
    
    // Show full decimal without rounding
    const parts = number.toString().split('.');
    if (parts.length === 1) {
      return number.toString();
    } else {
      // Keep all decimals but trim trailing zeros
      const decimals = parts[1].replace(/0+$/, '');
      return decimals ? `${parts[0]}.${decimals}` : parts[0];
    }
  };

  // Format for display - keep full precision
  const formatDisplay = (num) => {
    return formatNumber(num);
  };

  // Format for money - keep 2 decimals
  const formatMoney = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0.00';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(number) ? '0.00' : number.toFixed(2);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    const storageKey = `gasStationData_${date}`;
    localStorage.setItem(storageKey, JSON.stringify(allShiftsData));
    
    const depositsKey = `gasStationDeposits_${date}`;
    localStorage.setItem(depositsKey, JSON.stringify(allDeposits));
    
    localStorage.setItem('gasStationSellers', JSON.stringify(sellers));
  }, [allShiftsData, allDeposits, sellers, date]);

  // Initialize new day's data when date changes
  useEffect(() => {
    setAllShiftsData(initializeAllShifts());
    setAllDeposits(initializeDeposits());
  }, [date]);

  // Get current shift's readings
  const getCurrentReadings = () => {
    return allShiftsData[shift] || initializePumpReadings();
  };

  // Get current shift's deposits
  const getCurrentDeposits = () => {
    return allDeposits[shift] || {};
  };

  const updateReading = (pump, pistol, field, value) => {
    setAllShiftsData(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [pump]: {
          ...prev[shift][pump],
          [pistol]: {
            ...prev[shift][pump][pistol],
            [field]: value
          }
        }
      }
    }));
  };

  const updateSeller = (pump, pistol, sellerName) => {
    setAllShiftsData(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [pump]: {
          ...prev[shift][pump],
          [pistol]: {
            ...prev[shift][pump][pistol],
            seller: sellerName
          }
        }
      }
    }));
  };

  const updateDeposit = (sellerName, amount) => {
    setAllDeposits(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [sellerName]: parseFloat(amount) || 0
      }
    }));
  };

  const addSeller = () => {
    if (newSellerName.trim() && !sellers.includes(newSellerName.trim())) {
      setSellers(prev => [...prev, newSellerName.trim()]);
      setNewSellerName('');
    }
  };

  const removeSeller = (sellerName) => {
    if (confirm(`Remove seller "${sellerName}"? This will also remove their assignments from pumps.`)) {
      setSellers(prev => prev.filter(s => s !== sellerName));
      
      // Remove seller from all pumps
      const updatedData = { ...allShiftsData };
      Object.keys(updatedData).forEach(shiftKey => {
        Object.keys(updatedData[shiftKey]).forEach(pump => {
          Object.keys(updatedData[shiftKey][pump]).forEach(pistol => {
            if (updatedData[shiftKey][pump][pistol].seller === sellerName) {
              updatedData[shiftKey][pump][pistol].seller = '';
            }
          });
        });
      });
      setAllShiftsData(updatedData);
      
      // Remove seller's deposits
      const updatedDeposits = { ...allDeposits };
      Object.keys(updatedDeposits).forEach(shiftKey => {
        if (updatedDeposits[shiftKey][sellerName]) {
          delete updatedDeposits[shiftKey][sellerName];
        }
      });
      setAllDeposits(updatedDeposits);
    }
  };

  const calculateGallons = (start, end) => {
    const s = parseFloat(start) || 0;
    const e = parseFloat(end) || 0;
    return e - s;
  };

  // Calculate totals for a specific shift
  const calculateTotals = (shiftData = null) => {
    const dataToCalculate = shiftData || getCurrentReadings();
    
    let totalGasolineGallons = 0;
    let totalDieselGallons = 0;
    let totalGasolineSales = 0;
    let totalDieselSales = 0;

    Object.entries(dataToCalculate).forEach(([pump, pistols]) => {
      Object.entries(pistols).forEach(([pistol, data]) => {
        const gallons = calculateGallons(data.start, data.end);

        if (data.fuelType.includes('Gasoline')) {
          totalGasolineGallons += gallons;
          totalGasolineSales += gallons * prices.gasoline;
        } else if (data.fuelType === 'Diesel') {
          totalDieselGallons += gallons;
          totalDieselSales += gallons * prices.diesel;
        }
      });
    });

    return {
      totalGasolineGallons,
      totalDieselGallons,
      totalGasolineSales,
      totalDieselSales,
      grandTotal: totalGasolineSales + totalDieselSales
    };
  };

  // Calculate per-pump totals for a specific shift
  const calculatePumpTotals = (pumpData) => {
    if (!pumpData) return null;
    
    let pumpGasolineGallons = 0;
    let pumpDieselGallons = 0;
    let pumpGasolineSales = 0;
    let pumpDieselSales = 0;

    Object.entries(pumpData).forEach(([pistol, data]) => {
      const gallons = calculateGallons(data.start, data.end);

      if (data.fuelType.includes('Gasoline')) {
        pumpGasolineGallons += gallons;
        pumpGasolineSales += gallons * prices.gasoline;
      } else if (data.fuelType === 'Diesel') {
        pumpDieselGallons += gallons;
        pumpDieselSales += gallons * prices.diesel;
      }
    });

    return {
      gasolineGallons: pumpGasolineGallons,
      dieselGallons: pumpDieselGallons,
      gasolineSales: pumpGasolineSales,
      dieselSales: pumpDieselSales,
      totalGallons: pumpGasolineGallons + pumpDieselGallons,
      totalSales: pumpGasolineSales + pumpDieselSales
    };
  };

  // Calculate seller totals for a specific shift
  const calculateSellerTotals = (shiftData = null, shiftKey = null) => {
    const shiftToCalculate = shiftData || getCurrentReadings();
    const shiftDeposits = shiftKey ? allDeposits[shiftKey] : getCurrentDeposits();
    const sellerTotals = {};

    // Initialize all sellers
    sellers.forEach(seller => {
      sellerTotals[seller] = {
        gasolineGallons: 0,
        dieselGallons: 0,
        gasolineSales: 0,
        dieselSales: 0,
        totalSales: 0,
        deposit: shiftDeposits[seller] || 0,
        expectedCash: 0
      };
    });

    // Calculate sales per seller
    Object.entries(shiftToCalculate).forEach(([pump, pistols]) => {
      Object.entries(pistols).forEach(([pistol, data]) => {
        const gallons = calculateGallons(data.start, data.end);
        const seller = data.seller;

        if (seller && sellerTotals[seller]) {
          if (data.fuelType.includes('Gasoline')) {
            sellerTotals[seller].gasolineGallons += gallons;
            sellerTotals[seller].gasolineSales += gallons * prices.gasoline;
          } else if (data.fuelType === 'Diesel') {
            sellerTotals[seller].dieselGallons += gallons;
            sellerTotals[seller].dieselSales += gallons * prices.diesel;
          }
          sellerTotals[seller].totalSales = sellerTotals[seller].gasolineSales + sellerTotals[seller].dieselSales;
          sellerTotals[seller].expectedCash = sellerTotals[seller].totalSales - sellerTotals[seller].deposit;
        }
      });
    });

    return sellerTotals;
  };

  const getPumpDetails = () => {
    const details = [];
    const currentReadings = getCurrentReadings();

    Object.entries(currentReadings).forEach(([pump, pistols]) => {
      Object.entries(pistols).forEach(([pistol, data]) => {
        const gallons = calculateGallons(data.start, data.end);
        if (gallons !== 0 || data.start || data.end || data.seller) {
          const price = data.fuelType === 'Diesel' ? prices.diesel : prices.gasoline;
          const sales = gallons * price;

          details.push({
            pump,
            pistol: pistol.replace('pistol', 'P'),
            fuelType: data.fuelType,
            seller: data.seller,
            start: data.start || '0',
            end: data.end || '0',
            gallons,
            price,
            sales
          });
        }
      });
    });

    return details;
  };

  const resetForm = () => {
    if (confirm('Are you sure you want to reset ALL data for today?')) {
      setAllShiftsData({
        AM: initializePumpReadings(),
        PM: initializePumpReadings()
      });
      setAllDeposits({
        AM: {},
        PM: {}
      });
      setShowReport(false);
    }
  };

  const resetCurrentShift = () => {
    if (confirm(`Are you sure you want to reset ${shift} shift data?`)) {
      setAllShiftsData(prev => ({
        ...prev,
        [shift]: initializePumpReadings()
      }));
      setAllDeposits(prev => ({
        ...prev,
        [shift]: {}
      }));
    }
  };

  const totals = calculateTotals();
  const pumpDetails = getPumpDetails();
  const currentReadings = getCurrentReadings();
  const currentDeposits = getCurrentDeposits();
  const sellerTotals = calculateSellerTotals();
  const amSellerTotals = calculateSellerTotals(allShiftsData.AM, 'AM');
  const pmSellerTotals = calculateSellerTotals(allShiftsData.PM, 'PM');

  // Calculate daily totals (AM + PM)
  const amTotals = calculateTotals(allShiftsData.AM);
  const pmTotals = calculateTotals(allShiftsData.PM);
  
  const dailyTotals = {
    gasolineGallons: amTotals.totalGasolineGallons + pmTotals.totalGasolineGallons,
    dieselGallons: amTotals.totalDieselGallons + pmTotals.totalDieselGallons,
    gasolineSales: amTotals.totalGasolineSales + pmTotals.totalGasolineSales,
    dieselSales: amTotals.totalDieselSales + pmTotals.totalDieselSales,
  };
  dailyTotals.grandTotal = dailyTotals.gasolineSales + dailyTotals.dieselSales;

  const getFuelColor = (fuelType) => {
    if (fuelType === 'Diesel') return 'bg-amber-100 border-amber-400';
    if (fuelType === 'Gasoline 1') return 'bg-emerald-100 border-emerald-400';
    if (fuelType === 'Gasoline 2') return 'bg-sky-100 border-sky-400';
    return 'bg-purple-100 border-purple-400';
  };

  const getFuelBadgeColor = (fuelType) => {
    if (fuelType === 'Diesel') return 'bg-amber-500';
    if (fuelType === 'Gasoline 1') return 'bg-emerald-500';
    if (fuelType === 'Gasoline 2') return 'bg-sky-500';
    return 'bg-purple-500';
  };

  const getPumpColor = (pumpNumber) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-emerald-500 to-emerald-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-amber-500 to-amber-600',
      'bg-gradient-to-br from-rose-500 to-rose-600'
    ];
    return colors[pumpNumber - 1] || colors[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Fuel size={32} />
          <div>
            <h1 className="text-xl font-bold">Gas Station</h1>
            <p className="text-sm text-blue-100">Sales & Seller Management</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm bg-white text-gray-900 rounded-lg font-semibold"
          />

          <select
            value={shift}
            onChange={(e) => {
              setShift(e.target.value);
              setExpandedPump('P1');
            }}
            className="px-3 py-2 text-sm bg-white text-gray-900 rounded-lg font-semibold"
          >
            <option value="AM">AM Shift</option>
            <option value="PM">PM Shift</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => {
              setShowReport(!showReport);
              setShowSellers(false);
            }}
            className="bg-white text-blue-600 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <FileText size={18} />
            {showReport ? 'Data Entry' : 'Report'}
          </button>
          <button
            onClick={() => {
              setShowSellers(!showSellers);
              setShowReport(false);
            }}
            className="bg-purple-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Users size={18} />
            Sellers
          </button>
          <button
            onClick={resetCurrentShift}
            className="bg-orange-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Trash2 size={18} />
            Reset {shift}
          </button>
          <button
            onClick={resetForm}
            className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Trash2 size={18} />
            Reset Day
          </button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {showSellers ? (
          <div className="space-y-4">
            {/* Manage Sellers */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users size={24} />
                Manage Sellers
              </h2>
              
              {/* Add Seller */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Add New Seller</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    placeholder="Enter seller name"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-semibold"
                    onKeyPress={(e) => e.key === 'Enter' && addSeller()}
                  />
                  <button
                    onClick={addSeller}
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Seller List */}
              <div>
                <h3 className="text-lg font-bold mb-3">Current Sellers</h3>
                <div className="space-y-2">
                  {sellers.length > 0 ? (
                    sellers.map((seller, index) => (
                      <div key={seller} className="bg-white bg-opacity-20 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-bold">{seller}</p>
                            <p className="text-sm opacity-90">ID: {index + 1}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSeller(seller)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white text-opacity-70">
                      No sellers added yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : !showReport ? (
          <div className="space-y-3">
            {/* Shift Indicator */}
            <div className="bg-slate-800 text-white rounded-lg p-3 text-center">
              <div className="text-sm opacity-90">Current Shift</div>
              <div className="text-xl font-bold">{shift} SHIFT</div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
                <p className="text-xs opacity-90 mb-1">Gasoline ({shift})</p>
                <p className="text-2xl font-bold">{formatDisplay(totals.totalGasolineGallons)}</p>
                <p className="text-xs opacity-90">gallons</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-4 shadow-lg">
                <p className="text-xs opacity-90 mb-1">Diesel ({shift})</p>
                <p className="text-2xl font-bold">{formatDisplay(totals.totalDieselGallons)}</p>
                <p className="text-xs opacity-90">gallons</p>
              </div>
            </div>

            {/* Seller Deposits Section */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Seller Deposits - {shift} Shift
              </h3>
              <div className="space-y-3">
                {sellers.map(seller => (
                  <div key={seller} className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <User size={20} />
                        <span className="font-bold">{seller}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        sellerTotals[seller]?.expectedCash > 0 
                          ? 'bg-green-500' 
                          : sellerTotals[seller]?.expectedCash < 0 
                          ? 'bg-red-500' 
                          : 'bg-gray-500'
                      }`}>
                        Expected: {formatMoney(sellerTotals[seller]?.expectedCash || 0)} HTG
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="opacity-90">Total Sales</p>
                        <p className="font-bold">{formatMoney(sellerTotals[seller]?.totalSales || 0)} HTG</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="opacity-90">Deposit</p>
                          <input
                            type="number"
                            step="0.01"
                            value={currentDeposits[seller] || ''}
                            onChange={(e) => updateDeposit(seller, e.target.value)}
                            placeholder="0.00"
                            className="flex-1 px-3 py-1 rounded text-gray-900 font-semibold text-right"
                          />
                          <span className="font-bold">HTG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pump Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['P1', 'P2', 'P3', 'P4', 'P5'].map((pump) => (
                <button
                  key={pump}
                  onClick={() => setExpandedPump(pump)}
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                    expandedPump === pump
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {pump}
                </button>
              ))}
            </div>

            {/* Pistols for Selected Pump */}
            {Object.entries(currentReadings).map(([pump, pistols]) => {
              if (pump !== expandedPump) return null;

              const pumpTotal = calculatePumpTotals(pistols);
              const pumpNumber = parseInt(pump.replace('P', ''));

              return (
                <div key={pump} className="space-y-3">
                  {/* Pump Header with Total */}
                  <div className={`${getPumpColor(pumpNumber)} text-white rounded-xl p-5 shadow-lg`}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{pump}</h3>
                        <p className="text-sm opacity-90">
                          {pump === 'P5' ? '1 Gasoline Pistol' : 'Phase 1: P1-P3 | Phase 2: P4-P6'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">{shift} Shift Total</p>
                        <p className="text-2xl font-bold">{formatMoney(pumpTotal?.totalSales || 0)} HTG</p>
                      </div>
                    </div>
                    
                    {/* Pump Summary */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-xs opacity-90">Gasoline</p>
                        <p className="text-lg font-bold">{formatDisplay(pumpTotal?.gasolineGallons || 0)} gal</p>
                        <p className="text-sm opacity-90">{formatMoney(pumpTotal?.gasolineSales || 0)} HTG</p>
                      </div>
                      {pump !== 'P5' && (
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                          <p className="text-xs opacity-90">Diesel</p>
                          <p className="text-lg font-bold">{formatDisplay(pumpTotal?.dieselGallons || 0)} gal</p>
                          <p className="text-sm opacity-90">{formatMoney(pumpTotal?.dieselSales || 0)} HTG</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pistol Inputs */}
                  <div className="space-y-3">
                    {Object.entries(pistols).map(([pistol, data]) => {
                      const gallons = calculateGallons(data.start, data.end);
                      const price = data.fuelType === 'Diesel' ? prices.diesel : prices.gasoline;
                      const sales = gallons * price;

                      return (
                        <div key={pistol} className={`rounded-xl shadow-lg overflow-hidden border-2 ${getFuelColor(data.fuelType)}`}>
                          <div className={`${getFuelBadgeColor(data.fuelType)} text-white px-4 py-3 flex justify-between items-center`}>
                            <div>
                              <p className="text-lg font-bold">{pistol.replace('pistol', 'Pistol ')}</p>
                              <p className="text-sm opacity-90">{data.fuelType}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs opacity-90">Price</p>
                              <p className="text-lg font-bold">{price} HTG</p>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            {/* Seller Selection */}
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                SELLER ASSIGNMENT
                              </label>
                              <select
                                value={data.seller}
                                onChange={(e) => updateSeller(pump, pistol, e.target.value)}
                                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Seller</option>
                                {sellers.map(seller => (
                                  <option key={seller} value={seller}>{seller}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                START METER
                              </label>
                              <input
                                type="number"
                                step="0.001"
                                value={data.start}
                                onChange={(e) => updateReading(pump, pistol, 'start', e.target.value)}
                                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.000"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                END METER
                              </label>
                              <input
                                type="number"
                                step="0.001"
                                value={data.end}
                                onChange={(e) => updateReading(pump, pistol, 'end', e.target.value)}
                                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.000"
                              />
                            </div>

                            {(data.start || data.end) && (
                              <div className="bg-white rounded-lg p-3 space-y-1 border-2 border-gray-300">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-gray-600">Gallons</span>
                                  <span className="text-xl font-bold text-gray-900">{formatDisplay(gallons)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                  <span className="text-sm font-semibold text-gray-600">Total Sales</span>
                                  <span className="text-xl font-bold text-green-600">{formatMoney(sales)} HTG</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calculator size={24} />
                Daily Summary - {date}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90">AM Shift</p>
                  <p className="text-lg font-bold">{formatMoney(amTotals.grandTotal)} HTG</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">PM Shift</p>
                  <p className="text-lg font-bold">{formatMoney(pmTotals.grandTotal)} HTG</p>
                </div>
              </div>
            </div>

            {/* Seller Financial Summary */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User size={20} />
                Seller Financial Summary
              </h3>
              
              {/* AM Shift Sellers */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 className="font-bold">AM Shift Sellers</h4>
                </div>
                <div className="space-y-3">
                  {sellers.map(seller => {
                    const sellerData = amSellerTotals[seller];
                    if (!sellerData || sellerData.totalSales === 0) return null;
                    
                    return (
                      <div key={`am-${seller}`} className="bg-white bg-opacity-20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="font-bold">{seller}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            sellerData.expectedCash > 0 
                              ? 'bg-green-500' 
                              : sellerData.expectedCash < 0 
                              ? 'bg-red-500' 
                              : 'bg-gray-500'
                          }`}>
                            Expected: {formatMoney(sellerData.expectedCash)} HTG
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="opacity-90">Total Sales</p>
                            <p className="font-bold">{formatMoney(sellerData.totalSales)} HTG</p>
                          </div>
                          <div>
                            <p className="opacity-90">Deposit</p>
                            <p className="font-bold">{formatMoney(sellerData.deposit)} HTG</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PM Shift Sellers */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h4 className="font-bold">PM Shift Sellers</h4>
                </div>
                <div className="space-y-3">
                  {sellers.map(seller => {
                    const sellerData = pmSellerTotals[seller];
                    if (!sellerData || sellerData.totalSales === 0) return null;
                    
                    return (
                      <div key={`pm-${seller}`} className="bg-white bg-opacity-20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="font-bold">{seller}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            sellerData.expectedCash > 0 
                              ? 'bg-green-500' 
                              : sellerData.expectedCash < 0 
                              ? 'bg-red-500' 
                              : 'bg-gray-500'
                          }`}>
                            Expected: {formatMoney(sellerData.expectedCash)} HTG
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="opacity-90">Total Sales</p>
                            <p className="font-bold">{formatMoney(sellerData.totalSales)} HTG</p>
                          </div>
                          <div>
                            <p className="opacity-90">Deposit</p>
                            <p className="font-bold">{formatMoney(sellerData.deposit)} HTG</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AM Shift Pump Details */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-4">🌅 AM Shift Pump Details</h3>
              <div className="space-y-4">
                {['P1', 'P2', 'P3', 'P4', 'P5'].map((pump) => {
                  const pumpData = allShiftsData.AM[pump];
                  const pumpTotal = calculatePumpTotals(pumpData);
                  const pumpNumber = parseInt(pump.replace('P', ''));

                  return (
                    <div key={`am-${pump}`} className="bg-white bg-opacity-20 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-bold">{pump}</h4>
                        <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">AM</span>
                      </div>
                      
                      <div className="space-y-3">
                        {pumpData && Object.entries(pumpData).map(([pistol, data]) => {
                          const gallons = calculateGallons(data.start, data.end);
                          if (gallons === 0 && !data.start && !data.end && !data.seller) return null;
                          
                          return (
                            <div key={pistol} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{pistol.replace('pistol', 'P')}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getFuelBadgeColor(data.fuelType)}`}>
                                  {data.fuelType.replace('Gasoline ', 'G')}
                                </span>
                                {data.seller && (
                                  <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-500">
                                    {data.seller}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatDisplay(gallons)} gal</div>
                                <div className="text-xs opacity-90">
                                  {data.start || '0'} → {data.end || '0'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Pump Total */}
                        {pumpTotal && (pumpTotal.totalGallons !== 0 || Object.values(pumpData).some(data => data.start || data.end || data.seller)) && (
                          <div className="pt-3 mt-3 border-t border-white border-opacity-30">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Pump {pump} Total:</span>
                              <div className="text-right">
                                <div className="font-bold">{formatDisplay(pumpTotal.totalGallons)} gal</div>
                                <div className="text-lg font-bold">{formatMoney(pumpTotal.totalSales)} HTG</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PM Shift Pump Details */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-4">🌇 PM Shift Pump Details</h3>
              <div className="space-y-4">
                {['P1', 'P2', 'P3', 'P4', 'P5'].map((pump) => {
                  const pumpData = allShiftsData.PM[pump];
                  const pumpTotal = calculatePumpTotals(pumpData);
                  const pumpNumber = parseInt(pump.replace('P', ''));

                  return (
                    <div key={`pm-${pump}`} className="bg-white bg-opacity-20 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-bold">{pump}</h4>
                        <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">PM</span>
                      </div>
                      
                      <div className="space-y-3">
                        {pumpData && Object.entries(pumpData).map(([pistol, data]) => {
                          const gallons = calculateGallons(data.start, data.end);
                          if (gallons === 0 && !data.start && !data.end && !data.seller) return null;
                          
                          return (
                            <div key={pistol} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{pistol.replace('pistol', 'P')}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getFuelBadgeColor(data.fuelType)}`}>
                                  {data.fuelType.replace('Gasoline ', 'G')}
                                </span>
                                {data.seller && (
                                  <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-500">
                                    {data.seller}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatDisplay(gallons)} gal</div>
                                <div className="text-xs opacity-90">
                                  {data.start || '0'} → {data.end || '0'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Pump Total */}
                        {pumpTotal && (pumpTotal.totalGallons !== 0 || Object.values(pumpData).some(data => data.start || data.end || data.seller)) && (
                          <div className="pt-3 mt-3 border-t border-white border-opacity-30">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Pump {pump} Total:</span>
                              <div className="text-right">
                                <div className="font-bold">{formatDisplay(pumpTotal.totalGallons)} gal</div>
                                <div className="text-lg font-bold">{formatMoney(pumpTotal.totalSales)} HTG</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Totals */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">💚 Gasoline - Daily Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gallons</span>
                  <span className="font-bold">{formatDisplay(dailyTotals.gasolineGallons)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price/Gallon</span>
                  <span className="font-bold">600 HTG</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
                  <span className="font-bold">Total Sales</span>
                  <span className="font-bold">{formatMoney(dailyTotals.gasolineSales)} HTG</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">⚡ Diesel - Daily Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gallons</span>
                  <span className="font-bold">{formatDisplay(dailyTotals.dieselGallons)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price/Gallon</span>
                  <span className="font-bold">650 HTG</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
                  <span className="font-bold">Total Sales</span>
                  <span className="font-bold">{formatMoney(dailyTotals.dieselSales)} HTG</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-5 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">DAILY GRAND TOTAL</span>
                <span className="text-2xl font-bold">{formatMoney(dailyTotals.grandTotal)} HTG</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GasStationSystem;