// utils/cisternCalibration.js

// Complete calibration data for different cistern sizes
// Based on your examples, I'll create more points with consistent patterns

const cisternCalibration = {
  // 8000 gal cistern (standard: 8000, max: 8307)
  8000: [
    { depth: 0.000, gallons: 0 },
    { depth: 0.125, gallons: 3 },
    { depth: 0.250, gallons: 5 },
    { depth: 0.375, gallons: 7 },
    { depth: 0.500, gallons: 10 },
    { depth: 0.625, gallons: 13 },
    { depth: 0.750, gallons: 16 },
    { depth: 0.875, gallons: 19 },
    { depth: 1.000, gallons: 22 },
    { depth: 2.000, gallons: 50 },
    { depth: 4.000, gallons: 105 },
    { depth: 8.000, gallons: 225 },
    { depth: 12.000, gallons: 350 },
    { depth: 24.000, gallons: 750 },
    { depth: 36.000, gallons: 1200 },
    { depth: 48.000, gallons: 1750 },
    { depth: 60.000, gallons: 2450 },
    { depth: 72.000, gallons: 3350 },
    { depth: 84.000, gallons: 4500 },
    { depth: 90.000, gallons: 5100 },
    { depth: 92.000, gallons: 6500 },
    { depth: 94.000, gallons: 7400 },
    { depth: 95.000, gallons: 7800 },
    { depth: 96.000, gallons: 8307 }
  ],
  
  // 6000 gal cistern (standard: 6000, max: 6094)
  6000: [
    { depth: 0.000, gallons: 0 },
    { depth: 0.125, gallons: 3 },
    { depth: 0.250, gallons: 4 },
    { depth: 0.375, gallons: 5 },
    { depth: 0.500, gallons: 7 },
    { depth: 0.625, gallons: 9 },
    { depth: 0.750, gallons: 11 },
    { depth: 0.875, gallons: 13 },
    { depth: 1.000, gallons: 15 },
    { depth: 2.000, gallons: 35 },
    { depth: 4.000, gallons: 80 },
    { depth: 8.000, gallons: 170 },
    { depth: 12.000, gallons: 265 },
    { depth: 24.000, gallons: 550 },
    { depth: 36.000, gallons: 900 },
    { depth: 48.000, gallons: 1350 },
    { depth: 60.000, gallons: 1900 },
    { depth: 72.000, gallons: 2600 },
    { depth: 84.000, gallons: 3500 },
    { depth: 90.000, gallons: 4200 },
    { depth: 93.000, gallons: 5000 },
    { depth: 95.000, gallons: 5600 },
    { depth: 95.500, gallons: 5850 },
    { depth: 95.750, gallons: 6094 }
  ],
  
  // 4000 gal cistern (standard: 4000, max: 4100)
  4000: [
    { depth: 0.000, gallons: 0 },
    { depth: 0.125, gallons: 2 },
    { depth: 0.250, gallons: 3 },
    { depth: 0.375, gallons: 4 },
    { depth: 0.500, gallons: 5 },
    { depth: 0.625, gallons: 7 },
    { depth: 0.750, gallons: 9 },
    { depth: 0.875, gallons: 11 },
    { depth: 1.000, gallons: 13 },
    { depth: 2.000, gallons: 30 },
    { depth: 4.000, gallons: 65 },
    { depth: 8.000, gallons: 140 },
    { depth: 12.000, gallons: 220 },
    { depth: 24.000, gallons: 450 },
    { depth: 36.000, gallons: 750 },
    { depth: 48.000, gallons: 1150 },
    { depth: 60.000, gallons: 1650 },
    { depth: 72.000, gallons: 2300 },
    { depth: 80.000, gallons: 2800 },
    { depth: 85.000, gallons: 3200 },
    { depth: 88.000, gallons: 3550 },
    { depth: 90.000, gallons: 3800 },
    { depth: 91.000, gallons: 3950 },
    { depth: 91.250, gallons: 4100 }
  ]
};

// Function to convert depth to gallons with linear interpolation
export function depthToGallons(cisternType, depth) {
  const calibration = cisternCalibration[cisternType];
  if (!calibration || depth === null || depth === undefined || isNaN(depth)) {
    return 0;
  }
  
  depth = parseFloat(depth);
  
  // Sort calibration points by depth
  const sortedPoints = [...calibration].sort((a, b) => a.depth - b.depth);
  
  // Check if depth is below minimum
  if (depth <= sortedPoints[0].depth) {
    return sortedPoints[0].gallons;
  }
  
  // Check if depth is above maximum
  if (depth >= sortedPoints[sortedPoints.length - 1].depth) {
    return sortedPoints[sortedPoints.length - 1].gallons;
  }
  
  // Find the two points to interpolate between
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const current = sortedPoints[i];
    const next = sortedPoints[i + 1];
    
    if (depth >= current.depth && depth <= next.depth) {
      // Linear interpolation
      const depthRatio = (depth - current.depth) / (next.depth - current.depth);
      return Math.round(current.gallons + depthRatio * (next.gallons - current.gallons));
    }
  }
  
  // Fallback: return last point
  return sortedPoints[sortedPoints.length - 1].gallons;
}

// Function to convert gallons to approximate depth (reverse lookup)
export function gallonsToDepth(cisternType, gallons) {
  const calibration = cisternCalibration[cisternType];
  if (!calibration || gallons === null || gallons === undefined || isNaN(gallons)) {
    return 0;
  }
  
  gallons = parseFloat(gallons);
  
  // Sort calibration points by gallons
  const sortedPoints = [...calibration].sort((a, b) => a.gallons - b.gallons);
  
  // Check if gallons is below minimum
  if (gallons <= sortedPoints[0].gallons) {
    return sortedPoints[0].depth;
  }
  
  // Check if gallons is above maximum
  if (gallons >= sortedPoints[sortedPoints.length - 1].gallons) {
    return sortedPoints[sortedPoints.length - 1].depth;
  }
  
  // Find the two points to interpolate between
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const current = sortedPoints[i];
    const next = sortedPoints[i + 1];
    
    if (gallons >= current.gallons && gallons <= next.gallons) {
      // Linear interpolation
      const gallonRatio = (gallons - current.gallons) / (next.gallons - current.gallons);
      return parseFloat((current.depth + gallonRatio * (next.depth - current.depth)).toFixed(3));
    }
  }
  
  // Fallback: return last point
  return sortedPoints[sortedPoints.length - 1].depth;
}

// Get maximum depth for a cistern type
export function getMaxDepth(cisternType) {
  const calibration = cisternCalibration[cisternType];
  if (!calibration) return 0;
  
  const maxPoint = calibration.reduce((max, point) => 
    point.depth > max.depth ? point : max
  );
  return maxPoint.depth;
}

// Get maximum gallons for a cistern type
export function getMaxGallons(cisternType) {
  const calibration = cisternCalibration[cisternType];
  if (!calibration) return 0;
  
  const maxPoint = calibration.reduce((max, point) => 
    point.gallons > max.gallons ? point : max
  );
  return maxPoint.gallons;
}

// Get standard capacity (nominal capacity)
export function getStandardCapacity(cisternType) {
  const standards = {
    8000: 8000,
    6000: 6000,
    4000: 4000
  };
  return standards[cisternType] || 0;
}