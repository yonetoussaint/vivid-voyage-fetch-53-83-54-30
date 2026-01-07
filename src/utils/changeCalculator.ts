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
  MAX_BILLS_PER_DENOMINATION: 20
};

// Function to get the maximum amount we can give with denominations (round down to nearest 5)
export const getMaximumGivableAmount = (amount) => {
  const remainder = amount % CONFIG.MIN_DENOMINATION;
  return amount - remainder;
};

// Simple greedy algorithm that always uses descending order
const simpleGreedy = (amount, startFromIndex = 0, limitLargeBills = false, maxBillsPerDenom = null) => {
  let remaining = amount;
  const breakdown = [];

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

  return {
    breakdown,
    remainder: remaining,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0),
    isExact: remaining === 0
  };
};

// Generate 4 different change combinations
export const generateChangeCombinations = (changeNeeded) => {
  if (changeNeeded <= 0) return [];

  const amount = Math.round(changeNeeded);
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;

  if (givableAmount === 0) {
    return [
      {
        key: 'no-change-1',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: remainder,
        isExact: false,
        strategyName: "Montant trop petit",
        description: "Impossible de donner de la monnaie pour moins de 5 HTG"
      }
    ];
  }

  const combinations = [];
  const seenPatterns = new Set();

  // Helper to add combination if unique
  const addUniqueCombination = (result, key, strategyName, description) => {
    const totalAmount = givableAmount - result.remainder;
    const pattern = result.breakdown.map(item => `${item.denomination}:${item.count}`).sort().join(',');
    
    if (!seenPatterns.has(pattern)) {
      seenPatterns.add(pattern);
      
      combinations.push({
        key,
        breakdown: result.breakdown.sort((a, b) => b.denomination - a.denomination),
        totalNotes: result.totalBills,
        totalAmount,
        remainder: result.remainder + remainder,
        isExact: (result.remainder + remainder) === 0,
        strategyName,
        description
      });
      return true;
    }
    return false;
  };

  // Strategy 1: Standard greedy (starting from largest denomination)
  const result1 = simpleGreedy(givableAmount, 0, false);
  addUniqueCombination(result1, 'strategy-standard', "Priorité aux gros billets", 
    "Commence par les billets de 1000, 500, 250...");

  // Strategy 2: Skip 1000 if amount is moderate, otherwise start from 250
  let result2;
  if (givableAmount >= 1000) {
    // For large amounts, avoid 1000 bills
    result2 = simpleGreedy(givableAmount, 1, false); // Start from 500
  } else if (givableAmount >= 500) {
    // For medium amounts, start from 250
    result2 = simpleGreedy(givableAmount, 2, false); // Start from 250
  } else {
    // For small amounts, use standard but limit to 2 bills per denomination
    result2 = simpleGreedy(givableAmount, 0, false, 2);
  }
  
  if (!addUniqueCombination(result2, 'strategy-alternative', "Approche différente", 
      givableAmount >= 1000 ? "Évite les billets de 1000" : "Variation pour plus de choix")) {
    // If not unique, try a different approach
    result2 = simpleGreedy(givableAmount, 0, true); // Limit large bills
    addUniqueCombination(result2, 'strategy-limited-large', "Gros billets limités", 
      "Limite les billets de 1000 et 500 à 2 maximum");
  }

  // Strategy 3: Prefer medium denominations (100, 50, 25)
  if (givableAmount >= 100) {
    let remaining3 = givableAmount;
    const breakdown3 = [];
    
    // First, use as many 100 as possible (but max 5)
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
    
    // Then, use as many 50 as possible
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
    
    // Then use standard greedy for the rest
    const remainingResult = simpleGreedy(remaining3, 0, false);
    breakdown3.push(...remainingResult.breakdown);
    remaining3 = remainingResult.remainder;
    
    const result3 = {
      breakdown: breakdown3,
      remainder: remaining3,
      totalBills: breakdown3.reduce((sum, item) => sum + item.count, 0)
    };
    
    addUniqueCombination(result3, 'strategy-medium', "Billets moyens", 
      "Privilégie les billets de 100 et 50 HTG");
  }

  // Strategy 4: Create a truly different option
  // Option 4a: If amount is divisible by 250, use that as base
  if (givableAmount >= 250 && givableAmount % 250 === 0) {
    const count250 = givableAmount / 250;
    const result4 = {
      breakdown: [{
        denomination: 250,
        count: count250,
        total: givableAmount
      }],
      remainder: 0,
      totalBills: count250
    };
    
    addUniqueCombination(result4, 'strategy-250-only', "Uniquement 250 HTG", 
      "Utilise seulement des billets de 250 HTG");
  }
  // Option 4b: Try to use more 500 and 100 instead of 1000
  else if (givableAmount >= 1000) {
    let remaining4 = givableAmount;
    const breakdown4 = [];
    
    // Use 500 instead of 1000 when possible
    if (remaining4 >= 1000) {
      const count500 = Math.floor(remaining4 / 500);
      if (count500 > 0) {
        const value500 = count500 * 500;
        remaining4 -= value500;
        breakdown4.push({
          denomination: 500,
          count: count500,
          total: value500
        });
      }
    }
    
    // Use standard greedy for the rest
    const remainingResult = simpleGreedy(remaining4, 0, false);
    breakdown4.push(...remainingResult.breakdown);
    remaining4 = remainingResult.remainder;
    
    const result4 = {
      breakdown: breakdown4,
      remainder: remaining4,
      totalBills: breakdown4.reduce((sum, item) => sum + item.count, 0)
    };
    
    addUniqueCombination(result4, 'strategy-500-focus', "Focus 500 HTG", 
      "Utilise plus de billets de 500 HTG");
  }
  // Option 4c: For smaller amounts, try to avoid very small bills
  else if (givableAmount >= 50) {
    let remaining4 = givableAmount;
    const breakdown4 = [];
    
    // First use bills >= 25
    for (const denom of denominations.filter(d => d.value >= 25)) {
      if (remaining4 >= denom.value) {
        const count = Math.floor(remaining4 / denom.value);
        if (count > 0) {
          const value = count * denom.value;
          remaining4 -= value;
          breakdown4.push({
            denomination: denom.value,
            count,
            total: value
          });
        }
      }
    }
    
    // Only if necessary, use 10 and 5
    if (remaining4 > 0) {
      const smallResult = simpleGreedy(remaining4, 6, false); // Start from 10
      breakdown4.push(...smallResult.breakdown);
      remaining4 = smallResult.remainder;
    }
    
    const result4 = {
      breakdown: breakdown4,
      remainder: remaining4,
      totalBills: breakdown4.reduce((sum, item) => sum + item.count, 0)
    };
    
    addUniqueCombination(result4, 'strategy-avoid-small', "Évite petite monnaie", 
      "Utilise minimum de billets de 5 et 10 HTG");
  }

  // If we still don't have 4 unique options, create forced variations
  while (combinations.length < 4) {
    const index = combinations.length;
    
    // Try different starting points
    const startIndex = (index * 2) % denominations.length;
    const result = simpleGreedy(givableAmount, startIndex, false);
    
    // If still the same, modify the result
    let modifiedResult = { ...result };
    if (index > 0 && combinations.length > 0) {
      // Try to create variation by adjusting counts
      modifiedResult.breakdown = result.breakdown.map(item => {
        if (item.count > 1 && item.denomination >= 100) {
          // Reduce count by 1 for larger bills
          return {
            ...item,
            count: item.count - 1,
            total: (item.count - 1) * item.denomination
          };
        }
        return { ...item };
      });
      
      // Recalculate remainder
      const totalGiven = modifiedResult.breakdown.reduce((sum, item) => sum + item.total, 0);
      modifiedResult.remainder = givableAmount - totalGiven;
      modifiedResult.totalBills = modifiedResult.breakdown.reduce((sum, item) => sum + item.count, 0);
      
      // If we removed too much, add back with smaller bills
      if (modifiedResult.remainder > 0) {
        const addResult = simpleGreedy(modifiedResult.remainder, 0, false);
        modifiedResult.breakdown.push(...addResult.breakdown);
        modifiedResult.remainder = addResult.remainder;
        modifiedResult.totalBills += addResult.totalBills;
      }
    }
    
    const strategyNames = ["Option classique", "Solution pratique", "Approche flexible", "Variante optimisée"];
    const strategyDescs = ["Distribution traditionnelle", "Adaptée aux disponibilités", "Bon équilibre des coupures", "Optimisation intelligente"];
    
    addUniqueCombination(modifiedResult, `strategy-fallback-${index}`, 
      strategyNames[index % strategyNames.length], 
      strategyDescs[index % strategyDescs.length]);
  }

  // Final verification: ensure totals are correct
  combinations.forEach(combo => {
    const calculatedTotal = combo.breakdown.reduce((sum, item) => sum + item.total, 0);
    combo.totalAmount = calculatedTotal;
    combo.remainder = (givableAmount - calculatedTotal) + remainder;
    combo.isExact = combo.remainder === 0;
  });

  // Ensure we only return 4 combinations, sorted by total bills
  return combinations.slice(0, 4).sort((a, b) => a.totalNotes - b.totalNotes);
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