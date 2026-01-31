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
    'Gasoline 1': 'bg-emerald-100 border-emerald-400',
    'Gasoline 2': 'bg-sky-100 border-sky-400',
    'Gasoline': 'bg-purple-100 border-purple-400'
  };
  return couleurs[typeCarburant] || 'bg-gray-100 border-gray-400';
};

// Obtenir couleur badge
export const getCouleurBadge = (typeCarburant) => {
  const couleurs = {
    'Diesel': 'bg-amber-500',
    'Gasoline 1': 'bg-emerald-500',
    'Gasoline 2': 'bg-sky-500',
    'Gasoline': 'bg-purple-500'
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

  let gallonsGasoline = 0;
  let gallonsDiesel = 0;
  let ventesGasoline = 0;
  let ventesDiesel = 0;

  Object.entries(donneesPompe).forEach(([key, donnees]) => {
    if (key === '_vendeur') return;

    const gallons = calculerGallons(donnees.debut, donnees.fin);

    if (donnees.typeCarburant.includes('Gasoline')) {
      gallonsGasoline += gallons;
      ventesGasoline += gallons * prix.gasoline;
    } else if (donnees.typeCarburant === 'Diesel') {
      gallonsDiesel += gallons;
      ventesDiesel += gallons * prix.diesel;
    }
  });

  return {
    gallonsGasoline: parseFloat(gallonsGasoline.toFixed(3)),
    gallonsDiesel: parseFloat(gallonsDiesel.toFixed(3)),
    ventesGasoline: parseFloat(ventesGasoline.toFixed(2)),
    ventesDiesel: parseFloat(ventesDiesel.toFixed(2)),
    totalGallons: parseFloat((gallonsGasoline + gallonsDiesel).toFixed(3)),
    ventesTotales: parseFloat((ventesGasoline + ventesDiesel).toFixed(2))
  };
};
