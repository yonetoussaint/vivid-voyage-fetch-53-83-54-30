import React, { useState, useEffect } from 'react';
import { Database, Fuel, Droplets, Battery, BatteryCharging, AlertCircle, Ruler } from 'lucide-react';
import { formaterGallons } from '@/utils/formatters';
import { depthToGallons, gallonsToDepth, getMaxDepth, getMaxGallons, getStandardCapacity } from '@/utils/cisternCalibration';

const StockRestant = ({ 
  date, 
  shift, 
  toutesDonnees, 
  propaneDonnees, 
  pompes = ['P1', 'P2', 'P3', 'P4', 'P5'],
  prix = { essence: 600, diesel: 650 }
}) => {
  // Configuration des citernes avec leurs types
  const cisternConfig = {
    essence1: { type: 8000, label: 'Gasoline 1', color: 'bg-blue-400' },
    essence2: { type: 8000, label: 'Gasoline 2', color: 'bg-green-400' },
    essence3: { type: 6000, label: 'Gasoline 3', color: 'bg-emerald-400' },
    diesel: { type: 8000, label: 'Diesel', color: 'bg-amber-400' },
    reserveEssence: { type: 4000, label: 'Réserve Essence', color: 'bg-purple-400' },
    reserveDiesel: { type: 6000, label: 'Réserve Diesel', color: 'bg-red-400' }
  };

  // Capacités initiales des citernes (en gallons)
  const capacitesInitiales = {
    essence1: 8000,
    essence2: 8000,
    essence3: 6000,
    diesel: 8000,
    reserveEssence: 4000,
    reserveDiesel: 6000
  };

  // État pour les profondeurs actuelles (en inches)
  const [profondeursActuelles, setProfondeursActuelles] = useState(() => {
    const saved = localStorage.getItem(`stockRestantProfondeurs_${date}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Initialiser avec des profondeurs correspondant à 50% de capacité
    const initialDepths = {};
    Object.keys(cisternConfig).forEach(key => {
      const config = cisternConfig[key];
      // Trouver la profondeur pour 50% de la capacité standard
      const halfGallons = getStandardCapacity(config.type) * 0.5;
      initialDepths[key] = gallonsToDepth(config.type, halfGallons);
    });
    return initialDepths;
  });

  // Calculer les gallons à partir des profondeurs
  const calculerGallonsFromProfondeurs = () => {
    const gallons = {};
    Object.entries(cisternConfig).forEach(([key, config]) => {
      gallons[key] = depthToGallons(config.type, profondeursActuelles[key] || 0);
    });
    return gallons;
  };

  // Mettre à jour la profondeur d'une citerne
  const mettreAJourProfondeur = (citerne, nouvelleProfondeur) => {
    const config = cisternConfig[citerne];
    if (!config) return;
    
    const profondeurParse = parseFloat(nouvelleProfondeur) || 0;
    const maxDepth = getMaxDepth(config.type);
    
    setProfondeursActuelles(prev => {
      const nouvellesProfondeurs = {
        ...prev,
        [citerne]: Math.min(Math.max(0, profondeurParse), maxDepth)
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem(`stockRestantProfondeurs_${date}`, JSON.stringify(nouvellesProfondeurs));
      
      return nouvellesProfondeurs;
    });
  };

  // Mettre à jour les gallons directement (optionnel)
  const mettreAJourGallons = (citerne, nouveauxGallons) => {
    const config = cisternConfig[citerne];
    if (!config) return;
    
    const gallonsParse = parseFloat(nouveauxGallons) || 0;
    const nouvelleProfondeur = gallonsToDepth(config.type, gallonsParse);
    
    mettreAJourProfondeur(citerne, nouvelleProfondeur);
  };

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

  // Réinitialiser les profondeurs
  const reinitialiserProfondeurs = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les profondeurs?')) {
      const initialDepths = {};
      Object.keys(cisternConfig).forEach(key => {
        const config = cisternConfig[key];
        // Réinitialiser à 0 (vide)
        initialDepths[key] = 0;
      });
      setProfondeursActuelles(initialDepths);
      localStorage.setItem(`stockRestantProfondeurs_${date}`, JSON.stringify(initialDepths));
    }
  };

  // Calculer les niveaux après consommation
  const consommationShift = calculerConsommationShift();
  const consommationQuotidienne = calculerConsommationQuotidienne();
  
  // Obtenir les gallons actuels
  const gallonsActuels = calculerGallonsFromProfondeurs();

  // Niveaux actuels après déduction de la consommation du shift
  const niveauxApresConsommation = {
    essence1: Math.max(0, gallonsActuels.essence1 - consommationShift.essence1),
    essence2: Math.max(0, gallonsActuels.essence2 - consommationShift.essence2),
    essence3: Math.max(0, gallonsActuels.essence3 - consommationShift.essence3),
    diesel: Math.max(0, gallonsActuels.diesel - consommationShift.diesel),
    reserveEssence: gallonsActuels.reserveEssence,
    reserveDiesel: gallonsActuels.reserveDiesel
  };

  // Calculer les pourcentages de remplissage
  const calculerPourcentage = (gallons, citerne) => {
    const config = cisternConfig[citerne];
    if (!config) return 0;
    
    const maxGallons = getMaxGallons(config.type);
    return Math.round((gallons / maxGallons) * 100);
  };

  // Vérifier les niveaux bas
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

  // Render une citerne
  const renderCistern = (citerne) => {
    const config = cisternConfig[citerne];
    const capacite = capacitesInitiales[citerne];
    const gallonsApres = niveauxApresConsommation[citerne];
    const pourcentage = calculerPourcentage(gallonsApres, citerne);
    const maxDepth = getMaxDepth(config.type);
    const maxGallons = getMaxGallons(config.type);

    return (
      <div key={citerne} className="bg-white bg-opacity-10 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
            <span className="font-bold">{config.label}</span>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">
              Capacité: {getStandardCapacity(config.type).toLocaleString()} gal
              <br />
              <span className="text-xs">Max: {maxGallons.toLocaleString()} gal</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Entrée de profondeur */}
          <div className="bg-white bg-opacity-5 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium flex items-center gap-1">
                <Ruler size={14} />
                Profondeur mesurée
              </span>
              <span className="text-xs opacity-90">Max: {maxDepth}"</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.125"
                min="0"
                max={maxDepth}
                value={profondeursActuelles[citerne] || 0}
                onChange={(e) => mettreAJourProfondeur(citerne, e.target.value)}
                className="flex-1 px-3 py-2 bg-white bg-opacity-20 text-white rounded text-center font-medium"
                placeholder="Inches"
              />
              <span className="text-sm w-10 text-center">po</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => mettreAJourProfondeur(citerne, Math.max(0, profondeursActuelles[citerne] - 0.125))}
                className="px-2 py-1 bg-white bg-opacity-10 text-white rounded text-xs active:scale-95 transition"
              >
                -0.125"
              </button>
              <button
                onClick={() => mettreAJourProfondeur(citerne, Math.min(maxDepth, profondeursActuelles[citerne] + 0.125))}
                className="px-2 py-1 bg-white bg-opacity-10 text-white rounded text-xs active:scale-95 transition"
              >
                +0.125"
              </button>
            </div>
          </div>

          {/* Affichage des gallons */}
          <div className="bg-white bg-opacity-5 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Volume calculé</span>
              <button
                onClick={() => {
                  const gallons = prompt(`Entrez les gallons pour ${config.label}:`, gallonsActuels[citerne]);
                  if (gallons !== null) {
                    mettreAJourGallons(citerne, gallons);
                  }
                }}
                className="text-xs px-2 py-1 bg-white bg-opacity-10 rounded active:scale-95 transition"
              >
                Modifier gallons
              </button>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formaterGallons(gallonsActuels[citerne])}</div>
              <div className="text-sm opacity-90">gallons</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Niveau restant</span>
              <span className="text-sm font-bold">{formaterGallons(gallonsApres)} gal</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${getCouleurNiveau(pourcentage)}`}
                style={{ width: `${pourcentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="opacity-90">0 gal</span>
              <span className={`font-bold ${getCouleurTexte(pourcentage)}`}>
                {pourcentage}%
              </span>
              <span className="opacity-90">{maxGallons.toLocaleString()} gal</span>
            </div>
          </div>
        </div>
      </div>
    );
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
            onClick={reinitialiserProfondeurs}
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

          {['essence1', 'essence2', 'essence3', 'diesel'].map(renderCistern)}
        </div>

        {/* Citernes de Réserve */}
        <div className="space-y-4 mt-6">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <BatteryCharging size={18} />
            Citernes de Réserve
          </h4>

          {['reserveEssence', 'reserveDiesel'].map(renderCistern)}
        </div>

        {/* Alerts pour niveaux bas */}
        <div className="mt-6">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            Alertes Stock
          </h4>
          
          <div className="space-y-2">
            {Object.entries(niveauxApresConsommation).map(([citerne, gallons]) => {
              if (citerne.includes('reserve')) return null;
              
              const config = cisternConfig[citerne];
              const pourcentage = calculerPourcentage(gallons, citerne);
              
              if (pourcentage <= 20) {
                return (
                  <div key={citerne} className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{config.label}</span>
                      <span className="text-sm font-bold">{pourcentage}%</span>
                    </div>
                    <div className="text-xs mt-1">
                      Seulement {formaterGallons(gallons)} gal restants 
                      (Profondeur: {profondeursActuelles[citerne]?.toFixed(3)}")
                    </div>
                  </div>
                );
              }
              return null;
            })}
            
            {Object.entries(niveauxApresConsommation).every(([citerne, gallons]) => {
              if (citerne.includes('reserve')) return true;
              const pourcentage = calculerPourcentage(gallons, citerne);
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