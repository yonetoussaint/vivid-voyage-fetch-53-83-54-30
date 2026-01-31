// Initialiser la structure des lectures de pompes
export const initialiserLecturesPompes = () => {
  const pompes = {};

  // Pompes 1-4: 6 pistolets
  for (let p = 1; p <= 4; p++) {
    pompes[`P${p}`] = {
      _vendeur: '',
      pistolet1: { typeCarburant: 'Gasoline 1', debut: '', fin: '' },
      pistolet2: { typeCarburant: 'Gasoline 2', debut: '', fin: '' },
      pistolet3: { typeCarburant: 'Diesel', debut: '', fin: '' },
      pistolet4: { typeCarburant: 'Gasoline 1', debut: '', fin: '' },
      pistolet5: { typeCarburant: 'Gasoline 2', debut: '', fin: '' },
      pistolet6: { typeCarburant: 'Diesel', debut: '', fin: '' }
    };
  }

  // Pompe 5: Seulement 1 pistolet
  pompes['P5'] = {
    _vendeur: '',
    pistolet1: { typeCarburant: 'Gasoline', debut: '', fin: '' }
  };

  return pompes;
};

// Initialiser les données propane
export const initialiserDonneesPropane = () => ({
  debut: '',
  fin: '',
  _vendeur: ''
});

// Fonction générale d'initialisation
export const initialiserDonnees = (date, type) => {
  const cleStockage = getStorageKey(date, type);
  const donneesSauvegardees = localStorage.getItem(cleStockage);

  if (donneesSauvegardees) {
    try {
      const parse = JSON.parse(donneesSauvegardees);
      return parse;
    } catch (e) {
      console.error(`Erreur parsing données ${type}:`, e);
    }
  }

  return getDefaultData(type);
};

// Obtenir la clé de stockage
const getStorageKey = (date, type) => {
  const keys = {
    pompes: `donneesStationService_${date}`,
    propane: `propaneDonnees_${date}`,
    depots: `depotsStationService_${date}`,
    usd: `ventesUSD_${date}`,
    vendeurs: 'vendeursStationService'
  };
  return keys[type];
};

// Obtenir les données par défaut
const getDefaultData = (type) => {
  switch (type) {
    case 'pompes':
      return {
        AM: initialiserLecturesPompes(),
        PM: initialiserLecturesPompes()
      };
    case 'propane':
      return {
        AM: initialiserDonneesPropane(),
        PM: initialiserDonneesPropane()
      };
    case 'depots':
      return { AM: {}, PM: {} };
    case 'usd':
      return { AM: [], PM: [] };
    case 'vendeurs':
      return [];
    default:
      return null;
  }
};
