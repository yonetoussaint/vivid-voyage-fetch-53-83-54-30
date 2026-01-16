import { useState, useEffect, useCallback } from 'react';
import { calculerTotaux, calculerTotauxVendeurs } from '@/utils/calculations';
import { initialiserDonnees } from '@/utils/dataInitializers';

export const useStationData = (date, shift) => {
  // États pour toutes les données
  const [toutesDonnees, setToutesDonnees] = useState(() => initialiserDonnees(date, 'pompes'));
  const [propaneDonnees, setPropaneDonnees] = useState(() => initialiserDonnees(date, 'propane'));
  const [vendeurs, setVendeurs] = useState(() => initialiserDonnees(date, 'vendeurs'));
  const [tousDepots, setTousDepots] = useState(() => initialiserDonnees(date, 'depots'));
  const [ventesUSD, setVentesUSD] = useState(() => initialiserDonnees(date, 'usd'));
  const [nouveauVendeur, setNouveauVendeur] = useState('');

  // Sauvegarder dans localStorage quand données changent
  useEffect(() => {
    const cleStockage = `donneesStationService_${date}`;
    localStorage.setItem(cleStockage, JSON.stringify(toutesDonnees));

    const clePropane = `propaneDonnees_${date}`;
    localStorage.setItem(clePropane, JSON.stringify(propaneDonnees));

    const cleDepots = `depotsStationService_${date}`;
    localStorage.setItem(cleDepots, JSON.stringify(tousDepots));

    const cleUSD = `ventesUSD_${date}`;
    localStorage.setItem(cleUSD, JSON.stringify(ventesUSD));

    localStorage.setItem('vendeursStationService', JSON.stringify(vendeurs));
  }, [toutesDonnees, propaneDonnees, tousDepots, ventesUSD, vendeurs, date]);

  // Initialiser nouvelles données quand date change
  useEffect(() => {
    setToutesDonnees(initialiserDonnees(date, 'pompes'));
    setPropaneDonnees(initialiserDonnees(date, 'propane'));
    setTousDepots(initialiserDonnees(date, 'depots'));
    setVentesUSD(initialiserDonnees(date, 'usd'));
  }, [date]);

  // Parser l'input gallons pour max 3 décimales
  const parserInputGallons = (valeur) => {
    if (!valeur && valeur !== 0) return '';

    // Convert to string if it's a number
    const valeurStr = String(valeur);

    // Remove non-numeric characters except decimal point and minus sign
    const valeurPropre = valeurStr.replace(/[^\d.-]/g, '');

    // Handle empty result
    if (valeurPropre === '' || valeurPropre === '-') return valeurPropre;

    const parties = valeurPropre.split('.');

    // If there are multiple decimal points, keep only the first one
    if (parties.length > 2) {
      return parties[0] + '.' + parties.slice(1).join('');
    }

    // Limit to 3 decimal places
    if (parties[1] && parties[1].length > 3) {
      return parties[0] + '.' + parties[1].substring(0, 3);
    }

    return valeurPropre;
  };

  // Fonction pour compter les affectations de pompes pour un vendeur
  const getNombreAffectations = useCallback((nomVendeur) => {
    let count = 0;
    ['AM', 'PM'].forEach(shiftKey => {
      Object.values(toutesDonnees[shiftKey] || {}).forEach(donneesPompe => {
        if (donneesPompe._vendeur === nomVendeur) {
          count++;
        }
      });
      // Also count propane assignments
      if (propaneDonnees[shiftKey] && propaneDonnees[shiftKey]._vendeur === nomVendeur) {
        count++;
      }
    });
    return count;
  }, [toutesDonnees, propaneDonnees]);

  // Calculer gallons
  const calculerGallons = useCallback((debut, fin) => {
    const d = parseFloat(debut) || 0;
    const f = parseFloat(fin) || 0;
    return parseFloat((f - d).toFixed(3));
  }, []);

  // Fonctions de mise à jour
  const mettreAJourLecture = useCallback((pompe, pistolet, champ, valeur) => {
    const valeurParse = parserInputGallons(valeur);

    setToutesDonnees(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [pompe]: {
          ...prev[shift][pompe],
          [pistolet]: {
            ...prev[shift][pompe][pistolet],
            [champ]: valeurParse
          }
        }
      }
    }));
  }, [shift]);

  const mettreAJourPropane = useCallback((champ, valeur) => {
    const valeurParse = parserInputGallons(valeur);

    setPropaneDonnees(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [champ]: valeurParse
      }
    }));
  }, [shift]);

  // UPDATED: Handle both pump and propane vendeur assignment
  const mettreAJourAffectationVendeur = useCallback((pompe, nomVendeur) => {
    if (pompe === 'propane') {
      // Handle propane vendeur assignment
      setPropaneDonnees(prev => ({
        ...prev,
        [shift]: {
          ...prev[shift],
          _vendeur: nomVendeur
        }
      }));
    } else {
      // Original logic for pumps
      setToutesDonnees(prev => ({
        ...prev,
        [shift]: {
          ...prev[shift],
          [pompe]: {
            ...prev[shift][pompe],
            _vendeur: nomVendeur
          }
        }
      }));
    }
  }, [shift]);

  // FIXED: Handle both HTG and USD deposits with all properties
