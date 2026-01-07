// Haitian Gourde denominations in descending order
export const denominations = [
  { value: 1000, name: 'Mille', priority: 1, category: 'large' },
  { value: 500, name: 'Cinq-cents', priority: 2, category: 'large' },
  { value: 250, name: 'Deux-cents-cinquante', priority: 3, category: 'large' },
  { value: 100, name: 'Cent', priority: 4, category: 'medium' },
  { value: 50, name: 'Cinquante', priority: 5, category: 'medium' },
  { value: 25, name: 'Vingt-cinq', priority: 6, category: 'small' },
  { value: 10, name: 'Dix', priority: 7, category: 'small' },
  { value: 5, name: 'Cinq', priority: 8, category: 'small' }
];

const CONFIG = {
  MIN_DENOMINATION: 5,
  MAX_BILLS_PER_DENOMINATION: 20,
  IDEAL_BILL_COUNT: 10 // Target for balanced approach
};

export const getMaximumGivableAmount = (amount) => {
  const remainder = amount % CONFIG.MIN_DENOMINATION;
  return amount - remainder;
};

// Advanced greedy with constraints
const constrainedGreedy = (amount, constraints = {}) => {
  let remaining = amount;
  const breakdown = [];
  const {
    skipDenoms = [],
    maxPerDenom = {},
    minPerDenom = {},
    preferredDenoms = [],
    startIndex = 0
  } = constraints;

  for (let i = startIndex; i < denominations.length; i++) {
    const denom = denominations[i];
    
    if (skipDenoms.includes(denom.value)) continue;
    if (remaining < denom.value) continue;

    let maxCount = Math.floor(remaining / denom.value);
    
    // Apply constraints
    if (maxPerDenom[denom.value] !== undefined) {
      maxCount = Math.min(maxCount, maxPerDenom[denom.value]);
    }
    
    const minCount = minPerDenom[denom.value] || 0;
    let count = Math.max(maxCount, minCount);
    
    // Prefer certain denominations
    if (preferredDenoms.includes(denom.value) && count > 0) {
      count = maxCount; // Use maximum available
    }
    
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

  return {
    breakdown,
    remainder: remaining,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0),
    isExact: remaining === 0
  };
};

// Dynamic programming approach for optimal bill count
const dpOptimalBills = (amount) => {
  const dp = new Array(amount + 1).fill(Infinity);
  const parent = new Array(amount + 1).fill(null);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const denom of denominations) {
      if (denom.value <= i && dp[i - denom.value] + 1 < dp[i]) {
        dp[i] = dp[i - denom.value] + 1;
        parent[i] = denom.value;
      }
    }
  }

  // Reconstruct solution
  const breakdown = [];
  let current = amount;
  
  while (current > 0 && parent[current] !== null) {
    const denomValue = parent[current];
    const existing = breakdown.find(b => b.denomination === denomValue);
    
    if (existing) {
      existing.count++;
      existing.total += denomValue;
    } else {
      breakdown.push({
        denomination: denomValue,
        count: 1,
        total: denomValue
      });
    }
    
    current -= denomValue;
  }

  return {
    breakdown: breakdown.sort((a, b) => b.denomination - a.denomination),
    remainder: current,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0),
    isExact: current === 0
  };
};

// Balanced distribution approach
const balancedDistribution = (amount) => {
  let remaining = amount;
  const breakdown = [];
  const targetBillsPerDenom = 3; // Aim for 2-4 bills per denomination

  // First pass: distribute evenly across suitable denominations
  const suitableDenoms = denominations.filter(d => d.value <= amount / 2);
  
  for (const denom of suitableDenoms) {
    if (remaining >= denom.value * targetBillsPerDenom) {
      const count = targetBillsPerDenom;
      const value = count * denom.value;
      remaining -= value;
      
      breakdown.push({
        denomination: denom.value,
        count,
        total: value
      });
    }
  }

  // Second pass: fill remaining with greedy
  const fillResult = constrainedGreedy(remaining, {});
  breakdown.push(...fillResult.breakdown);
  
  // Consolidate duplicates
  const consolidated = [];
  breakdown.forEach(item => {
    const existing = consolidated.find(b => b.denomination === item.denomination);
    if (existing) {
      existing.count += item.count;
      existing.total += item.total;
    } else {
      consolidated.push({...item});
    }
  });

  const finalRemaining = amount - consolidated.reduce((sum, item) => sum + item.total, 0);

  return {
    breakdown: consolidated.sort((a, b) => b.denomination - a.denomination),
    remainder: finalRemaining,
    totalBills: consolidated.reduce((sum, item) => sum + item.count, 0),
    isExact: finalRemaining === 0
  };
};

