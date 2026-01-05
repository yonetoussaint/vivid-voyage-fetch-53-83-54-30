// Helper function to add apostrophe separators for thousands
const ajouterApostrophes = (str) => {
  // Remove any existing separators first
  const cleanStr = str.replace(/[',]/g, '');

  // Add apostrophe separators for thousands
  return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Helper function to format decimal numbers, removing trailing zeros after 3 decimal places
const formaterDecimal = (num, maxDecimalPlaces = 3) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // Convert to string with enough decimal places
  const str = nombre.toFixed(maxDecimalPlaces);
  
  // Remove trailing zeros and the decimal point if all zeros
  return str.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
};

// Formater nombre pour gallons - 3 décimales mais on enlève les zéros à la fin
export const formaterGallons = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // Format with max 3 decimal places
  const str = nombre.toFixed(3);
  
  // Remove trailing zeros and the decimal point if all zeros
  const formattedDecimal = str.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  
  // Split into parts
  const parts = formattedDecimal.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';
  
  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);
  
  // Return with decimal part only if it exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

// Formater nombre pour argent - 2 décimales mais on enlève les zéros à la fin
export const formaterArgent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // Format with max 2 decimal places
  const str = nombre.toFixed(2);
  
  // Remove trailing zeros and the decimal point if all zeros
  const formattedDecimal = str.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  
  // Split into parts
  const parts = formattedDecimal.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';
  
  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);
  
  // Return with decimal part only if it exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

// Format avec apostrophes pour les grands nombres (pas de décimales)
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
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(nombre)) return '0';

  // Arrondir au multiple de 5 le plus proche (peut être positif ou négatif)
  const rounded = Math.round(nombre / 5) * 5;

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

// Exemples d'utilisation et résultats attendus:
console.log(formaterGallons(1234.567)); // "1'234.567"
console.log(formaterGallons(1234.000)); // "1'234" (pas de .000)
console.log(formaterGallons(1234.500)); // "1'234.5" (pas de .500)
console.log(formaterGallons(1234.050)); // "1'234.05" (pas de .050)

console.log(formaterArgent(1234.50));  // "1'234.5"
console.log(formaterArgent(1234.00));  // "1'234" (pas de .00)
console.log(formaterArgent(1234.30));  // "1'234.3"
console.log(formaterArgent(1234.03));  // "1'234.03"