// changeCalculator.js - Optimized version
// Haitian Gourde denominations in descending order
export const denominations = [
  { value: 1000, name: 'Mille', priority: 1 },
  { value: 500, name: 'Cinq-cents', priority: 2 },
  { value: 250, name: 'Deux-cents-cinquante', priority: 3 },
  { value: 100, name: 'Cent', priority: 4 },
  { value: 50, name: 'Cinquante', priority: 5 },
  { value: 25, name: 'Vingt-cinq', priority: 6 },
  { value: 10, name: 'Dix', priority: 7 },
  { value: 5, name: 'Cinq', priority: 8 }
];

// Configuration
const CONFIG = {
  MIN_DENOMINATION: 5,
  MAX_BILLS_PER_DENOMINATION: 20,
  MAX_COMBINATIONS: 4,
  CACHE_SIZE_LIMIT: 100
};

// Caches
const simpleGreedyCache = new Map();
const combinationsCache = new Map();

// Helper to get cache key for simpleGreedy
const getSimpleGreedyKey = (amount, startFromIndex, limitLargeBills, maxBillsPerDenom) => 
  `${amount}_${startFromIndex}_${limitLargeBills}_${maxBillsPerDenom}`;

// Function to get the maximum amount we can give with denominations (round down to nearest 5)
export const getMaximumGivableAmount = (amount) => {
  const remainder = amount % CONFIG.MIN_DENOMINATION;
  return amount - remainder;
};

// Simple greedy algorithm with caching
const simpleGreedy = (amount, startFromIndex = 0, limitLargeBills = false, maxBillsPerDenom = null) => {
  const cacheKey = getSimpleGreedyKey(amount, startFromIndex, limitLargeBills, maxBillsPerDenom);
  
  if (simpleGreedyCache.has(cacheKey)) {
    return simpleGreedyCache.get(cacheKey);
  }
  
  let remaining = amount;
  const breakdown = [];

  // Quick exit for very small amounts
  if (amount < 5) {
    const result = {
      breakdown: [],
      remainder: amount,
      totalBills: 0,
      isExact: false
    };
    simpleGreedyCache.set(cacheKey, result);
    return result;
  }

  // Use denominations starting from specified index
  for (let i = startFromIndex; i < denominations.length; i++) {
    const denom = denominations[i];
    if (remaining >= denom.value) {
      let count = Math.floor(remaining / denom.value);

      // Limit large bills if requested
      if (limitLargeBills && denom.value >= 500 && count > 2) {
        count = 2;
      }

      // Apply custom limit if provided
      if (maxBillsPerDenom && count > maxBillsPerDenom) {
        count = maxBillsPerDenom;
      }

      // Also limit very large counts
      if (count > CONFIG.MAX_BILLS_PER_DENOMINATION) {
        count = CONFIG.MAX_BILLS_PER_DENOMINATION;
      }

      if (count > 0) {
        const value = count * denom.value;
        remaining -= value;

        breakdown.push({
          denomination: denom.value,
          count,
          total: value
        });
      }
    }
  }

  const result = {
    breakdown,
    remainder: remaining,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0),
    isExact: remaining === 0
  };
  
  simpleGreedyCache.set(cacheKey, result);
  
  // Limit cache size
  if (simpleGreedyCache.size > CONFIG.CACHE_SIZE_LIMIT) {
    const firstKey = simpleGreedyCache.keys().next().value;
    simpleGreedyCache.delete(firstKey);
  }
  
  return result;
};

// Helper to add unique combination
const addUniqueCombination = (combinations, seenPatterns, result, key, strategyName, description) => {
  if (combinations.length >= CONFIG.MAX_COMBINATIONS) return false;
  
  const totalAmount = result.breakdown.reduce((sum, item) => sum + item.total, 0);
  const pattern = result.breakdown.map(item => `${item.denomination}:${item.count}`).sort().join(',');
  
  if (pattern && !seenPatterns.has(pattern)) {
    seenPatterns.add(pattern);
    
    combinations.push({
      key,
      breakdown: result.breakdown.sort((a, b) => b.denomination - a.denomination),
      totalNotes: result.totalBills,
      totalAmount,
      remainder: result.remainder,
      isExact: result.remainder === 0,
      strategyName,
      description
    });
    return true;
  }
  return false;
};

