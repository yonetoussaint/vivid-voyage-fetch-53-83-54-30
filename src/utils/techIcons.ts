// Base URL for all icons - using skillicons.dev
const ICON_CDN = 'https://skillicons.dev/icons?i=';

// Complete mapping of available skillicons.dev IDs
// You can check all available icons at: https://skillicons.dev/

export const techIcons: Record<string, { 
  id: string;        // skillicons.dev icon ID
  name: string;      // Display name
}> = {
  // ✅ Verified working icons:
  
  // Frontend
  'react': { id: 'react', name: 'React' },
  'nextjs': { id: 'nextjs', name: 'Next.js' },
  'next.js': { id: 'nextjs', name: 'Next.js' },
  'typescript': { id: 'typescript', name: 'TypeScript' },
  'javascript': { id: 'javascript', name: 'JavaScript' },
  'tailwindcss': { id: 'tailwindcss', name: 'Tailwind CSS' },
  'tailwind': { id: 'tailwindcss', name: 'Tailwind CSS' },
  'vuejs': { id: 'vuejs', name: 'Vue.js' },
  'vue.js': { id: 'vuejs', name: 'Vue.js' },
  'vue': { id: 'vuejs', name: 'Vue.js' },
  'angular': { id: 'angular', name: 'Angular' },
  'svelte': { id: 'svelte', name: 'Svelte' },
  'redux': { id: 'redux', name: 'Redux' },
  'vite': { id: 'vite', name: 'Vite' },
  'webpack': { id: 'webpack', name: 'Webpack' },
  'html': { id: 'html', name: 'HTML5' },
  'css': { id: 'css', name: 'CSS3' },
  'sass': { id: 'sass', name: 'Sass' },
  
  // Backend
  'nodejs': { id: 'nodejs', name: 'Node.js' },
  'node.js': { id: 'nodejs', name: 'Node.js' },
  'node': { id: 'nodejs', name: 'Node.js' },
  'express': { id: 'express', name: 'Express.js' },
  'express.js': { id: 'express', name: 'Express.js' },
  'nestjs': { id: 'nestjs', name: 'NestJS' },
  'fastify': { id: 'fastify', name: 'Fastify' },
  'python': { id: 'python', name: 'Python' },
  'django': { id: 'django', name: 'Django' },
  'flask': { id: 'flask', name: 'Flask' },
  'go': { id: 'go', name: 'Go' },
  'golang': { id: 'go', name: 'Go' },
  'rust': { id: 'rust', name: 'Rust' },
  'java': { id: 'java', name: 'Java' },
  'spring': { id: 'spring', name: 'Spring' },
  'php': { id: 'php', name: 'PHP' },
  'laravel': { id: 'laravel', name: 'Laravel' },
  
  // Databases
  'postgresql': { id: 'postgresql', name: 'PostgreSQL' },
  'postgres': { id: 'postgresql', name: 'PostgreSQL' },
  'mongodb': { id: 'mongodb', name: 'MongoDB' },
  'mongo': { id: 'mongodb', name: 'MongoDB' },
  'mysql': { id: 'mysql', name: 'MySQL' },
  'redis': { id: 'redis', name: 'Redis' },
  'sqlite': { id: 'sqlite', name: 'SQLite' },
  
  // APIs & Communication
  'graphql': { id: 'graphql', name: 'GraphQL' },
  'jwt': { id: 'jwt', name: 'JWT' },
  'socketio': { id: 'socketio', name: 'Socket.IO' },
  'socket.io': { id: 'socketio', name: 'Socket.IO' },
  
  // DevOps & Cloud
  'docker': { id: 'docker', name: 'Docker' },
  'kubernetes': { id: 'kubernetes', name: 'Kubernetes' },
  'k8s': { id: 'kubernetes', name: 'Kubernetes' },
  'aws': { id: 'aws', name: 'AWS' },
  'azure': { id: 'azure', name: 'Azure' },
  'gcp': { id: 'gcp', name: 'Google Cloud' },
  'googlecloud': { id: 'gcp', name: 'Google Cloud' },
  'firebase': { id: 'firebase', name: 'Firebase' },
  'vercel': { id: 'vercel', name: 'Vercel' },
  'netlify': { id: 'netlify', name: 'Netlify' },
  'nginx': { id: 'nginx', name: 'Nginx' },
  
  // Tools
  'git': { id: 'git', name: 'Git' },
  'github': { id: 'github', name: 'GitHub' },
  'gitlab': { id: 'gitlab', name: 'GitLab' },
  'npm': { id: 'npm', name: 'npm' },
  'yarn': { id: 'yarn', name: 'Yarn' },
  'pnpm': { id: 'pnpm', name: 'pnpm' },
  'bun': { id: 'bun', name: 'Bun' },
  'deno': { id: 'deno', name: 'Deno' },
  'figma': { id: 'figma', name: 'Figma' },
  
  // Testing
  'jest': { id: 'jest', name: 'Jest' },
  'cypress': { id: 'cypress', name: 'Cypress' },
  
  // UI/Design
  'mui': { id: 'mui', name: 'Material-UI' },
  'materialui': { id: 'mui', name: 'Material-UI' },
  'bootstrap': { id: 'bootstrap', name: 'Bootstrap' },
  
  // Payment
  'stripe': { id: 'stripe', name: 'Stripe' },
  
  // Mobile
  'reactnative': { id: 'react', name: 'React Native' },
  'react native': { id: 'react', name: 'React Native' },
  'android': { id: 'android', name: 'Android' },
  'ios': { id: 'ios', name: 'iOS' },
  
  // Fallbacks for missing skillicons
  // These use devicon as alternative source
  'prisma': { id: 'prisma', name: 'Prisma' },
  'trpc': { id: 'trpc', name: 'tRPC' },
  'zustand': { id: 'redux', name: 'Zustand' }, // Using redux as visual placeholder
  'webrtc': { id: 'webrtc', name: 'WebRTC' },
  'oauth': { id: 'oauth', name: 'OAuth' },
  'terraform': { id: 'terraform', name: 'Terraform' },
  'supabase': { id: 'supabase', name: 'Supabase' },
  'expo': { id: 'react', name: 'Expo' }, // Using react as placeholder
  'vitest': { id: 'vitest', name: 'Vitest' },
};

