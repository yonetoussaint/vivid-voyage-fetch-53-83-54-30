// Helper function to add apostrophe separators for thousands
const ajouterApostrophes = (str) => {
  // Remove any existing separators first
  const cleanStr = str.replace(/[',]/g, '');

  // Add apostrophe separators for thousands
  return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

// Helper function to apply the formaterCaisse logic to any number
const appliquerRegleCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 0;
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return 0;

  // Get integer part and last digit
  const entier = Math.floor(nombre);
  const dernierChiffre = Math.abs(entier) % 10;
  const hasDecimal = nombre > entier;

  let rounded;

  if (dernierChiffre >= 1 && dernierChiffre <= 5) {
    // 1-5: make it end with 5
    rounded = Math.floor(nombre / 10) * 10 + 5;
  } else if (dernierChiffre >= 6 && dernierChiffre <= 9) {
    // 6-9: round up to next ten
    rounded = Math.ceil(nombre / 10) * 10;
  } else {
    // Last digit is 0
    if (hasDecimal) {
      // Has decimal part: add 5
      rounded = nombre + 5;
    } else {
      // No decimal part: keep as is
      rounded = nombre;
    }
  }

  return rounded;
};

// Helper function to format decimal numbers with formaterCaisse logic
const formaterDecimalCaisse = (num, decimalPlaces = 2) => {
  if (num === null || num === undefined || isNaN(num)) return `0.${'0'.repeat(decimalPlaces)}`;
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return `0.${'0'.repeat(decimalPlaces)}`;

  // Apply the formaterCaisse rule
  const rounded = appliquerRegleCaisse(nombre);
  
  return rounded.toFixed(decimalPlaces);
};

// Formater nombre avec 3 décimales - using formaterCaisse logic
export const formaterGallons = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.000';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.000';

  // Apply the formaterCaisse rule
  const rounded = appliquerRegleCaisse(nombre);
  
  // Format with 3 decimal places
  const formatted = rounded.toFixed(3);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);

  return `${formattedInteger}.${decimalPart}`;
};

// Formater nombre avec 2 décimales - using formaterCaisse logic
export const formaterArgent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0.00';

  // Apply the formaterCaisse rule
  const rounded = appliquerRegleCaisse(nombre);
  
  // Format with 2 decimal places
  const formatted = rounded.toFixed(2);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add apostrophe separators for thousands
  const formattedInteger = ajouterApostrophes(integerPart);

  return `${formattedInteger}.${decimalPart}`;
};

// Format avec apostrophes - using formaterCaisse logic
export const formaterNombre = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // Apply the formaterCaisse rule
  const rounded = appliquerRegleCaisse(nombre);
  
  // Round to integer
  const result = Math.round(rounded);

  // Add apostrophe separators for thousands
  return ajouterApostrophes(result.toString());
};

// Original formaterCaisse logic - main reference
export const formaterCaisse = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const nombre = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(nombre)) return '0';

  // Apply the formaterCaisse rule
  const rounded = appliquerRegleCaisse(nombre);
  
  // Round to integer
  const result = Math.round(rounded);

  // Add apostrophe separators for thousands
  return ajouterApostrophes(result.toString());
};

// formaterCaisseDizaine now uses the SAME logic as formaterCaisse
export const formaterCaisseDizaine = (num) => {
  return formaterCaisse(num); // Same logic!
};

// Formater pour affichage caisse avec symbole HTG - using formaterCaisse logic
export const formaterCaisseHTG = (num) => {
  const valeur = formaterCaisse(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG et apostrophes - using formaterCaisse logic
export const formaterArgentHTG = (num) => {
  const valeur = formaterArgent(num);
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG (sans décimales) - using formaterCaisse logic
export const formaterArgentHTGSansDecimales = (num) => {
  const valeur = formaterNombre(num); // Uses formaterCaisse logic
  return `${valeur} HTG`;
};

// Formater pour affichage caisse avec symbole HTG - using formaterCaisse logic
export const formaterCaisseHTGDizaine = (num) => {
  const valeur = formaterCaisse(num); // Same logic!
  return `${valeur} HTG`;
};

// Test function to verify all formatters give same rounded result
export const testerFormatters = (num) => {
  const nombre = parseFloat(num);
  const rounded = appliquerRegleCaisse(nombre);
  
  return {
    original: nombre,
    roundedValue: rounded,
    formaterGallons: formaterGallons(num),
    formaterArgent: formaterArgent(num),
    formaterNombre: formaterNombre(num),
    formaterCaisse: formaterCaisse(num),
    formaterCaisseDizaine: formaterCaisseDizaine(num),
    formaterCaisseHTG: formaterCaisseHTG(num),
    formaterArgentHTG: formaterArgentHTG(num),
    formaterArgentHTGSansDecimales: formaterArgentHTGSansDecimales(num),
    formaterCaisseHTGDizaine: formaterCaisseHTGDizaine(num),
  };
};