import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Trash2, Fuel } from 'lucide-react';

const GasStationSystem = () => {
  const [shift, setShift] = useState('AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Initialize pump readings structure
  const initializePumpReadings = () => {
    const pumps = {};

    // Pumps 1-4: 6 pistols with specific fuel types
    for (let p = 1; p <= 4; p++) {
      pumps[`P${p}`] = {
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
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    
    return {
      AM: initializePumpReadings(),
      PM: initializePumpReadings()
    };
  };

  // State to hold ALL shifts data
  const [allShiftsData, setAllShiftsData] = useState(initializeAllShifts());
  const [showReport, setShowReport] = useState(false);
  const [expandedPump, setExpandedPump] = useState('P1');

  const prices = {
    gasoline: 600,
    diesel: 650
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    const storageKey = `gasStationData_${date}`;
    localStorage.setItem(storageKey, JSON.stringify(allShiftsData));
  }, [allShiftsData, date]);

  // Initialize new day's data when date changes
  useEffect(() => {
    setAllShiftsData(initializeAllShifts());
  }, [date]);

  // Get current shift's readings
  const getCurrentReadings = () => {
    return allShiftsData[shift] || initializePumpReadings();
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

  const calculateGallons = (start, end) => {
    const s = parseFloat(start) || 0;
    const e = parseFloat(end) || 0;
    return Math.max(0, e - s);
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
      totalGasolineGallons: totalGasolineGallons.toFixed(2),
      totalDieselGallons: totalDieselGallons.toFixed(2),
      totalGasolineSales: totalGasolineSales.toFixed(2),
      totalDieselSales: totalDieselSales.toFixed(2),
      grandTotal: (totalGasolineSales + totalDieselSales).toFixed(2)
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
      gasolineGallons: pumpGasolineGallons.toFixed(2),
      dieselGallons: pumpDieselGallons.toFixed(2),
      gasolineSales: pumpGasolineSales.toFixed(2),
      dieselSales: pumpDieselSales.toFixed(2),
      totalGallons: (pumpGasolineGallons + pumpDieselGallons).toFixed(2),
      totalSales: (pumpGasolineSales + pumpDieselSales).toFixed(2)
    };
  };

  const getPumpDetails = () => {
    const details = [];
    const currentReadings = getCurrentReadings();

    Object.entries(currentReadings).forEach(([pump, pistols]) => {
      Object.entries(pistols).forEach(([pistol, data]) => {
        const gallons = calculateGallons(data.start, data.end);
        if (gallons > 0 || data.start || data.end) {
          const price = data.fuelType === 'Diesel' ? prices.diesel : prices.gasoline;
          const sales = gallons * price;

          details.push({
            pump,
            pistol: pistol.replace('pistol', 'P'),
            fuelType: data.fuelType,
            start: data.start || '0',
            end: data.end || '0',
            gallons: gallons.toFixed(2),
            price,
            sales: sales.toFixed(2)
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
      setShowReport(false);
    }
  };

  const resetCurrentShift = () => {
    if (confirm(`Are you sure you want to reset ${shift} shift data?`)) {
      setAllShiftsData(prev => ({
        ...prev,
        [shift]: initializePumpReadings()
      }));
    }
  };

  const totals = calculateTotals();
  const pumpDetails = getPumpDetails();
  const currentReadings = getCurrentReadings();

  // Calculate daily totals (AM + PM)
  const dailyTotals = {
    gasolineGallons: (parseFloat(calculateTotals(allShiftsData.AM).totalGasolineGallons) + 
                     parseFloat(calculateTotals(allShiftsData.PM).totalGasolineGallons)).toFixed(2),
    dieselGallons: (parseFloat(calculateTotals(allShiftsData.AM).totalDieselGallons) + 
                   parseFloat(calculateTotals(allShiftsData.PM).totalDieselGallons)).toFixed(2),
    gasolineSales: (parseFloat(calculateTotals(allShiftsData.AM).totalGasolineSales) + 
                   parseFloat(calculateTotals(allShiftsData.PM).totalGasolineSales)).toFixed(2),
    dieselSales: (parseFloat(calculateTotals(allShiftsData.AM).totalDieselSales) + 
                 parseFloat(calculateTotals(allShiftsData.PM).totalDieselSales)).toFixed(2),
  };
  dailyTotals.grandTotal = (parseFloat(dailyTotals.gasolineSales) + parseFloat(dailyTotals.dieselSales)).toFixed(2);

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
            <p className="text-sm text-blue-100">Sales Management</p>
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

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowReport(!showReport)}
            className="bg-white text-blue-600 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <FileText size={18} />
            {showReport ? 'Data Entry' : 'View Report'}
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
        {!showReport ? (
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
                <p className="text-2xl font-bold">{totals.totalGasolineGallons}</p>
                <p className="text-xs opacity-90">gallons</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-4 shadow-lg">
                <p className="text-xs opacity-90 mb-1">Diesel ({shift})</p>
                <p className="text-2xl font-bold">{totals.totalDieselGallons}</p>
                <p className="text-xs opacity-90">gallons</p>
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
                        <p className="text-2xl font-bold">{pumpTotal?.totalSales || '0.00'} HTG</p>
                      </div>
                    </div>
                    
                    {/* Pump Summary */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-xs opacity-90">Gasoline</p>
                        <p className="text-lg font-bold">{pumpTotal?.gasolineGallons || '0.00'} gal</p>
                        <p className="text-sm opacity-90">{pumpTotal?.gasolineSales || '0.00'} HTG</p>
                      </div>
                      {pump !== 'P5' && (
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                          <p className="text-xs opacity-90">Diesel</p>
                          <p className="text-lg font-bold">{pumpTotal?.dieselGallons || '0.00'} gal</p>
                          <p className="text-sm opacity-90">{pumpTotal?.dieselSales || '0.00'} HTG</p>
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
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                START METER
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={data.start}
                                onChange={(e) => updateReading(pump, pistol, 'start', e.target.value)}
                                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                END METER
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={data.end}
                                onChange={(e) => updateReading(pump, pistol, 'end', e.target.value)}
                                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                            </div>

                            {(data.start || data.end) && (
                              <div className="bg-white rounded-lg p-3 space-y-1 border-2 border-gray-300">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-gray-600">Gallons</span>
                                  <span className="text-xl font-bold text-gray-900">{gallons.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                  <span className="text-sm font-semibold text-gray-600">Total Sales</span>
                                  <span className="text-xl font-bold text-green-600">{sales.toFixed(2)} HTG</span>
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
                  <p className="text-lg font-bold">{calculateTotals(allShiftsData.AM).grandTotal} HTG</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">PM Shift</p>
                  <p className="text-lg font-bold">{calculateTotals(allShiftsData.PM).grandTotal} HTG</p>
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
                                <div className="font-bold">{gallons.toFixed(2)} gal</div>
                                <div className="text-xs opacity-90">
                                  {data.start || '0'} → {data.end || '0'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Pump Total */}
                        {pumpTotal && parseFloat(pumpTotal.totalGallons) > 0 && (
                          <div className="pt-3 mt-3 border-t border-white border-opacity-30">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Pump {pump} Total:</span>
                              <div className="text-right">
                                <div className="font-bold">{pumpTotal.totalGallons} gal</div>
                                <div className="text-lg font-bold">{pumpTotal.totalSales} HTG</div>
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
                                <div className="font-bold">{gallons.toFixed(2)} gal</div>
                                <div className="text-xs opacity-90">
                                  {data.start || '0'} → {data.end || '0'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Pump Total */}
                        {pumpTotal && parseFloat(pumpTotal.totalGallons) > 0 && (
                          <div className="pt-3 mt-3 border-t border-white border-opacity-30">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Pump {pump} Total:</span>
                              <div className="text-right">
                                <div className="font-bold">{pumpTotal.totalGallons} gal</div>
                                <div className="text-lg font-bold">{pumpTotal.totalSales} HTG</div>
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

            {/* AM Shift Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">🌅 AM Shift Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90">Gasoline</p>
                  <p className="text-xl font-bold">{calculateTotals(allShiftsData.AM).totalGasolineGallons} gal</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Diesel</p>
                  <p className="text-xl font-bold">{calculateTotals(allShiftsData.AM).totalDieselGallons} gal</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white border-opacity-30">
                <div className="flex justify-between">
                  <span>AM Total</span>
                  <span className="font-bold">{calculateTotals(allShiftsData.AM).grandTotal} HTG</span>
                </div>
              </div>
            </div>

            {/* PM Shift Summary */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">🌇 PM Shift Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90">Gasoline</p>
                  <p className="text-xl font-bold">{calculateTotals(allShiftsData.PM).totalGasolineGallons} gal</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Diesel</p>
                  <p className="text-xl font-bold">{calculateTotals(allShiftsData.PM).totalDieselGallons} gal</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white border-opacity-30">
                <div className="flex justify-between">
                  <span>PM Total</span>
                  <span className="font-bold">{calculateTotals(allShiftsData.PM).grandTotal} HTG</span>
                </div>
              </div>
            </div>

            {/* Daily Totals */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">💚 Gasoline - Daily Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gallons</span>
                  <span className="font-bold">{dailyTotals.gasolineGallons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price/Gallon</span>
                  <span className="font-bold">600 HTG</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
                  <span className="font-bold">Total Sales</span>
                  <span className="font-bold">{dailyTotals.gasolineSales} HTG</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">⚡ Diesel - Daily Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gallons</span>
                  <span className="font-bold">{dailyTotals.dieselGallons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price/Gallon</span>
                  <span className="font-bold">650 HTG</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
                  <span className="font-bold">Total Sales</span>
                  <span className="font-bold">{dailyTotals.dieselSales} HTG</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-5 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">DAILY GRAND TOTAL</span>
                <span className="text-2xl font-bold">{dailyTotals.grandTotal} HTG</span>
              </div>
            </div>

            {/* Detailed Report */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-800 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Detailed Report - {shift} Shift</h3>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm font-bold"
                  >
                    <option value="AM">AM Shift</option>
                    <option value="PM">PM Shift</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b-2 border-slate-300">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-slate-700">Pump</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-700">Pistol</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-700">Type</th>
                      <th className="px-3 py-2 text-right font-bold text-slate-700">Gal</th>
                      <th className="px-3 py-2 text-right font-bold text-slate-700">Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pumpDetails.length > 0 ? (
                      pumpDetails.map((detail, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-bold text-slate-800">{detail.pump}</td>
                          <td className="px-3 py-2 text-slate-700">{detail.pistol}</td>
                          <td className="px-3 py-2">
                            <span className={`${getFuelBadgeColor(detail.fuelType)} text-white px-2 py-1 rounded text-xs font-bold`}>
                              {detail.fuelType.replace('Gasoline ', 'G')}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-slate-800">{detail.gallons}</td>
                          <td className="px-3 py-2 text-right font-bold text-green-600">{detail.sales}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-3 py-8 text-center text-slate-500">
                          No data entered for {shift} shift
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GasStationSystem;