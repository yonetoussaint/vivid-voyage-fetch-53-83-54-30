
// Helper function to add apostrophe separators for thousands
const ajouterApostrophes = (str) => {
  // Remove any existing separators first
  const cleanStr = str.replace(/[',]/g, '');

  // Add apostrophe separators for thousands
  return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Helper function to format decimal numbers with 2 decimal places
const formaterDecimal = (num, decimalPlaces = 2) => {
  if (num === null || num === undefined || isNaN(num)) return `0.${'0'.repeat(decimalPlaces)}`;
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return `0.${'0'.repeat(decimalPlaces)}`;

  return nombre.toFixed(decimalPlaces);
};

// Formater nombre avec 3 décimales pour gallons
export const formaterGallons = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.000';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.000';

  // Format with 3 decimal places
  const formatted = nombre.toFixed(3);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);

  return `${formattedInteger}.${decimalPart}`;
};

// Formater nombre avec 2 décimales pour argent
export const formaterArgent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.00';

  // Format with 2 decimal places
  const formatted = nombre.toFixed(2);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);

  return `${formattedInteger}.${decimalPart}`;
};

// Format avec apostrophes pour les grands nombres
export const formaterNombre = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // Arrondir à l'entier le plus proche
  const rounded = Math.round(nombre);

  // Add apostrophe separators for thousands
  return ajouterApostrophes(rounded.toString());
};

// Formater pour la caisse - arrondir au multiple de 5 le plus proche
// Formater pour la caisse - arrondir selon la règle: 1-5→5, 6-9→10
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(nombre)) return '0';

  // Récupérer le dernier chiffre
  const dernierChiffre = Math.abs(nombre) % 10;

  let rounded;

  if (dernierChiffre >= 1 && dernierChiffre <= 5) {
    // Pour 1-5: arrondir à 5
    // Ex: 1,2,3,4,5 → 5
    // Ex: 11,12,13,14,15 → 15
    // Ex: 21,22,23,24,25 → 25
    rounded = Math.floor(nombre / 10) * 10 + 5;
  } else if (dernierChiffre >= 6 && dernierChiffre <= 9 || dernierChiffre === 0) {
    // Pour 6-9: arrondir à 10 (dizaine suivante)
    // Pour 0: garder la dizaine actuelle
    // Ex: 6,7,8,9 → 10
    // Ex: 16,17,18,19 → 20
    // Ex: 10,20,30 → 10,20,30 (pas de changement)
    rounded = Math.ceil(nombre / 10) * 10;
  } else {
    // Cas par défaut (ne devrait pas arriver)
    rounded = Math.round(nombre / 5) * 5;
  }

  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);

  // Ajouter des apostrophes pour les milliers
  return ajouterApostrophes(result.toString());
};

// Alternative: arrondir TOUJOURS AU PLUS HAUT à la dizaine la plus proche
export const formaterCaisseDizaine = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(nombre)) return '0';

  // TOUJOURS arrondir AU PLUS HAUT à la dizaine la plus proche
  const rounded = Math.ceil(nombre / 10) * 10;

  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);

  // Ajouter des apostrophes pour les milliers
  return ajouterApostrophes(result.toString());
};

// Formater pour affichage caisse avec symbole HTG
export const formaterCaisseHTG = (num) => {
  const valeur = formaterCaisse(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG et apostrophes
export const formaterArgentHTG = (num) => {
  const valeur = formaterArgent(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG (sans décimales)
export const formaterArgentHTGSansDecimales = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0 HTG';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0 HTG';

  // Arrondir à l'entier le plus proche
  const rounded = Math.round(nombre);

  // Add apostrophe separators for thousands
  const formatted = ajouterApostrophes(rounded.toString());

  return `${formatted} HTG`;
};