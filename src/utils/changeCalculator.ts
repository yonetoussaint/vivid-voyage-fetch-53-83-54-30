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

  // Strategy 2: Skip 1000 if possible, otherwise use different starting point
  let result2;
  let strategy2Name;
  let strategy2Desc;
  
  if (givableAmount >= 1000) {
    // Option 2a: Without 1000 bills
    result2 = simpleGreedy(givableAmount, 1, false); // Start from 500
    strategy2Name = "Sans billets de 1000";
    strategy2Desc = "Utilise plus de billets de 500, 250, 100 HTG";
  } else {
    // Option 2b: For smaller amounts, start from 100 instead
    result2 = simpleGreedy(givableAmount, 3, false); // Start from 100
    strategy2Name = "Billets moyens et petits";
    strategy2Desc = "Priorité aux billets de 100, 50, 25 HTG";
  }
  
  const totalAmount2 = givableAmount - result2.remainder;
  
  combinations.push({
    key: 'strategy-no-1000',
    breakdown: result2.breakdown.sort((a, b) => b.denomination - a.denomination),
    totalNotes: result2.totalBills,
    totalAmount: totalAmount2,
    remainder: result2.remainder + remainder,
    isExact: (result2.remainder + remainder) === 0,
    strategyName: strategy2Name,
    description: strategy2Desc
  });

  // Strategy 3: Balanced approach with limited large bills
  const result3 = simpleGreedy(givableAmount, 0, true); // Limit large bills
  const totalAmount3 = givableAmount - result3.remainder;
  
  combinations.push({
    key: 'strategy-balanced',
    breakdown: result3.breakdown.sort((a, b) => b.denomination - a.denomination),
    totalNotes: result3.totalBills,
    totalAmount: totalAmount3,
    remainder: result3.remainder + remainder,
    isExact: (result3.remainder + remainder) === 0,
    strategyName: "Approche équilibrée",
    description: "Limite les gros billets pour une répartition plus uniforme"
  });

  // Strategy 4: Always create a 4th option, even if similar
  let result4;
  let strategy4Name;
  let strategy4Desc;
  
  if (givableAmount >= 250) {
    // Option 4a: Prefer 250, 100, 50
    let remaining4 = givableAmount;
    const breakdown4 = [];
    
    // Force use of 250 first if possible
    if (remaining4 >= 250) {
      const count250 = Math.floor(remaining4 / 250);
      if (count250 > 0) {
        const value250 = count250 * 250;
        remaining4 -= value250;
        breakdown4.push({
          denomination: 250,
          count: count250,
          total: value250
        });
      }
    }
    
    // Then use standard greedy for the rest
    const remainingResult = simpleGreedy(remaining4, 0, false);
    breakdown4.push(...remainingResult.breakdown);
    remaining4 = remainingResult.remainder;
    
    const totalBills4 = breakdown4.reduce((sum, item) => sum + item.count, 0);
    const totalAmount4 = givableAmount - remaining4;
    
    result4 = {
      breakdown: breakdown4,
      remainder: remaining4,
      totalBills: totalBills4
    };
    
    strategy4Name = "Focus 250 HTG";
    strategy4Desc = "Priorité aux billets de 250 HTG d'abord";
  } else {
    // Option 4b: For small amounts, use exact greedy with all denominations
    result4 = simpleGreedy(givableAmount, 0, false);
    strategy4Name = "Solution exacte";
    strategy4Desc = "Utilise toutes les dénominations disponibles";
  }
  
  const totalAmount4 = givableAmount - result4.remainder;
  
  combinations.push({
    key: 'strategy-alternative',
    breakdown: result4.breakdown.sort((a, b) => b.denomination - a.denomination),
    totalNotes: result4.totalBills,
    totalAmount: totalAmount4,
    remainder: result4.remainder + remainder,
    isExact: (result4.remainder + remainder) === 0,
    strategyName: strategy4Name,
    description: strategy4Desc
  });

  // Ensure all combinations are unique by adjusting if needed
  const uniqueCombinations = [];
  const seenPatterns = new Set();
  
  for (const combo of combinations) {
    const pattern = combo.breakdown.map(item => `${item.denomination}x${item.count}`).join('|');
    
    if (!seenPatterns.has(pattern)) {
      seenPatterns.add(pattern);
      uniqueCombinations.push(combo);
    } else {
      // Create a variation for this duplicate
      const variation = createVariation(combo, givableAmount, remainder);
      const variationPattern = variation.breakdown.map(item => `${item.denomination}x${item.count}`).join('|');
      
      if (!seenPatterns.has(variationPattern)) {
        seenPatterns.add(variationPattern);
        uniqueCombinations.push(variation);
      }
    }
  }

  // Always ensure we have exactly 4 options
  while (uniqueCombinations.length < 4) {
    const lastIndex = uniqueCombinations.length - 1;
    const baseCombo = uniqueCombinations[lastIndex] || combinations[0];
    const newVariation = createVariation(baseCombo, givableAmount, remainder, uniqueCombinations.length);
    
    const newPattern = newVariation.breakdown.map(item => `${item.denomination}x${item.count}`).join('|');
    if (!seenPatterns.has(newPattern)) {
      seenPatterns.add(newPattern);
      uniqueCombinations.push(newVariation);
    }
  }

  // Final verification: ensure totals are correct
  uniqueCombinations.forEach(combo => {
    const calculatedTotal = combo.breakdown.reduce((sum, item) => sum + item.total, 0);
    combo.totalAmount = calculatedTotal;
    combo.remainder = (givableAmount - calculatedTotal) + remainder;
    combo.isExact = combo.remainder === 0;
  });

  // Sort by total bills (fewest first)
  return uniqueCombinations.slice(0, 4).sort((a, b) => a.totalNotes - b.totalNotes);
};

