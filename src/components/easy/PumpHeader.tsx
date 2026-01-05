import React from 'react';
import { User, DollarSign, TrendingUp, Fuel } from 'lucide-react';
import { formaterArgent, formaterGallons, formaterCaisse, formaterCaisseHTG } from '@/utils/formatters';
import { getCouleurPompe, calculerTotalPompe } from '@/utils/helpers';

const PumpHeader = ({ pompe, shift, donneesPompe, vendeurs, mettreAJourAffectationVendeur, prix }) => {
  const totalPompe = calculerTotalPompe(donneesPompe, prix);
  const numeroPompe = parseInt(pompe.replace('P', ''));
  const vendeurActuel = donneesPompe._vendeur || '';

  // Calculate rounded totals for essence and diesel
  const essenceTotal = parseFloat(totalPompe?.ventesEssence || 0);
  const dieselTotal = parseFloat(totalPompe?.ventesDiesel || 0);
  
  const essenceArrondi = formaterCaisse(essenceTotal);
  const dieselArrondi = formaterCaisse(dieselTotal);

  // Calculate adjustments
  const essenceRounded = parseFloat(essenceArrondi.replace(/'/g, ''));
  const dieselRounded = parseFloat(dieselArrondi.replace(/'/g, ''));

  const essenceAdjustment = essenceRounded - essenceTotal;
  const dieselAdjustment = dieselRounded - dieselTotal;

  const hasEssenceAdjustment = Math.abs(essenceAdjustment) > 0;
  const hasDieselAdjustment = Math.abs(dieselAdjustment) > 0;

  const essenceIsRoundedUp = essenceAdjustment > 0;
  const dieselIsRoundedUp = dieselAdjustment > 0;

  // Calculate total gallons (essence + diesel)
  const totalGallons = (parseFloat(totalPompe?.gallonsEssence || 0) + parseFloat(totalPompe?.gallonsDiesel || 0)).toFixed(2);

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

      {/* Statistiques Rapides */}
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
            <p className="text-2xl sm:text-3xl font-bold mb-0.5">{formaterGallons(totalGallons)}</p>
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

      {/* ESSENCE TOTAL SALES CARD */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
            <p className="text-sm font-bold">VENTES ESSENCE ({pompe})</p>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            600 HTG/gal
          </div>
        </div>

        <div className="space-y-2">
          {/* Main Essence Sales */}
          <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-1">VENTES BRUTES ESSENCE</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(essenceTotal)}</p>
              <span className="text-sm font-medium opacity-90">HTG</span>
            </div>
          </div>

          {/* Final Adjusted Total - ROUNDED */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>

            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">TOTAL AJUSTÉ ESSENCE</p>
                  <p className="text-[10px] opacity-80">Arrondi au 0 ou 5 le plus proche</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                <p className="text-xs font-bold">ESSENCE</p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="mb-1">
                <div className="flex items-end justify-between">
                  <p className="text-2xl sm:text-3xl font-bold">{essenceArrondi}</p>
                  <span className="text-xl font-bold ml-2">HTG</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs opacity-80">Valeur arrondie</p>
                {hasEssenceAdjustment && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs opacity-80">Écart:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      essenceIsRoundedUp ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      {essenceIsRoundedUp ? `+${essenceAdjustment.toFixed(2)}` : `${essenceAdjustment.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIESEL TOTAL SALES CARD */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-300"></div>
            <p className="text-sm font-bold">VENTES DIESEL ({pompe})</p>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            650 HTG/gal
          </div>
        </div>

        <div className="space-y-2">
          {/* Main Diesel Sales */}
          <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-1">VENTES BRUTES DIESEL</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(dieselTotal)}</p>
              <span className="text-sm font-medium opacity-90">HTG</span>
            </div>
          </div>

          {/* Final Adjusted Total - ROUNDED */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>

            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">TOTAL AJUSTÉ DIESEL</p>
                  <p className="text-[10px] opacity-80">Arrondi au 0 ou 5 le plus proche</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                <p className="text-xs font-bold">DIESEL</p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="mb-1">
                <div className="flex items-end justify-between">
                  <p className="text-2xl sm:text-3xl font-bold">{dieselArrondi}</p>
                  <span className="text-xl font-bold ml-2">HTG</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs opacity-80">Valeur arrondie</p>
                {hasDieselAdjustment && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs opacity-80">Écart:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      dieselIsRoundedUp ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      {dieselIsRoundedUp ? `+${dieselAdjustment.toFixed(2)}` : `${dieselAdjustment.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-slate-800 text-white rounded-lg p-2">
          <p className="text-[10px] opacity-90 mb-0.5">Total Gallons Essence</p>
          <p className="text-sm font-bold">{formaterGallons(totalPompe?.gallonsEssence || 0)}</p>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-2">
          <p className="text-[10px] opacity-90 mb-0.5">Total Gallons Diesel</p>
          <p className="text-sm font-bold">{formaterGallons(totalPompe?.gallonsDiesel || 0)}</p>
        </div>
      </div>

      {/* TOTAL POMPE CARD */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white bg-opacity-80"></div>
            <p className="text-sm font-bold">TOTAL {pompe}</p>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            Shift {shift}
          </div>
        </div>

        <div className="space-y-2">
          {/* Main Total Sales */}
          <div className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-1">TOTAL VENTES (Essence + Diesel)</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{formaterArgent(totalPompe?.ventesTotales || 0)}</p>
              <span className="text-sm font-medium opacity-90">HTG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PumpHeader;