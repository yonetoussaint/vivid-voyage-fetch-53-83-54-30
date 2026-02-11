// src/utils/textUtils.ts
export const truncateText = (text: string, maxLength: number = 120): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};