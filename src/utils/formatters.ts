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
  return isNaN(nombre) ? '0.00' : nombre.toFixed(2);
};

// Arrondir à la dizaine la plus proche (56.87 → 56.90, 67 → 70)
export const arrondirDizaine = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0.00';
  
  // Arrondir à 2 décimales d'abord
  const arrondi2 = Math.round(nombre * 100) / 100;
  
  // Arrondir à la dizaine (centime) supérieure
  const arrondiDizaine = Math.ceil(arrondi2 * 10) / 10;
  
  return arrondiDizaine.toFixed(2);
};

// Arrondir pour l'affichage (pour totaux ajustés)
export const formaterArrondiCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0.00';
  
  // Arrondir à 2 décimales d'abord
  const arrondi2 = Math.round(nombre * 100) / 100;
  
  // Arrondir à la dizaine (centime) supérieure
  const arrondiDizaine = Math.ceil(arrondi2 * 10) / 10;
  
  // Formater avec 2 décimales
  return arrondiDizaine.toFixed(2);
};

// Formater pour affichage caisse (avec arrondi)
export const formaterCaisse = (num) => {
  return formaterArrondiCaisse(num);
};