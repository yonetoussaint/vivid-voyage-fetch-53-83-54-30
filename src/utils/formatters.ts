// Helper function to add apostrophe separators for thousands
const ajouterApostrophes = (str) => {
  // Remove any existing separators first
  const cleanStr = str.replace(/[',]/g, '');

  // Add apostrophe separators for thousands
  return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Helper function to format decimal numbers with ALWAYS ROUND UP to specified decimal places
const formaterDecimal = (num, decimalPlaces = 2) => {
  if (num === null || num === undefined || isNaN(num)) return `0.${'0'.repeat(decimalPlaces)}`;
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return `0.${'0'.repeat(decimalPlaces)}`;

  // ALWAYS ROUND UP to specified decimal places
  const multiplier = Math.pow(10, decimalPlaces);
  const rounded = Math.ceil(nombre * multiplier) / multiplier;
  
  return rounded.toFixed(decimalPlaces);
};

// Formater nombre avec 3 décimales pour gallons - ALWAYS ROUND UP
export const formaterGallons = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.000';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.000';

  // ALWAYS ROUND UP to 3 decimal places
  const multiplier = 1000;
  const rounded = Math.ceil(nombre * multiplier) / multiplier;
  
  // Format with 3 decimal places
  const formatted = rounded.toFixed(3);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);

  return `${formattedInteger}.${decimalPart}`;
};

// Formater nombre avec 2 décimales pour argent - ALWAYS ROUND UP
export const formaterArgent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.00';

  // ALWAYS ROUND UP to 2 decimal places
  const multiplier = 100;
  const rounded = Math.ceil(nombre * multiplier) / multiplier;
  
  // Format with 2 decimal places
  const formatted = rounded.toFixed(2);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);

  return `${formattedInteger}.${decimalPart}`;
};

// Format avec apostrophes pour les grands nombres - ALWAYS ROUND UP
export const formaterNombre = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // ALWAYS ROUND UP to the nearest integer
  const rounded = Math.ceil(nombre);

  // Add apostrophe separators for thousands
  return ajouterApostrophes(rounded.toString());
};

// Formater pour la caisse - ALWAYS ROUND UP to the nearest 5
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(nombre)) return '0';

  // ALWAYS ROUND UP to the nearest 5
  const rounded = Math.ceil(nombre / 5) * 5;

  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);

  // Ajouter des apostrophes pour les milliers
  return ajouterApostrophes(result.toString());
};

// Formater pour la caisse - ALWAYS ROUND UP to the nearest 10
export const formaterCaisseDizaine = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(nombre)) return '0';

  // ALWAYS ROUND UP to the nearest 10
  const rounded = Math.ceil(nombre / 10) * 10;

  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);

  // Ajouter des apostrophes pour les milliers
  return ajouterApostrophes(result.toString());
};

// Formater pour la caisse - ALWAYS ROUND UP to the specified multiple
export const formaterArrondiSup = (num, multiple = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(nombre) || multiple <= 0) return '0';

  // ALWAYS ROUND UP to the specified multiple
  const rounded = Math.ceil(nombre / multiple) * multiple;

  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);

  // Ajouter des apostrophes pour les milliers
  return ajouterApostrophes(result.toString());
};

// Formater pour affichage caisse avec symbole HTG - ALWAYS ROUND UP
export const formaterCaisseHTG = (num) => {
  const valeur = formaterCaisse(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG et apostrophes - ALWAYS ROUND UP
export const formaterArgentHTG = (num) => {
  const valeur = formaterArgent(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG (sans décimales, ALWAYS ROUND UP)
export const formaterArgentHTGSansDecimales = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0 HTG';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0 HTG';

  // ALWAYS ROUND UP to the nearest integer
  const rounded = Math.ceil(nombre);

  // Add apostrophe separators for thousands
  const formatted = ajouterApostrophes(rounded.toString());

  return `${formatted} HTG`;
};

// Formater pour affichage caisse avec symbole HTG (ALWAYS ROUND UP to nearest 10)
export const formaterCaisseHTGDizaine = (num) => {
  const valeur = formaterCaisseDizaine(num);
  return `${valeur} HTG`;
};

// Version alternative qui arrondit vers le haut avec une précision spécifique
export const formaterArrondiDecimalSup = (num, decimalPlaces = 0) => {
  if (num === null || num === undefined || isNaN(num)) {
    if (decimalPlaces === 0) return '0';
    return `0.${'0'.repeat(decimalPlaces)}`;
  }
  
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) {
    if (decimalPlaces === 0) return '0';
    return `0.${'0'.repeat(decimalPlaces)}`;
  }

  if (decimalPlaces === 0) {
    // ALWAYS ROUND UP to nearest integer
    const rounded = Math.ceil(nombre);
    return ajouterApostrophes(rounded.toString());
  } else {
    // ALWAYS ROUND UP to specified decimal places
    const multiplier = Math.pow(10, decimalPlaces);
    const rounded = Math.ceil(nombre * multiplier) / multiplier;
    
    const formatted = rounded.toFixed(decimalPlaces);
    const parts = formatted.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const formattedInteger = ajouterApostrophes(integerPart);
    return `${formattedInteger}.${decimalPart}`;
  }
};

// Test examples showing ALWAYS ROUND UP behavior:
/*
formaterDecimal(19.002, 2) → "19.01" (ALWAYS rounds UP from 19.002 to 19.01)
formaterDecimal(19.999, 2) → "20.00" (ALWAYS rounds UP from 19.999 to 20.00)
formaterDecimal(20.000, 2) → "20.00" (20.00 stays 20.00)

formaterGallons(19.0002) → "19.001" (ALWAYS rounds UP to 3 decimal places)
formaterGallons(19.0009) → "19.001" (ALWAYS rounds UP to 3 decimal places)

formaterArgent(19.002) → "19.01" (ALWAYS rounds UP to 2 decimal places)
formaterArgent(19.999) → "20.00" (ALWAYS rounds UP to 2 decimal places)

formaterNombre(19.002) → "20" (ALWAYS rounds UP to nearest integer)
formaterNombre(19.999) → "20" (ALWAYS rounds UP to nearest integer)

formaterCaisse(19.002) → "20" (ALWAYS rounds UP to nearest 5)
formaterCaisse(19.999) → "20" (ALWAYS rounds UP to nearest 5)
formaterCaisse(20.001) → "25" (ALWAYS rounds UP to nearest 5)

formaterCaisseDizaine(19.002) → "20" (ALWAYS rounds UP to nearest 10)
formaterCaisseDizaine(11.001) → "20" (ALWAYS rounds UP to nearest 10)
formaterCaisseDizaine(20.001) → "30" (ALWAYS rounds UP to nearest 10)
*/