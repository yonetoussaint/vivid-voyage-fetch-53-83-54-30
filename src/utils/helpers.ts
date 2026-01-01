// Calculer gallons
export const calculerGallons = (debut, fin) => {
  const d = parseFloat(debut) || 0;
  const f = parseFloat(fin) || 0;
  return parseFloat((f - d).toFixed(3));
};

// Obtenir couleur pour carburant
export const getCouleurCarburant = (typeCarburant) => {
  const couleurs = {
    'Diesel': 'bg-amber-100 border-amber-400',
    'Essence 1': 'bg-emerald-100 border-emerald-400',
    'Essence 2': 'bg-sky-100 border-sky-400',
    'Essence': 'bg-purple-100 border-purple-400'
  };
  return couleurs[typeCarburant] || 'bg-gray-100 border-gray-400';
};

// Obtenir couleur badge
export const getCouleurBadge = (typeCarburant) => {
  const couleurs = {
    'Diesel': 'bg-amber-500',
    'Essence 1': 'bg-emerald-500',
    'Essence 2': 'bg-sky-500',
    'Essence': 'bg-purple-500'
  };
  return couleurs[typeCarburant] || 'bg-gray-500';
};

// Obtenir couleur pompe
export const getCouleurPompe = (numeroPompe) => {
  const couleurs = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-rose-500 to-rose-600'
  ];
  return couleurs[numeroPompe - 1] || couleurs[0];
};

// Calculer total pompe
export const calculerTotalPompe = (donneesPompe, prix) => {
  if (!donneesPompe) return null;

  let gallonsEssence = 0;
  let gallonsDiesel = 0;
  let ventesEssence = 0;
  let ventesDiesel = 0;

  Object.entries(donneesPompe).forEach(([key, donnees]) => {
    if (key === '_vendeur') return;

    const gallons = calculerGallons(donnees.debut, donnees.fin);

    if (donnees.typeCarburant.includes('Essence')) {
      gallonsEssence += gallons;
      ventesEssence += gallons * prix.essence;
    } else if (donnees.typeCarburant === 'Diesel') {
      gallonsDiesel += gallons;
      ventesDiesel += gallons * prix.diesel;
    }
  });

  return {
    gallonsEssence: parseFloat(gallonsEssence.toFixed(3)),
    gallonsDiesel: parseFloat(gallonsDiesel.toFixed(3)),
    ventesEssence: parseFloat(ventesEssence.toFixed(2)),
    ventesDiesel: parseFloat(ventesDiesel.toFixed(2)),
    totalGallons: parseFloat((gallonsEssence + gallonsDiesel).toFixed(3)),
    ventesTotales: parseFloat((ventesEssence + ventesDiesel).toFixed(2))
  };
};