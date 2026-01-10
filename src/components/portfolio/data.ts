import { 
  User, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Quote, 
  Code2 
} from 'lucide-react';

// Tabs for navigation
export const tabs = [
  { id: 'about', label: 'About', description: 'Learn about my background', icon: User },
  { id: 'projects', label: 'Projects', description: 'View my portfolio work', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', description: 'My professional journey', icon: Briefcase },
  { id: 'education', label: 'Education', description: 'Degrees & certifications', icon: GraduationCap },
  { id: 'testimonials', label: 'Reviews', description: 'What others say', icon: Quote },
  { id: 'skills', label: 'Skills', description: 'Technical expertise', icon: Code2 }
];

// Projects data
export const projects = [
  {
    title: "Mima Marketplace",
    desc: "Online public marketplace for selling/requesting products with a private mall section for quality-curated items",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    stars: 157,
    forks: 28,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    category: "E-Commerce"
  },
  {
    title: "EduFlow Academy",
    desc: "Comprehensive online learning platform with interactive courses, live classes, progress tracking, and certification",
    tech: ["React", "Node.js", "MongoDB", "WebRTC", "Stripe"],
    stars: 342,
    forks: 67,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    category: "EdTech"
  },
  {
    title: "Bet509",
    desc: "Real-time online sports betting platform with live odds, secure transactions, and multiplayer features",
    tech: ["React", "Node.js", "Socket.io", "Payment API", "Redis"],
    stars: 289,
    forks: 51,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop",
    category: "Gaming & Betting"
  },
  {
    title: "Easy+",
    desc: "Comprehensive gas station management system for inventory, fuel tracking, sales, and customer management",
    tech: ["React", "Node.js", "MongoDB", "Express", "IoT Integration"],
    stars: 134,
    forks: 22,
    image: "https://images.unsplash.com/photo-1611258623152-1703c5d4b3f3?w=800&h=600&fit=crop",
    category: "Enterprise SaaS"
  },
  {
    title: "TransfèPam",
    desc: "Money transfer platform for sending funds to Haiti with local cash distribution network",
    tech: ["React Native", "Node.js", "PostgreSQL", "REST API", "Payment Gateway"],
    stars: 89,
    forks: 16,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    category: "FinTech"
  },
  {
    title: "Authentication SDK",
    desc: "Node.js/Express authentication system published on npm and GitHub with multiple auth strategies",
    tech: ["Node.js", "Express.js", "JWT", "OAuth2", "npm", "GitHub"],
    stars: 213,
    forks: 47,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    category: "Developer Tools"
  },
  {
    title: "E-Commerce Platform",
    desc: "Full-stack marketplace with real-time inventory, payment processing, and admin dashboard",
    tech: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
    stars: 234,
    forks: 45,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    category: "E-Commerce"
  },
  {
    title: "DevOps Dashboard",
    desc: "Kubernetes cluster monitoring with real-time metrics, alerts, and deployment management",
    tech: ["React", "Go", "Prometheus", "WebSocket"],
    stars: 189,
    forks: 32,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    category: "DevOps"
  },
  {
    title: "AI Content Generator",
    desc: "ML-powered content creation tool with fine-tuned models and custom training pipeline",
    tech: ["Python", "FastAPI", "Transformers", "Docker"],
    stars: 567,
    forks: 98,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    category: "AI/ML"
  },
  {
    title: "Real-Time Collaboration",
    desc: "Collaborative document editor with CRDT synchronization and presence awareness",
    tech: ["TypeScript", "Yjs", "WebRTC", "Node.js"],
    stars: 423,
    forks: 76,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    category: "Collaboration"
  },
  {
    title: "API Gateway",
    desc: "High-performance API gateway with rate limiting, caching, and authentication",
    tech: ["Rust", "Redis", "JWT", "Nginx"],
    stars: 312,
    forks: 54,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    category: "Infrastructure"
  },
  {
    title: "Mobile Fitness App",
    desc: "Cross-platform fitness tracking with workout plans, progress analytics, and social features",
    tech: ["React Native", "Firebase", "TensorFlow Lite"],
    stars: 198,
    forks: 41,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    category: "HealthTech"
  }
];

// Experience data
export const experience = [
  {
    company: "Tech Innovations Inc",
    role: "Senior Full Stack Developer",
    period: "2023 - Present",
    desc: "Led development of microservices architecture serving 2M+ users. Improved API response times by 60%.",
    year: "2023"
  },
  {
    company: "StartupCo",
    role: "Full Stack Developer",
    period: "2021 - 2023",
    desc: "Built core platform features from scratch. Reduced infrastructure costs by 40% through optimization.",
    year: "2021"
  },
  {
    company: "Digital Agency",
    role: "Frontend Developer",
    period: "2019 - 2021",
    desc: "Developed responsive web applications for Fortune 500 clients. Mentored junior developers.",
    year: "2019"
  }
];

// Education data
export const education = [
  {
    degree: "Master of Science in Computer Science",
    institution: "Stanford University",
    period: "2017 - 2019",
    desc: "Specialized in Machine Learning and Distributed Systems",
    type: "degree"
  },
  {
    degree: "Bachelor of Science in Software Engineering",
    institution: "University of California, Berkeley",
    period: "2013 - 2017",
    desc: "Graduated with Honors, GPA: 3.8/4.0",
    type: "degree"
  }
];

// Certifications data
export const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    type: "cert"
  },
  {
    name: "Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    date: "2022",
    type: "cert"
  },
  {
    name: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "2022",
    type: "cert"
  }
];

// Testimonials data
export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO at Tech Innovations Inc",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    text: "Alex is an exceptional developer who consistently delivers high-quality code. Their ability to tackle complex problems and mentor junior developers has been invaluable to our team."
  },
  {
    name: "Michael Lee",
    role: "Product Manager at StartupCo",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    text: "Working with Alex was a game-changer for our product. They have a rare combination of technical expertise and business acumen that helped us ship features faster than ever."
  },
  {
    name: "Emily Rodriguez",
    role: "Senior Engineer at Digital Agency",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    text: "Alex's attention to detail and commitment to best practices raised the bar for our entire engineering team. A true professional and excellent collaborator."
  }
];

// Skills data
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

// Contact information
export const contactInfo = {
  name: "Alex Chen",
  title: "Full Stack Developer",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "alexchen.dev",
  github: "github.com/alexchen",
  linkedin: "linkedin.com/in/alexchen",
  status: "Available for work"
};

// Quick stats
export const quickStats = [
  { value: "5+", label: "Years Experience", color: "blue" },
  { value: "50+", label: "Projects", color: "green" },
  { value: "2.4k", label: "GitHub Stars", color: "purple" },
  { value: "98%", label: "Satisfaction", color: "orange" }
];

// Profile information for side panel
export const profileInfo = {
  name: "Alex Chen",
  title: "Full Stack Developer",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  status: "Available for work",
  contact: {
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexchen.dev"
  }
};

// About section content
export const aboutContent = {
  greeting: "Hey there! 👋",
  intro: "I'm a software engineer specializing in building exceptional digital experiences. Currently focused on creating accessible, human-centered products at scale.",
  description: "With 5+ years of experience, I've worked on everything from e-commerce platforms to real-time collaboration tools, always striving to write clean, maintainable code that solves real problems."
};