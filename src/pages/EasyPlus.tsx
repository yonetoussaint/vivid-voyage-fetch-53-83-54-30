import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Trash2, Fuel, User, DollarSign, Users } from 'lucide-react';

// Reusable Seller Management Component
const SellerManagement = ({ sellers, newSellerName, setNewSellerName, addSeller, removeSeller }) => {
  return (
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
  );
};

// Reusable Pump Header Component
const PumpHeader = ({ pump, shift, pumpTotal, pumpNumber, getPumpColor, formatMoney, formatDisplay, prices, children }) => {
  return (
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
      
      {children}
    </div>
  );
};

// Reusable Pistol Input Component
const PistolInput = ({ pistol, data, pump, updateReading, updateSeller, sellers, getFuelColor, getFuelBadgeColor, prices, calculateGallons, formatDisplay, formatMoney }) => {
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
};

// Reusable Seller Deposits Component
const SellerDeposits = ({ shift, sellers, sellerTotals, currentDeposits, updateDeposit, formatMoney }) => {
  return (
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
  );
};

// Reusable Seller Assignment Component
const SellerAssignment = ({ pump, sellers, currentSeller, updateSellerAssignment }) => {
  return (
    <div className="bg-white rounded-lg p-4 border-2 border-indigo-300 mb-3">
      <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
        <User size={18} />
        Seller Assignment for {pump}
      </h4>
      <div className="flex items-center gap-3">
        <select
          value={currentSeller}
          onChange={(e) => updateSellerAssignment(pump, e.target.value)}
          className="flex-1 px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Seller</option>
          {sellers.map(seller => (
            <option key={seller} value={seller}>{seller}</option>
          ))}
        </select>
        {currentSeller && (
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-bold">
            {currentSeller}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Shift Pump Details Component
const ShiftPumpDetails = ({ shift, pumps, allShiftsData, calculatePumpTotals, calculateGallons, getFuelBadgeColor, formatDisplay, formatMoney }) => {
  return (
    <div className={`bg-gradient-to-br ${shift === 'AM' ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-indigo-600'} text-white rounded-xl p-5 shadow-xl`}>
      <h3 className="text-lg font-bold mb-4">{shift === 'AM' ? '🌅' : '🌇'} {shift} Shift Pump Details</h3>
      <div className="space-y-4">
        {pumps.map((pump) => {
          const pumpData = allShiftsData[shift][pump];
          const pumpTotal = calculatePumpTotals(pumpData);
          const pumpNumber = parseInt(pump.replace('P', ''));
          const pumpSeller = pumpData._seller || '';

          return (
            <div key={`${shift}-${pump}`} className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-lg font-bold">{pump}</h4>
                  {pumpSeller && (
                    <div className="flex items-center gap-2 mt-1">
                      <User size={14} />
                      <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">Seller: {pumpSeller}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">{shift}</span>
              </div>
              
              <div className="space-y-3">
                {pumpData && Object.entries(pumpData).filter(([key]) => key !== '_seller').map(([pistol, data]) => {
                  const gallons = calculateGallons(data.start, data.end);
                  if (gallons === 0 && !data.start && !data.end) return null;
                  
                  return (
                    <div key={pistol} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{pistol.replace('pistol', 'P')}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getFuelBadgeColor(data.fuelType)}`}>
                          {data.fuelType.replace('Gasoline ', 'G')}
                        </span>
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
                {pumpTotal && (pumpTotal.totalGallons !== 0 || Object.values(pumpData).some(data => data && data.start || data.end)) && (
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
  );
};

// Reusable Seller Financial Summary Component
const SellerFinancialSummary = ({ shift, sellers, sellerTotals, formatMoney }) => {
  const shiftData = sellerTotals[shift];
  if (!shiftData) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${shift === 'AM' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
        <h4 className="font-bold">{shift} Shift Sellers</h4>
      </div>
      <div className="space-y-3">
        {sellers.map(seller => {
          const sellerData = shiftData[seller];
          if (!sellerData || sellerData.totalSales === 0) return null;
          
          return (
            <div key={`${shift}-${seller}`} className="bg-white bg-opacity-20 rounded-lg p-4">
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
  );
};

// Main Component
const GasStationSystem = () => {
  const [shift, setShift] = useState('AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Initialize pump readings structure with seller field
  const initializePumpReadings = () => {
    const pumps = {};

    // Pumps 1-4: 6 pistols with specific fuel types
    for (let p = 1; p <= 4; p++) {
      pumps[`P${p}`] = {
        _seller: '', // Seller for the entire pump
        pistol1: { fuelType: 'Gasoline 1', start: '', end: '' },
        pistol2: { fuelType: 'Gasoline 2', start: '', end: '' },
        pistol3: { fuelType: 'Diesel', start: '', end: '' },
        pistol4: { fuelType: 'Gasoline 1', start: '', end: '' },
        pistol5: { fuelType: 'Gasoline 2', start: '', end: '' },
        pistol6: { fuelType: 'Diesel', start: '', end: '' }
      };
    }

    // Pump 5: Only 1 pistol - Gasoline only
    pumps['P5'] = {
      _seller: '', // Seller for the entire pump
      pistol1: { fuelType: 'Gasoline', start: '', end: '' }
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
        // Ensure all pumps have _seller field
        Object.keys(parsed).forEach(shiftKey => {
          Object.keys(parsed[shiftKey]).forEach(pump => {
            if (!parsed[shiftKey][pump]._seller) {
              parsed[shiftKey][pump]._seller = '';
            }
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

  const pumps = ['P1', 'P2', 'P3', 'P4', 'P5'];

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

  const updateSellerAssignment = (pump, sellerName) => {
    setAllShiftsData(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [pump]: {
          ...prev[shift][pump],
          _seller: sellerName
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
          if (updatedData[shiftKey][pump]._seller === sellerName) {
            updatedData[shiftKey][pump]._seller = '';
          }
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

    Object.entries(dataToCalculate).forEach(([pump, pumpData]) => {
      Object.entries(pumpData).forEach(([key, data]) => {
        // Skip the _seller field
        if (key === '_seller') return;
        
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

    Object.entries(pumpData).forEach(([key, data]) => {
      // Skip the _seller field
      if (key === '_seller') return;
      
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

  // Calculate seller totals for all shifts
  const calculateSellerTotals = () => {
    const sellerTotals = {
      AM: {},
      PM: {}
    };

    // Initialize all sellers for both shifts
    sellers.forEach(seller => {
      sellerTotals.AM[seller] = {
        gasolineGallons: 0,
        dieselGallons: 0,
        gasolineSales: 0,
        dieselSales: 0,
        totalSales: 0,
        deposit: allDeposits.AM[seller] || 0,
        expectedCash: 0
      };
      
      sellerTotals.PM[seller] = {
        gasolineGallons: 0,
        dieselGallons: 0,
        gasolineSales: 0,
        dieselSales: 0,
        totalSales: 0,
        deposit: allDeposits.PM[seller] || 0,
        expectedCash: 0
      };
    });

    // Calculate sales per seller per shift
    ['AM', 'PM'].forEach(shiftKey => {
      Object.entries(allShiftsData[shiftKey]).forEach(([pump, pumpData]) => {
        const seller = pumpData._seller;
        
        if (seller && sellerTotals[shiftKey][seller]) {
          Object.entries(pumpData).forEach(([key, data]) => {
            // Skip the _seller field
            if (key === '_seller') return;
            
            const gallons = calculateGallons(data.start, data.end);

            if (data.fuelType.includes('Gasoline')) {
              sellerTotals[shiftKey][seller].gasolineGallons += gallons;
              sellerTotals[shiftKey][seller].gasolineSales += gallons * prices.gasoline;
            } else if (data.fuelType === 'Diesel') {
              sellerTotals[shiftKey][seller].dieselGallons += gallons;
              sellerTotals[shiftKey][seller].dieselSales += gallons * prices.diesel;
            }
          });
          
          // Update totals
          const sellerData = sellerTotals[shiftKey][seller];
          sellerData.totalSales = sellerData.gasolineSales + sellerData.dieselSales;
          sellerData.expectedCash = sellerData.totalSales - sellerData.deposit;
        }
      });
    });

    return sellerTotals;
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
  const currentReadings = getCurrentReadings();
  const currentDeposits = getCurrentDeposits();
  const sellerTotals = calculateSellerTotals();
  const currentSellerTotals = sellerTotals[shift];

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
          <SellerManagement
            sellers={sellers}
            newSellerName={newSellerName}
            setNewSellerName={setNewSellerName}
            addSeller={addSeller}
            removeSeller={removeSeller}
          />
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
            <SellerDeposits
              shift={shift}
              sellers={sellers}
              sellerTotals={currentSellerTotals}
              currentDeposits={currentDeposits}
              updateDeposit={updateDeposit}
              formatMoney={formatMoney}
            />

            {/* Pump Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pumps.map((pump) => (
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
            {Object.entries(currentReadings).map(([pump, pumpData]) => {
              if (pump !== expandedPump) return null;

              const pumpTotal = calculatePumpTotals(pumpData);
              const pumpNumber = parseInt(pump.replace('P', ''));
              const currentSeller = pumpData._seller || '';

              return (
                <div key={pump} className="space-y-3">
                  {/* Seller Assignment */}
                  <SellerAssignment
                    pump={pump}
                    sellers={sellers}
                    currentSeller={currentSeller}
                    updateSellerAssignment={updateSellerAssignment}
                  />

                  {/* Pump Header with Total */}
                  <PumpHeader
                    pump={pump}
                    shift={shift}
                    pumpTotal={pumpTotal}
                    pumpNumber={pumpNumber}
                    getPumpColor={getPumpColor}
                    formatMoney={formatMoney}
                    formatDisplay={formatDisplay}
                    prices={prices}
                  />

                  {/* Pistol Inputs */}
                  <div className="space-y-3">
                    {Object.entries(pumpData).filter(([key]) => key !== '_seller').map(([pistol, data]) => (
                      <PistolInput
                        key={pistol}
                        pistol={pistol}
                        data={data}
                        pump={pump}
                        updateReading={updateReading}
                        sellers={sellers}
                        getFuelColor={getFuelColor}
                        getFuelBadgeColor={getFuelBadgeColor}
                        prices={prices}
                        calculateGallons={calculateGallons}
                        formatDisplay={formatDisplay}
                        formatMoney={formatMoney}
                      />
                    ))}
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
              
              <SellerFinancialSummary
                shift="AM"
                sellers={sellers}
                sellerTotals={sellerTotals}
                formatMoney={formatMoney}
              />
              
              <SellerFinancialSummary
                shift="PM"
                sellers={sellers}
                sellerTotals={sellerTotals}
                formatMoney={formatMoney}
              />
            </div>

            {/* AM Shift Pump Details */}
            <ShiftPumpDetails
              shift="AM"
              pumps={pumps}
              allShiftsData={allShiftsData}
              calculatePumpTotals={calculatePumpTotals}
              calculateGallons={calculateGallons}
              getFuelBadgeColor={getFuelBadgeColor}
              formatDisplay={formatDisplay}
              formatMoney={formatMoney}
            />

            {/* PM Shift Pump Details */}
            <ShiftPumpDetails
              shift="PM"
              pumps={pumps}
              allShiftsData={allShiftsData}
              calculatePumpTotals={calculatePumpTotals}
              calculateGallons={calculateGallons}
              getFuelBadgeColor={getFuelBadgeColor}
              formatDisplay={formatDisplay}
              formatMoney={formatMoney}
            />

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