import { calculerGallons } from './helpers';

// Calculer totaux pour un shift spécifique (propane SEPARATE)
export const calculerTotaux = (donneesShift, propaneShift, usdShift, prix, tauxUSD, prixPropane) => {
  if (!donneesShift) return getEmptyTotals();

  let totalGallonsEssence = 0;
  let totalGallonsDiesel = 0;
  let totalVentesEssence = 0;
  let totalVentesDiesel = 0;

  Object.entries(donneesShift).forEach(([pompe, donneesPompe]) => {
    Object.entries(donneesPompe).forEach(([key, donnees]) => {
      if (key === '_vendeur') return;

      const gallons = calculerGallons(donnees.debut, donnees.fin);

      if (donnees.typeCarburant.includes('Essence')) {
        totalGallonsEssence += gallons;
        totalVentesEssence += gallons * prix.essence;
      } else if (donnees.typeCarburant === 'Diesel') {
        totalGallonsDiesel += gallons;
        totalVentesDiesel += gallons * prix.diesel;
      }
    });
  });

  // Calculer propane SEPARATELY (not added to main totals)
  const propaneGallons = (parseFloat(propaneShift?.fin) || 0) - (parseFloat(propaneShift?.debut) || 0);
  const propaneVentes = propaneGallons * prixPropane;

  // Calculer USD
  const totalUSD = (usdShift || []).reduce((total, usd) => total + (parseFloat(usd) || 0), 0);
  const totalHTGenUSD = totalUSD * tauxUSD;

  // Totaux - DO NOT include propane in main totals
  const totalBrut = totalVentesEssence + totalVentesDiesel; // REMOVED propaneVentes
  const totalAjuste = totalBrut - totalHTGenUSD;

  return {
    totalGallonsEssence: parseFloat(totalGallonsEssence.toFixed(3)),
    totalGallonsDiesel: parseFloat(totalGallonsDiesel.toFixed(3)),
    propaneGallons: parseFloat(propaneGallons.toFixed(3)),
    totalVentesEssence: parseFloat(totalVentesEssence.toFixed(2)),
    totalVentesDiesel: parseFloat(totalVentesDiesel.toFixed(2)),
    propaneVentes: parseFloat(propaneVentes.toFixed(2)), // Still calculated but separate
    totalUSD: parseFloat(totalUSD.toFixed(2)),
    totalHTGenUSD: parseFloat(totalHTGenUSD.toFixed(2)),
    totalBrut: parseFloat(totalBrut.toFixed(2)), // Now only essence + diesel
    totalAjuste: parseFloat(totalAjuste.toFixed(2))
  };
};

// Calculer totaux vendeurs (no propane in vendeur totals)
export const calculerTotauxVendeurs = (vendeurs, toutesDonnees, tousDepots, prix) => {
  const totauxVendeurs = { AM: {}, PM: {} };

  // Initialiser tous les vendeurs
  vendeurs.forEach(vendeur => {
    totauxVendeurs.AM[vendeur] = getEmptyVendeurData();
    totauxVendeurs.PM[vendeur] = getEmptyVendeurData();
  });

  // Calculer ventes par vendeur
  ['AM', 'PM'].forEach(shiftKey => {
    Object.entries(toutesDonnees[shiftKey] || {}).forEach(([pompe, donneesPompe]) => {
      const vendeur = donneesPompe?._vendeur || '';

      if (vendeur && totauxVendeurs[shiftKey][vendeur]) {
        Object.entries(donneesPompe).forEach(([key, donnees]) => {
          if (key === '_vendeur') return;

          const gallons = calculerGallons(donnees.debut, donnees.fin);

          if (donnees.typeCarburant.includes('Essence')) {
            totauxVendeurs[shiftKey][vendeur].gallonsEssence += gallons;
            totauxVendeurs[shiftKey][vendeur].ventesEssence += gallons * prix.essence;
          } else if (donnees.typeCarburant === 'Diesel') {
            totauxVendeurs[shiftKey][vendeur].gallonsDiesel += gallons;
            totauxVendeurs[shiftKey][vendeur].ventesDiesel += gallons * prix.diesel;
          }
        });

        // Mettre à jour les totaux
        updateVendeurTotals(totauxVendeurs[shiftKey][vendeur]);
        
        // Calculer dépôts
        updateDepotsForVendeur(totauxVendeurs, shiftKey, vendeur, tousDepots);
      }
    });
  });

  return totauxVendeurs;
};

// Mettre à jour les totaux du vendeur
const updateVendeurTotals = (donneesVendeur) => {
  donneesVendeur.gallonsEssence = parseFloat(donneesVendeur.gallonsEssence.toFixed(3));
  donneesVendeur.gallonsDiesel = parseFloat(donneesVendeur.gallonsDiesel.toFixed(3));
  donneesVendeur.ventesEssence = parseFloat(donneesVendeur.ventesEssence.toFixed(2));
  donneesVendeur.ventesDiesel = parseFloat(donneesVendeur.ventesDiesel.toFixed(2));
  donneesVendeur.ventesTotales = parseFloat((donneesVendeur.ventesEssence + donneesVendeur.ventesDiesel).toFixed(2));
};

// Mettre à jour les dépôts du vendeur
const updateDepotsForVendeur = (totauxVendeurs, shiftKey, vendeur, tousDepots) => {
  const depots = (tousDepots[shiftKey]?.[vendeur] || []).filter(depot => depot !== '');
  const depotsValides = depots.map(depot => parseFloat(depot) || 0);
  const totalDepot = depotsValides.reduce((sum, depot) => sum + depot, 0);

  const donneesVendeur = totauxVendeurs[shiftKey][vendeur];
  donneesVendeur.depot = parseFloat(totalDepot.toFixed(2));
  donneesVendeur.depots = depotsValides;
  donneesVendeur.especesAttendues = parseFloat((donneesVendeur.ventesTotales - donneesVendeur.depot).toFixed(2));
};

// Helper functions
const getEmptyTotals = () => ({
  totalGallonsEssence: 0,
  totalGallonsDiesel: 0,
  propaneGallons: 0,
  totalVentesEssence: 0,
  totalVentesDiesel: 0,
  propaneVentes: 0,
  totalUSD: 0,
  totalHTGenUSD: 0,
  totalBrut: 0,
  totalAjuste: 0
});

const getEmptyVendeurData = () => ({
  gallonsEssence: 0,
  gallonsDiesel: 0,
  ventesEssence: 0,
  ventesDiesel: 0,
  ventesTotales: 0,
  depot: 0,
  depots: [],
  especesAttendues: 0
});