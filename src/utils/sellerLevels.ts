
export interface SellerLevel {
  name: string;
  icon: string;
  minSales: number;
  color: string;
  gradient: string;
}

export const SELLER_LEVELS: SellerLevel[] = [
  { name: 'Newcomer', icon: '🌱', minSales: 0, color: '#9CA3AF', gradient: 'from-gray-400 to-gray-500' },
  { name: 'Bronze', icon: '🥉', minSales: 10, color: '#CD7F32', gradient: 'from-orange-700 to-orange-900' },
  { name: 'Silver', icon: '🥈', minSales: 50, color: '#C0C0C0', gradient: 'from-gray-300 to-gray-500' },
  { name: 'Gold', icon: '🥇', minSales: 100, color: '#FFD700', gradient: 'from-yellow-400 to-yellow-600' },
  { name: 'Platinum', icon: '💎', minSales: 250, color: '#E5E4E2', gradient: 'from-slate-300 to-slate-500' },
  { name: 'Emerald', icon: '💚', minSales: 500, color: '#50C878', gradient: 'from-green-400 to-green-600' },
  { name: 'Sapphire', icon: '💙', minSales: 1000, color: '#0F52BA', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Ruby', icon: '❤️', minSales: 2000, color: '#E0115F', gradient: 'from-red-400 to-red-600' },
  { name: 'Diamond', icon: '💠', minSales: 5000, color: '#B9F2FF', gradient: 'from-cyan-300 to-blue-400' },
  { name: 'Master', icon: '⭐', minSales: 10000, color: '#FFD700', gradient: 'from-yellow-300 to-orange-400' },
  { name: 'Grandmaster', icon: '🌟', minSales: 25000, color: '#FFA500', gradient: 'from-orange-400 to-red-400' },
  { name: 'Elite', icon: '👑', minSales: 50000, color: '#DAA520', gradient: 'from-yellow-500 to-amber-600' },
  { name: 'Champion', icon: '🏆', minSales: 100000, color: '#FFD700', gradient: 'from-yellow-400 to-yellow-600' },
  { name: 'Legend', icon: '🔥', minSales: 250000, color: '#FF4500', gradient: 'from-orange-500 to-red-600' },
  { name: 'Mythic', icon: '✨', minSales: 500000, color: '#8B00FF', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Immortal', icon: '🌠', minSales: 1000000, color: '#4B0082', gradient: 'from-indigo-400 to-purple-600' },
  { name: 'Celestial', icon: '🌌', minSales: 2500000, color: '#191970', gradient: 'from-blue-500 to-indigo-700' },
  { name: 'Divine', icon: '👼', minSales: 5000000, color: '#FFFFFF', gradient: 'from-white to-blue-200' },
];

export const getSellerLevel = (totalSales: number): SellerLevel => {
  // Find the highest level the seller qualifies for
  for (let i = SELLER_LEVELS.length - 1; i >= 0; i--) {
    if (totalSales >= SELLER_LEVELS[i].minSales) {
      return SELLER_LEVELS[i];
    }
  }
  return SELLER_LEVELS[0]; // Default to Newcomer
};

export const getNextLevel = (totalSales: number): SellerLevel | null => {
  const currentLevel = getSellerLevel(totalSales);
  const currentIndex = SELLER_LEVELS.findIndex(level => level.name === currentLevel.name);
  
  if (currentIndex < SELLER_LEVELS.length - 1) {
    return SELLER_LEVELS[currentIndex + 1];
  }
  return null; // Already at max level
};

export const getProgressToNextLevel = (totalSales: number): number => {
  const currentLevel = getSellerLevel(totalSales);
  const nextLevel = getNextLevel(totalSales);
  
  if (!nextLevel) return 100; // Max level reached
  
  const currentMin = currentLevel.minSales;
  const nextMin = nextLevel.minSales;
  const progress = ((totalSales - currentMin) / (nextMin - currentMin)) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
};
