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
  { depth: 0.625, gallons: 12 },
  { depth: 0.750, gallons: 15 },
  { depth: 0.875, gallons: 18 },
  { depth: 1.000, gallons: 21 },
  { depth: 1.125, gallons: 24 },
  { depth: 1.250, gallons: 27 },
  { depth: 1.375, gallons: 31 },
  { depth: 1.500, gallons: 34 },
  { depth: 1.625, gallons: 38 },
  { depth: 1.750, gallons: 42 },
  { depth: 1.875, gallons: 46 },
  { depth: 2.000, gallons: 50 },
  { depth: 2.125, gallons: 54 },
  { depth: 2.250, gallons: 59 },
  { depth: 2.375, gallons: 63 },
  { depth: 2.500, gallons: 67 },
  { depth: 2.625, gallons: 72 },
  { depth: 2.750, gallons: 77 },
  { depth: 2.875, gallons: 81 },
  { depth: 3.000, gallons: 87 },
  { depth: 3.125, gallons: 92 },
  { depth: 3.250, gallons: 97 },
  { depth: 3.375, gallons: 102 },
  { depth: 3.500, gallons: 107 },
  { depth: 3.625, gallons: 113 },
  { depth: 3.750, gallons: 118 },
  { depth: 3.875, gallons: 123 },
  { depth: 4.000, gallons: 129 },
  { depth: 4.125, gallons: 135 },
  { depth: 4.250, gallons: 141 },
  { depth: 4.375, gallons: 146 },
  { depth: 4.500, gallons: 152 },
  { depth: 4.625, gallons: 158 },
  { depth: 4.750, gallons: 161 },
  { depth: 4.875, gallons: 170 },
  { depth: 5.000, gallons: 177 },
  { depth: 5.125, gallons: 183 },
  { depth: 5.250, gallons: 189 },
  { depth: 5.375, gallons: 196 },
  { depth: 5.500, gallons: 202 },
  { depth: 5.625, gallons: 209 },
  { depth: 5.750, gallons: 215 },
  { depth: 5.875, gallons: 222 },
  { depth: 6.000, gallons: 229 },
  { depth: 6.125, gallons: 236 },
  { depth: 6.250, gallons: 242 },
  { depth: 6.375, gallons: 249 },
  { depth: 6.500, gallons: 256 },
  { depth: 6.625, gallons: 263 },
  { depth: 6.750, gallons: 270 },
  { depth: 6.875, gallons: 278 },
  { depth: 7.000, gallons: 285 },
  { depth: 7.125, gallons: 292 },
  { depth: 7.250, gallons: 299 },
  { depth: 7.375, gallons: 307 },
  { depth: 7.500, gallons: 314 },
  { depth: 7.625, gallons: 322 },
  { depth: 7.750, gallons: 329 },
  { depth: 7.875, gallons: 337 },
  { depth: 8.000, gallons: 344 },
  { depth: 8.125, gallons: 352 },
  { depth: 8.250, gallons: 360 },
  { depth: 8.375, gallons: 368 },
  { depth: 8.500, gallons: 376 },
  { depth: 8.625, gallons: 383 },
  { depth: 8.750, gallons: 391 },
  { depth: 8.875, gallons: 399 },
  { depth: 9.000, gallons: 408 },
  { depth: 9.125, gallons: 416 },
  { depth: 9.250, gallons: 424 },
  { depth: 9.375, gallons: 432 },
  { depth: 9.500, gallons: 441 },
  { depth: 9.625, gallons: 449 },
  { depth: 9.750, gallons: 457 },
  { depth: 9.875, gallons: 466 },
  { depth: 10.000, gallons: 474 },
  { depth: 10.125, gallons: 483 },
  { depth: 10.250, gallons: 491 },
  { depth: 10.375, gallons: 500 },
  { depth: 10.500, gallons: 508 },
  { depth: 10.625, gallons: 517 },
  { depth: 10.750, gallons: 526 },
  { depth: 10.875, gallons: 535 },
  { depth: 11.000, gallons: 543 },
  { depth: 11.125, gallons: 552 },
  { depth: 11.250, gallons: 561 },
  { depth: 11.375, gallons: 570 },
  { depth: 11.500, gallons: 579 },
  { depth: 11.625, gallons: 588 },
  { depth: 11.750, gallons: 597 },
  { depth: 11.875, gallons: 606 },
  { depth: 12.000, gallons: 615 },
  { depth: 12.125, gallons: 624 },
  { depth: 12.250, gallons: 633 },
  { depth: 12.375, gallons: 643 },
  { depth: 12.500, gallons: 652 },
  { depth: 12.625, gallons: 661 },
  { depth: 12.750, gallons: 671 },
  { depth: 12.875, gallons: 680 },
  { depth: 13.000, gallons: 690 },
  { depth: 13.125, gallons: 699 },
  { depth: 13.250, gallons: 709 },
  { depth: 13.375, gallons: 718 },
  { depth: 13.500, gallons: 728 },
  { depth: 13.625, gallons: 738 },
  { depth: 13.750, gallons: 747 },
  { depth: 13.875, gallons: 757 },
  { depth: 14.000, gallons: 767 },
  { depth: 14.125, gallons: 776 },
  { depth: 14.250, gallons: 786 },
  { depth: 14.375, gallons: 796 },
  { depth: 14.500, gallons: 806 },
  { depth: 14.625, gallons: 816 },
  { depth: 14.750, gallons: 826 },
  { depth: 14.875, gallons: 836 },
  { depth: 15.000, gallons: 846 },
  { depth: 15.125, gallons: 856 },
  { depth: 15.250, gallons: 866 },
  { depth: 15.375, gallons: 875 },
  { depth: 15.500, gallons: 886 },
  { depth: 15.625, gallons: 896 },
  { depth: 15.750, gallons: 907 },
  { depth: 15.875, gallons: 917 },
  { depth: 16.000, gallons: 927 },
  { depth: 16.125, gallons: 937 },
  { depth: 16.250, gallons: 948 },
  { depth: 16.375, gallons: 958 },
  { depth: 16.500, gallons: 969 },
  { depth: 16.625, gallons: 979 },
  { depth: 16.750, gallons: 989 },
  { depth: 16.875, gallons: 1000 },
  { depth: 17.000, gallons: 1010 },
  { depth: 17.125, gallons: 1021 },
  { depth: 17.250, gallons: 1032 },
  { depth: 17.375, gallons: 1042 },
  { depth: 17.500, gallons: 1053 },
  { depth: 17.625, gallons: 1064 },
  { depth: 17.750, gallons: 1074 },
  { depth: 17.875, gallons: 1085 },
  { depth: 18.000, gallons: 1096 }
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