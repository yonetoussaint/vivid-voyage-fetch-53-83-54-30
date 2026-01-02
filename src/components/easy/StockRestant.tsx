import React, { useState } from 'react';
import { Database, Fuel, Droplets, Battery, BatteryCharging, AlertCircle } from 'lucide-react';
import { formaterGallons } from '@/utils/formatters';

const StockRestant = ({ 
  date, 
  shift, 
  toutesDonnees, 
  propaneDonnees, 
  pompes = ['P1', 'P2', 'P3', 'P4', 'P5'],
  prix = { essence: 600, diesel: 650 }
}) => {
  // Capacités initiales des citernes (en gallons)
  const capacitesInitiales = {
    essence1: 8000,    // Gasoline 1
    essence2: 8000,    // Gasoline 2
    essence3: 6000,    // Gasoline 3
    diesel: 8000,      // Diesel
    reserveEssence: 4000,  // Reserve Gasoline
    reserveDiesel: 6000    // Reserve Diesel
  };

  // État pour les niveaux actuels
  const [niveauxActuels, setNiveauxActuels] = useState(() => {
    const saved = localStorage.getItem(`stockRestant_${date}`);
    return saved ? JSON.parse(saved) : { ...capacitesInitiales };
  });

  // Calculer la consommation du shift actuel
  const calculerConsommationShift = () => {
    let consommationEssence1 = 0;
    let consommationEssence2 = 0;
    let consommationEssence3 = 0;
    let consommationDiesel = 0;

    const donneesShift = toutesDonnees[shift] || {};

    Object.entries(donneesShift).forEach(([pompe, donneesPompe]) => {
      Object.entries(donneesPompe).forEach(([key, donnees]) => {
        if (key === '_vendeur') return;

        const debut = parseFloat(donnees.debut) || 0;
        const fin = parseFloat(donnees.fin) || 0;
        const gallons = fin - debut;

        if (donnees.typeCarburant === 'Essence 1') {
          consommationEssence1 += gallons;
        } else if (donnees.typeCarburant === 'Essence 2') {
          consommationEssence2 += gallons;
        } else if (donnees.typeCarburant === 'Essence') {
          consommationEssence3 += gallons;
        } else if (donnees.typeCarburant === 'Diesel') {
          consommationDiesel += gallons;
        }
      });
    });

    return {
      essence1: consommationEssence1,
      essence2: consommationEssence2,
      essence3: consommationEssence3,
      diesel: consommationDiesel
    };
  };

  // Calculer la consommation quotidienne totale
  const calculerConsommationQuotidienne = () => {
    let consommationEssence1 = 0;
    let consommationEssence2 = 0;
    let consommationEssence3 = 0;
    let consommationDiesel = 0;

    ['AM', 'PM'].forEach(shiftKey => {
      const donneesShift = toutesDonnees[shiftKey] || {};
      
      Object.entries(donneesShift).forEach(([pompe, donneesPompe]) => {
        Object.entries(donneesPompe).forEach(([key, donnees]) => {
          if (key === '_vendeur') return;

          const debut = parseFloat(donnees.debut) || 0;
          const fin = parseFloat(donnees.fin) || 0;
          const gallons = fin - debut;

          if (donnees.typeCarburant === 'Essence 1') {
            consommationEssence1 += gallons;
          } else if (donnees.typeCarburant === 'Essence 2') {
            consommationEssence2 += gallons;
          } else if (donnees.typeCarburant === 'Essence') {
            consommationEssence3 += gallons;
          } else if (donnees.typeCarburant === 'Diesel') {
            consommationDiesel += gallons;
          }
        });
      });
    });

    return {
      essence1: consommationEssence1,
      essence2: consommationEssence2,
      essence3: consommationEssence3,
      diesel: consommationDiesel
    };
  };

  // Mettre à jour les niveaux manuellement
  const mettreAJourNiveau = (citernes, nouvelleValeur) => {
    const nouvelleValeurParse = parseFloat(nouvelleValeur) || 0;
    
    setNiveauxActuels(prev => {
      const nouveauxNiveaux = {
        ...prev,
        [citernes]: Math.max(0, nouvelleValeurParse)
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem(`stockRestant_${date}`, JSON.stringify(nouveauxNiveaux));
      
      return nouveauxNiveaux;
    });
  };

  // Réinitialiser les niveaux aux capacités initiales
  const reinitialiserNiveaux = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser tous les niveaux aux capacités initiales?')) {
      setNiveauxActuels({ ...capacitesInitiales });
      localStorage.setItem(`stockRestant_${date}`, JSON.stringify(capacitesInitiales));
    }
  };

  // Calculer les niveaux après consommation
  const consommationShift = calculerConsommationShift();
  const consommationQuotidienne = calculerConsommationQuotidienne();

  // Niveaux actuels après déduction de la consommation du shift
  const niveauxApresConsommation = {
    essence1: Math.max(0, niveauxActuels.essence1 - consommationShift.essence1),
    essence2: Math.max(0, niveauxActuels.essence2 - consommationShift.essence2),
    essence3: Math.max(0, niveauxActuels.essence3 - consommationShift.essence3),
    diesel: Math.max(0, niveauxActuels.diesel - consommationShift.diesel),
    reserveEssence: niveauxActuels.reserveEssence,
    reserveDiesel: niveauxActuels.reserveDiesel
  };

  // Calculer les pourcentages de remplissage
  const calculerPourcentage = (niveau, capacite) => {
    return Math.round((niveau / capacite) * 100);
  };

  // Vérifier les niveaux bas (< 20%)
  const getCouleurNiveau = (pourcentage) => {
    if (pourcentage <= 10) return 'bg-red-500';
    if (pourcentage <= 20) return 'bg-orange-500';
    if (pourcentage <= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCouleurTexte = (pourcentage) => {
    if (pourcentage <= 10) return 'text-red-100';
    if (pourcentage <= 20) return 'text-orange-100';
    if (pourcentage <= 40) return 'text-yellow-100';
    return 'text-green-100';
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database size={22} />
            <h3 className="text-lg font-bold">Stock Restant - {date}</h3>
          </div>
          <button
            onClick={reinitialiserNiveaux}
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-bold text-sm active:scale-95 transition"
          >
            Réinitialiser
          </button>
        </div>

        {/* Résumé Total */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-90">Total Essence</p>
              <p className="text-xl font-bold">
                {formaterGallons(
                  niveauxApresConsommation.essence1 + 
                  niveauxApresConsommation.essence2 + 
                  niveauxApresConsommation.essence3 + 
                  niveauxApresConsommation.reserveEssence
                )}
              </p>
              <p className="text-sm opacity-90">gallons</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Total Diesel</p>
              <p className="text-xl font-bold">
                {formaterGallons(niveauxApresConsommation.diesel + niveauxApresConsommation.reserveDiesel)}
              </p>
              <p className="text-sm opacity-90">gallons</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white border-opacity-30 text-xs opacity-90">
            <p>Consommation Shift {shift}: Essence {formaterGallons(consommationShift.essence1 + consommationShift.essence2 + consommationShift.essence3)} gal | Diesel {formaterGallons(consommationShift.diesel)} gal</p>
          </div>
        </div>

        {/* Citernes Principales */}
        <div className="space-y-4">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Fuel size={18} />
            Citernes Principales
          </h4>

          {/* Essence 1 */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="font-bold">Gasoline 1</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Capacité: 8,000 gal</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Niveau Actuel</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={niveauxActuels.essence1}
                    onChange={(e) => mettreAJourNiveau('essence1', e.target.value)}
                    className="w-24 px-2 py-1 text-right bg-white bg-opacity-20 text-white rounded text-sm"
                  />
                  <span className="text-sm">gal</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getCouleurNiveau(calculerPourcentage(niveauxApresConsommation.essence1, capacitesInitiales.essence1))}`}
                  style={{ width: `${calculerPourcentage(niveauxApresConsommation.essence1, capacitesInitiales.essence1)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-90">Restant: {formaterGallons(niveauxApresConsommation.essence1)} gal</span>
                <span className={`font-bold ${getCouleurTexte(calculerPourcentage(niveauxApresConsommation.essence1, capacitesInitiales.essence1))}`}>
                  {calculerPourcentage(niveauxApresConsommation.essence1, capacitesInitiales.essence1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Essence 2 */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="font-bold">Gasoline 2</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Capacité: 8,000 gal</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Niveau Actuel</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={niveauxActuels.essence2}
                    onChange={(e) => mettreAJourNiveau('essence2', e.target.value)}
                    className="w-24 px-2 py-1 text-right bg-white bg-opacity-20 text-white rounded text-sm"
                  />
                  <span className="text-sm">gal</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getCouleurNiveau(calculerPourcentage(niveauxApresConsommation.essence2, capacitesInitiales.essence2))}`}
                  style={{ width: `${calculerPourcentage(niveauxApresConsommation.essence2, capacitesInitiales.essence2)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-90">Restant: {formaterGallons(niveauxApresConsommation.essence2)} gal</span>
                <span className={`font-bold ${getCouleurTexte(calculerPourcentage(niveauxApresConsommation.essence2, capacitesInitiales.essence2))}`}>
                  {calculerPourcentage(niveauxApresConsommation.essence2, capacitesInitiales.essence2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Essence 3 */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="font-bold">Gasoline 3</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Capacité: 6,000 gal</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Niveau Actuel</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={niveauxActuels.essence3}
                    onChange={(e) => mettreAJourNiveau('essence3', e.target.value)}
                    className="w-24 px-2 py-1 text-right bg-white bg-opacity-20 text-white rounded text-sm"
                  />
                  <span className="text-sm">gal</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getCouleurNiveau(calculerPourcentage(niveauxApresConsommation.essence3, capacitesInitiales.essence3))}`}
                  style={{ width: `${calculerPourcentage(niveauxApresConsommation.essence3, capacitesInitiales.essence3)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-90">Restant: {formaterGallons(niveauxApresConsommation.essence3)} gal</span>
                <span className={`font-bold ${getCouleurTexte(calculerPourcentage(niveauxApresConsommation.essence3, capacitesInitiales.essence3))}`}>
                  {calculerPourcentage(niveauxApresConsommation.essence3, capacitesInitiales.essence3)}%
                </span>
              </div>
            </div>
          </div>

          {/* Diesel */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="font-bold">Diesel</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Capacité: 8,000 gal</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Niveau Actuel</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={niveauxActuels.diesel}
                    onChange={(e) => mettreAJourNiveau('diesel', e.target.value)}
                    className="w-24 px-2 py-1 text-right bg-white bg-opacity-20 text-white rounded text-sm"
                  />
                  <span className="text-sm">gal</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getCouleurNiveau(calculerPourcentage(niveauxApresConsommation.diesel, capacitesInitiales.diesel))}`}
                  style={{ width: `${calculerPourcentage(niveauxApresConsommation.diesel, capacitesInitiales.diesel)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-90">Restant: {formaterGallons(niveauxApresConsommation.diesel)} gal</span>
                <span className={`font-bold ${getCouleurTexte(calculerPourcentage(niveauxApresConsommation.diesel, capacitesInitiales.diesel))}`}>
                  {calculerPourcentage(niveauxApresConsommation.diesel, capacitesInitiales.diesel)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Citernes de Réserve */}
        <div className="space-y-4 mt-6">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <BatteryCharging size={18} />
            Citernes de Réserve
          </h4>

          {/* Réserve Essence */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Droplets size={16} />
                <span className="font-bold">Réserve Essence</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Capacité: 4,000 gal</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Niveau Actuel</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={niveauxActuels.reserveEssence}
                    onChange={(e) => mettreAJourNiveau('reserveEssence', e.target.value)}
                    className="w-24 px-2 py-1 text-right bg-white bg-opacity-20 text-white rounded text-sm"
                  />
                  <span className="text-sm">gal</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getCouleurNiveau(calculerPourcentage(niveauxApresConsommation.reserveEssence, capacitesInitiales.reserveEssence))}`}
                  style={{ width: `${calculerPourcentage(niveauxApresConsommation.reserveEssence, capacitesInitiales.reserveEssence)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-90">Disponible: {formaterGallons(niveauxApresConsommation.reserveEssence)} gal</span>
                <span className={`font-bold ${getCouleurTexte(calculerPourcentage(niveauxApresConsommation.reserveEssence, capacitesInitiales.reserveEssence))}`}>
                  {calculerPourcentage(niveauxApresConsommation.reserveEssence, capacitesInitiales.reserveEssence)}%
                </span>
              </div>
            </div>
          </div>

          {/* Réserve Diesel */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Battery size={16} />
                <span className="font-bold">Réserve Diesel</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Capacité: 6,000 gal</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Niveau Actuel</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={niveauxActuels.reserveDiesel}
                    onChange={(e) => mettreAJourNiveau('reserveDiesel', e.target.value)}
                    className="w-24 px-2 py-1 text-right bg-white bg-opacity-20 text-white rounded text-sm"
                  />
                  <span className="text-sm">gal</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getCouleurNiveau(calculerPourcentage(niveauxApresConsommation.reserveDiesel, capacitesInitiales.reserveDiesel))}`}
                  style={{ width: `${calculerPourcentage(niveauxApresConsommation.reserveDiesel, capacitesInitiales.reserveDiesel)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-90">Disponible: {formaterGallons(niveauxApresConsommation.reserveDiesel)} gal</span>
                <span className={`font-bold ${getCouleurTexte(calculerPourcentage(niveauxApresConsommation.reserveDiesel, capacitesInitiales.reserveDiesel))}`}>
                  {calculerPourcentage(niveauxApresConsommation.reserveDiesel, capacitesInitiales.reserveDiesel)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts pour niveaux bas */}
        <div className="mt-6">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            Alertes Stock
          </h4>
          
          <div className="space-y-2">
            {Object.entries(niveauxApresConsommation).map(([citerne, niveau]) => {
              if (citerne.includes('reserve')) return null; // Ne pas inclure les réserves
              
              const capacite = capacitesInitiales[citerne];
              const pourcentage = calculerPourcentage(niveau, capacite);
              
              if (pourcentage <= 20) {
                const nomCiterne = {
                  essence1: 'Gasoline 1',
                  essence2: 'Gasoline 2',
                  essence3: 'Gasoline 3',
                  diesel: 'Diesel'
                }[citerne];
                
                return (
                  <div key={citerne} className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{nomCiterne}</span>
                      <span className="text-sm font-bold">{pourcentage}%</span>
                    </div>
                    <div className="text-xs mt-1">
                      Seulement {formaterGallons(niveau)} gal restants sur {capacite} gal
                    </div>
                  </div>
                );
              }
              return null;
            })}
            
            {Object.entries(niveauxApresConsommation).every(([citerne, niveau]) => {
              if (citerne.includes('reserve')) return true;
              const capacite = capacitesInitiales[citerne];
              const pourcentage = calculerPourcentage(niveau, capacite);
              return pourcentage > 20;
            }) && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-2 text-center">
                <span className="text-sm">Tous les niveaux sont satisfaisants</span>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-6 p-3 bg-white bg-opacity-10 rounded-lg">
          <h4 className="font-bold text-white mb-2">Statistiques Quotidiennes</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Consommation Essence (jour):</span>
              <span className="font-bold">
                {formaterGallons(consommationQuotidienne.essence1 + consommationQuotidienne.essence2 + consommationQuotidienne.essence3)} gal
              </span>
            </div>
            <div className="flex justify-between">
              <span>Consommation Diesel (jour):</span>
              <span className="font-bold">{formaterGallons(consommationQuotidienne.diesel)} gal</span>
            </div>
            <div className="flex justify-between">
              <span>Total Essence disponible:</span>
              <span className="font-bold">
                {formaterGallons(
                  niveauxApresConsommation.essence1 + 
                  niveauxApresConsommation.essence2 + 
                  niveauxApresConsommation.essence3 + 
                  niveauxApresConsommation.reserveEssence
                )} gal
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Diesel disponible:</span>
              <span className="font-bold">
                {formaterGallons(niveauxApresConsommation.diesel + niveauxApresConsommation.reserveDiesel)} gal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockRestant;