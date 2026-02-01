import React, { useState, useEffect } from 'react';
import { User, DollarSign,Pencil, Fuel, Calculator, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { formaterArgent, formaterGallons, formaterCaisse } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';
import CaisseRecuCard from './CaisseRecuCard'; // Import the new component

const PumpHeader = ({ 
  pompe, 
  shift, 
  donneesPompe, 
  vendeurs, 
  mettreAJourAffectationVendeur, 
  prix,
  vendeurDepots = {}, // Pass deposits data from parent
  tauxUSD = 132, // ADD THIS: exchange rate for USD deposits
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
    productIcon = <Flame size={20} className="text-white" />;
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

  // Get vendeur - For propane, check if we have vendeur in propaneData
  const vendeurActuel = isPropane 
    ? (propaneData?._vendeur || donneesPompe?._vendeur || '') 
    : (donneesPompe?._vendeur || '');

  // Calculate deposits for current seller - FIXED to handle both HTG and USD
  const sellerDeposits = vendeurActuel ? vendeurDepots[vendeurActuel] || [] : [];

  // FIXED: Calculate total deposits including USD deposits converted to HTG
  const totalDeposits = sellerDeposits.reduce((sum, depot) => {
    if (!depot) return sum;

    if (typeof depot === 'object' && depot.devise === 'USD') {
      // Convert USD to HTG
      const montantUSD = parseFloat(depot.montant) || 0;
      return sum + (montantUSD * tauxUSD);
    } else {
      // HTG deposit
      return sum + (parseFloat(depot) || 0);
    }
  }, 0);

  // Calculate expected cash = Rounded Total - Total Deposits
  const especesAttendues = totalAjustePourCaisse - totalDeposits;

  // Background color based on mode
  const getMainCardColor = () => {
    if (isPropane) {
      return 'bg-gradient-to-br from-red-600 to-orange-600';
    }
    return 'bg-gradient-to-br from-indigo-600 to-purple-600';
  };

  // Vendor card color based on mode
  const getVendorCardColor = () => {
    if (isPropane) {
      return 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200';
    }
    return 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200';
  };

  // Vendor icon color based on mode
  const getVendorIconColor = () => {
    if (isPropane) {
      return 'text-red-600';
    }
    return 'text-indigo-600';
  };

  // Vendor badge color based on mode
  const getVendorBadgeColor = () => {
    if (isPropane) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-indigo-100 text-indigo-700';
  };

  // Vendor confirmation color based on mode
  const getVendorConfirmationColor = () => {
    if (isPropane) {
      return 'bg-gradient-to-r from-red-500 to-orange-500';
    }
    return 'bg-gradient-to-r from-indigo-500 to-blue-500';
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

  // Handle vendeur change for propane
  const handleVendeurChange = (newVendeurId) => {
    if (isPropane) {
      // For propane, we need a special handler
      // Since propane doesn't use donneesPompe, we need to call a different function
      // We'll pass it through props
      mettreAJourAffectationVendeur('propane', newVendeurId);
    } else {
      mettreAJourAffectationVendeur(pompe, newVendeurId);
    }
  };

  return (
    <div className="w-full space-y-3">
    {/* Vendor Assignment - Split Panel */}
<div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
  {/* Left side - Type */}
  <div className={`px-3 py-2 flex items-center gap-2 ${isPropane ? 'bg-red-50' : 'bg-indigo-50'}`}>
    <User size={16} className={isPropane ? 'text-red-600' : 'text-indigo-600'} />
    <span className="text-sm font-medium whitespace-nowrap">
      {isPropane ? 'Propane' : pompe}
    </span>
  </div>
  
  {/* Right side - Selection */}
  <div className="flex-1 min-w-0">
    {vendeurActuel ? (
      <div className="flex items-center justify-between px-3 py-2 pr-4"> {/* Added pr-4 for right padding */}
        <span className="text-sm text-gray-900 truncate">{vendeurActuel}</span>
        <button 
          onClick={() => handleVendeurChange('')}
          className="text-gray-400 hover:text-gray-600 ml-2 shrink-0 flex items-center"
        >
          <Pencil size={14} /> {/* Edit icon instead of text */}
        </button>
      </div>
    ) : (
      <div className="relative flex items-center pr-4"> {/* Wrapper div with right padding */}
        <select
          value={vendeurActuel}
          onChange={(e) => handleVendeurChange(e.target.value)}
          className="w-full h-full px-3 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500 appearance-none pr-6" /* Added appearance-none and pr-6 */
        >
          <option value="">Vendeur assigné</option>
          {vendeurs.map(vendeur => (
            <option key={vendeur} value={vendeur}>{vendeur}</option>
          ))}
        </select>
        <div className="absolute right-4 pointer-events-none"> {/* Chevron positioning */}
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    )}
  </div>
</div>

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
            {productIcon}
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

      {/* CASH RECEIVED INPUT CARD - Now using the extracted component */}
      <CaisseRecuCard
        vendeurActuel={vendeurActuel}
        sellerDeposits={sellerDeposits}
        totalDeposits={totalDeposits}
        totalAjustePourCaisse={totalAjustePourCaisse}
        especesAttendues={especesAttendues}
        isPropane={isPropane}
        tauxUSD={tauxUSD}
      />

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