// Haitian Gourde denominations with realistic priorities
export const denominations = [
  { value: 1000, name: 'Mille', priority: 1, type: 'large' },
  { value: 500, name: 'Cinq-cents', priority: 2, type: 'large' },
  { value: 250, name: 'Deux-cents-cinquante', priority: 3, type: 'medium' },
  { value: 100, name: 'Cent', priority: 4, type: 'medium' },
  { value: 50, name: 'Cinquante', priority: 5, type: 'small' },
  { value: 25, name: 'Vingt-cinq', priority: 6, type: 'small' },
  { value: 10, name: 'Dix', priority: 7, type: 'coin' },
  { value: 5, name: 'Cinq', priority: 8, type: 'coin' }
];

// Weights for different strategies
const STRATEGY_WEIGHTS = {
  MIN_BILLS: { large: 0.9, medium: 0.6, small: 0.3, coin: 0.1 },
  BALANCED: { large: 0.7, medium: 0.8, small: 0.7, coin: 0.5 },
  SMALL_BILLS: { large: 0.3, medium: 0.7, small: 0.9, coin: 0.8 },
  CUSTOM: { 1000: 0.1, 500: 0.9, 250: 0.8, 100: 0.7, 50: 0.6, 25: 0.5, 10: 0.4, 5: 0.3 }
};

// Configuration
const CONFIG = {
  MIN_DENOMINATION: 5,
  MAX_BILLS_PER_DENOMINATION: 20,
  PREFERRED_COMBINATIONS: [500, 250, 100], // Prefer bills of 500, 250, 100
  AVOID_EXCESSIVE: [1000], // Avoid too many of these
  OPTIMAL_RANGE: {
    large: { min: 1, max: 3 },
    medium: { min: 1, max: 5 },
    small: { min: 0, max: 8 },
    coin: { min: 0, max: 10 }
  }
};

// Function to get the maximum amount we can give with denominations (round down to nearest 5)
export const getMaximumGivableAmount = (amount) => {
  const remainder = amount % CONFIG.MIN_DENOMINATION;
  return amount - remainder;
};

// Helper to calculate bill distribution score
const calculateDistributionScore = (breakdown) => {
  if (breakdown.length === 0) return 0;
  
  let score = 0;
  const totalBills = breakdown.reduce((sum, item) => sum + item.count, 0);
  
  // Penalize too many bills
  if (totalBills > 20) score -= (totalBills - 20) * 2;
  
  // Reward using preferred denominations
  breakdown.forEach(item => {
    if (CONFIG.PREFERRED_COMBINATIONS.includes(item.denomination)) {
      score += item.count * 0.5;
    }
    
    // Penalize excessive use of certain denominations
    if (CONFIG.AVOID_EXCESSIVE.includes(item.denomination) && item.count > 2) {
      score -= (item.count - 2) * 1.5;
    }
  });
  
  // Reward variety in denominations (not too concentrated)
  const uniqueDenoms = new Set(breakdown.map(item => item.denomination)).size;
  score += uniqueDenoms * 0.3;
  
  return score;
};

