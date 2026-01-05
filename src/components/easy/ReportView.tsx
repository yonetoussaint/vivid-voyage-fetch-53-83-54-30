import React from 'react';
import { Calculator, Globe, Flame, User, DollarSign, TrendingUp, TrendingDown, Fuel, Users } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';
import PumpDetailsShift from '@/components/easy/PumpDetailsShift';
import ResumeFinancierVendeurs from '@/components/easy/ResumeFinancierVendeurs';

const ReportView = ({ 
  date, 
  totauxAM, 
  totauxPM, 
  totauxQuotidiens, 
  toutesDonnees, 
  propaneDonnees, 
  ventesUSD, 
  vendeurs, 
  totauxVendeurs, 
  tauxUSD, 
  prix, 
  prixPropane, 
  pompes 
}) => {
  return (
    <div className="space-y-3">
      {/* Daily Summary Card - Mobile First */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-white" />
            <h2 className="text-lg font-bold">Résumé Quotidien</h2>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">{date}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white bg-opacity-15 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <p className="text-xs font-medium opacity-90">Matin</p>
            </div>
            <p className="text-lg font-bold">{formaterArgent(totauxAM.totalAjuste)}</p>
            <div className="text-[10px] opacity-80 mt-1">
              <p>USD: ${formaterArgent(totauxAM.totalUSD)}</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-15 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple-300"></div>
              <p className="text-xs font-medium opacity-90">Soir</p>
            </div>
            <p className="text-lg font-bold">{formaterArgent(totauxPM.totalAjuste)}</p>
            <div className="text-[10px] opacity-80 mt-1">
              <p>USD: ${formaterArgent(totauxPM.totalUSD)}</p>
            </div>
          </div>
        </div>
        
        {/* Daily Quick Stats */}
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="bg-white bg-opacity-10 rounded p-1">
            <p className="text-[10px] opacity-90">Pompes</p>
            <p className="text-xs font-bold">5</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded p-1">
            <p className="text-[10px] opacity-90">Vendeurs</p>
            <p className="text-xs font-bold">{vendeurs.length}</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded p-1">
            <p className="text-[10px] opacity-90">Pistolets</p>
            <p className="text-xs font-bold">21</p>
          </div>
        </div>
      </div>

      {/* USD Sales Summary - Mobile Optimized */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-white" />
            <h3 className="text-base font-bold">Ventes USD</h3>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            Taux: {tauxUSD}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                <p className="text-xs opacity-90">Matin</p>
              </div>
              <div className="flex items-end gap-1">
                <p className="text-lg font-bold">${formaterArgent(totauxAM.totalUSD)}</p>
                <p className="text-[10px] opacity-80 mb-0.5">USD</p>
              </div>
              <p className="text-[10px] opacity-80">{formaterArgent(totauxAM.totalHTGenUSD)} HTG</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                <p className="text-xs opacity-90">Soir</p>
              </div>
              <div className="flex items-end gap-1">
                <p className="text-lg font-bold">${formaterArgent(totauxPM.totalUSD)}</p>
                <p className="text-[10px] opacity-80 mb-0.5">USD</p>
              </div>
              <p className="text-[10px] opacity-80">{formaterArgent(totauxPM.totalHTGenUSD)} HTG</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-25 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold">Total USD</p>
              <div className="flex items-center gap-1">
                <span className="text-xs opacity-80">=</span>
                <span className="text-sm font-bold">{formaterArgent(totauxQuotidiens.totalHTGenUSD)}</span>
                <span className="text-xs opacity-80">HTG</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">${formaterArgent(totauxQuotidiens.totalUSD)}</p>
              <p className="text-[10px] opacity-70">Conversion HTG</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEPARATE Propane Daily Report */}
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-white" />
            <h3 className="text-base font-bold">Propane - Journalier</h3>
          </div>
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            SÉPARÉ
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <p className="text-xs opacity-90 mb-1">Shift Matin</p>
              <div className="space-y-0.5">
                <p className="text-sm font-bold">{totauxAM.propaneGallons.toFixed(3)} gal</p>
                <p className="text-[10px] opacity-80">{formaterArgent(totauxAM.propaneVentes)} HTG</p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <p className="text-xs opacity-90 mb-1">Shift Soir</p>
              <div className="space-y-0.5">
                <p className="text-sm font-bold">{totauxPM.propaneGallons.toFixed(3)} gal</p>
                <p className="text-[10px] opacity-80">{formaterArgent(totauxPM.propaneVentes)} HTG</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-25 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <p className="text-sm font-bold">Total Propane</p>
              </div>
              <p className="text-xs opacity-80">Prix: {prixPropane} HTG/gal</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-90">Gallons Totaux</span>
                <span className="text-base font-bold">{totauxQuotidiens.propaneGallons.toFixed(3)}</span>
              </div>
              
              <div className="pt-1 border-t border-white border-opacity-30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Ventes Propane</span>
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.propaneVentes)}</span>
                    <span className="text-sm opacity-80">HTG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Financial Summary */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-white" />
            <h3 className="text-base font-bold">Vendeurs</h3>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            Total: {vendeurs.length}
          </div>
        </div>
        
        <ResumeFinancierVendeurs
          shift="AM"
          vendeurs={vendeurs}
          totauxVendeurs={totauxVendeurs}
        />
        
        <ResumeFinancierVendeurs
          shift="PM"
          vendeurs={vendeurs}
          totauxVendeurs={totauxVendeurs}
        />
      </div>

      {/* Pump Details - AM Shift */}
      <PumpDetailsShift
        shift="AM"
        pompes={pompes}
        toutesDonnees={toutesDonnees}
      />

      {/* Pump Details - PM Shift */}
      <PumpDetailsShift
        shift="PM"
        pompes={pompes}
        toutesDonnees={toutesDonnees}
      />

      {/* Daily Fuel Totals */}
      <div className="space-y-2">
        {/* Essence Daily Total */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Fuel size={16} className="text-emerald-200" />
              <h3 className="text-base font-bold">Essence - Journalier</h3>
            </div>
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              600 HTG/gal
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Gallons Totaux</span>
              <span className="text-base font-bold">{formaterGallons(totauxQuotidiens.gallonsEssence)}</span>
            </div>
            
            <div className="pt-2 border-t border-white border-opacity-30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Ventes Essence</span>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.ventesEssence)}</span>
                  <span className="text-sm opacity-80">HTG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diesel Daily Total */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Fuel size={16} className="text-amber-200" />
              <h3 className="text-base font-bold">Diesel - Journalier</h3>
            </div>
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              650 HTG/gal
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Gallons Totaux</span>
              <span className="text-base font-bold">{formaterGallons(totauxQuotidiens.gallonsDiesel)}</span>
            </div>
            
            <div className="pt-2 border-t border-white border-opacity-30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Ventes Diesel</span>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.ventesDiesel)}</span>
                  <span className="text-sm opacity-80">HTG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TOTAL SALES - Most Prominent Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-white" />
            <h2 className="text-lg font-bold">TOTAL VENTES QUOTIDIEN</h2>
          </div>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            {date}
          </div>
        </div>
        
        <div className="space-y-3">
          {/* TOTAL SALES - BIG AND BOLD */}
          <div className="bg-white bg-opacity-15 rounded-xl p-4 border-2 border-white border-opacity-20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-base font-bold">VENTES BRUTES TOTALES</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Essence + Diesel</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formaterArgent(totauxQuotidiens.totalBrut)}</p>
              <span className="text-xl font-medium">HTG</span>
            </div>
          </div>
          
          {/* Fuel Breakdown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <p className="text-xs font-bold opacity-90">Essence</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold">{formaterArgent(totauxQuotidiens.ventesEssence)}</p>
                <span className="text-xs opacity-80">HTG</span>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <p className="text-xs font-bold opacity-90">Diesel</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold">{formaterArgent(totauxQuotidiens.ventesDiesel)}</p>
                <span className="text-xs opacity-80">HTG</span>
              </div>
            </div>
          </div>
          
          {/* USD Adjustment - Less Prominent */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingDown size={14} className="text-white" />
                <p className="text-sm font-bold">MOINS: USD Converti</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">${formaterArgent(totauxQuotidiens.totalUSD)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90 mb-0.5">= {formaterArgent(totauxQuotidiens.totalHTGenUSD)} HTG</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-80">Taux: 1 USD = {tauxUSD} HTG</p>
              </div>
            </div>
          </div>
          
          {/* FINAL ADJUSTED TOTAL - Still Important */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-white" />
                <p className="text-lg font-bold">TOTAL FINAL AJUSTÉ</p>
              </div>
              <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full">
                <p className="text-xs font-bold">CAISSE FINALE</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs opacity-90 mb-0.5">Ventes Brutes - USD converti</p>
                <p className="text-2xl sm:text-3xl font-bold">{formaterArgent(totauxQuotidiens.totalAjuste)}</p>
              </div>
              <span className="text-xl font-bold">HTG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separate Propane Final Report */}
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-white" />
            <h2 className="text-lg font-bold">PROPANE FINAL</h2>
          </div>
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
            RAPPORT SÉPARÉ
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white bg-opacity-25 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-bold opacity-90">TOTAL PROPANE</p>
              <div className="flex items-center gap-1">
                <span className="text-xs opacity-80">{prixPropane} HTG/gal</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Gallons Totaux</span>
                <span className="text-lg font-bold">{totauxQuotidiens.propaneGallons.toFixed(3)}</span>
              </div>
              
              <div className="pt-2 border-t border-white border-opacity-30">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">Ventes Propane Total</span>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">{formaterArgent(totauxQuotidiens.propaneVentes)}</span>
                    <span className="text-base opacity-80">HTG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs opacity-70">* Propane traité séparément des ventes principales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;