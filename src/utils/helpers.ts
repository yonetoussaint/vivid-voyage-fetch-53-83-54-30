



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
  if (item.estimatedMinutes) return item.estimatedMinutes * 60;
  if (item.task.includes('Brush teeth')) return 120;
  if (item.task.includes('Floss')) return 60;
  if (item.task.includes('Shower')) return 600;
  if (item.task.includes('Shampoo')) return 180;
  if (item.task.includes('Shave')) return 300;
  if (item.task.includes('Check') || item.task.includes('Verify')) return 180;
  if (item.task.includes('Review')) return 300;
  if (item.task.includes('Wash')) return 60;
  return 300;
};

export const getRemainingTime = (taskId, timerSeconds, item) => {
  const elapsed = timerSeconds[taskId] || 0;
  const estimated = getEstimatedTime(item);
  const remaining = Math.max(0, estimated - elapsed);
  return remaining;
};

// Get current time position for calendar
export const getCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Total minutes since midnight
  const totalMinutes = hours * 60 + minutes + seconds / 60;
  const totalMinutesInDay = 24 * 60;
  
  // Percentage through the day
  const percentageOfDay = (totalMinutes / totalMinutesInDay) * 100;
  
  return {
    percentage: percentageOfDay,
    hours,
    minutes,
    seconds,
    timeString: now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    }),
    fullDate: now
  };
};

// Get time label for a given percentage position
export const getTimeFromPosition = (percentage) => {
  const totalMinutesInDay = 24 * 60;
  const minutesSinceMidnight = (percentage / 100) * totalMinutesInDay;
  const hours = Math.floor(minutesSinceMidnight / 60);
  const minutes = Math.floor(minutesSinceMidnight % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Check if current time is within an event
export const isCurrentTimeInEvent = (eventStart, eventEnd, currentTime = new Date()) => {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const startMinutes = parseInt(eventStart.split(':')[0]) * 60 + parseInt(eventStart.split(':')[1]);
  const endMinutes = parseInt(eventEnd.split(':')[0]) * 60 + parseInt(eventEnd.split(':')[1]);
  
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// Format time for display
export const formatTimeDisplay = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
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
