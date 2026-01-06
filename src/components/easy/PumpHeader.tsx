import React from 'react';
import { Fuel, Flame } from 'lucide-react';
import { formaterArgent, formaterGallons } from '@/utils/formatters';

const PumpHeader = ({ 
  pompe, 
  shift, 
  donneesPompe, 
  vendeurs, 
  mettreAJourAffectationVendeur, 
  prix,
  vendeurDepots,
  // New props for propane
  isPropane = false,
  propaneData = null,
  propaneTotaux = null,
  prixPropane = null
}) => {
  // Calculate totals for pump
  const calculerTotalsPompe = () => {
    if (!donneesPompe) return { gallons: 0, montant: 0 };
    
    const totalGallons = Object.values(donneesPompe).reduce((total, pistolet) => {
      const gallons = pistolet.fin && pistolet.debut ? pistolet.fin - pistolet.debut : 0;
      return total + gallons;
    }, 0);
    
    // Determine product type and price
    const productType = pompe.includes('D') ? 'diesel' : 'regular';
    const prixProduit = prix[productType];
    const montantTotal = totalGallons * prixProduit;
    
    return { gallons: totalGallons, montant: montantTotal };
  };

  // Get propane totals
  const calculerTotalsPropane = () => {
    if (!propaneData || !propaneTotaux) return { gallons: 0, montant: 0 };
    
    const gallons = propaneTotaux.propaneGallons || 0;
    const montant = propaneTotaux.propaneVentes || 0;
    
    return { gallons, montant };
  };

  const totals = isPropane ? calculerTotalsPropane() : calculerTotalsPompe();
  const currentPrice = isPropane ? prixPropane : (pompe.includes('D') ? prix.diesel : prix.regular);
  const vendeurActuel = donneesPompe?.P1?.vendeurId || '';

  // Get vendeur deposits
  const getDepotVendeur = () => {
    if (!vendeurActuel || !vendeurDepots) return 0;
    return vendeurDepots[vendeurActuel] || 0;
  };

  return (
    <div className={`rounded-xl p-3 shadow-lg ${isPropane ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isPropane ? (
            <Flame size={24} className="text-white" />
          ) : (
            <Fuel size={24} className="text-white" />
          )}
          <div>
            <h2 className="text-lg font-bold text-white">
              {isPropane ? 'Propane' : pompe}
            </h2>
            <p className="text-xs text-white opacity-90">Shift {shift}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white opacity-90">Prix/Gallon</p>
          <p className="text-lg font-bold text-white">{currentPrice} HTG</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <p className="text-xs text-white opacity-90">Gallons Vendus</p>
          <p className="text-lg font-bold text-white">
            {isPropane ? totals.gallons.toFixed(3) : formaterGallons(totals.gallons)}
          </p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <p className="text-xs text-white opacity-90">Total Ventes</p>
          <p className="text-lg font-bold text-white">{formaterArgent(totals.montant)}</p>
        </div>
      </div>
      
      {/* Vendeur assignment section - conditionally show for pumps only */}
      {!isPropane ? (
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-medium">Vendeur Assigné:</span>
            <select
              className="px-3 py-1 bg-white text-gray-900 rounded-lg font-semibold text-sm"
              value={vendeurActuel}
              onChange={(e) => mettreAJourAffectationVendeur(pompe, e.target.value, shift)}
            >
              <option value="">Sélectionner Vendeur</option>
              {vendeurs.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nom} {vendeurDepots && vendeurDepots[v.id] ? `(${formaterArgent(vendeurDepots[v.id])})` : ''}
                </option>
              ))}
            </select>
          </div>
          {vendeurActuel && (
            <div className="flex justify-between items-center mt-1 pt-1 border-t border-white border-opacity-20">
              <span className="text-xs text-white opacity-90">Dépôts du Vendeur:</span>
              <span className="text-xs font-bold text-white">
                {formaterArgent(getDepotVendeur())}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* For propane, show a simpler info section */
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Responsable:</span>
            <span className="text-white font-bold">Propane - Tous Vendeurs</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpHeader;