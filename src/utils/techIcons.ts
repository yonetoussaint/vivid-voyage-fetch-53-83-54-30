// Base URL for all icons - using your existing devicon CDN
const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

// Mapping of tech names to their devicon paths
export const techIcons: Record<string, { 
  id: string;        // devicon icon path/ID
  name: string;      // Display name
}> = {
  // Frontend
  'react': { id: 'react/react-original.svg', name: 'React' },
  'nextjs': { id: 'nextjs/nextjs-original.svg', name: 'Next.js' },
  'next.js': { id: 'nextjs/nextjs-original.svg', name: 'Next.js' },
  'typescript': { id: 'typescript/typescript-original.svg', name: 'TypeScript' },
  'javascript': { id: 'javascript/javascript-original.svg', name: 'JavaScript' },
  'tailwindcss': { id: 'tailwindcss/tailwindcss-original.svg', name: 'Tailwind CSS' },
  'tailwind': { id: 'tailwindcss/tailwindcss-original.svg', name: 'Tailwind CSS' },
  'vuejs': { id: 'vuejs/vuejs-original.svg', name: 'Vue.js' },
  'vue.js': { id: 'vuejs/vuejs-original.svg', name: 'Vue.js' },
  'vue': { id: 'vuejs/vuejs-original.svg', name: 'Vue.js' },
  'angular': { id: 'angularjs/angularjs-original.svg', name: 'Angular' },
  'svelte': { id: 'svelte/svelte-original.svg', name: 'Svelte' },
  'redux': { id: 'redux/redux-original.svg', name: 'Redux' },
  'vite': { id: 'vitejs/vitejs-original.svg', name: 'Vite' },
  'webpack': { id: 'webpack/webpack-original.svg', name: 'Webpack' },
  'html': { id: 'html5/html5-original.svg', name: 'HTML5' },
  'css': { id: 'css3/css3-original.svg', name: 'CSS3' },
  'sass': { id: 'sass/sass-original.svg', name: 'Sass' },

  // Backend
  'nodejs': { id: 'nodejs/nodejs-original.svg', name: 'Node.js' },
  'node.js': { id: 'nodejs/nodejs-original.svg', name: 'Node.js' },
  'node': { id: 'nodejs/nodejs-original.svg', name: 'Node.js' },
  'express': { id: 'express/express-original.svg', name: 'Express.js' },
  'express.js': { id: 'express/express-original.svg', name: 'Express.js' },
  'nestjs': { id: 'nestjs/nestjs-plain.svg', name: 'NestJS' },
  'fastify': { id: 'fastify/fastify-original.svg', name: 'Fastify' },
  'python': { id: 'python/python-original.svg', name: 'Python' },
  'django': { id: 'django/django-plain.svg', name: 'Django' },
  'flask': { id: 'flask/flask-original.svg', name: 'Flask' },
  'go': { id: 'go/go-original.svg', name: 'Go' },
  'golang': { id: 'go/go-original.svg', name: 'Go' },
  'rust': { id: 'rust/rust-plain.svg', name: 'Rust' },
  'java': { id: 'java/java-original.svg', name: 'Java' },
  'spring': { id: 'spring/spring-original.svg', name: 'Spring' },
  'php': { id: 'php/php-original.svg', name: 'PHP' },
  'laravel': { id: 'laravel/laravel-original.svg', name: 'Laravel' },

  // Databases
  'postgresql': { id: 'postgresql/postgresql-original.svg', name: 'PostgreSQL' },
  'postgres': { id: 'postgresql/postgresql-original.svg', name: 'PostgreSQL' },
  'mongodb': { id: 'mongodb/mongodb-original.svg', name: 'MongoDB' },
  'mongo': { id: 'mongodb/mongodb-original.svg', name: 'MongoDB' },
  'mysql': { id: 'mysql/mysql-original.svg', name: 'MySQL' },
  'redis': { id: 'redis/redis-original.svg', name: 'Redis' },
  'sqlite': { id: 'sqlite/sqlite-original.svg', name: 'SQLite' },

  // APIs & Communication
  'graphql': { id: 'graphql/graphql-plain.svg', name: 'GraphQL' },
  'jwt': { id: 'jwt/jwt-original.svg', name: 'JWT' },
  'socketio': { id: 'socketio/socketio-original.svg', name: 'Socket.IO' },
  'socket.io': { id: 'socketio/socketio-original.svg', name: 'Socket.IO' },

  // DevOps & Cloud
  'docker': { id: 'docker/docker-original.svg', name: 'Docker' },
  'kubernetes': { id: 'kubernetes/kubernetes-plain.svg', name: 'Kubernetes' },
  'k8s': { id: 'kubernetes/kubernetes-plain.svg', name: 'Kubernetes' },
  'aws': { id: 'amazonwebservices/amazonwebservices-original-wordmark.svg', name: 'AWS' },
  'azure': { id: 'azure/azure-original.svg', name: 'Azure' },
  'gcp': { id: 'googlecloud/googlecloud-original.svg', name: 'Google Cloud' },
  'googlecloud': { id: 'googlecloud/googlecloud-original.svg', name: 'Google Cloud' },
  'firebase': { id: 'firebase/firebase-plain.svg', name: 'Firebase' },
  'vercel': { id: 'vercel/vercel-original.svg', name: 'Vercel' },
  'netlify': { id: 'netlify/netlify-original.svg', name: 'Netlify' },
  'nginx': { id: 'nginx/nginx-original.svg', name: 'Nginx' },

  // Tools
  'git': { id: 'git/git-original.svg', name: 'Git' },
  'github': { id: 'github/github-original.svg', name: 'GitHub' },
  'gitlab': { id: 'gitlab/gitlab-original.svg', name: 'GitLab' },
  'npm': { id: 'npm/npm-original-wordmark.svg', name: 'npm' },
  'yarn': { id: 'yarn/yarn-original.svg', name: 'Yarn' },
  'pnpm': { id: 'pnpm/pnpm-original.svg', name: 'pnpm' },
  'bun': { id: 'bun/bun-original.svg', name: 'Bun' },
  'deno': { id: 'denojs/denojs-original.svg', name: 'Deno' },
  'figma': { id: 'figma/figma-original.svg', name: 'Figma' },

  // Testing
  'jest': { id: 'jest/jest-plain.svg', name: 'Jest' },
  'cypress': { id: 'cypress/cypress-plain.svg', name: 'Cypress' },

  // UI/Design
  'mui': { id: 'materialui/materialui-original.svg', name: 'Material-UI' },
  'materialui': { id: 'materialui/materialui-original.svg', name: 'Material-UI' },
  'bootstrap': { id: 'bootstrap/bootstrap-original.svg', name: 'Bootstrap' },

  // Payment
  'stripe': { id: 'stripe/stripe-original.svg', name: 'Stripe' },

  // Mobile
  'reactnative': { id: 'react/react-original.svg', name: 'React Native' },
  'react native': { id: 'react/react-original.svg', name: 'React Native' },
  'android': { id: 'android/android-original.svg', name: 'Android' },
  'ios': { id: 'apple/apple-original.svg', name: 'iOS' },
};

