// Helper function to convert Tailwind gradient classes to inline styles
export const getGradientStyle = (gradientClasses: string): React.CSSProperties => {
  // Parse Tailwind gradient classes and convert to CSS gradient
  const colorMap: Record<string, string> = {
    'red-500': '#ef4444',
    'red-600': '#dc2626',
    'yellow-400': '#facc15',
    'yellow-500': '#eab308',
    'blue-500': '#3b82f6',
    'blue-600': '#2563eb',
    'purple-500': '#a855f7',
    'purple-600': '#9333ea',
    'pink-500': '#ec4899',
    'pink-600': '#db2777',
    'teal-400': '#2dd4bf',
    'teal-500': '#14b8a6',
    'green-500': '#22c55e',
    'green-600': '#16a34a',
    'indigo-500': '#6366f1',
    'indigo-600': '#4f46e5',
    'orange-400': '#fb923c',
    'orange-500': '#f97316'
  };

  const colors: string[] = [];
  const parts = gradientClasses.split(' ');
  
  parts.forEach(part => {
    if (part.startsWith('from-')) {
      const color = part.replace('from-', '');
      colors.push(colorMap[color] || color);
    } else if (part.startsWith('via-')) {
      const color = part.replace('via-', '');
      colors.push(colorMap[color] || color);
    } else if (part.startsWith('to-')) {
      const color = part.replace('to-', '');
      colors.push(colorMap[color] || color);
    }
  });

  if (colors.length === 0) return {};
  
  return {
    background: `linear-gradient(to right, ${colors.join(', ')})`
  };
};