// Optimized generateChangeCombinations with caching
export const generateChangeCombinations = (changeNeeded) => {
  // Round to nearest multiple of 5 for caching
  const roundedAmount = Math.round(Math.max(0, changeNeeded) / 5) * 5;
  const cacheKey = roundedAmount;
  
  // Check cache
  if (combinationsCache.has(cacheKey)) {
    return combinationsCache.get(cacheKey);
  }

  if (roundedAmount <= 0) {
    const result = [];
    combinationsCache.set(cacheKey, result);
    return result;
  }

  const amount = roundedAmount;
  
  // Quick return for very small amounts
  if (amount < 5) {
    const result = [
      {
        key: 'no-change-1',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: amount,
        isExact: false,
        strategyName: "Montant trop petit",
        description: "Impossible de donner de la monnaie pour moins de 5 HTG"
      }
    ];
    combinationsCache.set(cacheKey, result);
    return result;
  }

  const combinations = [];
  const seenPatterns = new Set();

  // Strategy 1: Standard greedy
  const result1 = simpleGreedy(amount, 0, false);
  addUniqueCombination(combinations, seenPatterns, result1, 'strategy-standard', 
    "Priorité aux gros billets", "Commence par les billets de 1000, 500, 250...");

  // Strategy 2: Alternative based on amount size
  let result2;
  if (amount >= 1000) {
    result2 = simpleGreedy(amount, 1, false); // Start from 500, skip 1000
  } else if (amount >= 500) {
    result2 = simpleGreedy(amount, 2, false); // Start from 250
  } else {
    result2 = simpleGreedy(amount, 0, false, 2); // Limit to 2 bills per denomination
  }
  addUniqueCombination(combinations, seenPatterns, result2, 'strategy-alternative', 
    "Approche différente", amount >= 1000 ? "Évite les billets de 1000" : "Variation pour plus de choix");

  // Strategy 3: Focus on medium denominations (100, 50, 25)
  if (amount >= 100 && combinations.length < CONFIG.MAX_COMBINATIONS) {
    let remaining3 = amount;
    const breakdown3 = [];

    // Use 100 bills (max 5)
    if (remaining3 >= 100) {
      const max100 = Math.min(5, Math.floor(remaining3 / 100));
      if (max100 > 0) {
        const value100 = max100 * 100;
        remaining3 -= value100;
        breakdown3.push({
          denomination: 100,
          count: max100,
          total: value100
        });
      }
    }

    // Use 50 bills
    if (remaining3 >= 50) {
      const count50 = Math.floor(remaining3 / 50);
      if (count50 > 0) {
        const value50 = count50 * 50;
        remaining3 -= value50;
        breakdown3.push({
          denomination: 50,
          count: count50,
          total: value50
        });
      }
    }

    // Use greedy for the rest
    const remainingResult = simpleGreedy(remaining3, 0, false);
    breakdown3.push(...remainingResult.breakdown);
    remaining3 = remainingResult.remainder;

    const result3 = {
      breakdown: breakdown3,
      remainder: remaining3,
      totalBills: breakdown3.reduce((sum, item) => sum + item.count, 0)
    };

    addUniqueCombination(combinations, seenPatterns, result3, 'strategy-medium', 
      "Billets moyens", "Privilégie les billets de 100 et 50 HTG");
  }

  // Strategy 4: Avoid very small bills
  if (amount >= 50 && combinations.length < CONFIG.MAX_COMBINATIONS) {
    // Start from 25 (skip 5 and 10)
    const result4 = simpleGreedy(amount, 5, false); // Start from 25 value (index 5)
    addUniqueCombination(combinations, seenPatterns, result4, 'strategy-avoid-small', 
      "Évite petite monnaie", "Utilise minimum de billets de 5 et 10 HTG");
  }

  // Fill remaining slots with forced variations if needed
  const strategyNames = ["Option classique", "Solution pratique", "Approche flexible", "Variante optimisée"];
  const strategyDescs = ["Distribution traditionnelle", "Adaptée aux disponibilités", "Bon équilibre des coupures", "Optimisation intelligente"];
  
  while (combinations.length < CONFIG.MAX_COMBINATIONS) {
    const index = combinations.length;
    
    // Try different starting points
    const startIndex = Math.min(index + 1, denominations.length - 1);
    const result = simpleGreedy(amount, startIndex, false);
    
    addUniqueCombination(combinations, seenPatterns, result, `strategy-fallback-${index}`, 
      strategyNames[index % strategyNames.length], 
      strategyDescs[index % strategyDescs.length]);
  }

  // Sort by total bills (ascending)
  const finalResult = combinations.sort((a, b) => a.totalNotes - b.totalNotes);
  
  // Cache the result
  combinationsCache.set(cacheKey, finalResult);
  
  // Limit cache size
  if (combinationsCache.size > CONFIG.CACHE_SIZE_LIMIT) {
    const firstKey = combinationsCache.keys().next().value;
    combinationsCache.delete(firstKey);
  }
  
  return finalResult;
};

// Simple utility function for quick calculation
export const calculateOptimalChange = (amount) => {
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;

  const result = simpleGreedy(givableAmount, 0, false);

  return {
    breakdown: result.breakdown.sort((a, b) => b.denomination - a.denomination),
    totalAmount: result.breakdown.reduce((sum, item) => sum + item.total, 0),
    totalBills: result.totalBills,
    remainder: result.remainder + remainder,
    givableAmount,
    originalAmount: amount
  };
};

// Clear caches (useful for testing or memory management)
export const clearCaches = () => {
  simpleGreedyCache.clear();
  combinationsCache.clear();
};