// Helper function to create variations when combinations are too similar
const createVariation = (baseCombo, givableAmount, remainder, variationIndex = 0) => {
  const variations = [
    // Variation 1: Split large bills
    (combo) => {
      const newBreakdown = [...combo.breakdown.map(item => ({ ...item }))];
      
      // Find a large bill to split
      const largeBillIndex = newBreakdown.findIndex(item => item.denomination >= 500 && item.count > 0);
      
      if (largeBillIndex >= 0) {
        const largeBill = newBreakdown[largeBillIndex];
        const valueToSplit = largeBill.denomination;
        
        // Reduce the large bill by 1
        largeBill.count -= 1;
        largeBill.total -= valueToSplit;
        
        // If count becomes 0, remove it
        if (largeBill.count === 0) {
          newBreakdown.splice(largeBillIndex, 1);
        }
        
        // Add equivalent in smaller bills (prefer 250, 100, 50)
        let remainingValue = valueToSplit;
        
        // Try to use 250 first
        if (remainingValue >= 250) {
          const count250 = Math.floor(remainingValue / 250);
          if (count250 > 0) {
            const existing250 = newBreakdown.find(item => item.denomination === 250);
            if (existing250) {
              existing250.count += count250;
              existing250.total += count250 * 250;
            } else {
              newBreakdown.push({
                denomination: 250,
                count: count250,
                total: count250 * 250
              });
            }
            remainingValue -= count250 * 250;
          }
        }
        
        // Then 100
        if (remainingValue >= 100) {
          const count100 = Math.floor(remainingValue / 100);
          if (count100 > 0) {
            const existing100 = newBreakdown.find(item => item.denomination === 100);
            if (existing100) {
              existing100.count += count100;
              existing100.total += count100 * 100;
            } else {
              newBreakdown.push({
                denomination: 100,
                count: count100,
                total: count100 * 100
              });
            }
            remainingValue -= count100 * 100;
          }
        }
        
        // Then 50
        if (remainingValue >= 50) {
          const count50 = Math.floor(remainingValue / 50);
          if (count50 > 0) {
            const existing50 = newBreakdown.find(item => item.denomination === 50);
            if (existing50) {
              existing50.count += count50;
              existing50.total += count50 * 50;
            } else {
              newBreakdown.push({
                denomination: 50,
                count: count50,
                total: count50 * 50
              });
            }
            remainingValue -= count50 * 50;
          }
        }
        
        // Add remainder as smallest bills
        if (remainingValue > 0) {
          const smallestBills = simpleGreedy(remainingValue, 0, false);
          smallestBills.breakdown.forEach(item => {
            const existing = newBreakdown.find(b => b.denomination === item.denomination);
            if (existing) {
              existing.count += item.count;
              existing.total += item.total;
            } else {
              newBreakdown.push({ ...item });
            }
          });
        }
      }
      
      return newBreakdown;
    },
    
    // Variation 2: Consolidate small bills
    (combo) => {
      const newBreakdown = [...combo.breakdown.map(item => ({ ...item }))];
      
      // Find small bills that can be consolidated
      const smallBills = newBreakdown.filter(item => item.denomination <= 100);
      let smallTotal = smallBills.reduce((sum, item) => sum + item.total, 0);
      
      if (smallTotal >= 250) {
        // Remove small bills
        smallBills.forEach(sb => {
          const index = newBreakdown.findIndex(item => 
            item.denomination === sb.denomination && item.count === sb.count
          );
          if (index >= 0) newBreakdown.splice(index, 1);
        });
        
        // Add 250 bills
        const count250 = Math.floor(smallTotal / 250);
        if (count250 > 0) {
          const existing250 = newBreakdown.find(item => item.denomination === 250);
          if (existing250) {
            existing250.count += count250;
            existing250.total += count250 * 250;
          } else {
            newBreakdown.push({
              denomination: 250,
              count: count250,
              total: count250 * 250
            });
          }
          smallTotal -= count250 * 250;
        }
        
        // Add remaining as original small bills
        if (smallTotal > 0) {
          const remainingResult = simpleGreedy(smallTotal, 0, false);
          remainingResult.breakdown.forEach(item => {
            const existing = newBreakdown.find(b => b.denomination === item.denomination);
            if (existing) {
              existing.count += item.count;
              existing.total += item.total;
            } else {
              newBreakdown.push({ ...item });
            }
          });
        }
      }
      
      return newBreakdown;
    },
    
    // Variation 3: Force use of specific denominations
    (combo) => {
      const newBreakdown = [...combo.breakdown.map(item => ({ ...item }))];
      
      // Ensure we use at least one of 100, 50, 25 if possible
      const denominationsToEnsure = [100, 50, 25];
      const totalValue = newBreakdown.reduce((sum, item) => sum + item.total, 0);
      
      for (const denom of denominationsToEnsure) {
        const hasDenom = newBreakdown.some(item => item.denomination === denom);
        const canAddDenom = totalValue >= denom;
        
        if (!hasDenom && canAddDenom) {
          // Remove some value to add this denomination
          let amountToRemove = denom;
          
          // Try to remove from large bills first
          for (let i = newBreakdown.length - 1; i >= 0 && amountToRemove > 0; i--) {
            const item = newBreakdown[i];
            if (item.denomination > denom && item.count > 0) {
              const valueToRemove = Math.min(amountToRemove, item.denomination);
              if (valueToRemove > 0) {
                item.count -= 1;
                item.total -= item.denomination;
                amountToRemove -= item.denomination;
                
                if (item.count === 0) {
                  newBreakdown.splice(i, 1);
                }
              }
            }
          }
          
          // Add the new denomination
          newBreakdown.push({
            denomination: denom,
            count: 1,
            total: denom
          });
          
          // Re-add the removed value in smaller denominations
          if (amountToRemove < 0) { // We removed too much
            const valueToAddBack = -amountToRemove;
            const addBackResult = simpleGreedy(valueToAddBack, 0, false);
            addBackResult.breakdown.forEach(item => {
              const existing = newBreakdown.find(b => b.denomination === item.denomination);
              if (existing) {
                existing.count += item.count;
                existing.total += item.total;
              } else {
                newBreakdown.push({ ...item });
              }
            });
          }
          
          break;
        }
      }
      
      return newBreakdown;
    }
  ];

  // Use the variation function based on index, or default to first
  const variationFunc = variations[variationIndex % variations.length] || variations[0];
  const newBreakdown = variationFunc(baseCombo);
  
  // Sort by denomination
  newBreakdown.sort((a, b) => b.denomination - a.denomination);
  
  // Calculate totals
  const totalAmount = newBreakdown.reduce((sum, item) => sum + item.total, 0);
  const totalNotes = newBreakdown.reduce((sum, item) => sum + item.count, 0);
  const newRemainder = givableAmount - totalAmount;
  
  return {
    key: `variation-${variationIndex}`,
    breakdown: newBreakdown,
    totalNotes: totalNotes,
    totalAmount: totalAmount,
    remainder: newRemainder + remainder,
    isExact: newRemainder === 0,
    strategyName: `Option ${variationIndex + 1}`,
    description: "Variation pour plus de choix"
  };
};

// Additional utility function for quick calculation
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