// Dynamic programming algorithm for optimal change
const dpChangeMaking = (amount, denominations, strategyWeights) => {
  const sortedDenoms = [...denominations].sort((a, b) => b.value - a.value);
  const denomValues = sortedDenoms.map(d => d.value);
  const denomTypes = sortedDenoms.reduce((acc, d) => {
    acc[d.value] = d.type;
    return acc;
  }, {});
  
  // Initialize DP table
  const dp = Array(amount + 1).fill(Infinity);
  const bills = Array(amount + 1).fill(null);
  const breakdowns = Array(amount + 1).fill(null);
  
  dp[0] = 0;
  bills[0] = {};
  breakdowns[0] = [];
  
  for (let i = 1; i <= amount; i++) {
    for (const denom of denomValues) {
      if (denom <= i) {
        const prev = i - denom;
        if (dp[prev] !== Infinity) {
          // Calculate new bill count
          const prevBills = bills[prev] || {};
          const newBills = { ...prevBills };
          newBills[denom] = (newBills[denom] || 0) + 1;
          
          // Calculate weighted cost based on strategy
          const type = denomTypes[denom];
          const weight = strategyWeights[type] || strategyWeights[denom] || 1;
          const newCost = dp[prev] + weight;
          
          // Check if this is better
          if (newCost < dp[i]) {
            dp[i] = newCost;
            bills[i] = newBills;
            
            // Build breakdown
            const prevBreakdown = breakdowns[prev];
            const newBreakdown = [...prevBreakdown];
            const existingIdx = newBreakdown.findIndex(item => item.denomination === denom);
            if (existingIdx >= 0) {
              newBreakdown[existingIdx] = {
                ...newBreakdown[existingIdx],
                count: newBreakdown[existingIdx].count + 1,
                total: (newBreakdown[existingIdx].count + 1) * denom
              };
            } else {
              newBreakdown.push({
                denomination: denom,
                count: 1,
                total: denom
              });
            }
            breakdowns[i] = newBreakdown;
          }
        }
      }
    }
  }
  
  return {
    possible: dp[amount] !== Infinity,
    totalBills: Object.values(bills[amount] || {}).reduce((a, b) => a + b, 0),
    breakdown: breakdowns[amount] || [],
    score: dp[amount]
  };
};

