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
const simpleGreedy = (amount, startFromIndex = 0, limitLargeBills = false) => {
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

  // Strategy 1: Standard greedy (starting from largest denomination)
  const result1 = simpleGreedy(givableAmount, 0, false);
  const totalAmount1 = givableAmount - result1.remainder;
  
  combinations.push({
    key: 'strategy-standard',
    breakdown: result1.breakdown.sort((a, b) => b.denomination - a.denomination),
    totalNotes: result1.totalBills,
    totalAmount: totalAmount1,
    remainder: result1.remainder + remainder,
    isExact: (result1.remainder + remainder) === 0,
    strategyName: "Priorité aux gros billets",
    description: "Commence par les billets de 1000, 500, 250..."
  });

  // Strategy 2: Start from different denomination based on amount
  let result2;
  let strategy2Name;
  let strategy2Desc;
  
  if (givableAmount >= 1000) {
    // For large amounts, skip 1000 bills
    result2 = simpleGreedy(givableAmount, 1, false); // Start from 500
    strategy2Name = "Sans billets de 1000";
    strategy2Desc = "Utilise plus de billets de 500, 250, 100 HTG";
  } else if (givableAmount >= 500) {
    // For medium amounts, start from 250
    result2 = simpleGreedy(givableAmount, 2, false); // Start from 250
    strategy2Name = "Priorité 250 HTG";
    strategy2Desc = "Commence par les billets de 250 HTG";
  } else {
    // For small amounts, use standard but sorted differently
    result2 = simpleGreedy(givableAmount, 0, false);
    strategy2Name = "Toutes dénominations";
    strategy2Desc = "Utilise toutes les coupures disponibles";
  }
  
  const totalAmount2 = givableAmount - result2.remainder;
  
  // Only add if different from first strategy
  const result1Str = JSON.stringify(result1.breakdown.sort((a, b) => b.denomination - a.denomination));
  const result2Str = JSON.stringify(result2.breakdown.sort((a, b) => b.denomination - a.denomination));
  
  if (result1Str !== result2Str) {
    combinations.push({
      key: 'strategy-alternative',
      breakdown: result2.breakdown.sort((a, b) => b.denomination - a.denomination),
      totalNotes: result2.totalBills,
      totalAmount: totalAmount2,
      remainder: result2.remainder + remainder,
      isExact: (result2.remainder + remainder) === 0,
      strategyName: strategy2Name,
      description: strategy2Desc
    });
  }

  // Strategy 3: Balanced approach with limited large bills
  const result3 = simpleGreedy(givableAmount, 0, true); // Limit large bills
  const totalAmount3 = givableAmount - result3.remainder;
  const result3Str = JSON.stringify(result3.breakdown.sort((a, b) => b.denomination - a.denomination));
  
  // Only add if different from previous strategies
  const isUnique3 = !combinations.some(combo => 
    JSON.stringify(combo.breakdown) === result3Str
  );
  
  if (isUnique3) {
    combinations.push({
      key: 'strategy-balanced',
      breakdown: result3.breakdown.sort((a, b) => b.denomination - a.denomination),
      totalNotes: result3.totalBills,
      totalAmount: totalAmount3,
      remainder: result3.remainder + remainder,
      isExact: (result3.remainder + remainder) === 0,
      strategyName: "Approche équilibrée",
      description: "Limite les gros billets pour plus de flexibilité"
    });
  }

  // Strategy 4: Force use of medium denominations (100, 50, 25)
  let result4;
  let strategy4Name = "Billets moyens";
  let strategy4Desc = "Privilégie 100, 50, 25 HTG";
  
  if (givableAmount >= 100) {
    // Try to use more 100, 50, 25 bills
    let remaining4 = givableAmount;
    const breakdown4 = [];
    
    // First, take as many 100 as possible
    if (remaining4 >= 100) {
      const count100 = Math.floor(remaining4 / 100);
      if (count100 > 0) {
        const value100 = count100 * 100;
        remaining4 -= value100;
        breakdown4.push({
          denomination: 100,
          count: count100,
          total: value100
        });
      }
    }
    
    // Then use standard greedy for the rest
    const remainingResult = simpleGreedy(remaining4, 0, false);
    breakdown4.push(...remainingResult.breakdown);
    remaining4 = remainingResult.remainder;
    
    result4 = {
      breakdown: breakdown4,
      remainder: remaining4,
      totalBills: breakdown4.reduce((sum, item) => sum + item.count, 0)
    };
  } else {
    // For very small amounts, just use standard
    result4 = simpleGreedy(givableAmount, 0, false);
    strategy4Name = "Petite monnaie";
    strategy4Desc = "Optimisé pour les petits montants";
  }
  
  const totalAmount4 = givableAmount - result4.remainder;
  const result4Str = JSON.stringify(result4.breakdown.sort((a, b) => b.denomination - a.denomination));
  
  // Only add if different from previous strategies
  const isUnique4 = !combinations.some(combo => 
    JSON.stringify(combo.breakdown) === result4Str
  );
  
  if (isUnique4) {
    combinations.push({
      key: 'strategy-medium',
      breakdown: result4.breakdown.sort((a, b) => b.denomination - a.denomination),
      totalNotes: result4.totalBills,
      totalAmount: totalAmount4,
      remainder: result4.remainder + remainder,
      isExact: (result4.remainder + remainder) === 0,
      strategyName: strategy4Name,
      description: strategy4Desc
    });
  }

  // If we still don't have 4 options, create simple variations
  while (combinations.length < 4) {
    const index = combinations.length;
    const baseResult = simpleGreedy(givableAmount, index % denominations.length, false);
    const totalAmount = givableAmount - baseResult.remainder;
    
    combinations.push({
      key: `strategy-fallback-${index}`,
      breakdown: baseResult.breakdown.sort((a, b) => b.denomination - a.denomination),
      totalNotes: baseResult.totalBills,
      totalAmount: totalAmount,
      remainder: baseResult.remainder + remainder,
      isExact: (baseResult.remainder + remainder) === 0,
      strategyName: `Option ${index + 1}`,
      description: "Variation simple"
    });
  }

  // Final verification: ensure totals are correct
  combinations.forEach(combo => {
    const calculatedTotal = combo.breakdown.reduce((sum, item) => sum + item.total, 0);
    combo.totalAmount = calculatedTotal;
    combo.remainder = (givableAmount - calculatedTotal) + remainder;
    combo.isExact = combo.remainder === 0;
  });

  // Ensure we only return 4 combinations
  return combinations.slice(0, 4);
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