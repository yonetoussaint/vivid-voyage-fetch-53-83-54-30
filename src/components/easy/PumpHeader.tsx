import React, { useState } from 'react';
import { User, DollarSign, Fuel, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { formaterArgent, formaterGallons, formaterCaisse } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ 
  pompe, 
  shift, 
  donneesPompe, 
  vendeurs, 
  mettreAJourAffectationVendeur, 
  prix,
  vendeurDepots = {} // Pass deposits data from parent
}) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  // Calculate rounded adjusted total (to nearest 5)
  const totalAjusteArrondi = formaterCaisse(totalPompe?.ventesTotales || 0);

  // Calculate exact value for comparison
  const exactValue = parseFloat(totalPompe?.ventesTotales || 0);
  // Remove apostrophes for parsing
  const roundedValue = parseFloat(totalAjusteArrondi.replace(/'/g, ''));

  // Calculate EXACT adjustment (with decimals)
  const adjustment = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0;

  // Determine if rounded up or down
  const isRoundedUp = adjustment > 0;

  // Use the ROUNDED adjusted total for cash calculations
  const totalAjustePourCaisse = roundedValue;

  // Calculate deposits for current seller if exists
  const sellerDeposits = vendeurActuel ? vendeurDepots[vendeurActuel] || [] : [];
  const totalDeposits = sellerDeposits.reduce((sum, depot) => sum + (parseFloat(depot) || 0), 0);
  
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

  return (
    <div className="w-full space-y-3">
      {/* Vendor Assignment Card */}
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

      {/* All Cards Section */}
      
      {/* Statistiques Rapides - Gallons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
            <p className="text-xs font-medium opacity-90">Essence ({pompe})</p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterGallons(totalPompe?.gallonsEssence || 0)}</p>
          <p className="text-[10px] opacity-90">gallons</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
            <p className="text-xs font-medium opacity-90">Diesel ({pompe})</p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterGallons(totalPompe?.gallonsDiesel || 0)}</p>
          <p className="text-[10px] opacity-90">gallons</p>
        </div>
      </div>

      {/* TOTAL GALLONS CARD */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 shadow-lg mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <Fuel size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">TOTAL GALLONS ({pompe})</p>
            <p className="text-[10px] opacity-80">Essence + Diesel</p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl sm:text-3xl font-bold mb-0.5">{formaterGallons((totalPompe?.gallonsEssence || 0) + (totalPompe?.gallonsDiesel || 0))}</p>
            <p className="text-[10px] opacity-90">gallons totaux</p>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80 mb-1">Détail:</div>
            <div className="text-xs opacity-90">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                <span>Essence: {formaterGallons(totalPompe?.gallonsEssence || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                <span>Diesel: {formaterGallons(totalPompe?.gallonsDiesel || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Total Sales Cards for Essence and Diesel - BEFORE main total sales card */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
            <p className="text-xs font-medium opacity-90">Ventes Essence</p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterArgent(totalPompe?.ventesEssence || 0)}</p>
          <p className="text-[10px] opacity-90">HTG</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
            <p className="text-xs font-medium opacity-90">Ventes Diesel</p>
          </div>
          <p className="text-lg sm:text-xl font-bold mb-0.5">{formaterArgent(totalPompe?.ventesDiesel || 0)}</p>
          <p className="text-[10px] opacity-90">HTG</p>
        </div>
      </div>

      {/* TOTAL SALES - Most Prominent Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white bg-opacity-80"></div>
            <p className="text-sm font-bold">TOTAL VENTES ({pompe})</p>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            Final
          </div>
        </div>

        <div className="space-y-2">
          {/* Main Total Sales - Most Prominent */}
          <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-1">VENTES BRUTES (Essence + Diesel)</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(totalPompe?.ventesTotales || 0)}</p>
              <span className="text-sm font-medium opacity-90">HTG</span>
            </div>
          </div>

          {/* Final Adjusted Total - ROUNDED */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 relative overflow-hidden">
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
                  <p className="text-2xl sm:text-3xl font-bold">{formaterCaisse(totalPompe?.ventesTotales || 0)}</p>
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

      {/* CASH RECEIVED INPUT CARD - AFTER main total card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-4 shadow-lg mb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <DollarSign size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">CAISSE REÇUE</p>
            <p className="text-[10px] opacity-80">Argent donné par le vendeur</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Deposits Summary */}
          {vendeurActuel && totalDeposits > 0 && (
            <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Calculator size={14} className="text-white" />
                  <p className="text-xs opacity-90">Dépôts effectués:</p>
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
                  <p className="text-[10px] opacity-80 mt-1">À donner en monnaie au vendeur</p>
                )}
                {isShort && (
                  <p className="text-[10px] opacity-80 mt-1">Le vendeur doit donner plus d'argent</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Row - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800 text-white rounded-lg p-2">
          <p className="text-[10px] opacity-90 mb-0.5">Gallons Essence</p>
          <p className="text-sm font-bold">{formaterGallons(totalPompe?.gallonsEssence || 0)}</p>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-2">
          <p className="text-[10px] opacity-90 mb-0.5">Gallons Diesel</p>
          <p className="text-sm font-bold">{formaterGallons(totalPompe?.gallonsDiesel || 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;