// Genetic algorithm for finding diverse combinations
const geneticAlgorithm = (amount, populationSize = 50, generations = 100) => {
  // Initialize population
  let population = [];
  
  for (let i = 0; i < populationSize; i++) {
    // Generate random solution
    let remaining = amount;
    const breakdown = [];
    const availableDenoms = [...denominations];
    
    // Shuffle denominations for diversity
    for (let j = availableDenoms.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [availableDenoms[j], availableDenoms[k]] = [availableDenoms[k], availableDenoms[j]];
    }
    
    for (const denom of availableDenoms) {
      if (remaining >= denom.value) {
        const maxCount = Math.min(
          Math.floor(remaining / denom.value),
          CONFIG.MAX_BILLS_PER_DENOMINATION
        );
        if (maxCount > 0) {
          const count = Math.floor(Math.random() * maxCount) + 1;
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
    
    // Fill with smallest denomination if there's remainder
    if (remaining > 0) {
      const smallest = denominations[denominations.length - 1];
      const count = Math.floor(remaining / smallest.value);
      if (count > 0) {
        breakdown.push({
          denomination: smallest.value,
          count,
          total: count * smallest.value
        });
        remaining -= count * smallest.value;
      }
    }
    
    population.push({
      breakdown,
      remainder: remaining,
      fitness: calculateFitness(breakdown, remaining)
    });
  }
  
  // Evolve population
  for (let gen = 0; gen < generations; gen++) {
    // Sort by fitness
    population.sort((a, b) => b.fitness - a.fitness);
    
    // Keep top 50%
    const keepCount = Math.floor(populationSize / 2);
    const newPopulation = population.slice(0, keepCount);
    
    // Generate offspring
    while (newPopulation.length < populationSize) {
      const parent1 = population[Math.floor(Math.random() * keepCount)];
      const parent2 = population[Math.floor(Math.random() * keepCount)];
      
      const child = crossover(parent1, parent2, amount);
      const mutatedChild = mutate(child, amount);
      
      newPopulation.push(mutatedChild);
    }
    
    population = newPopulation;
  }
  
  // Return best solutions
  population.sort((a, b) => b.fitness - a.fitness);
  return population.slice(0, 4); // Return top 4 solutions
};

const calculateFitness = (breakdown, remainder) => {
  let fitness = 1000;
  
  // Penalize remainder heavily
  fitness -= remainder * 100;
  
  // Reward using fewer bills (but not too few)
  const totalBills = breakdown.reduce((sum, item) => sum + item.count, 0);
  const optimalBills = Math.ceil(breakdown.reduce((sum, item) => sum + item.total, 0) / 500);
  
  if (totalBills <= optimalBills * 1.5 && totalBills >= optimalBills * 0.5) {
    fitness += 50;
  } else {
    fitness -= Math.abs(totalBills - optimalBills) * 10;
  }
  
  // Reward using preferred denominations
  breakdown.forEach(item => {
    if (CONFIG.PREFERRED_COMBINATIONS.includes(item.denomination)) {
      fitness += item.count * 20;
    }
    
    // Penalize too many of the same bill
    if (item.count > CONFIG.OPTIMAL_RANGE[getDenomType(item.denomination)]?.max || 5) {
      fitness -= (item.count - 5) * 5;
    }
  });
  
  // Reward diversity
  const uniqueDenoms = new Set(breakdown.map(item => item.denomination)).size;
  fitness += uniqueDenoms * 15;
  
  // Reward proximity to target amount
  const total = breakdown.reduce((sum, item) => sum + item.total, 0);
  fitness -= Math.abs(total - (total + remainder)) * 2;
  
  return Math.max(0, fitness);
};

const getDenomType = (value) => {
  const denom = denominations.find(d => d.value === value);
  return denom ? denom.type : 'coin';
};

const crossover = (parent1, parent2, targetAmount) => {
  // Combine breakdowns
  const combined = [...parent1.breakdown, ...parent2.breakdown];
  const merged = {};
  
  combined.forEach(item => {
    if (!merged[item.denomination]) {
      merged[item.denomination] = { ...item };
    } else {
      merged[item.denomination].count += item.count;
      merged[item.denomination].total += item.total;
    }
  });
  
  // Adjust to meet target
  let breakdown = Object.values(merged);
  let total = breakdown.reduce((sum, item) => sum + item.total, 0);
  
  // Adjust up or down
  while (Math.abs(total - targetAmount) > CONFIG.MIN_DENOMINATION) {
    if (total < targetAmount) {
      // Add bills
      const availableDenoms = denominations.filter(d => d.value <= targetAmount - total);
      if (availableDenoms.length > 0) {
        const denom = availableDenoms[0].value;
        const existing = breakdown.find(item => item.denomination === denom);
        if (existing) {
          existing.count += 1;
          existing.total += denom;
        } else {
          breakdown.push({ denomination: denom, count: 1, total: denom });
        }
        total += denom;
      } else {
        break;
      }
    } else {
      // Remove bills
      if (breakdown.length > 0) {
        const lastItem = breakdown[breakdown.length - 1];
        if (lastItem.count > 1) {
          lastItem.count -= 1;
          lastItem.total -= lastItem.denomination;
        } else {
          breakdown.pop();
        }
        total -= lastItem.denomination;
      } else {
        break;
      }
    }
  }
  
  const remainder = targetAmount - total;
  return {
    breakdown,
    remainder: Math.max(0, remainder),
    fitness: calculateFitness(breakdown, remainder)
  };
};

const mutate = (solution, targetAmount) => {
  const breakdown = solution.breakdown.map(item => ({ ...item }));
  
  // Random mutation
  if (Math.random() < 0.3) {
    // Add or remove a random bill
    const denomValues = denominations.map(d => d.value);
    const randomDenom = denomValues[Math.floor(Math.random() * denomValues.length)];
    
    if (Math.random() < 0.5) {
      // Add
      const existing = breakdown.find(item => item.denomination === randomDenom);
      if (existing) {
        existing.count += 1;
        existing.total += randomDenom;
      } else {
        breakdown.push({ denomination: randomDenom, count: 1, total: randomDenom });
      }
    } else {
      // Remove
      const existingIdx = breakdown.findIndex(item => item.denomination === randomDenom);
      if (existingIdx >= 0) {
        if (breakdown[existingIdx].count > 1) {
          breakdown[existingIdx].count -= 1;
          breakdown[existingIdx].total -= randomDenom;
        } else {
          breakdown.splice(existingIdx, 1);
        }
      }
    }
  }
  
  // Optimize: Replace with better combinations
  if (Math.random() < 0.2) {
    // Try to consolidate smaller bills into larger ones
    const smallBills = breakdown.filter(item => item.denomination <= 100);
    if (smallBills.length > 2) {
      const smallTotal = smallBills.reduce((sum, item) => sum + item.total, 0);
      const largeDenoms = denominations.filter(d => d.value > 100 && d.value <= smallTotal);
      
      if (largeDenoms.length > 0) {
        const bestLarge = largeDenoms[0].value;
        const count = Math.floor(smallTotal / bestLarge);
        
        if (count > 0) {
          // Remove small bills
          smallBills.forEach(smallBill => {
            const idx = breakdown.findIndex(item => 
              item.denomination === smallBill.denomination && item.count === smallBill.count
            );
            if (idx >= 0) breakdown.splice(idx, 1);
          });
          
          // Add large bill
          breakdown.push({
            denomination: bestLarge,
            count,
            total: count * bestLarge
          });
          
          // Add remainder
          const remainder = smallTotal % bestLarge;
          if (remainder > 0) {
            const smallDenom = denominations.find(d => d.value === 5)?.value || 5;
            const smallCount = Math.floor(remainder / smallDenom);
            if (smallCount > 0) {
              breakdown.push({
                denomination: smallDenom,
                count: smallCount,
                total: smallCount * smallDenom
              });
            }
          }
        }
      }
    }
  }
  
  const total = breakdown.reduce((sum, item) => sum + item.total, 0);
  const remainder = Math.max(0, targetAmount - total);
  
  return {
    breakdown,
    remainder,
    fitness: calculateFitness(breakdown, remainder)
  };
};

// Smart greedy algorithm with look-ahead
const smartGreedy = (amount, strategy = 'MIN_BILLS') => {
  let remaining = amount;
  const breakdown = [];
  const weights = STRATEGY_WEIGHTS[strategy] || STRATEGY_WEIGHTS.MIN_BILLS;
  
  // Sort denominations by weighted value
  const weightedDenoms = denominations.map(denom => ({
    ...denom,
    weight: weights[denom.type] || weights[denom.value] || 1
  })).sort((a, b) => {
    // Sort by value/weight ratio
    const ratioA = a.value / a.weight;
    const ratioB = b.value / b.weight;
    return ratioB - ratioA;
  });
  
  for (const denom of weightedDenoms) {
    if (remaining >= denom.value) {
      // Calculate maximum possible count considering constraints
      let maxCount = Math.floor(remaining / denom.value);
      
      // Apply constraints based on denomination type
      const constraints = CONFIG.OPTIMAL_RANGE[denom.type];
      if (constraints) {
        maxCount = Math.min(maxCount, constraints.max);
      }
      
      if (maxCount > 0) {
        // Use look-ahead to determine optimal count
        let optimalCount = maxCount;
        
        // Check if using fewer of this bill would allow better combination later
        for (let count = maxCount; count > 0; count--) {
          const usedValue = count * denom.value;
          const nextRemaining = remaining - usedValue;
          
          // Check if next remaining can be efficiently made with remaining denominations
          const nextDenoms = weightedDenoms.filter(d => d.value < denom.value);
          let canMakeEfficiently = true;
          
          for (const nextDenom of nextDenoms) {
            if (nextRemaining >= nextDenom.value) {
              const nextCount = Math.floor(nextRemaining / nextDenom.value);
              if (nextCount > (CONFIG.OPTIMAL_RANGE[nextDenom.type]?.max || 10)) {
                canMakeEfficiently = false;
                break;
              }
            }
          }
          
          if (canMakeEfficiently) {
            optimalCount = count;
            break;
          }
        }
        
        if (optimalCount > 0) {
          const value = optimalCount * denom.value;
          remaining -= value;
          breakdown.push({
            denomination: denom.value,
            count: optimalCount,
            total: value
          });
        }
      }
    }
  }
  
  // Fill any remaining with smallest denomination
  if (remaining > 0) {
    const smallest = denominations[denominations.length - 1];
    const count = Math.floor(remaining / smallest.value);
    if (count > 0) {
      breakdown.push({
        denomination: smallest.value,
        count,
        total: count * smallest.value
      });
      remaining -= count * smallest.value;
    }
  }
  
  return {
    breakdown,
    remainder: remaining,
    totalBills: breakdown.reduce((sum, item) => sum + item.count, 0)
  };
};

// Main function to generate 4 truly different and intelligent change combinations
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
        description: "Impossible de donner de la monnaie pour moins de 5 HTG",
        efficiency: 0
      }
    ];
  }
  
  const combinations = [];
  
  // Strategy 1: Minimum bills (traditional greedy optimized)
  const minBillsResult = smartGreedy(givableAmount, 'MIN_BILLS');
  combinations.push({
    key: 'strategy-min-bills',
    breakdown: minBillsResult.breakdown,
    totalNotes: minBillsResult.totalBills,
    totalAmount: minBillsResult.breakdown.reduce((sum, item) => sum + item.total, 0),
    remainder: minBillsResult.remainder + remainder,
    isExact: (minBillsResult.remainder + remainder) === 0,
    strategyName: "Minimum de billets",
    description: "Utilise le moins de billets possible",
    efficiency: calculateEfficiency(minBillsResult.breakdown, minBillsResult.totalBills)
  });
  
  // Strategy 2: Balanced approach
  const balancedResult = smartGreedy(givableAmount, 'BALANCED');
  combinations.push({
    key: 'strategy-balanced',
    breakdown: balancedResult.breakdown,
    totalNotes: balancedResult.totalBills,
    totalAmount: balancedResult.breakdown.reduce((sum, item) => sum + item.total, 0),
    remainder: balancedResult.remainder + remainder,
    isExact: (balancedResult.remainder + remainder) === 0,
    strategyName: "Approche équilibrée",
    description: "Bon compromis entre grosses et petites coupures",
    efficiency: calculateEfficiency(balancedResult.breakdown, balancedResult.totalBills)
  });
  
  // Strategy 3: Prefer smaller bills (for customer convenience)
  const smallBillsResult = smartGreedy(givableAmount, 'SMALL_BILLS');
  combinations.push({
    key: 'strategy-small-bills',
    breakdown: smallBillsResult.breakdown,
    totalNotes: smallBillsResult.totalBills,
    totalAmount: smallBillsResult.breakdown.reduce((sum, item) => sum + item.total, 0),
    remainder: smallBillsResult.remainder + remainder,
    isExact: (smallBillsResult.remainder + remainder) === 0,
    strategyName: "Plus de petites coupures",
    description: "Privilégie les billets de 250, 100, 50 HTG",
    efficiency: calculateEfficiency(smallBillsResult.breakdown, smallBillsResult.totalBills)
  });
  
  // Strategy 4: Genetic algorithm solution (most optimized)
  const geneticResults = geneticAlgorithm(givableAmount, 30, 50);
  if (geneticResults.length > 0) {
    const bestGenetic = geneticResults[0];
    combinations.push({
      key: 'strategy-genetic',
      breakdown: bestGenetic.breakdown,
      totalNotes: bestGenetic.breakdown.reduce((sum, item) => sum + item.count, 0),
      totalAmount: bestGenetic.breakdown.reduce((sum, item) => sum + item.total, 0),
      remainder: bestGenetic.remainder + remainder,
      isExact: (bestGenetic.remainder + remainder) === 0,
      strategyName: "Solution optimisée",
      description: "Algorithme intelligent pour la meilleure distribution",
      efficiency: calculateEfficiency(bestGenetic.breakdown, bestGenetic.breakdown.reduce((sum, item) => sum + item.count, 0))
    });
  }
  
  // Strategy 5: Dynamic programming (optimal solution)
  const dpResult = dpChangeMaking(givableAmount, denominations, STRATEGY_WEIGHTS.CUSTOM);
  if (dpResult.possible) {
    combinations.push({
      key: 'strategy-dp',
      breakdown: dpResult.breakdown,
      totalNotes: dpResult.totalBills,
      totalAmount: dpResult.breakdown.reduce((sum, item) => sum + item.total, 0),
      remainder: remainder,
      isExact: remainder === 0,
      strategyName: "Solution mathématique",
      description: "Solution optimale par programmation dynamique",
      efficiency: calculateEfficiency(dpResult.breakdown, dpResult.totalBills)
    });
  }
  
  // Remove duplicates and ensure we have exactly 4 unique strategies
  const uniqueCombinations = [];
  const seenHashes = new Set();
  
  for (const combo of combinations) {
    const hash = combo.breakdown
      .map(item => `${item.denomination}:${item.count}`)
      .sort()
      .join('|');
    
    if (!seenHashes.has(hash) && uniqueCombinations.length < 4) {
      seenHashes.add(hash);
      uniqueCombinations.push(combo);
    }
  }
  
  // If we don't have 4 unique, generate variations
  if (uniqueCombinations.length < 4) {
    const baseCombo = uniqueCombinations[0];
    for (let i = uniqueCombinations.length; i < 4; i++) {
      const variation = generateVariation(baseCombo, givableAmount, i);
      uniqueCombinations.push(variation);
    }
  }
  
  // Sort by efficiency (higher is better)
  return uniqueCombinations.sort((a, b) => b.efficiency - a.efficiency);
};

