import React from 'react';
import { Calculator, Globe, Flame, User } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Cartes Résumé */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calculator size={24} />
          Résumé Quotidien - {date}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Shift Matin</p>
            <p className="text-lg font-bold">{formaterArgent(totauxAM.totalAjuste)} HTG</p>
            <p className="text-xs opacity-90">USD: ${formaterArgent(totauxAM.totalUSD)}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Shift Soir</p>
            <p className="text-lg font-bold">{formaterArgent(totauxPM.totalAjuste)} HTG</p>
            <p className="text-xs opacity-90">USD: ${formaterArgent(totauxPM.totalUSD)}</p>
          </div>
        </div>
      </div>

      {/* Résumé USD Quotidien */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Globe size={20} />
          Ventes USD - Total Quotidien
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Shift Matin</p>
              <p className="text-lg font-bold">${formaterArgent(totauxAM.totalUSD)}</p>
              <p className="text-sm opacity-90">{formaterArgent(totauxAM.totalHTGenUSD)} HTG</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Shift Soir</p>
              <p className="text-lg font-bold">${formaterArgent(totauxPM.totalUSD)}</p>
              <p className="text-sm opacity-90">{formaterArgent(totauxPM.totalHTGenUSD)} HTG</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total USD:</span>
              <span className="text-xl font-bold">${formaterArgent(totauxQuotidiens.totalUSD)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white border-opacity-30">
              <span className="font-bold">Total HTG (USD):</span>
              <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.totalHTGenUSD)} HTG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé Propane Quotidien SEPARATE */}
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Flame size={20} />
          Propane - Total Quotidien (Séparé)
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Shift Matin</p>
              <p className="text-lg font-bold">{totauxAM.propaneGallons.toFixed(3)} gal</p>
              <p className="text-sm opacity-90">{formaterArgent(totauxAM.propaneVentes)} HTG</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Shift Soir</p>
              <p className="text-lg font-bold">{totauxPM.propaneGallons.toFixed(3)} gal</p>
              <p className="text-sm opacity-90">{formaterArgent(totauxPM.propaneVentes)} HTG</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Gallons Propane:</span>
              <span className="text-xl font-bold">{totauxQuotidiens.propaneGallons.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white border-opacity-30">
              <span className="font-bold">Total Ventes Propane:</span>
              <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.propaneVentes)} HTG</span>
            </div>
            <div className="text-center text-xs opacity-90 mt-2">
              Prix: {prixPropane} HTG par gallon
            </div>
          </div>
        </div>
      </div>

      {/* Résumé Financier Vendeurs */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User size={20} />
          Résumé Financier Vendeurs
        </h3>

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

      {/* Détails Pompes Shift Matin */}
      <PumpDetailsShift
        shift="AM"
        pompes={pompes}
        toutesDonnees={toutesDonnees}
      />

      {/* Détails Pompes Shift Soir */}
      <PumpDetailsShift
        shift="PM"
        pompes={pompes}
        toutesDonnees={toutesDonnees}
      />

      {/* Totaux Essence Quotidiens */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-bold mb-3">💚 Essence - Total Quotidien</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Gallons</span>
            <span className="font-bold">{formaterGallons(totauxQuotidiens.gallonsEssence)}</span>
          </div>
          <div className="flex justify-between">
            <span>Prix/Gallon</span>
            <span className="font-bold">600 HTG</span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
            <span className="font-bold">Ventes Brutes</span>
            <span className="font-bold">{formaterArgent(totauxQuotidiens.ventesEssence)} HTG</span>
          </div>
        </div>
      </div>

      {/* Totaux Diesel Quotidiens */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-bold mb-3">⚡ Diesel - Total Quotidien</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Gallons</span>
            <span className="font-bold">{formaterGallons(totauxQuotidiens.gallonsDiesel)}</span>
          </div>
          <div className="flex justify-between">
            <span>Prix/Gallon</span>
            <span className="font-bold">650 HTG</span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
            <span className="font-bold">Ventes Brutes</span>
            <span className="font-bold">{formaterArgent(totauxQuotidiens.ventesDiesel)} HTG</span>
          </div>
        </div>
      </div>

      {/* Total Final Ajusté SANS Propane */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-5 shadow-xl">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">TOTAL BRUT (HTG)</span>
            <span className="text-2xl font-bold">{formaterArgent(totauxQuotidiens.totalBrut)} HTG</span>
          </div>
          <div className="space-y-1 pl-2 border-l-2 border-white border-opacity-30 ml-2">
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-90">• Essence</span>
              <span>{formaterArgent(totauxQuotidiens.ventesEssence)} HTG</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-90">• Diesel</span>
              <span>{formaterArgent(totauxQuotidiens.ventesDiesel)} HTG</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white border-opacity-30">
            <span className="text-sm opacity-90">Moins: USD converti</span>
            <span className="text-sm">- {formaterArgent(totauxQuotidiens.totalHTGenUSD)} HTG</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold">TOTAL FINAL AJUSTÉ</span>
            <span className="text-2xl font-bold">{formaterArgent(totauxQuotidiens.totalAjuste)} HTG</span>
          </div>
        </div>
      </div>

      {/* Propane Report Card - SEPARATE */}
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Flame size={20} />
          Rapport Propane Quotidien (Séparé)
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Total Gallons</p>
              <p className="text-xl font-bold">{totauxQuotidiens.propaneGallons.toFixed(3)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Prix/Gallon</p>
              <p className="text-xl font-bold">{prixPropane} HTG</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Ventes Propane:</span>
              <span className="text-2xl font-bold">{formaterArgent(totauxQuotidiens.propaneVentes)} HTG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;