// Special icons that need different URLs (same as your skills data)
const SPECIAL_ICONS: Record<string, string> = {
  // From your skills Frontend
  'tanstackquery': 'https://tanstack.com/_build/assets/logo-color-100w.png',
  'zustand': 'https://raw.githubusercontent.com/pmndrs/zustand/main/examples/demo/public/favicon.ico',
  'shadcnui': 'https://ui.shadcn.com/favicon.ico',
  'shadcn/ui': 'https://ui.shadcn.com/favicon.ico',
  'radixui': 'https://avatars.githubusercontent.com/u/75042455?s=200&v=4',
  'radix ui': 'https://avatars.githubusercontent.com/u/75042455?s=200&v=4',
  'lucideicons': 'https://lucide.dev/logo.svg',
  'lucide icons': 'https://lucide.dev/logo.svg',
  'authjs': 'https://authjs.dev/img/logo-sm.png',
  'clerk': 'https://avatars.githubusercontent.com/u/83972758?s=200&v=4',
  'expo': 'https://avatars.githubusercontent.com/u/12504344?s=200&v=4',
  
  // From your skills Backend
  'hono': 'https://avatars.githubusercontent.com/u/98495527?s=200&v=4',
  'restapis': 'https://www.svgrepo.com/show/354202/rest-api.svg',
  'rest apis': 'https://www.svgrepo.com/show/354202/rest-api.svg',
  'trpc': 'https://avatars.githubusercontent.com/u/78011399?s=200&v=4',
  'websockets': 'https://www.svgrepo.com/show/493713/websocket.svg',
  'nextauth': 'https://authjs.dev/img/logo-sm.png',
  'oauth20': 'https://www.svgrepo.com/show/475656/oauth.svg',
  'oauth2.0': 'https://www.svgrepo.com/show/475656/oauth.svg',
  'oauth': 'https://www.svgrepo.com/show/475656/oauth.svg',
  'prisma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
  'drizzleorm': 'https://avatars.githubusercontent.com/u/108468352?s=200&v=4',
  'drizzle orm': 'https://avatars.githubusercontent.com/u/108468352?s=200&v=4',
  'supabase': 'https://raw.githubusercontent.com/supabase/supabase/master/packages/common/assets/images/supabase-logo-icon.png',
  'bullmq': 'https://avatars.githubusercontent.com/u/75309366?s=200&v=4',
  'nodecron': 'https://www.svgrepo.com/show/373598/cron.svg',
  'node cron': 'https://www.svgrepo.com/show/373598/cron.svg',
  'vitest': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitest/vitest-original.svg',
  
  // From your skills DevOps
  'cicd': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'terraform': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
  
  // Other
  'framer motion': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg',
  'framermotion': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg',
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

// Helper function to get all skills data
const getAllSkills = () => {
  // Since skills is defined in the same file, we can access it directly
  // This function ensures we only call it when needed
  return [
    ...skills.Frontend,
    ...skills.Backend,
    ...skills.DevOps,
    ...skills.Other
  ];
};

// Get icon info by tech name
export const getTechIcon = (techName: string) => {
  const normalized = normalizeTechName(techName);

  // Check special icons first
  if (SPECIAL_ICONS[normalized]) {
    return { id: normalized, name: techName };
  }

  // Direct match
  if (techIcons[normalized]) {
    return techIcons[normalized];
  }

  // Try to find by partial match in techIcons
  for (const [key, value] of Object.entries(techIcons)) {
    const normalizedKey = normalizeTechName(key);
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return value;
    }
  }

  // Try to find by partial match in special icons
  for (const [key] of Object.entries(SPECIAL_ICONS)) {
    const normalizedKey = normalizeTechName(key);
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return { id: key, name: techName };
    }
  }

  // Default fallback - try to find in your skills data
  const allSkills = getAllSkills();
  const foundSkill = allSkills.find(skill => 
    normalizeTechName(skill.name) === normalized || 
    skill.name.toLowerCase().includes(techName.toLowerCase()) ||
    techName.toLowerCase().includes(skill.name.toLowerCase())
  );

  if (foundSkill) {
    return { id: foundSkill.name, name: foundSkill.name };
  }

  // Final fallback
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

  // Try partial match for special icons
  for (const [key, url] of Object.entries(SPECIAL_ICONS)) {
    const normalizedKey = normalizeTechName(key);
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return url;
    }
  }

  const icon = getTechIcon(techName);

  // If it's a special icon with custom URL, return it
  if (SPECIAL_ICONS[icon.id]) {
    return SPECIAL_ICONS[icon.id];
  }

  // If it's in techIcons, use devicon CDN
  if (techIcons[normalized] || techIcons[icon.id]) {
    const iconData = techIcons[normalized] || techIcons[icon.id];
    return `${DEVICON_CDN}${iconData.id}`;
  }

  // Try to find the logo in your skills data
  const allSkills = getAllSkills();
  const foundSkill = allSkills.find(skill => 
    normalizeTechName(skill.name) === normalized || 
    skill.name.toLowerCase().includes(techName.toLowerCase()) ||
    techName.toLowerCase().includes(skill.name.toLowerCase())
  );

  if (foundSkill && foundSkill.logo) {
    return foundSkill.logo;
  }

  // Default fallback - use a generic icon or return empty
  return `${DEVICON_CDN}devicon/devicon-original.svg`;
};