// Special icons that need different CDN (not available on skillicons.dev)
const SPECIAL_ICONS: Record<string, string> = {
  'prisma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
  'trpc': 'https://trpc.io/img/logo.svg',
  'supabase': 'https://supabase.com/favicon/favicon-32x32.png',
  'zustand': 'https://zustand-demo.pmnd.rs/favicon.ico',
  'expo': 'https://docs.expo.dev/static/images/favicon.png',
  'webrtc': 'https://webrtc.org/assets/images/webrtc-logo-vert-retro-dist.svg',
};

// Helper function to normalize tech names
const normalizeTechName = (tech: string): string => {
  return tech.toLowerCase()
    .trim()
    .replace(/\s+/g, '') // Remove spaces
    .replace(/\./g, '') // Remove dots
    .replace(/-/g, '') // Remove hyphens
    .replace(/[^a-z0-9]/g, ''); // Remove special chars
};

// Get icon info by tech name
export const getTechIcon = (techName: string) => {
  const normalized = normalizeTechName(techName);
  
  // Direct match
  if (techIcons[normalized]) {
    return techIcons[normalized];
  }
  
  // Try to find by partial match
  for (const [key, value] of Object.entries(techIcons)) {
    const normalizedKey = normalizeTechName(key);
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return value;
    }
  }
  
  // Default fallback
  return {
    id: 'placeholder',
    name: techName
  };
};

// Get icon URL
export const getTechIconUrl = (techName: string): string => {
  const normalized = normalizeTechName(techName);
  
  // Check for special icons first
  if (SPECIAL_ICONS[normalized]) {
    return SPECIAL_ICONS[normalized];
  }
  
  const icon = getTechIcon(techName);
  
  // If it's a special icon with custom URL already, return it
  if (SPECIAL_ICONS[icon.id]) {
    return SPECIAL_ICONS[icon.id];
  }
  
  return `${ICON_CDN}${icon.id}`;
};

// Get display name
export const getTechDisplayName = (techName: string): string => {
  const icon = getTechIcon(techName);
  return icon.name;
};

// Check if icon exists
export const hasTechIcon = (techName: string): boolean => {
  const normalized = normalizeTechName(techName);
  return !!techIcons[normalized] || !!SPECIAL_ICONS[normalized];
};