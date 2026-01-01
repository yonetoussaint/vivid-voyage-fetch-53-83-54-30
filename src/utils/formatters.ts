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