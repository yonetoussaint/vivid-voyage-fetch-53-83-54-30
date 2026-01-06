import React, { useState } from 'react';
import { User, DollarSign, Fuel, Calculator, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { formaterArgent, formaterGallons, formaterCaisse } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ 
  pompe, 
  shift, 
  donneesPompe, 
  vendeurs, 
  mettreAJourAffectationVendeur, 
  prix,
  vendeurDepots = {}, // Pass deposits data from parent
  // New prop for propane mode
  isPropane = false,
  propaneData = null,
  prixPropane = null
}) => {
  // Calculate totals based on mode
  let totalPompe, gallonsEssence, gallonsDiesel, ventesEssence, ventesDiesel, ventesTotales, productIcon;
  
  if (isPropane) {
    // Calculate propane totals
    const gallonsPropane = (parseFloat(propaneData?.fin) || 0) - (parseFloat(propaneData?.debut) || 0);
    ventesTotales = gallonsPropane * prixPropane;
    
    totalPompe = {
      gallonsEssence: 0,
      gallonsDiesel: 0,
      ventesEssence: 0,
      ventesDiesel: 0,
      ventesTotales: ventesTotales
    };
    
    gallonsEssence = 0;
    gallonsDiesel = gallonsPropane; // Show propane gallons in diesel column for consistency
    ventesEssence = 0;
    ventesDiesel = ventesTotales; // Show propane sales in diesel sales column
    productIcon = <Flame size={20} className="text-orange-300" />;
  } else {
    // Calculate pump totals (original logic)
    totalPompe = calculerTotalPompe(donneesPompe, prix);
    gallonsEssence = totalPompe?.gallonsEssence || 0;
    gallonsDiesel = totalPompe?.gallonsDiesel || 0;
    ventesEssence = totalPompe?.ventesEssence || 0;
    ventesDiesel = totalPompe?.ventesDiesel || 0;
    ventesTotales = totalPompe?.ventesTotales || 0;
    productIcon = <Fuel size={20} className="text-white" />;
  }

  // Calculate rounded adjusted total (to nearest 5)
  const totalAjusteArrondi = formaterCaisse(ventesTotales || 0);

  // Calculate exact value for comparison
  const exactValue = parseFloat(ventesTotales || 0);
  // Remove apostrophes for parsing
  const roundedValue = parseFloat(totalAjusteArrondi.replace(/'/g, ''));

  // Calculate EXACT adjustment (with decimals)
  const adjustment = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0;

  // Determine if rounded up or down
  const isRoundedUp = adjustment > 0;

  // Use the ROUNDED adjusted total for cash calculations
  const totalAjustePourCaisse = roundedValue;

  // For propane, we don't have a specific vendeur
  const vendeurActuel = isPropane ? '' : (donneesPompe?._vendeur || '');
  
  // Calculate deposits
  let sellerDeposits = [];
  let totalDeposits = 0;
  
  if (isPropane) {
    // For propane, show ALL deposits for the shift
    Object.values(vendeurDepots).forEach(depot => {
      if (Array.isArray(depot)) {
        sellerDeposits = [...sellerDeposits, ...depot];
      } else {
        sellerDeposits.push(depot);
      }
    });
    totalDeposits = sellerDeposits.reduce((sum, depot) => sum + (parseFloat(depot) || 0), 0);
  } else if (vendeurActuel) {
    // For pumps, show deposits for specific vendeur
    sellerDeposits = vendeurDepots[vendeurActuel] || [];
    totalDeposits = sellerDeposits.reduce((sum, depot) => sum + (parseFloat(depot) || 0), 0);
  }
  
  // Calculate expected cash = Rounded Total - Total Deposits
  const especesAttendues = totalAjustePourCaisse - totalDeposits;

  // State for cash received and change calculation
  const [cashRecu, setCashRecu] = useState('');
  
  // Parse cash received value
  const cashRecuValue = parseFloat(cashRecu) || 0;
  
  // Calculate change based on expected cash vs cash received
  const changeNeeded = cashRecuValue - especesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;

  // Background color based on mode
  const getMainCardColor = () => {
    if (isPropane) {
      return 'bg-gradient-to-br from-red-600 to-orange-600';
    }
    return 'bg-gradient-to-br from-indigo-600 to-purple-600';
  };

  // Product label based on mode
  const getProductLabel = () => {
    if (isPropane) {
      return 'Propane';
    }
    return pompe;
  };

  // Gallons label based on mode
  const getGallonsLabel = () => {
    if (isPropane) {
      return 'Gallons Propane';
    }
    return 'TOTAL GALLONS';
  };

  return (
    <div className="w-full space-y-3">
      {/* Vendor Assignment Card - Only show for pumps, not propane */}
      {!isPropane && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <User size={20} className="text-indigo-600" />
            </div>
            <h4 className="text-base font-bold text-gray-800 flex-1">
              Vendeur assigné
            </h4>
            <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
              {pompe}
            </div>
          </div>

          <select
            value={vendeurActuel}
            onChange={(e) => mettreAJourAffectationVendeur(pompe, e.target.value)}
            className="w-full px-4 py-3.5 text-base font-semibold border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all mb-2"
          >
            <option value="">Sélectionner un vendeur</option>
            {vendeurs.map(vendeur => (
              <option key={vendeur} value={vendeur}>{vendeur}</option>
            ))}
          </select>

          {vendeurActuel && (
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-3 rounded-xl font-bold text-sm text-center shadow-md">
              ✓ {vendeurActuel}
            </div>
          )}
        </div>
      )}

      {/* Statistiques Rapides - Adjust for propane */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`rounded-xl p-3 shadow-lg ${
          isPropane 
            ? 'bg-gradient-to-br from-red-500 to-orange-500' 
            : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
        } text-white`}>
          <div className="flex items-center gap-1 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              isPropane ? 'bg-red-300' : 'bg-emerald-300'
            }`}></div>
            <p className="text-xs font-medium opacity-90">
              {isPropane ? 'Prix Propane' : `Essence (${pompe})`}
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">
            {isPropane ? `${prixPropane} HTG` : formaterGallons(gallonsEssence)}
          </p>
          <p className="text-[10px] opacity-90">
            {isPropane ? 'par gallon' : 'gallons'}
          </p>
        </div>
        
        <div className={`rounded-xl p-3 shadow-lg ${
          isPropane 
            ? 'bg-gradient-to-br from-orange-500 to-red-500' 
            : 'bg-gradient-to-br from-amber-500 to-amber-600'
        } text-white`}>
          <div className="flex items-center gap-1 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              isPropane ? 'bg-orange-300' : 'bg-amber-300'
            }`}></div>
            <p className="text-xs font-medium opacity-90">
              {isPropane ? 'Gallons Propane' : `Diesel (${pompe})`}
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">
            {isPropane ? gallonsDiesel.toFixed(3) : formaterGallons(gallonsDiesel)}
          </p>
          <p className="text-[10px] opacity-90">
            {isPropane ? 'gallons vendus' : 'gallons'}
          </p>
        </div>
      </div>

      {/* TOTAL GALLONS CARD */}
      <div className={`rounded-xl p-3 shadow-lg mb-3 ${
        isPropane 
          ? 'bg-gradient-to-br from-red-600 to-orange-600' 
          : 'bg-gradient-to-br from-blue-500 to-blue-600'
      } text-white`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            {isPropane ? <Flame size={16} className="text-white" /> : productIcon}
          </div>
          <div>
            <p className="text-sm font-bold">{getGallonsLabel()}</p>
            <p className="text-[10px] opacity-80">
              {isPropane ? 'Propane vendu' : 'Essence + Diesel'}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl sm:text-3xl font-bold mb-0.5">
              {isPropane ? gallonsDiesel.toFixed(3) : formaterGallons(gallonsEssence + gallonsDiesel)}
            </p>
            <p className="text-[10px] opacity-90">
              {isPropane ? 'gallons propane' : 'gallons totaux'}
            </p>
          </div>
          {!isPropane && (
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">Détail:</div>
              <div className="text-xs opacity-90">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                  <span>Essence: {formaterGallons(gallonsEssence)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                  <span>Diesel: {formaterGallons(gallonsDiesel)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Total Sales Cards - Adjust for propane */}
      {!isPropane ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
              <p className="text-xs font-medium opacity-90">Ventes Essence</p>
            </div>
            <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterArgent(ventesEssence)}</p>
            <p className="text-[10px] opacity-90">HTG</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-300"></div>
              <p className="text-xs font-medium opacity-90">Ventes Diesel</p>
            </div>
            <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterArgent(ventesDiesel)}</p>
            <p className="text-[10px] opacity-90">HTG</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-3 shadow-lg mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <Flame size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">VENTES PROPANE</p>
              <p className="text-[10px] opacity-80">Total des ventes propane</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold mb-0.5">{formaterArgent(ventesTotales)}</p>
              <p className="text-[10px] opacity-90">HTG total</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Calcul:</p>
              <p className="text-xs opacity-90">
                {gallonsDiesel.toFixed(3)} gal × {prixPropane} HTG
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOTAL SALES - Most Prominent Card */}
      <div className={`rounded-xl p-4 shadow-xl mb-3 ${getMainCardColor()} text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white bg-opacity-80"></div>
            <p className="text-sm font-bold">TOTAL VENTES ({getProductLabel()})</p>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            Final
          </div>
        </div>

        <div className="space-y-2">
          {/* Main Total Sales - Most Prominent */}
          <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-1">
              {isPropane ? 'VENTES BRUTES PROPANE' : 'VENTES BRUTES (Essence + Diesel)'}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(ventesTotales)}</p>
              <span className="text-sm font-medium opacity-90">HTG</span>
            </div>
          </div>

          {/* Final Adjusted Total - ROUNDED */}
          <div className={`rounded-lg p-3 relative overflow-hidden ${
            isPropane 
              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}>
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>

            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">TOTAL AJUSTÉ (CAISSE)</p>
                  <p className="text-[10px] opacity-80">Arrondi au 0 ou 5 le plus proche</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                <p className="text-xs font-bold">FINAL</p>
              </div>
            </div>

            <div className="relative z-10">
              {/* Main rounded amount with HTG */}
              <div className="mb-1">
                <div className="flex items-end justify-between">
                  <p className="text-2xl sm:text-3xl font-bold">{formaterCaisse(ventesTotales)}</p>
                  <span className="text-xl font-bold ml-2">HTG</span>
                </div>
              </div>

              {/* Valeur arrondie label with adjustment on far right */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs opacity-80">Valeur arrondie</p>
                {hasAdjustment && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs opacity-80">Écart:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isRoundedUp ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      {isRoundedUp ? `+${adjustment.toFixed(2)}` : `${adjustment.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CASH RECEIVED INPUT CARD */}
      <div className={`rounded-xl p-4 shadow-lg mb-3 ${
        isPropane 
          ? 'bg-gradient-to-br from-orange-500 to-red-500' 
          : 'bg-gradient-to-br from-blue-500 to-indigo-500'
      } text-white`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <DollarSign size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">CAISSE REÇUE</p>
            <p className="text-[10px] opacity-80">
              {isPropane ? 'Argent total reçu pour propane' : 'Argent donné par le vendeur'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Deposits Summary */}
          {(totalDeposits > 0 || isPropane) && (
            <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Calculator size={14} className="text-white" />
                  <p className="text-xs opacity-90">
                    {isPropane ? 'Dépôts shift (tous vendeurs):' : 'Dépôts effectués:'}
                  </p>
                </div>
                <p className="text-sm font-bold">{formaterArgent(totalDeposits)} HTG</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} className="text-white" />
                  <p className="text-xs opacity-90">Espèces attendues:</p>
                </div>
                <p className={`text-sm font-bold ${especesAttendues > 0 ? 'text-green-300' : especesAttendues < 0 ? 'text-red-300' : 'text-white'}`}>
                  {formaterArgent(especesAttendues)} HTG
                </p>
              </div>
              <p className="text-[10px] opacity-70 mt-1">
                (Total ajusté {formaterArgent(totalAjustePourCaisse)} HTG - Dépôts {formaterArgent(totalDeposits)} HTG)
              </p>
            </div>
          )}

          {/* Input field for cash received */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white font-bold">HTG</span>
            </div>
            <input
              type="number"
              value={cashRecu}
              onChange={(e) => setCashRecu(e.target.value)}
              placeholder="0.00"
              className="w-full pl-14 pr-4 py-3 text-lg font-bold bg-white bg-opacity-15 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
            />
          </div>

          {/* Change calculation */}
          {cashRecu && (
            <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Calculator size={14} className="text-white" />
                  <p className="text-xs opacity-90">Espèces à payer:</p>
                </div>
                <p className="text-sm font-bold">{formaterArgent(especesAttendues)} HTG</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} className="text-white" />
                  <p className="text-xs opacity-90">Argent reçu:</p>
                </div>
                <p className="text-sm font-bold">{formaterArgent(cashRecuValue)} HTG</p>
              </div>

              {/* Change display */}
              <div className={`pt-2 border-t border-white border-opacity-20 ${shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {shouldGiveChange ? (
                      <TrendingUp size={14} className="text-green-300" />
                    ) : isShort ? (
                      <TrendingDown size={14} className="text-red-300" />
                    ) : (
                      <DollarSign size={14} className="text-white" />
                    )}
                    <p className="text-sm font-bold">
                      {shouldGiveChange ? 'À rendre:' : isShort ? 'Manquant:' : 'Exact'}
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${shouldGiveChange ? 'text-green-300' : isShort ? 'text-red-300' : 'text-white'}`}>
                    {formaterArgent(Math.abs(changeNeeded))} HTG
                  </p>
                </div>
                {shouldGiveChange && (
                  <p className="text-[10px] opacity-80 mt-1">À donner en monnaie</p>
                )}
                {isShort && (
                  <p className="text-[10px] opacity-80 mt-1">Doit donner plus d'argent</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`rounded-lg p-2 ${isPropane ? 'bg-red-800' : 'bg-slate-800'} text-white`}>
          <p className="text-[10px] opacity-90 mb-0.5">
            {isPropane ? 'Prix/Gallon' : 'Gallons Essence'}
          </p>
          <p className="text-sm font-bold">
            {isPropane ? `${prixPropane} HTG` : formaterGallons(gallonsEssence)}
          </p>
        </div>
        <div className={`rounded-lg p-2 ${isPropane ? 'bg-orange-800' : 'bg-slate-800'} text-white`}>
          <p className="text-[10px] opacity-90 mb-0.5">
            {isPropane ? 'Gallons Propane' : 'Gallons Diesel'}
          </p>
          <p className="text-sm font-bold">
            {isPropane ? gallonsDiesel.toFixed(3) : formaterGallons(gallonsDiesel)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;