// Get display name
export const getTechDisplayName = (techName: string): string => {
  const icon = getTechIcon(techName);
  return icon.name;
};

// Check if icon exists
export const hasTechIcon = (techName: string): boolean => {
  const normalized = normalizeTechName(techName);
  
  if (SPECIAL_ICONS[normalized]) {
    return true;
  }
  
  if (techIcons[normalized]) {
    return true;
  }
  
  // Check in skills data
  const allSkills = getAllSkills();
  return allSkills.some(skill => normalizeTechName(skill.name) === normalized);
};

// Your skills data (already defined in the file)
export const skills = {
  Frontend: [
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", cert: null, proficiency: 95 },
    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", cert: null, proficiency: 90 },
    { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", cert: null, proficiency: 88 },
    { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", cert: null, proficiency: 92 },
    { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", cert: null, proficiency: 75 },
    { name: "TanStack Query", logo: "https://tanstack.com/_build/assets/logo-color-100w.png", cert: null, proficiency: 90 },
    { name: "Redux Toolkit", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg", cert: null, proficiency: 85 },
    { name: "Zustand", logo: "https://raw.githubusercontent.com/pmndrs/zustand/main/examples/demo/public/favicon.ico", cert: null, proficiency: 88 },
    { name: "Vite", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg", cert: null, proficiency: 92 },
    { name: "Bun", logo: "https://bun.sh/logo.svg", cert: null, proficiency: 80 },
    { name: "shadcn/ui", logo: "https://ui.shadcn.com/favicon.ico", cert: null, proficiency: 88 },
    { name: "Radix UI", logo: "https://avatars.githubusercontent.com/u/75042455?s=200&v=4", cert: null, proficiency: 85 },
    { name: "MUI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg", cert: null, proficiency: 82 },
    { name: "Lucide Icons", logo: "https://lucide.dev/logo.svg", cert: null, proficiency: 85 },
    { name: "Framer Motion", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg", cert: null, proficiency: 85 },
    { name: "Auth.js", logo: "https://authjs.dev/img/logo-sm.png", cert: null, proficiency: 82 },
    { name: "Clerk", logo: "https://avatars.githubusercontent.com/u/83972758?s=200&v=4", cert: null, proficiency: 80 },
    { name: "Netlify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg", cert: null, proficiency: 85 },
    { name: "React Native", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", cert: null, proficiency: 78 },
    { name: "Expo", logo: "https://avatars.githubusercontent.com/u/12504344?s=200&v=4", cert: null, proficiency: 80 }
  ],
  Backend: [
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", cert: null, proficiency: 90 },
    { name: "Bun", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg", cert: null, proficiency: 82 },
    { name: "Deno", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg", cert: null, proficiency: 75 },
    { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", cert: null, proficiency: 88 },
    { name: "Fastify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastify/fastify-original.svg", cert: null, proficiency: 85 },
    { name: "NestJS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", cert: null, proficiency: 85 },
    { name: "Hono", logo: "https://avatars.githubusercontent.com/u/98495527?s=200&v=4", cert: null, proficiency: 78 },
    { name: "REST APIs", logo: "https://www.svgrepo.com/show/354202/rest-api.svg", cert: null, proficiency: 92 },
    { name: "GraphQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg", cert: null, proficiency: 80 },
    { name: "tRPC", logo: "https://avatars.githubusercontent.com/u/78011399?s=200&v=4", cert: null, proficiency: 82 },
    { name: "WebSockets", logo: "https://www.svgrepo.com/show/493713/websocket.svg", cert: null, proficiency: 80 },
    { name: "Auth.js / NextAuth", logo: "https://authjs.dev/img/logo-sm.png", cert: null, proficiency: 82 },
    { name: "JWT", logo: "https://www.svgrepo.com/show/374118/jwt.svg", cert: null, proficiency: 88 },
    { name: "OAuth 2.0", logo: "https://www.svgrepo.com/show/475656/oauth.svg", cert: null, proficiency: 85 },
    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", cert: null, proficiency: 82 },
    { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", cert: null, proficiency: 80 },
    { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", cert: null, proficiency: 78 },
    { name: "Prisma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg", cert: null, proficiency: 85 },
    { name: "Drizzle ORM", logo: "https://avatars.githubusercontent.com/u/108468352?s=200&v=4", cert: null, proficiency: 80 },
    { name: "Supabase", logo: "https://raw.githubusercontent.com/supabase/supabase/master/packages/common/assets/images/supabase-logo-icon.png", cert: null, proficiency: 78 },
    { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", cert: null, proficiency: 75 },
    { name: "BullMQ", logo: "https://avatars.githubusercontent.com/u/75309366?s=200&v=4", cert: null, proficiency: 80 },
    { name: "Node Cron", logo: "https://www.svgrepo.com/show/373598/cron.svg", cert: null, proficiency: 78 },
    { name: "Jest", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg", cert: null, proficiency: 85 },
    { name: "Vitest", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitest/vitest-original.svg", cert: null, proficiency: 82 },
    { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", cert: null, proficiency: 78 },
    { name: "Laravel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", cert: null, proficiency: 80 }
  ],
  DevOps: [
    { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", cert: null, proficiency: 88 },
    { name: "Kubernetes", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", cert: null, proficiency: 85 },
    { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", cert: null, proficiency: 90 },
    { name: "CI/CD", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", cert: null, proficiency: 87 },
    { name: "Terraform", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg", cert: null, proficiency: 75 }
  ],
  Other: [
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", cert: null, proficiency: 95 }
  ]
};