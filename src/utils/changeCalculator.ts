// Realistic Haitian Gourde denominations (no 1 gourde - smallest is 5 gourdes)
export const denominations = [1000, 500, 250, 100, 50, 25, 10, 5];

// Function to get the maximum amount we can give with denominations (round down to nearest 5)
export const getMaximumGivableAmount = (amount) => {
  const remainder = amount % 5;
  return amount - remainder; // Round down to nearest multiple of 5
};

// Helper: Standard greedy algorithm
const greedyAlgorithm = (amt, denoms) => {
  let remaining = amt;
  const breakdown = [];
  for (const denom of denoms) {
    if (remaining >= denom) {
      const count = Math.floor(remaining / denom);
      remaining -= count * denom;
      if (count > 0) {
        breakdown.push({ denomination: denom, count, total: denom * count });
      }
    }
  }
  return breakdown;
};

// Strategy 1: Classic greedy (fewest bills, largest denominations first)
const strategy1 = (amt, denoms) => {
  const breakdown = greedyAlgorithm(amt, denoms);
  return { 
    breakdown, 
    strategyName: "Classique (moins de billets)",
    description: "Utilise les plus gros billets d'abord"
  };
};

// Strategy 2: Prefer 500 HTG bills, avoid 1000 HTG when possible
const strategy2 = (amt, denoms) => {
  let remaining = amt;
  const breakdown = [];

  // Avoid 1000 HTG bills - use 500 HTG instead
  if (remaining >= 1000) {
    const possible1000s = Math.floor(remaining / 1000);
    // Convert each 1000 to two 500s
    const fiveHundredCount = possible1000s * 2;
    if (fiveHundredCount > 0) {
      breakdown.push({ 
        denomination: 500, 
        count: fiveHundredCount, 
        total: possible1000s * 1000 
      });
      remaining -= possible1000s * 1000;
    }
  }

  // Use greedy for the rest with adjusted denominations
  const remainingDenoms = [500, 250, 100, 50, 25, 10, 5];
  for (const denom of remainingDenoms) {
    if (remaining >= denom) {
      const count = Math.floor(remaining / denom);
      remaining -= count * denom;
      if (count > 0) {
        breakdown.push({ denomination: denom, count, total: denom * count });
      }
    }
  }

  return { 
    breakdown, 
    strategyName: "Préfère billets de 500",
    description: "Évite les billets de 1000 HTG"
  };
};

// Strategy 3: Use more smaller bills, avoid large bills for small amounts
const strategy3 = (amt, denoms) => {
  let remaining = amt;
  const breakdown = [];

  // For amounts < 500, don't use 1000 or 500 bills
  const adjustedDenoms = amt < 500 
    ? [250, 100, 50, 25, 10, 5]  // Skip 1000 and 500 for small amounts
    : [1000, 500, 250, 100, 50, 25, 10, 5];

  // Use greedy but with preference for smaller bills
  for (const denom of adjustedDenoms) {
    if (remaining >= denom) {
      // For smaller bills, use more of them
      let count = Math.floor(remaining / denom);
      if (denom <= 100) {
        // For bills <= 100, use more (up to 5) instead of larger bills
        count = Math.min(count, 5);
      }
      remaining -= count * denom;
      if (count > 0) {
        breakdown.push({ denomination: denom, count, total: denom * count });
      }
    }
  }

  // Fill any remaining with smallest denominations
  if (remaining > 0) {
    for (const denom of [10, 5]) {
      if (remaining >= denom) {
        const count = Math.floor(remaining / denom);
        remaining -= count * denom;
        if (count > 0) {
          breakdown.push({ denomination: denom, count, total: denom * count });
        }
      }
    }
  }

  return { 
    breakdown, 
    strategyName: "Plus de petits billets",
    description: "Privilégie les billets moyens et petits"
  };
};

// Strategy 4: Balanced mix - use equal distribution of bill sizes
const strategy4 = (amt, denoms) => {
  let remaining = amt;
  const breakdown = [];

  // Calculate target bill counts based on amount
  if (amt >= 1000) {
    // For large amounts, use 1-2 of each large denomination
    const largeBills = [1000, 500, 250];
    for (const denom of largeBills) {
      if (remaining >= denom) {
        const maxPossible = Math.floor(remaining / denom);
        const count = Math.min(maxPossible, 2); // Max 2 of each large bill
        if (count > 0) {
          breakdown.push({ denomination: denom, count, total: denom * count });
          remaining -= count * denom;
        }
      }
    }
  }

  // Use medium bills (100, 50)
  const mediumBills = [100, 50];
  for (const denom of mediumBills) {
    if (remaining >= denom) {
      const maxPossible = Math.floor(remaining / denom);
      const count = Math.min(maxPossible, 4); // Max 4 of each medium bill
      if (count > 0) {
        breakdown.push({ denomination: denom, count, total: denom * count });
        remaining -= count * denom;
      }
    }
  }

  // Use small bills for remainder
  if (remaining > 0) {
    const smallBills = [25, 10, 5];
    for (const denom of smallBills) {
      if (remaining >= denom) {
        const count = Math.floor(remaining / denom);
        remaining -= count * denom;
        if (count > 0) {
          breakdown.push({ denomination: denom, count, total: denom * count });
        }
      }
    }
  }

  return { 
    breakdown, 
    strategyName: "Mix équilibré",
    description: "Répartit sur différentes tailles"
  };
};

