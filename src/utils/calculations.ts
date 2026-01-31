import { calculerGallons } from './helpers';

// Calculer totaux pour un shift spécifique (propane SEPARATE)
export const calculerTotaux = (donneesShift, propaneShift, usdShift, prix, tauxUSD, prixPropane) => {
  if (!donneesShift) return getEmptyTotals();

  let totalGallonsGasoline = 0;
  let totalGallonsDiesel = 0;
  let totalVentesGasoline = 0;
  let totalVentesDiesel = 0;

  Object.entries(donneesShift).forEach(([pompe, donneesPompe]) => {
    Object.entries(donneesPompe).forEach(([key, donnees]) => {
      if (key === '_vendeur') return;

      const gallons = calculerGallons(donnees.debut, donnees.fin);

      if (donnees.typeCarburant.includes('Gasoline')) {
        totalGallonsGasoline += gallons;
        totalVentesGasoline += gallons * prix.gasoline;
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
  const totalBrut = totalVentesGasoline + totalVentesDiesel; // REMOVED propaneVentes
  const totalAjuste = totalBrut - totalHTGenUSD;

  return {
    totalGallonsGasoline: parseFloat(totalGallonsGasoline.toFixed(3)),
    totalGallonsDiesel: parseFloat(totalGallonsDiesel.toFixed(3)),
    propaneGallons: parseFloat(propaneGallons.toFixed(3)),
    totalVentesGasoline: parseFloat(totalVentesGasoline.toFixed(2)),
    totalVentesDiesel: parseFloat(totalVentesDiesel.toFixed(2)),
    propaneVentes: parseFloat(propaneVentes.toFixed(2)), // Still calculated but separate
    totalUSD: parseFloat(totalUSD.toFixed(2)),
    totalHTGenUSD: parseFloat(totalHTGenUSD.toFixed(2)),
    totalBrut: parseFloat(totalBrut.toFixed(2)), // Now only gasoline + diesel
    totalAjuste: parseFloat(totalAjuste.toFixed(2))
  };
};

// Calculer totaux vendeurs (no propane in vendeur totals)
export const calculerTotauxVendeurs = (vendeurs, toutesDonnees, tousDepots, prix, tauxUSD = 132) => {
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

          if (donnees.typeCarburant.includes('Gasoline')) {
            totauxVendeurs[shiftKey][vendeur].gallonsGasoline += gallons;
            totauxVendeurs[shiftKey][vendeur].ventesGasoline += gallons * prix.gasoline;
          } else if (donnees.typeCarburant === 'Diesel') {
            totauxVendeurs[shiftKey][vendeur].gallonsDiesel += gallons;
            totauxVendeurs[shiftKey][vendeur].ventesDiesel += gallons * prix.diesel;
          }
        });

        // Mettre à jour les totaux
        updateVendeurTotals(totauxVendeurs[shiftKey][vendeur]);

        // Calculer dépôts
        updateDepotsForVendeur(totauxVendeurs, shiftKey, vendeur, tousDepots, tauxUSD);
      }
    });
  });

  return totauxVendeurs;
};

// Mettre à jour les totaux du vendeur
const updateVendeurTotals = (donneesVendeur) => {
  donneesVendeur.gallonsGasoline = parseFloat(donneesVendeur.gallonsGasoline.toFixed(3));
  donneesVendeur.gallonsDiesel = parseFloat(donneesVendeur.gallonsDiesel.toFixed(3));
  donneesVendeur.ventesGasoline = parseFloat(donneesVendeur.ventesGasoline.toFixed(2));
  donneesVendeur.ventesDiesel = parseFloat(donneesVendeur.ventesDiesel.toFixed(2));
  donneesVendeur.ventesTotales = parseFloat((donneesVendeur.ventesGasoline + donneesVendeur.ventesDiesel).toFixed(2));
};

// FIXED: Mettre à jour les dépôts du vendeur
const updateDepotsForVendeur = (totauxVendeurs, shiftKey, vendeur, tousDepots, tauxUSD = 132) => {
  const depots = (tousDepots[shiftKey]?.[vendeur] || []);
  const depotsValides = depots.filter(depot => {
    if (!depot) return false;
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        return depot.montant !== '' && depot.montant !== null && depot.montant !== undefined;
      } else {
        // Check for HTG deposit object with 'value' property
        return depot.value !== '' && depot.value !== null && depot.value !== undefined;
      }
    }
    // Old simple HTG deposit (string/number)
    return depot !== '' && depot !== null && depot !== undefined;
  });

  // Calculate total deposits in HTG
  const totalDepot = depotsValides.reduce((sum, depot) => {
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        // Convert USD to HTG
        const montantUSD = parseFloat(depot.montant) || 0;
        return sum + (montantUSD * tauxUSD);
      } else {
        // HTG deposit object with 'value' property
        const montantHTG = parseFloat(depot.value) || 0;
        return sum + montantHTG;
      }
    } else {
      // Old simple HTG deposit (string/number)
      return sum + (parseFloat(depot) || 0);
    }
  }, 0);

  // Store deposit details for display
  const depotsDetails = depotsValides.map(depot => {
    if (typeof depot === 'object') {
      if (depot.devise === 'USD') {
        return {
          montant: parseFloat(depot.montant) || 0,
          devise: 'USD',
          montantHTG: (parseFloat(depot.montant) || 0) * tauxUSD
        };
      } else {
        // HTG deposit object
        return {
          montant: parseFloat(depot.value) || 0,
          devise: 'HTG',
          montantHTG: parseFloat(depot.value) || 0
        };
      }
    } else {
      // Old simple HTG deposit
      return {
        montant: parseFloat(depot) || 0,
        devise: 'HTG',
        montantHTG: parseFloat(depot) || 0
      };
    }
  });

  const donneesVendeur = totauxVendeurs[shiftKey][vendeur];
  donneesVendeur.depot = parseFloat(totalDepot.toFixed(2));
  donneesVendeur.depots = depotsDetails;
  donneesVendeur.especesAttendues = parseFloat((donneesVendeur.ventesTotales - donneesVendeur.depot).toFixed(2));
};

// Helper functions
const getEmptyTotals = () => ({
  totalGallonsGasoline: 0,
  totalGallonsDiesel: 0,
  propaneGallons: 0,
  totalVentesGasoline: 0,
  totalVentesDiesel: 0,
  propaneVentes: 0,
  totalUSD: 0,
  totalHTGenUSD: 0,
  totalBrut: 0,
  totalAjuste: 0
});

const getEmptyVendeurData = () => ({
  gallonsGasoline: 0,
  gallonsDiesel: 0,
  ventesGasoline: 0,
  ventesDiesel: 0,
  ventesTotales: 0,
  depot: 0,
  depots: [],
  especesAttendues: 0
});
