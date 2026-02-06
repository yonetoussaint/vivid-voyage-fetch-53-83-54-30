export const getHashFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const bannerImages = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1500&h=500&fit=crop'
];

export const profileImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=300&fit=crop'
];