const mettreAJourDepot = useCallback((nomVendeur, index, valeur) => {
  setTousDepots(prev => {
    const nouveauxDepots = { ...prev };
    if (!nouveauxDepots[shift][nomVendeur]) {
      nouveauxDepots[shift][nomVendeur] = [];
    }

    // Handle the different types of deposits
    if (typeof valeur === 'object') {
      if (valeur.devise === 'USD') {
        // For USD deposits - preserve all properties
        nouveauxDepots[shift][nomVendeur][index] = {
          ...valeur,
          montant: valeur.montant === '' ? '' : parseFloat(valeur.montant) || 0
        };
      } else {
        // For HTG deposit objects with breakdown and sequences
        const hasValue = 'value' in valeur;
        nouveauxDepots[shift][nomVendeur][index] = {
          ...valeur,
          ...(hasValue && { value: valeur.value === '' ? '' : parseFloat(valeur.value) || 0 })
        };
      }
    } else {
      // For simple HTG deposits (string/number)
      nouveauxDepots[shift][nomVendeur][index] = valeur === '' ? '' : parseFloat(valeur) || 0;
    }

    return nouveauxDepots;
  });
}, [shift]);

  // FIXED: Add deposit with currency type
  const ajouterDepot = useCallback((nomVendeur, typeDevise = 'HTG') => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (!nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = [];
      }

      // Add empty deposit based on currency type
      if (typeDevise === 'USD') {
        nouveauxDepots[shift][nomVendeur].push({
          montant: '',
          devise: 'USD'
        });
      } else {
        nouveauxDepots[shift][nomVendeur].push('');
      }

      return nouveauxDepots;
    });
  }, [shift]);

  const supprimerDepot = useCallback((nomVendeur, index) => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = nouveauxDepots[shift][nomVendeur].filter((_, i) => i !== index);
        if (nouveauxDepots[shift][nomVendeur].length === 0) {
          delete nouveauxDepots[shift][nomVendeur];
        }
      }
      return nouveauxDepots;
    });
  }, [shift]);

  // Gestion USD
  const ajouterUSD = useCallback(() => {
    setVentesUSD(prev => ({
      ...prev,
      [shift]: [...(prev[shift] || []), '']
    }));
  }, [shift]);

  const mettreAJourUSD = useCallback((index, valeur) => {
    setVentesUSD(prev => ({
      ...prev,
      [shift]: prev[shift].map((usd, i) => i === index ? (valeur === '' ? '' : parseFloat(valeur) || 0) : usd)
    }));
  }, [shift]);

  const supprimerUSD = useCallback((index) => {
    setVentesUSD(prev => ({
      ...prev,
      [shift]: prev[shift].filter((_, i) => i !== index)
    }));
  }, [shift]);

  // Gestion Vendeurs
  const ajouterVendeur = useCallback(() => {
    if (nouveauVendeur.trim() && !vendeurs.includes(nouveauVendeur.trim())) {
      setVendeurs(prev => [...prev, nouveauVendeur.trim()]);
      setNouveauVendeur('');
    }
  }, [nouveauVendeur, vendeurs]);

  const supprimerVendeur = useCallback((nomVendeur) => {
    if (window.confirm(`Supprimer vendeur "${nomVendeur}"? Cela supprimera aussi ses affectations aux pompes.`)) {
      setVendeurs(prev => prev.filter(v => v !== nomVendeur));

      // Retirer vendeur de toutes les pompes
      const donneesMAJ = { ...toutesDonnees };
      Object.keys(donneesMAJ).forEach(shiftKey => {
        Object.keys(donneesMAJ[shiftKey]).forEach(pompe => {
          if (donneesMAJ[shiftKey][pompe]._vendeur === nomVendeur) {
            donneesMAJ[shiftKey][pompe]._vendeur = '';
          }
        });
      });
      setToutesDonnees(donneesMAJ);

      // Retirer vendeur du propane
      const propaneMAJ = { ...propaneDonnees };
      Object.keys(propaneMAJ).forEach(shiftKey => {
        if (propaneMAJ[shiftKey] && propaneMAJ[shiftKey]._vendeur === nomVendeur) {
          propaneMAJ[shiftKey]._vendeur = '';
        }
      });
      setPropaneDonnees(propaneMAJ);

      // Retirer dépôts du vendeur
      const depotsMAJ = { ...tousDepots };
      Object.keys(depotsMAJ).forEach(shiftKey => {
        if (depotsMAJ[shiftKey][nomVendeur]) {
          delete depotsMAJ[shiftKey][nomVendeur];
        }
      });
      setTousDepots(depotsMAJ);
    }
  }, [toutesDonnees, propaneDonnees, tousDepots]);

  // Fonctions de réinitialisation
  const reinitialiserShift = useCallback((currentShift) => {
    if (window.confirm(`Voulez-vous vraiment réinitialiser les données du shift ${currentShift}?`)) {
      setToutesDonnees(prev => ({
        ...prev,
        [currentShift]: initialiserDonnees(date, 'pompes')[currentShift]
      }));
      setPropaneDonnees(prev => ({
        ...prev,
        [currentShift]: initialiserDonnees(date, 'propane')[currentShift]
      }));
      setTousDepots(prev => ({
        ...prev,
        [currentShift]: {}
      }));
      setVentesUSD(prev => ({
        ...prev,
        [currentShift]: []
      }));
    }
  }, [date]);

  const reinitialiserJour = useCallback(() => {
    if (window.confirm('Voulez-vous vraiment réinitialiser TOUTES les données pour aujourd\'hui?')) {
      setToutesDonnees(initialiserDonnees(date, 'pompes'));
      setPropaneDonnees(initialiserDonnees(date, 'propane'));
      setTousDepots(initialiserDonnees(date, 'depots'));
      setVentesUSD(initialiserDonnees(date, 'usd'));
    }
  }, [date]);

  // Constantes pour calculs
  const prix = { essence: 600, diesel: 650 };
  const tauxUSD = 132;
  const prixPropane = 450;

  // Obtenir les lectures du shift courant
  const obtenirLecturesCourantes = useCallback(() => {
    return toutesDonnees[shift] || {};
  }, [toutesDonnees, shift]);

  // Calculer totaux courants
  const totaux = calculerTotaux(
    toutesDonnees[shift], 
    propaneDonnees[shift], 
    ventesUSD[shift], 
    prix, 
    tauxUSD, 
    prixPropane
  );

  // FIXED: Pass tauxUSD to calculerTotauxVendeurs function
  const totauxVendeurs = calculerTotauxVendeurs(vendeurs, toutesDonnees, tousDepots, prix, tauxUSD);
  const totauxVendeursCourants = totauxVendeurs[shift];

  // Calculer totaux par shift
  const totauxAM = calculerTotaux(
    toutesDonnees.AM, 
    propaneDonnees.AM, 
    ventesUSD.AM, 
    prix, 
    tauxUSD, 
    prixPropane
  );

  const totauxPM = calculerTotaux(
    toutesDonnees.PM, 
    propaneDonnees.PM, 
    ventesUSD.PM, 
    prix, 
    tauxUSD, 
    prixPropane
  );

  // Calculer totaux quotidiens
  const totauxQuotidiens = {
    gallonsEssence: parseFloat((totauxAM.totalGallonsEssence + totauxPM.totalGallonsEssence).toFixed(3)),
    gallonsDiesel: parseFloat((totauxAM.totalGallonsDiesel + totauxPM.totalGallonsDiesel).toFixed(3)),
    propaneGallons: parseFloat((totauxAM.propaneGallons + totauxPM.propaneGallons).toFixed(3)),
    ventesEssence: parseFloat((totauxAM.totalVentesEssence + totauxPM.totalVentesEssence).toFixed(2)),
    ventesDiesel: parseFloat((totauxAM.totalVentesDiesel + totauxPM.totalVentesDiesel).toFixed(2)),
    propaneVentes: parseFloat((totauxAM.propaneVentes + totauxPM.propaneVentes).toFixed(2)),
    totalUSD: parseFloat((totauxAM.totalUSD + totauxPM.totalUSD).toFixed(2)),
    totalHTGenUSD: parseFloat((totauxAM.totalHTGenUSD + totauxPM.totalHTGenUSD).toFixed(2)),
  };

  // Total brut WITHOUT propane
  totauxQuotidiens.totalBrut = parseFloat((
    totauxQuotidiens.ventesEssence + 
    totauxQuotidiens.ventesDiesel 
  ).toFixed(2));

  // Total ajusté WITHOUT propane
  totauxQuotidiens.totalAjuste = parseFloat((
    totauxQuotidiens.totalBrut - 
    totauxQuotidiens.totalHTGenUSD
  ).toFixed(2));

  return {
    // États
    toutesDonnees,
    propaneDonnees,
    vendeurs,
    tousDepots,
    ventesUSD,
    nouveauVendeur,

    // Setters
    setNouveauVendeur,

    // Fonctions
    reinitialiserShift,
    reinitialiserJour,
    ajouterVendeur,
    supprimerVendeur,
    mettreAJourLecture,
    mettreAJourAffectationVendeur,
    mettreAJourPropane,
    mettreAJourDepot,
    ajouterDepot,
    supprimerDepot,
    ajouterUSD,
    mettreAJourUSD,
    supprimerUSD,
    getNombreAffectations,
    calculerGallons,
    obtenirLecturesCourantes,

    // Calculs
    totaux,
    totauxVendeurs,
    totauxVendeursCourants,
    totauxAM,
    totauxPM,
    totauxQuotidiens,

    // Constantes
    prix,
    tauxUSD,
    prixPropane
  };
};