// Practical merchant approach - easy to count and verify
const merchantFriendly = (amount) => {
  let remaining = amount;
  const breakdown = [];
  
  // Strategy: Use round numbers (multiples of 5 bills when possible)
  // and avoid single large bills mixed with many small ones
  
  for (const denom of denominations) {
    if (remaining >= denom.value) {
      let count = Math.floor(remaining / denom.value);
      
      // Make counts rounder for easier handling
      if (count > 10) {
        count = Math.floor(count / 5) * 5; // Round to nearest 5
      } else if (count > 5) {
        count = 5; // Use exactly 5
      } else if (count === 3 || count === 4) {
        count = count; // Keep as is
      } else if (count > 1) {
        count = 2; // Use pairs
      }
      
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

  return {
    breakdown,
    remainder: remaining,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0),
    isExact: remaining === 0
  };
};

// Customer convenience approach - fewer total bills
const customerConvenience = (amount) => {
  // Similar to DP but prioritizes larger denominations more aggressively
  let remaining = amount;
  const breakdown = [];
  
  for (const denom of denominations) {
    if (remaining >= denom.value) {
      let count = Math.floor(remaining / denom.value);
      
      // Strongly prefer using larger bills completely
      if (denom.value >= 250) {
        count = Math.min(count, 3); // Max 3 large bills
      } else if (denom.value >= 100) {
        count = Math.min(count, 5); // Max 5 medium bills
      }
      
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

  return {
    breakdown,
    remainder: remaining,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0),
    isExact: remaining === 0
  };
};

// Generate 4 highly distinct change combinations
export const generateChangeCombinations = (changeNeeded) => {
  if (changeNeeded <= 0) return [];

  const amount = Math.round(changeNeeded);
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;

  if (givableAmount === 0) {
    return [{
      key: 'no-change-1',
      breakdown: [],
      totalNotes: 0,
      totalAmount: 0,
      remainder: remainder,
      isExact: false,
      strategyName: "Montant trop petit",
      description: "Impossible de donner de la monnaie pour moins de 5 HTG"
    }];
  }

  const combinations = [];

  // Strategy 1: OPTIMAL BILL COUNT (DP-based minimum bills)
  const result1 = dpOptimalBills(givableAmount);
  const totalAmount1 = givableAmount - result1.remainder;
  
  combinations.push({
    key: 'strategy-optimal',
    breakdown: result1.breakdown,
    totalNotes: result1.totalBills,
    totalAmount: totalAmount1,
    remainder: result1.remainder + remainder,
    isExact: (result1.remainder + remainder) === 0,
    strategyName: "🎯 Minimum de billets",
    description: "Le moins de billets possible - optimal pour le client"
  });

  // Strategy 2: CUSTOMER CONVENIENCE (Largest bills with constraints)
  const result2 = customerConvenience(givableAmount);
  const totalAmount2 = givableAmount - result2.remainder;
  
  combinations.push({
    key: 'strategy-convenience',
    breakdown: result2.breakdown,
    totalNotes: result2.totalBills,
    totalAmount: totalAmount2,
    remainder: result2.remainder + remainder,
    isExact: (result2.remainder + remainder) === 0,
    strategyName: "💼 Gros billets prioritaires",
    description: "Maximise les grandes coupures - facile à transporter"
  });

  // Strategy 3: MERCHANT FRIENDLY (Easy to count and verify)
  const result3 = merchantFriendly(givableAmount);
  const totalAmount3 = givableAmount - result3.remainder;
  
  combinations.push({
    key: 'strategy-merchant',
    breakdown: result3.breakdown,
    totalNotes: result3.totalBills,
    totalAmount: totalAmount3,
    remainder: result3.remainder + remainder,
    isExact: (result3.remainder + remainder) === 0,
    strategyName: "🏪 Facile à compter",
    description: "Nombres ronds et réguliers - pratique pour les commerçants"
  });

  // Strategy 4: BALANCED MIX (Good distribution across denominations)
  const result4 = balancedDistribution(givableAmount);
  const totalAmount4 = givableAmount - result4.remainder;
  
  combinations.push({
    key: 'strategy-balanced',
    breakdown: result4.breakdown,
    totalNotes: result4.totalBills,
    totalAmount: totalAmount4,
    remainder: result4.remainder + remainder,
    isExact: (result4.remainder + remainder) === 0,
    strategyName: "⚖️ Distribution équilibrée",
    description: "Variété de coupures - flexible pour faire d'autres transactions"
  });

  // Remove exact duplicates but keep trying to get 4 unique options
  const uniqueCombinations = [];
  const seen = new Set();

  for (const combo of combinations) {
    const signature = JSON.stringify(combo.breakdown);
    if (!seen.has(signature)) {
      seen.add(signature);
      uniqueCombinations.push(combo);
    }
  }

  // If we have fewer than 4 unique combinations, add intelligent variations
  while (uniqueCombinations.length < 4) {
    let newCombo = null;
    
    if (uniqueCombinations.length === 1) {
      // Add variation: No large bills (500+)
      const noLargeResult = constrainedGreedy(givableAmount, {
        skipDenoms: [1000, 500]
      });
      const totalNoLarge = givableAmount - noLargeResult.remainder;
      
      newCombo = {
        key: 'strategy-no-large',
        breakdown: noLargeResult.breakdown,
        totalNotes: noLargeResult.totalBills,
        totalAmount: totalNoLarge,
        remainder: noLargeResult.remainder + remainder,
        isExact: (noLargeResult.remainder + remainder) === 0,
        strategyName: "🎒 Sans gros billets",
        description: "Utilise des coupures moyennes et petites uniquement"
      };
    } else if (uniqueCombinations.length === 2) {
      // Add variation: Prefer medium denominations (100, 50)
      const mediumResult = constrainedGreedy(givableAmount, {
        preferredDenoms: [100, 50],
        maxPerDenom: { 1000: 1, 500: 1 }
      });
      const totalMedium = givableAmount - mediumResult.remainder;
      
      newCombo = {
        key: 'strategy-medium',
        breakdown: mediumResult.breakdown,
        totalNotes: mediumResult.totalBills,
        totalAmount: totalMedium,
        remainder: mediumResult.remainder + remainder,
        isExact: (mediumResult.remainder + remainder) === 0,
        strategyName: "📊 Coupures moyennes",
        description: "Privilégie les billets de 100 et 50 HTG"
      };
    } else if (uniqueCombinations.length === 3) {
      // Add variation: Small bills focus
      const smallResult = constrainedGreedy(givableAmount, {
        skipDenoms: [1000],
        maxPerDenom: { 500: 2, 250: 3 }
      });
      const totalSmall = givableAmount - smallResult.remainder;
      
      newCombo = {
        key: 'strategy-small',
        breakdown: smallResult.breakdown,
        totalNotes: smallResult.totalBills,
        totalAmount: totalSmall,
        remainder: smallResult.remainder + remainder,
        isExact: (smallResult.remainder + remainder) === 0,
        strategyName: "💵 Petites coupures",
        description: "Plus de flexibilité avec des petits billets"
      };
    }
    
    if (newCombo) {
      const signature = JSON.stringify(newCombo.breakdown);
      if (!seen.has(signature)) {
        seen.add(signature);
        uniqueCombinations.push(newCombo);
      } else {
        // If duplicate, break to avoid infinite loop
        break;
      }
    } else {
      break;
    }
  }

  // Final verification
  uniqueCombinations.forEach(combo => {
    const calculatedTotal = combo.breakdown.reduce((sum, item) => sum + item.total, 0);
    combo.totalAmount = calculatedTotal;
    combo.remainder = (givableAmount - calculatedTotal) + remainder;
    combo.isExact = combo.remainder === 0;
  });

  // Ensure we return exactly 4 options (or all unique ones if less)
  return uniqueCombinations.slice(0, 4);
};

// Quick optimal calculation
export const calculateOptimalChange = (amount) => {
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;
  
  const result = dpOptimalBills(givableAmount);
  
  return {
    breakdown: result.breakdown,
    totalAmount: result.breakdown.reduce((sum, item) => sum + item.total, 0),
    totalBills: result.totalBills,
    remainder: result.remainder + remainder,
    givableAmount,
    originalAmount: amount
  };
};