const calculateEfficiency = (breakdown, totalBills) => {
  if (breakdown.length === 0 || totalBills === 0) return 0;
  
  let efficiency = 100;
  
  // Reward using fewer bills
  const avgValue = breakdown.reduce((sum, item) => sum + item.total, 0) / totalBills;
  efficiency += avgValue / 10;
  
  // Reward using preferred denominations
  breakdown.forEach(item => {
    if (CONFIG.PREFERRED_COMBINATIONS.includes(item.denomination)) {
      efficiency += 15;
    }
  });
  
  // Penalize using too many of one denomination
  const maxCount = Math.max(...breakdown.map(item => item.count));
  if (maxCount > 5) {
    efficiency -= (maxCount - 5) * 5;
  }
  
  // Reward diversity
  const uniqueDenoms = breakdown.length;
  efficiency += uniqueDenoms * 5;
  
  return Math.max(0, efficiency);
};

const generateVariation = (baseCombo, targetAmount, index) => {
  const breakdown = baseCombo.breakdown.map(item => ({ ...item }));
  
  // Apply different variation strategies based on index
  switch (index % 3) {
    case 0:
      // Consolidate: Try to replace multiple small bills with larger ones
      const smallBills = breakdown.filter(item => item.denomination <= 100);
      if (smallBills.length > 1) {
        const smallTotal = smallBills.reduce((sum, item) => sum + item.total, 0);
        const largerDenom = denominations.find(d => d.value > 100 && d.value <= smallTotal);
        if (largerDenom) {
          const count = Math.floor(smallTotal / largerDenom.value);
          if (count > 0) {
            // Remove small bills
            smallBills.forEach(sb => {
              const idx = breakdown.findIndex(item => 
                item.denomination === sb.denomination && item.count === sb.count
              );
              if (idx >= 0) breakdown.splice(idx, 1);
            });
            
            // Add larger bill
            breakdown.push({
              denomination: largerDenom.value,
              count,
              total: count * largerDenom.value
            });
            
            // Add remainder
            const remainder = smallTotal % largerDenom.value;
            if (remainder > 0) {
              const smallest = denominations[denominations.length - 1].value;
              const smallCount = Math.floor(remainder / smallest);
              if (smallCount > 0) {
                breakdown.push({
                  denomination: smallest,
                  count: smallCount,
                  total: smallCount * smallest
                });
              }
            }
          }
        }
      }
      break;
      
    case 1:
      // Split: Replace one large bill with smaller ones
      const largeBill = breakdown.find(item => item.denomination >= 500);
      if (largeBill && largeBill.count >= 1) {
        const value = largeBill.denomination;
        // Find smaller denominations that add up to the value
        const smallerDenoms = denominations.filter(d => d.value < value && d.value >= 100);
        if (smallerDenoms.length > 0) {
          // Remove the large bill
          if (largeBill.count > 1) {
            largeBill.count -= 1;
            largeBill.total -= value;
          } else {
            const idx = breakdown.indexOf(largeBill);
            breakdown.splice(idx, 1);
          }
          
          // Add smaller bills (prefer 250 and 100)
          let remaining = value;
          for (const denom of [250, 100, 50]) {
            if (remaining >= denom) {
              const count = Math.floor(remaining / denom);
              if (count > 0) {
                breakdown.push({
                  denomination: denom,
                  count,
                  total: count * denom
                });
                remaining -= count * denom;
              }
            }
          }
          
          // Add any remainder as smallest bills
          if (remaining > 0) {
            const smallest = denominations[denominations.length - 1].value;
            const count = Math.floor(remaining / smallest);
            if (count > 0) {
              breakdown.push({
                denomination: smallest,
                count,
                total: count * smallest
              });
            }
          }
        }
      }
      break;
      
    case 2:
      // Redistribute: Even out bill counts
      const totalBills = breakdown.reduce((sum, item) => sum + item.count, 0);
      const avgBillsPerDenom = totalBills / breakdown.length;
      
      breakdown.forEach(item => {
        if (item.count > avgBillsPerDenom * 1.5) {
          // Reduce this denomination and add others
          const reduceBy = Math.floor((item.count - avgBillsPerDenom) / 2);
          if (reduceBy > 0) {
            item.count -= reduceBy;
            item.total -= reduceBy * item.denomination;
            
            // Add equivalent value in smaller denominations
            let remainingValue = reduceBy * item.denomination;
            const smallerDenoms = denominations.filter(d => d.value < item.denomination);
            
            for (const denom of smallerDenoms) {
              if (remainingValue >= denom.value) {
                const count = Math.floor(remainingValue / denom.value);
                if (count > 0) {
                  const existing = breakdown.find(b => b.denomination === denom.value);
                  if (existing) {
                    existing.count += count;
                    existing.total += count * denom.value;
                  } else {
                    breakdown.push({
                      denomination: denom.value,
                      count,
                      total: count * denom.value
                    });
                  }
                  remainingValue -= count * denom.value;
                }
              }
            }
          }
        }
      });
      break;
  }
  
  const totalAmount = breakdown.reduce((sum, item) => sum + item.total, 0);
  const totalNotes = breakdown.reduce((sum, item) => sum + item.count, 0);
  const calculatedRemainder = targetAmount - totalAmount;
  
  return {
    key: `variation-${index}`,
    breakdown,
    totalNotes,
    totalAmount,
    remainder: Math.max(0, calculatedRemainder),
    isExact: calculatedRemainder === 0,
    strategyName: `Variante ${index + 1}`,
    description: "Adaptation pour plus de flexibilité",
    efficiency: calculateEfficiency(breakdown, totalNotes)
  };
};

// Additional utility function for quick calculations
export const calculateOptimalChange = (amount, preference = 'balanced') => {
  const givableAmount = getMaximumGivableAmount(amount);
  const remainder = amount - givableAmount;
  
  let result;
  switch (preference) {
    case 'minBills':
      result = smartGreedy(givableAmount, 'MIN_BILLS');
      break;
    case 'smallBills':
      result = smartGreedy(givableAmount, 'SMALL_BILLS');
      break;
    case 'balanced':
    default:
      result = smartGreedy(givableAmount, 'BALANCED');
      break;
  }
  
  return {
    breakdown: result.breakdown,
    totalAmount: result.breakdown.reduce((sum, item) => sum + item.total, 0),
    totalBills: result.totalBills,
    remainder: result.remainder + remainder,
    givableAmount,
    originalAmount: amount
  };
};