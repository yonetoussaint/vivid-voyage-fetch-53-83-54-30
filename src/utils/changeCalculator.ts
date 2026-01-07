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
const simpleGreedy = (amount) => {
  let remaining = amount;
  const breakdown = [];

  // Always use denominations in descending order
  for (const denom of denominations) {
    if (remaining >= denom.value) {
      const count = Math.floor(remaining / denom.value);
      
      if (count > 0 && count <= CONFIG.MAX_BILLS_PER_DENOMINATION) {
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

// Generate different strategies by starting from different denominations
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

  // Strategy 1: Standard greedy (starting from largest denomination)
  const result1 = simpleGreedy(givableAmount);
  combinations.push({
    key: 'strategy-standard',
    breakdown: result1.breakdown,
    totalNotes: result1.totalBills,
    totalAmount: givableAmount - result1.remainder,
    remainder: result1.remainder + remainder,
    isExact: (result1.remainder + remainder) === 0,
    strategyName: "Priorité aux gros billets",
    description: "Commence par les billets de 1000, 500, 250..."
  });

  // Strategy 2: Skip 1000 if amount is not too large
  if (givableAmount > 1000) {
    // Strategy 2a: With 1000
    const result2a = simpleGreedy(givableAmount);
    
    // Strategy 2b: Without 1000 (start from 500)
    let remaining2b = givableAmount;
    const breakdown2b = [];
    
    for (const denom of denominations.slice(1)) { // Skip 1000
      if (remaining2b >= denom.value) {
        const count = Math.floor(remaining2b / denom.value);
        if (count > 0 && count <= CONFIG.MAX_BILLS_PER_DENOMINATION) {
          const value = count * denom.value;
          remaining2b -= value;
          breakdown2b.push({
            denomination: denom.value,
            count,
            total: value
          });
        }
      }
    }
    
    const totalBills2b = breakdown2b.reduce((sum, item) => sum + item.count, 0);
    const totalAmount2b = givableAmount - remaining2b;
    
    // Only add if different from first strategy
    if (JSON.stringify(breakdown2b) !== JSON.stringify(result1.breakdown)) {
      combinations.push({
        key: 'strategy-no-1000',
        breakdown: breakdown2b,
        totalNotes: totalBills2b,
        totalAmount: totalAmount2b,
        remainder: remaining2b + remainder,
        isExact: (remaining2b + remainder) === 0,
        strategyName: "Éviter les billets de 1000",
        description: "Utilise plus de billets de 500 et 250"
      });
    }
  }

  // Strategy 3: Prefer medium denominations (250, 100, 50)
  let remaining3 = givableAmount;
  const breakdown3 = [];
  
  // First use medium denominations (250, 100, 50)
  const mediumDenoms = denominations.filter(d => d.value <= 250 && d.value >= 50);
  for (const denom of mediumDenoms) {
    if (remaining3 >= denom.value) {
      const count = Math.floor(remaining3 / denom.value);
      if (count > 0 && count <= CONFIG.MAX_BILLS_PER_DENOMINATION) {
        const value = count * denom.value;
        remaining3 -= value;
        breakdown3.push({
          denomination: denom.value,
          count,
          total: value
        });
      }
    }
  }
  
  // If there's still money left, use larger denominations
  if (remaining3 > 0) {
    const largeDenoms = denominations.filter(d => d.value > 250);
    for (const denom of largeDenoms) {
      if (remaining3 >= denom.value) {
        const count = Math.floor(remaining3 / denom.value);
        if (count > 0) {
          const value = count * denom.value;
          remaining3 -= value;
          breakdown3.push({
            denomination: denom.value,
            count,
            total: value
          });
        }
      }
    }
  }
  
  const totalBills3 = breakdown3.reduce((sum, item) => sum + item.count, 0);
  const totalAmount3 = givableAmount - remaining3;
  
  // Only add if different
  const breakdown3Str = JSON.stringify(breakdown3.sort((a, b) => b.denomination - a.denomination));
  const result1Str = JSON.stringify(result1.breakdown);
  
  if (breakdown3Str !== result1Str && combinations.length < 4) {
    combinations.push({
      key: 'strategy-medium-first',
      breakdown: breakdown3.sort((a, b) => b.denomination - a.denomination),
      totalNotes: totalBills3,
      totalAmount: totalAmount3,
      remainder: remaining3 + remainder,
      isExact: (remaining3 + remainder) === 0,
      strategyName: "Priorité aux billets moyens",
      description: "Privilégie 250, 100, 50 HTG d'abord"
    });
  }

  // Strategy 4: Balanced approach (limit large bills)
  if (givableAmount > 500) {
    let remaining4 = givableAmount;
    const breakdown4 = [];
    
    // Limit large bills to 2 maximum
    for (const denom of denominations) {
      if (remaining4 >= denom.value) {
        let count = Math.floor(remaining4 / denom.value);
        
        // Limit large bills
        if (denom.value >= 500 && count > 2) {
          count = 2;
        }
        
        if (count > 0 && count <= CONFIG.MAX_BILLS_PER_DENOMINATION) {
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
    
    const totalBills4 = breakdown4.reduce((sum, item) => sum + item.count, 0);
    const totalAmount4 = givableAmount - remaining4;
    const breakdown4Str = JSON.stringify(breakdown4);
    
    // Check if this combination is unique
    const isUnique = !combinations.some(combo => 
      JSON.stringify(combo.breakdown) === breakdown4Str
    );
    
    if (isUnique && combinations.length < 4) {
      combinations.push({
        key: 'strategy-balanced',
        breakdown: breakdown4,
        totalNotes: totalBills4,
        totalAmount: totalAmount4,
        remainder: remaining4 + remainder,
        isExact: (remaining4 + remainder) === 0,
        strategyName: "Approche équilibrée",
        description: "Limite les gros billets pour plus de flexibilité"
      });
    }
  }

  // Strategy 5: Fill remaining slots with variations if needed
  if (combinations.length < 4) {
    // Create a variation by consolidating small bills
    const baseResult = simpleGreedy(givableAmount);
    let remaining5 = givableAmount;
    const breakdown5 = [];
    
    // Try to avoid very small bills (5, 10) when possible
    for (const denom of denominations.filter(d => d.value >= 25)) {
      if (remaining5 >= denom.value) {
        const count = Math.floor(remaining5 / denom.value);
        if (count > 0 && count <= CONFIG.MAX_BILLS_PER_DENOMINATION) {
          const value = count * denom.value;
          remaining5 -= value;
          breakdown5.push({
            denomination: denom.value,
            count,
            total: value
          });
        }
      }
    }
    
    // If there's still remainder, use smallest bills
    if (remaining5 > 0) {
      for (const denom of denominations.filter(d => d.value < 25)) {
        if (remaining5 >= denom.value) {
          const count = Math.floor(remaining5 / denom.value);
          if (count > 0) {
            const value = count * denom.value;
            remaining5 -= value;
            breakdown5.push({
              denomination: denom.value,
              count,
              total: value
            });
          }
        }
      }
    }
    
    const totalBills5 = breakdown5.reduce((sum, item) => sum + item.count, 0);
    const totalAmount5 = givableAmount - remaining5;
    const breakdown5Str = JSON.stringify(breakdown5);
    
    // Check if unique
    const isUnique5 = !combinations.some(combo => 
      JSON.stringify(combo.breakdown) === breakdown5Str
    );
    
    if (isUnique5 && combinations.length < 4) {
      combinations.push({
        key: 'strategy-avoid-small',
        breakdown: breakdown5,
        totalNotes: totalBills5,
        totalAmount: totalAmount5,
        remainder: remaining5 + remainder,
        isExact: (remaining5 + remainder) === 0,
        strategyName: "Moins de petite monnaie",
        description: "Évite les billets de 5 et 10 HTG quand possible"
      });
    }
  }

  // Ensure all combinations are valid and total amount is correct
  combinations.forEach(combo => {
    const calculatedTotal = combo.breakdown.reduce((sum, item) => sum + item.total, 0);
    combo.totalAmount = calculatedTotal;
    combo.remainder = (givableAmount - calculatedTotal) + remainder;
    combo.isExact = combo.remainder === 0;
  });

  // Sort by total bills (fewest first)
  return combinations.sort((a, b) => a.totalNotes - b.totalNotes).slice(0, 4);
};

// Additional utility function for quick calculation
export const calculateOptimalChange = (amount) => {
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;
  
  const result = simpleGreedy(givableAmount);
  
  return {
    breakdown: result.breakdown,
    totalAmount: result.breakdown.reduce((sum, item) => sum + item.total, 0),
    totalBills: result.totalBills,
    remainder: result.remainder + remainder,
    givableAmount,
    originalAmount: amount
  };
};