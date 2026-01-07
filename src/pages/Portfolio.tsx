import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Star, GitFork, Calendar, Briefcase, Code2, User, FolderGit2, GraduationCap, Award, Quote, ChevronDown, Menu, X, MapPin, Phone, Globe, Download } from 'lucide-react';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('about');
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const aboutRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu
  const projectsRef = useRef(null);
const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const testimonialsRef = useRef(null);

  const projects = [
    {
      title: "E-Commerce Platform",
      desc: "Full-stack marketplace with real-time inventory, payment processing, and admin dashboard",
      tech: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
      stars: 234,
      forks: 45,
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop"
    },
    {
      title: "DevOps Dashboard",
      desc: "Kubernetes cluster monitoring with real-time metrics, alerts, and deployment management",
      tech: ["React", "Go", "Prometheus", "WebSocket"],
      stars: 189,
      forks: 32,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
    },
    {
      title: "AI Content Generator",
      desc: "ML-powered content creation tool with fine-tuned models and custom training pipeline",
      tech: ["Python", "FastAPI", "Transformers", "Docker"],
      stars: 567,
      forks: 98,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
    },
    {
      title: "Real-Time Collaboration",
      desc: "Collaborative document editor with CRDT synchronization and presence awareness",
      tech: ["TypeScript", "Yjs", "WebRTC", "Node.js"],
      stars: 423,
      forks: 76,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
    },
    {
      title: "API Gateway",
      desc: "High-performance API gateway with rate limiting, caching, and authentication",
      tech: ["Rust", "Redis", "JWT", "Nginx"],
      stars: 312,
      forks: 54,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop"
    },
    {
      title: "Mobile Fitness App",
      desc: "Cross-platform fitness tracking with workout plans, progress analytics, and social features",
      tech: ["React Native", "Firebase", "TensorFlow Lite"],
      stars: 198,
      forks: 41,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
    }
  ];

  const experience = [
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

  const education = [
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

  const certifications = [
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

  const testimonials = [
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

  const skills = {
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
  // JS Runtimes
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", cert: null, proficiency: 90 },
  { name: "Bun", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg", cert: null, proficiency: 82 },
  { name: "Deno", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg", cert: null, proficiency: 75 },

  // JS Frameworks
  { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", cert: null, proficiency: 88 },
  { name: "Fastify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastify/fastify-original.svg", cert: null, proficiency: 85 },
  { name: "NestJS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", cert: null, proficiency: 85 },
  { name: "Hono", logo: "https://avatars.githubusercontent.com/u/98495527?s=200&v=4", cert: null, proficiency: 78 },

  // APIs & Realtime
  { name: "REST APIs", logo: "https://www.svgrepo.com/show/354202/rest-api.svg", cert: null, proficiency: 92 },
  { name: "GraphQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg", cert: null, proficiency: 80 },
  { name: "tRPC", logo: "https://avatars.githubusercontent.com/u/78011399?s=200&v=4", cert: null, proficiency: 82 },
  { name: "WebSockets", logo: "https://www.svgrepo.com/show/493713/websocket.svg", cert: null, proficiency: 80 },

  // Auth & Security
  { name: "Auth.js / NextAuth", logo: "https://authjs.dev/img/logo-sm.png", cert: null, proficiency: 82 },
  { name: "JWT", logo: "https://www.svgrepo.com/show/374118/jwt.svg", cert: null, proficiency: 88 },
  { name: "OAuth 2.0", logo: "https://www.svgrepo.com/show/475656/oauth.svg", cert: null, proficiency: 85 },

  // Databases & ORM
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", cert: null, proficiency: 82 },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", cert: null, proficiency: 80 },
  { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", cert: null, proficiency: 78 },
  { name: "Prisma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg", cert: null, proficiency: 85 },
  { name: "Drizzle ORM", logo: "https://avatars.githubusercontent.com/u/108468352?s=200&v=4", cert: null, proficiency: 80 },

  // Backend Platforms
  { name: "Supabase", logo: "https://raw.githubusercontent.com/supabase/supabase/master/packages/common/assets/images/supabase-logo-icon.png", cert: null, proficiency: 78 },
  { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", cert: null, proficiency: 75 },

  // Jobs & Scheduling
  { name: "BullMQ", logo: "https://avatars.githubusercontent.com/u/75309366?s=200&v=4", cert: null, proficiency: 80 },
  { name: "Node Cron", logo: "https://www.svgrepo.com/show/373598/cron.svg", cert: null, proficiency: 78 },

  // Testing
  { name: "Jest", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg", cert: null, proficiency: 85 },
  { name: "Vitest", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitest/vitest-original.svg", cert: null, proficiency: 82 },

  // PHP
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

  const scrollToSection = (sectionId) => {
    const refs = {
      about: aboutRef,
      projects: projectsRef,
      experience: experienceRef,
      skills: skillsRef,
      education: educationRef,
      testimonials: testimonialsRef
    };
    
    refs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(sectionId);
    setSectionDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'about', ref: aboutRef },
        { id: 'projects', ref: projectsRef },
        { id: 'experience', ref: experienceRef },
        { id: 'education', ref: educationRef },
        { id: 'testimonials', ref: testimonialsRef },
        { id: 'skills', ref: skillsRef }
      ];

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [aboutRef, projectsRef, experienceRef, educationRef, testimonialsRef, skillsRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: 'about', label: 'About', description: 'Learn about my background', icon: User },
    { id: 'projects', label: 'Projects', description: 'View my portfolio work', icon: FolderGit2 },
    { id: 'experience', label: 'Experience', description: 'My professional journey', icon: Briefcase },
    { id: 'education', label: 'Education', description: 'Degrees & certifications', icon: GraduationCap },
    { id: 'testimonials', label: 'Reviews', description: 'What others say', icon: Quote },
    { id: 'skills', label: 'Skills', description: 'Technical expertise', icon: Code2 }
  ];

  const getActiveTabLabel = () => {
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.label : 'About';
  };

  const getActiveTabIcon = () => {
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.icon : User;
  };

  const getActiveTabDescription = () => {
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    return activeTabObj ? activeTabObj.description : 'Learn about my background';
  };

  const AnimatedSection = ({ children, id, delay = 0 }) => {
    const isVisible = visibleSections.has(id);
    return (
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed on top */}
      <header className="bg-white border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button - Replacing the profile picture */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <div>
                <h1 className="font-bold text-lg">Alex Chen</h1>
                <p className="text-xs text-gray-600">Full Stack Developer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Appears when hamburger is clicked */}
        {mobileMenuOpen && (
          <div className="border-t bg-white shadow-lg">
            <div className="max-w-4xl mx-auto py-2">
              <div className="grid grid-cols-2 gap-2 px-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        scrollToSection(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Thin Section Indicator Band - Hidden when mobile menu is open */}
        {!mobileMenuOpen && (
          <div className="border-t">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getActiveTabIcon();
                    return <Icon className="w-4 h-4 text-gray-500" />;
                  })()}
                  <span className="text-gray-700 text-sm font-medium">
                    {getActiveTabLabel()}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 text-xs">
                    {getActiveTabDescription()}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    sectionDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Panel */}
              {sectionDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setSectionDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 bg-white border-t shadow-lg z-50">
                    <div className="max-w-4xl mx-auto pb-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => scrollToSection(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                              isActive 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{tab.label}</div>
                              <div className="text-xs text-gray-500">{tab.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area - Added padding-top to account for fixed header */}
      <main className="flex-1 overflow-y-auto pb-8 pt-24">
        <div className="max-w-4xl mx-auto px-2 py-6 space-y-8">
          {/* About Section */}
          <section ref={aboutRef} id="about" className="scroll-mt-20">
            <div className="space-y-6">
              <AnimatedSection id="about" delay={0}>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-green-700">Available for opportunities</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Hey there! 👋</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    I'm a software engineer specializing in building exceptional digital experiences. 
                    Currently focused on creating accessible, human-centered products at scale.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    With 5+ years of experience, I've worked on everything from e-commerce platforms 
                    to real-time collaboration tools, always striving to write clean, maintainable code 
                    that solves real problems.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection id="about" delay={100}>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">5+</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">2.4k</div>
                      <div className="text-sm text-gray-600">GitHub Stars</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">98%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection id="about" delay={200}>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Get In Touch</h3>
                  <div className="space-y-3">
                    <a href="mailto:alex@example.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">alex@example.com</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Github className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">github.com/alexchen</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Linkedin className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">linkedin.com/in/alexchen</span>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* Projects Section */}
          <section ref={projectsRef} id="projects" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 px-2">Projects</h2>
            <div className="space-y-4">
              {projects.map((project, i) => (
                <AnimatedSection key={i} id="projects" delay={i * 100}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {project.stars}
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-gray-600" />
                          {project.forks}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {project.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tech.map((tech, j) => (
                          <span 
                            key={j}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Project
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href="#" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>

          {/* Experience Section with Timeline */}
          <section ref={experienceRef} id="experience" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 px-2">Experience</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <AnimatedSection key={i} id="experience" delay={i * 100}>
                    <div className="relative pl-16">
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-5 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                      
                      {/* Year badge */}
                      <div className="absolute left-0 top-4 w-12 text-center">
                        <span className="text-xs font-bold text-blue-600">{exp.year}</span>
                      </div>
                      
                      <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold mb-1">{exp.role}</h3>
                            <div className="text-sm text-gray-600 mb-1">{exp.company}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{exp.period}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{exp.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          {/* Education & Certifications Section */}
          <section ref={educationRef} id="education" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 px-2">Education & Certifications</h2>
            
            {/* Education */}
            <div className="space-y-4 mb-6">
              {education.map((edu, i) => (
                <AnimatedSection key={i} id="education" delay={i * 100}>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-1">{edu.degree}</h3>
                        <div className="text-sm text-gray-600 mb-1">{edu.institution}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{edu.period}</span>
                        </div>
                        <p className="text-sm text-gray-600">{edu.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Certifications */}
            <h3 className="text-lg font-bold mb-3 px-2">Professional Certifications</h3>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <AnimatedSection key={i} id="education" delay={(education.length + i) * 100}>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm mb-1">{cert.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{cert.issuer}</span>
                          <span className="text-xs text-gray-500">{cert.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section ref={testimonialsRef} id="testimonials" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 px-2">What People Say</h2>
            <div className="space-y-4">
              {testimonials.map((testimonial, i) => (
                <AnimatedSection key={i} id="testimonials" delay={i * 100}>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-base mb-1">{testimonial.name}</h3>
                        <p className="text-xs text-gray-600">{testimonial.role}</p>
                      </div>
                      <Quote className="w-8 h-8 text-blue-100 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section ref={skillsRef} id="skills" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 px-2">Skills & Expertise</h2>
            
            {/* Skills by Category */}
            <div className="space-y-4">
              {Object.entries(skills).map(([category, items], i) => (
                <AnimatedSection key={category} id="skills" delay={i * 100}>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-blue-600" />
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {items.map((skill, j) => (
                        <div 
                          key={j}
                          className="group relative bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <img 
                              src={skill.logo} 
                              alt={skill.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                          </div>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {skill.proficiency}% proficiency
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}