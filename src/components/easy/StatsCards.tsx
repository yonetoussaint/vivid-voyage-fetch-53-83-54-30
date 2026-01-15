import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Calculator, Fuel } from 'lucide-react';
import { formaterArgent, formaterGallons, formaterCaisse, formaterCaisseHTG } from '@/utils/formatters';

const StatsCards = ({ shift, totaux, tauxUSD }) => {
  // Calculate rounded adjusted total (to nearest 5)
  const totalAjusteArrondi = formaterCaisse(totaux.totalAjuste);

  // Calculate exact value for comparison
  const exactValue = parseFloat(totaux.totalAjuste);
  // Remove apostrophes for parsing
  const roundedValue = parseFloat(totalAjusteArrondi.replace(/'/g, ''));

  // Calculate EXACT adjustment (with decimals)
  const adjustment = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0;

  // Determine if rounded up or down
  const isRoundedUp = adjustment > 0;

  // Calculate total gallons (essence + diesel)
  const totalGallons = parseFloat(totaux.totalGallonsEssence || 0) + parseFloat(totaux.totalGallonsDiesel || 0);

  return (
    <>
      {/* Fuel Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <p className="text-sm font-medium text-gray-700">Essence ({shift})</p>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">{formaterGallons(totaux.totalGallonsEssence)}</p>
          <p className="text-xs text-gray-500">gallons</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <p className="text-sm font-medium text-gray-700">Diesel ({shift})</p>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">{formaterGallons(totaux.totalGallonsDiesel)}</p>
          <p className="text-xs text-gray-500">gallons</p>
        </div>
      </div>

      {/* Total Gallons */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Fuel size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Total Gallons ({shift})</p>
            <p className="text-sm text-gray-500">Essence + Diesel</p>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900 mb-1">{formaterGallons(totalGallons)}</p>
            <p className="text-sm text-gray-500">gallons totaux</p>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex items-center justify-end gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-600">Essence: {formaterGallons(totaux.totalGallonsEssence)}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-600">Diesel: {formaterGallons(totaux.totalGallonsDiesel)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <DollarSign size={18} className="text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">Ventes ({shift})</p>
          </div>
          <Calculator size={18} className="text-gray-400" />
        </div>

        <div className="space-y-3">
          {/* Gross Sales */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Ventes Brutes</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-semibold text-gray-900">{formaterArgent(totaux.totalBrut)}</p>
              <span className="text-sm text-gray-600">HTG</span>
            </div>
          </div>

          {/* USD Conversion */}
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">USD Converti</p>
              <p className="text-sm font-medium text-gray-900">${formaterArgent(totaux.totalUSD)}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">= {formaterArgent(totaux.totalHTGenUSD)} HTG</span>
              <span className="text-xs text-gray-500">1 USD = {tauxUSD} HTG</span>
            </div>
          </div>

          {/* Final Adjusted Total */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Total Ajusté (Caisse)</p>
                <p className="text-sm text-gray-500">Arrondi au 0 ou 5 le plus proche</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="mb-2">
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold text-gray-900">{formaterCaisse(totaux.totalAjuste)}</p>
                  <span className="text-lg font-semibold text-gray-700 ml-2">HTG</span>
                </div>
              </div>

              {hasAdjustment && (
                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <p className="text-sm text-gray-600">Valeur arrondie</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Écart:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isRoundedUp ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isRoundedUp ? `+${adjustment.toFixed(2)}` : `${adjustment.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">USD Sales</p>
          <p className="text-base font-semibold text-gray-900">${formaterArgent(totaux.totalUSD)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">HTG (USD)</p>
          <p className="text-base font-semibold text-gray-900">{formaterArgent(totaux.totalHTGenUSD)}</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;