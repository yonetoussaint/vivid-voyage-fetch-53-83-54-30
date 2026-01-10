// Base URL for all icons
const ICON_CDN = 'https://skillicons.dev/icons?i=';

// Unified icon mapping - all use the same CDN pattern
export const techIcons: Record<string, { 
  id: string;
  name: string;
  color?: string;
}> = {
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
  'redux': { id: 'redux', name: 'Redux' },
  'zustand': { id: 'redux', name: 'Zustand' }, // Using Redux as fallback
  'vite': { id: 'vite', name: 'Vite' },
  'webpack': { id: 'webpack', name: 'Webpack' },
  
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
  
  // APIs & Auth
  'graphql': { id: 'graphql', name: 'GraphQL' },
  'rest': { id: 'restapi', name: 'REST API' },
  'restapi': { id: 'restapi', name: 'REST API' },
  'jwt': { id: 'jwt', name: 'JWT' },
  'oauth': { id: 'oauth', name: 'OAuth' },
  'oauth2': { id: 'oauth', name: 'OAuth 2.0' },
  'socket.io': { id: 'socketio', name: 'Socket.IO' },
  'socketio': { id: 'socketio', name: 'Socket.IO' },
  'webrtc': { id: 'webrtc', name: 'WebRTC' },
  
  // DevOps & Cloud
  'docker': { id: 'docker', name: 'Docker' },
  'kubernetes': { id: 'kubernetes', name: 'Kubernetes' },
  'k8s': { id: 'kubernetes', name: 'Kubernetes' },
  'aws': { id: 'aws', name: 'AWS' },
  'amazon': { id: 'aws', name: 'AWS' },
  'azure': { id: 'azure', name: 'Azure' },
  'gcp': { id: 'gcp', name: 'Google Cloud' },
  'googlecloud': { id: 'gcp', name: 'Google Cloud' },
  'firebase': { id: 'firebase', name: 'Firebase' },
  'vercel': { id: 'vercel', name: 'Vercel' },
  'netlify': { id: 'netlify', name: 'Netlify' },
  'terraform': { id: 'terraform', name: 'Terraform' },
  'nginx': { id: 'nginx', name: 'Nginx' },
  
  // Tools & Platforms
  'git': { id: 'git', name: 'Git' },
  'github': { id: 'github', name: 'GitHub' },
  'gitlab': { id: 'gitlab', name: 'GitLab' },
  'npm': { id: 'npm', name: 'npm' },
  'yarn': { id: 'yarn', name: 'Yarn' },
  'pnpm': { id: 'pnpm', name: 'pnpm' },
  'bun': { id: 'bun', name: 'Bun' },
  'deno': { id: 'deno', name: 'Deno' },
  'figma': { id: 'figma', name: 'Figma' },
  
  // Payment & Services
  'stripe': { id: 'stripe', name: 'Stripe' },
  'paypal': { id: 'paypal', name: 'PayPal' },
  
  // Mobile
  'reactnative': { id: 'react', name: 'React Native' },
  'react native': { id: 'react', name: 'React Native' },
  'expo': { id: 'expo', name: 'Expo' },
  
  // Testing
  'jest': { id: 'jest', name: 'Jest' },
  'vitest': { id: 'vitest', name: 'Vitest' },
  'cypress': { id: 'cypress', name: 'Cypress' },
  
  // ORMs & Tools
  'prisma': { id: 'prisma', name: 'Prisma' },
  'mongoose': { id: 'mongodb', name: 'Mongoose' },
  'sequelize': { id: 'sequelize', name: 'Sequelize' },
  'typeorm': { id: 'typeorm', name: 'TypeORM' },
  'drizzle': { id: 'postgresql', name: 'Drizzle ORM' },
  
  // State Management
  'tanstackquery': { id: 'reactquery', name: 'TanStack Query' },
  'reactquery': { id: 'reactquery', name: 'TanStack Query' },
  
  // UI Libraries
  'mui': { id: 'mui', name: 'Material-UI' },
  'materialui': { id: 'mui', name: 'Material-UI' },
  'shadcn': { id: 'react', name: 'shadcn/ui' },
  'radix': { id: 'radixui', name: 'Radix UI' },
  'framer': { id: 'framer', name: 'Framer Motion' },
  
  // Authentication
  'authjs': { id: 'nextauth', name: 'Auth.js' },
  'nextauth': { id: 'nextauth', name: 'Auth.js' },
  'clerk': { id: 'clerk', name: 'Clerk' },
  'supabase': { id: 'supabase', name: 'Supabase' },
  
  // AI/ML
  'tensorflow': { id: 'tensorflow', name: 'TensorFlow' },
  'pytorch': { id: 'pytorch', name: 'PyTorch' },
  'openai': { id: 'openai', name: 'OpenAI' },
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
  
  // Partial match
  for (const [key, value] of Object.entries(techIcons)) {
    if (normalized.includes(key) || key.includes(normalized)) {
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
  const icon = getTechIcon(techName);
  return `${ICON_CDN}${icon.id}`;
};

// Get display name
export const getTechDisplayName = (techName: string): string => {
  const icon = getTechIcon(techName);
  return icon.name;
};