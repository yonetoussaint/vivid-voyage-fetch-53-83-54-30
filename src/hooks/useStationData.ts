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
    if (!valeur) return '';
    const valeurPropre = valeur.replace(/[^\d.]/g, '');
    const parties = valeurPropre.split('.');
    if (parties.length > 2) {
      return parties[0] + '.' + parties.slice(1).join('');
    }
    if (parties[1] && parties[1].length > 3) {
      return parties[0] + '.' + parties[1].substring(0, 3);
    }
    return valeurPropre;
  };

  // Calculer gallons
  const calculerGallons = useCallback((debut, fin) => {
    const d = parseFloat(debut) || 0;
    const f = parseFloat(fin) || 0;
    return parseFloat((f - d).toFixed(3));
  }, []);

  // Fonction pour compter les affectations de pompes pour un vendeur
  const getNombreAffectations = useCallback((nomVendeur) => {
    let count = 0;
    ['AM', 'PM'].forEach(shiftKey => {
      Object.values(toutesDonnees[shiftKey] || {}).forEach(donneesPompe => {
        if (donneesPompe._vendeur === nomVendeur) {
          count++;
        }
      });
    });
    return count;
  }, [toutesDonnees]);

  // Fonctions de mise à jour
  const mettreAJourLecture = useCallback((pompe, pistolet, champ, valeur) => {
    const valeurParse = champ === 'debut' || champ === 'fin' ? parserInputGallons(valeur) : valeur;

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

  const mettreAJourAffectationVendeur = useCallback((pompe, nomVendeur) => {
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
  }, [shift]);

  const mettreAJourDepot = useCallback((nomVendeur, index, valeur) => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (!nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = [];
      }
      nouveauxDepots[shift][nomVendeur][index] = valeur === '' ? '' : parseFloat(valeur) || 0;
      return nouveauxDepots;
    });
  }, [shift]);

  const ajouterDepot = useCallback((nomVendeur) => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (!nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = [];
      }
      nouveauxDepots[shift][nomVendeur].push('');
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

      // Retirer dépôts du vendeur
      const depotsMAJ = { ...tousDepots };
      Object.keys(depotsMAJ).forEach(shiftKey => {
        if (depotsMAJ[shiftKey][nomVendeur]) {
          delete depotsMAJ[shiftKey][nomVendeur];
        }
      });
      setTousDepots(depotsMAJ);
    }
  }, [toutesDonnees, tousDepots]);

  // Fonctions de réinitialisation
  const reinitialiserShift = useCallback((currentShift) => {
    if (window.confirm(`Voulez-vous vraiment réinitialiser les données du shift ${currentShift}?`)) {
      setToutesDonnees(prev => ({
        ...prev,
        [currentShift]: initialiserDonnees(date, 'pompes')
      }));
      setPropaneDonnees(prev => ({
        ...prev,
        [currentShift]: initialiserDonnees(date, 'propane')
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

  // Calculs
  const prix = { essence: 600, diesel: 650 };
  const tauxUSD = 132;
  const prixPropane = 450;

  // Calculer totaux courants
  const totaux = calculerTotaux(
    toutesDonnees[shift], 
    propaneDonnees[shift], 
    ventesUSD[shift], 
    prix, 
    tauxUSD, 
    prixPropane
  );

  // Calculer totaux vendeurs
  const totauxVendeurs = calculerTotauxVendeurs(vendeurs, toutesDonnees, tousDepots, prix);
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
  
  totauxQuotidiens.totalBrut = parseFloat((
    totauxQuotidiens.ventesEssence + 
    totauxQuotidiens.ventesDiesel + 
    totauxQuotidiens.propaneVentes
  ).toFixed(2));
  
  totauxQuotidiens.totalAjuste = parseFloat((
    totauxQuotidiens.totalBrut - 
    totauxQuotidiens.totalHTGenUSD
  ).toFixed(2));

  // Obtenir les lectures du shift courant
  const obtenirLecturesCourantes = useCallback(() => {
    return toutesDonnees[shift] || initialiserDonnees(date, 'pompes');
  }, [toutesDonnees, shift, date]);

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
    setToutesDonnees,
    setPropaneDonnees,
    setVendeurs,
    setTousDepots,
    setVentesUSD,
    
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