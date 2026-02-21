



// utils/helpers.js
export const getPriorityColor = (priority) => {
  switch(priority) {
    case 'high': return 'text-red-600 font-semibold';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getEstimatedTime = (item) => {
  // Default estimated times based on task type
  if (item.estimatedMinutes) return item.estimatedMinutes * 60; // Convert to seconds
  if (item.task.includes('Brush teeth')) return 120; // 2 minutes
  if (item.task.includes('Floss')) return 60; // 1 minute
  if (item.task.includes('Shower')) return 600; // 10 minutes
  if (item.task.includes('Shampoo')) return 180; // 3 minutes
  if (item.task.includes('Shave')) return 300; // 5 minutes
  if (item.task.includes('Check') || item.task.includes('Verify')) return 180; // 3 minutes
  if (item.task.includes('Review')) return 300; // 5 minutes
  if (item.task.includes('Wash')) return 60; // 1 minute
  return 300; // Default 5 minutes
};

export const getRemainingTime = (taskId, timerSeconds, item) => {
  const elapsed = timerSeconds[taskId] || 0;
  const estimated = getEstimatedTime(item);
  const remaining = Math.max(0, estimated - elapsed);
  return remaining;
};

export const getDayProgress = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutesInDay = 24 * 60;
  const currentMinutes = hours * 60 + minutes;
  const progressPercentage = (currentMinutes / totalMinutesInDay) * 100;
  
  const segments = [
    { start: 0, end: 6, label: 'Night', color: 'from-indigo-900 to-purple-900' },
    { start: 6, end: 12, label: 'Morning', color: 'from-orange-400 to-yellow-400' },
    { start: 12, end: 18, label: 'Afternoon', color: 'from-blue-400 to-cyan-400' },
    { start: 18, end: 24, label: 'Evening', color: 'from-purple-500 to-pink-500' }
  ];
  
  const currentSegment = segments.find(s => hours >= s.start && hours < s.end);
  const timeDisplay = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  return { progressPercentage, currentSegment, timeDisplay };
};




// Calculer gallons
export const calculerGallons = (debut, fin) => {
  const d = parseFloat(debut) || 0;
  const f = parseFloat(fin) || 0;
  return parseFloat((f - d).toFixed(3));
};

// Obtenir couleur pour carburant
export const getCouleurCarburant = (typeCarburant) => {
  const couleurs = {
    'Diesel': 'bg-amber-100 border-amber-400',
    'Gasoline 1': 'bg-emerald-100 border-emerald-400',
    'Gasoline 2': 'bg-sky-100 border-sky-400',
    'Gasoline': 'bg-purple-100 border-purple-400'
  };
  return couleurs[typeCarburant] || 'bg-gray-100 border-gray-400';
};

// Obtenir couleur badge
export const getCouleurBadge = (typeCarburant) => {
  const couleurs = {
    'Diesel': 'bg-amber-500',
    'Gasoline 1': 'bg-emerald-500',
    'Gasoline 2': 'bg-sky-500',
    'Gasoline': 'bg-purple-500'
  };
  return couleurs[typeCarburant] || 'bg-gray-500';
};

// Obtenir couleur pompe
export const getCouleurPompe = (numeroPompe) => {
  const couleurs = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-rose-500 to-rose-600'
  ];
  return couleurs[numeroPompe - 1] || couleurs[0];
};

// Calculer total pompe
export const calculerTotalPompe = (donneesPompe, prix) => {
  if (!donneesPompe) return null;

  let gallonsGasoline = 0;
  let gallonsDiesel = 0;
  let ventesGasoline = 0;
  let ventesDiesel = 0;

  Object.entries(donneesPompe).forEach(([key, donnees]) => {
    if (key === '_vendeur') return;

    const gallons = calculerGallons(donnees.debut, donnees.fin);

    if (donnees.typeCarburant.includes('Gasoline')) {
      gallonsGasoline += gallons;
      ventesGasoline += gallons * prix.gasoline;
    } else if (donnees.typeCarburant === 'Diesel') {
      gallonsDiesel += gallons;
      ventesDiesel += gallons * prix.diesel;
    }
  });

  return {
    gallonsGasoline: parseFloat(gallonsGasoline.toFixed(3)),
    gallonsDiesel: parseFloat(gallonsDiesel.toFixed(3)),
    ventesGasoline: parseFloat(ventesGasoline.toFixed(2)),
    ventesDiesel: parseFloat(ventesDiesel.toFixed(2)),
    totalGallons: parseFloat((gallonsGasoline + gallonsDiesel).toFixed(3)),
    ventesTotales: parseFloat((ventesGasoline + ventesDiesel).toFixed(2))
  };
};
