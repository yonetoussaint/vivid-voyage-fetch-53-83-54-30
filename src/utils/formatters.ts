// Formater pour la caisse - toujours arrondir AU PLUS HAUT au multiple de 5 AVEC apostrophes
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0';
  
  // TOUJOURS arrondir AU PLUS HAUT au multiple de 5
  const rounded = Math.ceil(nombre / 5) * 5;
  
  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);
  
  // Ajouter des apostrophes pour les milliers (toujours pour les milliers)
  return ajouterApostrophes(result.toString());
};

// Formater nombre avec 2 décimales pour argent AVEC apostrophes
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

// Helper function to add apostrophe separators for thousands
const ajouterApostrophes = (str) => {
  // Remove any existing separators first
  const cleanStr = str.replace(/[',]/g, '');
  
  // Add apostrophe separators for thousands
  return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// For gallons (3 decimal places)
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