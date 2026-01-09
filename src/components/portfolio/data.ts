import { 
  Github, Linkedin, Mail, ExternalLink, Star, GitFork, 
  Calendar, Briefcase, Code2, User, FolderGit2, 
  GraduationCap, Award, Quote, ChevronDown, Menu, X, 
  MapPin, Phone, Globe, Download 
} from 'lucide-react';

export const projects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-stack marketplace with real-time inventory, payment processing, and admin dashboard",
    tech: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
    stars: 234,
    forks: 45,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop"
  },
  // ... rest of projects data
];

export const experience = [
  {
    company: "Tech Innovations Inc",
    role: "Senior Full Stack Developer",
    period: "2023 - Present",
    desc: "Led development of microservices architecture serving 2M+ users. Improved API response times by 60%.",
    year: "2023"
  },
  // ... rest of experience data
];

export const education = [
  {
    degree: "Master of Science in Computer Science",
    institution: "Stanford University",
    period: "2017 - 2019",
    desc: "Specialized in Machine Learning and Distributed Systems",
    type: "degree"
  },
  // ... rest of education data
];

export const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    type: "cert"
  },
  // ... rest of certifications data
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO at Tech Innovations Inc",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    text: "Alex is an exceptional developer who consistently delivers high-quality code. Their ability to tackle complex problems and mentor junior developers has been invaluable to our team."
  },
  // ... rest of testimonials data
];

export const skills = {
  Frontend: [
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", cert: null, proficiency: 95 },
    // ... rest of frontend skills
  ],
  Backend: [
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", cert: null, proficiency: 90 },
    // ... rest of backend skills
  ],
  DevOps: [
    { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", cert: null, proficiency: 88 },
    // ... rest of devops skills
  ],
  Other: [
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", cert: null, proficiency: 95 }
  ]
};

export const tabs = [
  { id: 'about', label: 'About', description: 'Learn about my background', icon: User },
  { id: 'projects', label: 'Projects', description: 'View my portfolio work', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', description: 'My professional journey', icon: Briefcase },
  { id: 'education', label: 'Education', description: 'Degrees & certifications', icon: GraduationCap },
  { id: 'testimonials', label: 'Reviews', description: 'What others say', icon: Quote },
  { id: 'skills', label: 'Skills', description: 'Technical expertise', icon: Code2 }
];