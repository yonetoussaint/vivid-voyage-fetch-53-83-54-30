// Formater nombre avec 3 décimales pour gallons
export const formaterGallons = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.000';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  return isNaN(nombre) ? '0.000' : nombre.toFixed(3);
};

// Formater nombre avec 2 décimales pour argent
export const formaterArgent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.00';
  
  // Format with apostrophe separators for thousands
  const formatted = nombre.toFixed(2);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Add apostrophe separators for thousands
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  
  return `${formattedInteger}.${decimalPart}`;
};

// Format avec apostrophes pour les grands nombres
export const formaterNombre = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';
  
  // Arrondir à l'entier le plus proche
  const rounded = Math.round(nombre);
  
  // Ajouter des apostrophes pour les milliers
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Formater pour la caisse - toujours arrondir AU PLUS HAUT au multiple de 5
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0';
  
  // TOUJOURS arrondir AU PLUS HAUT au multiple de 5
  const rounded = Math.ceil(nombre / 5) * 5;
  
  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);
  
  // Ajouter des apostrophes pour les milliers
  return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Alternative: arrondir AU PLUS HAUT à la dizaine la plus proche
export const formaterCaisseDizaine = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0';
  
  // TOUJOURS arrondir AU PLUS HAUT à la dizaine la plus proche
  const rounded = Math.ceil(nombre / 10) * 10;
  
  // S'assurer que c'est un entier (pas de décimales)
  const result = Math.round(rounded);
  
  // Ajouter des apostrophes pour les milliers
  return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Formater pour affichage caisse avec symbole HTG
export const formaterCaisseHTG = (num) => {
  const valeur = formaterCaisse(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG et apostrophes
export const formaterArgentHTG = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0 HTG';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0 HTG';
  
  // Format avec apostrophe separators pour les milliers
  const formatted = nombre.toFixed(2);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Add apostrophe separators for thousands
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  
  return `${formattedInteger}.${decimalPart} HTG`;
};

// Formater pour affichage caisse avec symbole HTG (sans décimales)
export const formaterArgentHTGSansDecimales = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0 HTG';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0 HTG';
  
  // Arrondir à l'entier le plus proche
  const rounded = Math.round(nombre);
  
  // Ajouter des apostrophes pour les milliers
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  
  return `${formatted} HTG`;
};