// Strategy 5: Alternative - use only certain bill sizes
const strategy5 = (amt, denoms) => {
  let remaining = amt;
  const breakdown = [];

  // Try to use only 250, 100, 50 bills when possible
  const preferredBills = [250, 100, 50, 25, 10, 5];

  for (const denom of preferredBills) {
    if (remaining >= denom) {
      const count = Math.floor(remaining / denom);
      remaining -= count * denom;
      if (count > 0) {
        breakdown.push({ denomination: denom, count, total: denom * count });
      }
    }
  }

  return { 
    breakdown, 
    strategyName: "Billets standards",
    description: "Utilise 250, 100, 50 HTG principalement"
  };
};

// Main function to generate 4 truly different change combinations
export const generateChangeCombinations = (changeNeeded) => {
  if (changeNeeded <= 0) return [];

  const amount = Math.round(changeNeeded);
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;

  if (givableAmount === 0) {
    // If amount is less than 5, we can't give any change
    return [
      {
        key: 'no-change-1',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: remainder,
        isExact: false,
        strategyName: "Aucun billet possible"
      },
      {
        key: 'no-change-2',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: remainder,
        isExact: false,
        strategyName: "Montant < 5 HTG"
      },
      {
        key: 'no-change-3',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: remainder,
        isExact: false,
        strategyName: "Trop petit"
      },
      {
        key: 'no-change-4',
        breakdown: [],
        totalNotes: 0,
        totalAmount: 0,
        remainder: remainder,
        isExact: false,
        strategyName: "Rien à donner"
      }
    ];
  }

  const combinations = [];

  // Apply the 4 best strategies (we have 5, will pick the most different 4)
  const allStrategies = [strategy1, strategy2, strategy3, strategy4, strategy5];
  const results = allStrategies.map(strat => strat(givableAmount, denominations));

  // Pick the 4 most different combinations
  const selectedCombinations = [];
  const seenPatterns = new Set();

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const patternKey = result.breakdown.map(item => `${item.denomination}:${item.count}`).join('|');

    if (!seenPatterns.has(patternKey) && selectedCombinations.length < 4) {
      seenPatterns.add(patternKey);

      // Calculate totals
      const totalAmount = result.breakdown.reduce((sum, item) => sum + item.total, 0);
      const totalNotes = result.breakdown.reduce((sum, item) => sum + item.count, 0);

      selectedCombinations.push({
        key: `combo-${selectedCombinations.length + 1}`,
        breakdown: result.breakdown,
        totalNotes,
        totalAmount,
        remainder,
        isExact: remainder === 0,
        strategyName: result.strategyName,
        description: result.description,
        strategyIndex: selectedCombinations.length
      });
    }
  }

  // If we still don't have 4 unique combinations, create variations
  while (selectedCombinations.length < 4) {
    const baseCombo = selectedCombinations[selectedCombinations.length - 1] || selectedCombinations[0];
    const variationIndex = selectedCombinations.length;

    // Create a variation by adjusting one denomination
    let variationBreakdown = [...baseCombo.breakdown];
    if (variationBreakdown.length > 0) {
      // Try to adjust the first bill
      const firstBill = variationBreakdown[0];
      if (firstBill.count > 1) {
        // Reduce by 1 and add smaller bills
        variationBreakdown[0] = {
          ...firstBill,
          count: firstBill.count - 1,
          total: (firstBill.count - 1) * firstBill.denomination
        };

        // Add equivalent in smaller bills
        const remainingValue = firstBill.denomination;
        // Find smaller denominations to add
        const smallerDenoms = denominations.filter(d => d < firstBill.denomination);
        let tempRemaining = remainingValue;
        for (const denom of smallerDenoms) {
          if (tempRemaining >= denom) {
            const count = Math.floor(tempRemaining / denom);
            tempRemaining -= count * denom;
            if (count > 0) {
              variationBreakdown.push({
                denomination: denom,
                count,
                total: denom * count
              });
            }
          }
        }
      }
    }

    const totalAmount = variationBreakdown.reduce((sum, item) => sum + item.total, 0);
    const totalNotes = variationBreakdown.reduce((sum, item) => sum + item.count, 0);

    selectedCombinations.push({
      key: `variation-${variationIndex}`,
      breakdown: variationBreakdown,
      totalNotes,
      totalAmount,
      remainder,
      isExact: remainder === 0,
      strategyName: `${baseCombo.strategyName} (variante)`,
      description: "Variation de la méthode principale",
      strategyIndex: variationIndex
    });
  }

  // Sort by: fewest notes first, then strategy order
  return selectedCombinations.sort((a, b) => {
    if (a.totalNotes !== b.totalNotes) {
      return a.totalNotes - b.totalNotes;
    }
    return a.strategyIndex - b.strategyIndex;
  });
};