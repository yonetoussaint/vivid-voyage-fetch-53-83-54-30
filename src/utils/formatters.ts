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

// Formater pour la caisse - arrondi à 0 ou 5, pas de décimales
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0';
  
  // Arrondir au multiple de 5 le plus proche
  const rounded = Math.round(nombre / 5) * 5;
  
  // S'assurer que c'est un entier (pas de décimales)
  return Math.round(rounded).toString();
};

// Alternative: arrondir à la dizaine la plus proche
export const formaterCaisseDizaine = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(nombre)) return '0';
  
  // Arrondir à la dizaine la plus proche
  const rounded = Math.round(nombre / 10) * 10;
  
  // S'assurer que c'est un entier (pas de décimales)
  return Math.round(rounded).toString();
};

// Formater pour affichage caisse avec symbole HTG
export const formaterCaisseHTG = (num) => {
  const valeur = formaterCaisse(num);
  return `${valeur} HTG`;
};