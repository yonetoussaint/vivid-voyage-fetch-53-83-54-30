import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components for better performance
const ProjectDetails = lazy(() => import('@/components/ProjectDetails'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));

// Translation context
const translations = {
  fr: {
    nav: {
      work: 'Projets',
      skills: 'Compétences',
      experience: 'Expérience',
      blog: 'Blog',
      certifications: 'Certifications',
      contact: 'Contact'
    },
    hero: {
      title: 'Développeur Full Stack',
      description: 'Création d\'applications web évolutives et contribution à l\'innovation open-source.',
      ctaWork: 'Voir mes projets',
      ctaContact: 'Me contacter'
    },
    projects: {
      title: 'Projets <span class="text-[#00ff88]">Sélectionnés</span>',
      filterAll: 'Tous',
      filterWeb: 'Web Apps',
      filterMobile: 'Mobile',
      filterSdk: 'SDK',
      filterOpenSource: 'Open Source',
      visitSite: 'Voir le site',
      viewGithub: 'Voir GitHub',
      viewDetails: 'Détails',
      technologies: 'Technologies utilisées',
      challenges: 'Défis',
      solutions: 'Solutions',
      liveDemo: 'Démo Live',
      repository: 'Repository'
    },
    experience: {
      title: 'Expérience <span class="text-[#00ff88]">Professionnelle</span>',
      current: 'Actuel',
      responsibilities: 'Responsabilités',
      achievements: 'Réalisations',
      techStack: 'Stack technique'
    },
    skills: {
      title: 'Stack <span class="text-[#00ff88]">Technique</span>',
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Mobile',
      databases: 'Bases de données',
      tools: 'Outils',
      languages: 'Langages'
    },
    certifications: {
      title: 'Certifications <span class="text-[#00ff88]"></span>',
      viewCert: 'Voir la certification',
      issued: 'Délivré le',
      validUntil: 'Valide jusqu\'au'
    },
    testimonials: {
      title: 'Témoignages <span class="text-[#00ff88]"></span>',
      from: 'de',
      position: 'Poste',
      company: 'Entreprise'
    },
    blog: {
      title: 'Articles <span class="text-[#00ff88]">Techniques</span>',
      readMore: 'Lire plus',
      readTime: 'min de lecture',
      tags: 'Tags',
      latest: 'Derniers articles',
      allArticles: 'Tous les articles'
    },
    contact: {
      title: 'Contactez-<span class="text-[#00ff88]">moi</span>',
      subtitle: 'Ouvert aux collaborations, opportunités et projets intéressants.',
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès !',
      error: 'Une erreur est survenue. Réessayez.',
      required: 'Champ requis',
      invalidEmail: 'Email invalide'
    },
    footer: {
      copyright: '© 2026 Yoné Toussaint',
      builtWith: 'Construit avec React & Tailwind CSS'
    }
  },
  en: {
    nav: {
      work: 'Work',
      skills: 'Skills',
      experience: 'Experience',
      blog: 'Blog',
      certifications: 'Certifications',
      contact: 'Contact'
    },
    hero: {
      title: 'Full Stack Developer',
      description: 'Crafting scalable web applications and contributing to open-source innovation.',
      ctaWork: 'View My Work',
      ctaContact: 'Contact Me'
    },
    projects: {
      title: 'Selected <span class="text-[#00ff88]">Projects</span>',
      filterAll: 'All',
      filterWeb: 'Web Apps',
      filterMobile: 'Mobile',
      filterSdk: 'SDK',
      filterOpenSource: 'Open Source',
      visitSite: 'Visit Site',
      viewGithub: 'View GitHub',
      viewDetails: 'Details',
      technologies: 'Technologies Used',
      challenges: 'Challenges',
      solutions: 'Solutions',
      liveDemo: 'Live Demo',
      repository: 'Repository'
    },
    experience: {
      title: 'Professional <span class="text-[#00ff88]">Experience</span>',
      current: 'Current',
      responsibilities: 'Responsibilities',
      achievements: 'Achievements',
      techStack: 'Tech Stack'
    },
    skills: {
      title: 'Tech <span class="text-[#00ff88]">Stack</span>',
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Mobile',
      databases: 'Databases',
      tools: 'Tools',
      languages: 'Languages'
    },
    certifications: {
      title: '<span class="text-[#00ff88]">Certifications</span>',
      viewCert: 'View Certification',
      issued: 'Issued',
      validUntil: 'Valid until'
    },
    testimonials: {
      title: '<span class="text-[#00ff88]">Testimonials</span>',
      from: 'from',
      position: 'Position',
      company: 'Company'
    },
    blog: {
      title: 'Technical <span class="text-[#00ff88]">Articles</span>',
      readMore: 'Read More',
      readTime: 'min read',
      tags: 'Tags',
      latest: 'Latest Articles',
      allArticles: 'All Articles'
    },
    contact: {
      title: 'Let\'s <span class="text-[#00ff88]">Connect</span>',
      subtitle: 'Open to collaboration, opportunities, and interesting projects.',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'An error occurred. Please try again.',
      required: 'Required field',
      invalidEmail: 'Invalid email'
    },
    footer: {
      copyright: '© 2026 Yoné Toussaint',
      builtWith: 'Built with React & Tailwind CSS'
    }
  }
};

// Theme context
const ThemeContext = React.createContext();

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState('dark');
  const [activeProjectFilter, setActiveProjectFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    projectClicks: {},
    contactSubmissions: 0
  });

  const cursorRef = useRef({ x: 0, y: 0 });
  const t = translations[language];

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const savedLanguage = localStorage.getItem('portfolio-language');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Track page view
    setAnalytics(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1
    }));
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Apply language
  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
  }, [language]);

  // Cursor animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      setCursorVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      setCursorPos(prev => ({
        x: prev.x + (cursorRef.current.x - prev.x) * 0.1,
        y: prev.y + (cursorRef.current.y - prev.y) * 0.1
      }));
      requestAnimationFrame(animateCursor);
    };
    
    if (window.innerWidth > 768) {
      animateCursor();
    }

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing effect for hero section
  useEffect(() => {
    const texts = [
      t.hero.description,
      "Expert en React & TypeScript",
      "Spécialiste en développement Full Stack",
      "Contributeur Open Source"
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    const typeWriter = () => {
      const currentText = texts[currentTextIndex];
      
      if (isDeleting) {
        setTypedText(currentText.substring(0, currentCharIndex - 1));
        currentCharIndex--;
      } else {
        setTypedText(currentText.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      }
      
      if (!isDeleting && currentCharIndex === currentText.length) {
        // Pause at the end
        setTimeout(() => {
          isDeleting = true;
        }, 2000);
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
      }
      
      const speed = isDeleting ? 50 : 100;
      setTimeout(typeWriter, speed);
    };
    
    setTimeout(typeWriter, 1000);
    
    return () => clearTimeout(typeWriter);
  }, [language, t.hero.description]);

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  // Track project click
  const trackProjectClick = (projectId) => {
    setAnalytics(prev => ({
      ...prev,
      projectClicks: {
        ...prev.projectClicks,
        [projectId]: (prev.projectClicks[projectId] || 0) + 1
      }
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: 'sending', message: t.contact.sending });
    
    // Simulate API call - Replace with actual EmailJS/Formspree integration
    setTimeout(() => {
      setFormStatus({ type: 'success', message: t.contact.success });
      setAnalytics(prev => ({
        ...prev,
        contactSubmissions: prev.contactSubmissions + 1
      }));
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ type: '', message: '' });
      }, 5000);
    }, 1500);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Data arrays (would normally come from API/DB)
  const projects = [
    {
      id: 1,
      title: 'Mima',
      description: 'Plateforme de marketplace en ligne complète connectant acheteurs et vendeurs avec des capacités de transaction transparentes.',
      fullDescription: 'Mima est une marketplace B2B/B2C développée avec une architecture microservices. Le projet incluait la mise en place d\'un système de paiement sécurisé, un moteur de recherche avancé avec Elasticsearch, et une interface administrateur complète.',
      tags: ['React', 'TypeScript', 'MongoDB', 'Node.js', 'Express', 'Redis'],
      link: 'https://mimaht.com',
      github: '#',
      logo: '🛒',
      category: 'web',
      challenges: ['Scalabilité pour 10k+ utilisateurs', 'Intégration de multiples gateways de paiement', 'Temps de chargement initial optimisé'],
      solutions: ['Architecture microservices', 'Mise en cache avec Redis', 'Code splitting et lazy loading'],
      images: [],
      featured: true
    },
    {
      id: 2,
      title: 'TransfèPam',
      description: 'Application web moderne de transfert d\'argent permettant des transactions financières rapides et sécurisées avec une interface intuitive.',
      fullDescription: 'Solution de transfert d\'argent peer-to-peer avec vérification KYC, taux de change en temps réel, et notifications push. Intégration avec des services bancaires locaux et systèmes de mobile money.',
      tags: ['React', 'Node.js', 'Supabase', 'TypeScript', 'Stripe'],
      logo: '💸',
      category: 'web',
      challenges: ['Conformité financière et sécurité', 'Taux de change dynamiques', 'Notifications en temps réel'],
      solutions: ['Chiffrement end-to-end', 'API de taux de change', 'WebSockets pour les notifications'],
      featured: true
    },
    {
      id: 3,
      title: 'Auth SDK',
      description: 'SDK d\'authentification conçu pour simplifier l\'implémentation d\'une authentification utilisateur sécurisée pour les développeurs.',
      fullDescription: 'Bibliothèque JavaScript/TypeScript pour l\'authentification avec support multi-fournisseur (Google, Facebook, GitHub), 2FA, et gestion de session avancée. Documentation complète et exemples d\'implémentation.',
      tags: ['TypeScript', 'SDK', 'Open Source', 'JWT', 'OAuth2'],
      link: '#',
      github: '#',
      logo: '🔐',
      category: 'sdk',
      challenges: ['Compatibilité cross-browser', 'Support TypeScript natif', 'Bundle size optimisé'],
      solutions: ['Build avec Rollup', 'Typings complets', 'Tree shaking automatique'],
      featured: true
    },
    {
      id: 4,
      title: 'Easy+ Gaz',
      description: 'Application de gestion de projet construite pour l\'efficacité opérationnelle, rationalisant le flux de travail et la collaboration d\'équipe.',
      fullDescription: 'Suite d\'outils de productivité pour les équipes distribuées avec tableaux Kanban, suivi du temps, gestion des documents, et intégration Slack/Zoom.',
      tags: ['React', 'JavaScript', 'MongoDB', 'Socket.io', 'AWS'],
      link: 'https://mimaht.com/easy',
      github: '#',
      logo: '⚡',
      category: 'web',
      challenges: ['Collaboration en temps réel', 'Stockage de documents scalable', 'Interface utilisateur complexe'],
      solutions: ['WebSockets pour le real-time', 'S3 pour le stockage', 'Component library interne'],
      featured: true
    },
    {
      id: 5,
      title: 'Contributions Open Source',
      description: 'Contributeur actif à des projets open-source majeurs incluant PayPal SDK et Moncash SDK JS, améliorant les intégrations de paiement.',
      fullDescription: 'Maintien et amélioration de SDK de paiement avec focus sur la stabilité, les tests, et la documentation. Review de code, résolution de bugs, et ajout de nouvelles fonctionnalités.',
      tags: ['JavaScript', 'SDK Development', 'Community', 'Git', 'Testing'],
      github: '#',
      logo: '🌍',
      category: 'opensource',
      challenges: ['Compatibilité avec les versions majeures', 'Documentation technique', 'Support communautaire'],
      solutions: ['Versioning semantique', 'JSDoc auto-généré', 'Issue template optimisé'],
      featured: true
    },
    {
      id: 6,
      title: 'Portfolio Admin',
      description: 'Dashboard admin pour gérer le contenu du portfolio sans avoir à modifier le code.',
      fullDescription: 'Backoffice complet avec CRUD pour projets, compétences, expériences. Upload d\'images, édition Markdown, et prévisualisation en direct.',
      tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind', 'Cloudinary'],
      github: '#',
      logo: '⚙️',
      category: 'web',
      featured: false
    }
  ];

  const experience = [
    {
      id: 1,
      title: 'Développeur Full Stack Senior',
      company: 'Tech Solutions Inc.',
      period: '2022 - Présent',
      location: 'Remote',
      current: true,
      responsibilities: [
        'Développement d\'applications web avec React et Node.js',
        'Architecture de bases de données et API REST',
        'Mentoring des développeurs juniors',
        'Revue de code et bonnes pratiques'
      ],
      achievements: [
        'Réduction de 40% du temps de chargement des pages',
        'Implémentation réussie d\'un système de microservices',
        'Formation de 3 développeurs juniors'
      ],
      techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS', 'Docker']
    },
    {
      id: 2,
      title: 'Développeur Frontend',
      company: 'Digital Agency',
      period: '2020 - 2022',
      location: 'Paris, France',
      current: false,
      responsibilities: [
        'Développement d\'interfaces utilisateur responsive',
        'Intégration avec des APIs backend',
        'Optimisation des performances web',
        'Collaboration avec les designers UX/UI'
      ],
      achievements: [
        'Développement de 15+ sites e-commerce',
        'Augmentation des scores Lighthouse de 30% en moyenne',
        'Création d\'une librairie de composants réutilisables'
      ],
      techStack: ['React', 'JavaScript', 'CSS3', 'REST API', 'Git']
    }
  ];

  const certifications = [
    {
      id: 1,
      title: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2023-06-15',
      expiry: '2026-06-15',
      credentialId: 'AWS123456',
      link: '#',
      logo: '☁️'
    },
    {
      id: 2,
      title: 'React Advanced Patterns',
      issuer: 'Frontend Masters',
      date: '2023-03-10',
      expiry: null,
      credentialId: 'FEM789012',
      link: '#',
      logo: '⚛️'
    },
    {
      id: 3,
      title: 'Node.js Certified Developer',
      issuer: 'OpenJS Foundation',
      date: '2022-11-20',
      expiry: '2025-11-20',
      credentialId: 'OJS345678',
      link: '#',
      logo: '🟢'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Marie Laurent',
      position: 'CTO',
      company: 'Startup XYZ',
      text: 'Yoné a transformé notre plateforme avec son expertise React. Son code est propre, maintenable et scalable.',
      rating: 5,
      date: '2023-12-01'
    },
    {
      id: 2,
      name: 'Jean Dupont',
      position: 'Product Manager',
      company: 'Tech Corp',
      text: 'Collaboration excellente. Yoné comprend rapidement les besoins business et les transforme en solutions techniques efficaces.',
      rating: 5,
      date: '2023-10-15'
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Optimisation des Performances React',
      excerpt: 'Techniques avancées pour améliorer les performances de vos applications React.',
      content: '...',
      readTime: 8,
      tags: ['React', 'Performance', 'JavaScript'],
      date: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'TypeScript en Production',
      excerpt: 'Best practices pour utiliser TypeScript dans des projets à grande échelle.',
      content: '...',
      readTime: 10,
      tags: ['TypeScript', 'Best Practices'],
      date: '2023-12-10',
      featured: true
    }
  ];

  // Après la ligne où les skills sont définis (~ligne 330)
const skills = {
  frontend: ['React.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
  backend: ['Node.js', 'Express', 'Python', 'REST API', 'GraphQL'],
  mobile: ['React Native', 'Expo'],
  databases: ['MongoDB', 'PostgreSQL', 'Redis', 'Supabase'],
  tools: ['Git', 'Docker', 'AWS', 'CI/CD', 'Jest', 'Webpack'],
  languages: ['Français', 'Anglais', 'Créole']
};

// AJOUTE CE CODE ICI :
const contactLinks = [
  { 
    name: 'Email', 
    href: 'mailto:yone95572@gmail.com',
    icon: '✉️',
    copyText: 'yone95572@gmail.com'
  },
  { 
    name: 'WhatsApp', 
    href: 'https://wa.me/47279318',
    icon: '💬',
    copyText: '+47279318'
  },
  { 
    name: 'GitHub', 
    href: '#',
    icon: '🐙'
  },
  { 
    name: 'LinkedIn', 
    href: '#',
    icon: '👔'
  }
];

  const filteredProjects = activeProjectFilter === 'all' 
    ? projects.filter(p => p.featured)
    : projects.filter(p => p.category === activeProjectFilter && p.featured);

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      const toast = document.createElement('div');
      toast.className = `fixed bottom-4 left-1/2 -translate-x-1/2 ${
        theme === 'dark' ? 'bg-[#00ff88] text-black' : 'bg-green-600 text-white'
      } px-4 py-2 rounded-lg font-medium z-[9999] animate-fade-in-out`;
      toast.textContent = language === 'fr' ? 'Copié !' : 'Copied!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 overflow-x-hidden`}>
        {/* Global Styles */}
        <style>{`
          @keyframes scroll {
            0%, 100% { transform: translate(-50%, 0); opacity: 1; }
            50% { transform: translate(-50%, 10px); opacity: 0.3; }
          }
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(10px); }
            20%, 80% { opacity: 1; transform: translateY(0); }
          }
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          .scroll-dot { animation: scroll 2s infinite; }
          .animate-fade-in-out { animation: fadeInOut 2s ease-in-out; }
          .typing-animation { 
            overflow: hidden;
            border-right: 2px solid ${theme === 'dark' ? '#00ff88' : '#059669'};
            white-space: nowrap;
            animation: typing 3.5s steps(40, end);
          }
          .project-card { transition: all 0.3s ease; }
          .project-card:hover { transform: translateY(-4px); }
          .skill-item { transition: all 0.2s ease; }
          @media (max-width: 768px) { .hide-cursor-mobile { display: none; } }
          
          /* Theme variables */
          :root {
            --primary-color: #00ff88;
            --secondary-color: #0a0a0a;
          }
          
          [data-theme="light"] {
            --primary-color: #059669;
            --secondary-color: #f9fafb;
          }
        `}</style>

        {/* Cursor Follower */}
        <div
          className={`fixed w-5 h-5 border-2 ${theme === 'dark' ? 'border-[#00ff88]' : 'border-green-600'} rounded-full pointer-events-none z-[9999] transition-transform duration-150 hide-cursor-mobile`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            opacity: cursorVisible ? 1 : 0
          }}
        />

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[2000] flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-8 text-center px-4"
              >
                {Object.entries(t.nav).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className="text-3xl font-medium hover:text-[#00ff88] transition-colors duration-300 px-4 py-3"
                  >
                    {value}
                  </button>
                ))}
                <div className="mt-12 pt-8 border-t border-gray-700 w-48">
                  <p className="text-lg text-gray-400">yone95572@gmail.com</p>
                  <p className="text-lg text-gray-400 mt-2">+47279318</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className={`fixed top-0 w-full px-4 py-4 flex justify-between items-center z-[1000] ${
          theme === 'dark' ? 'bg-[#0a0a0a]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
        }`}>
          <div className="text-xl font-bold tracking-tight px-2 py-1">YT</div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 list-none">
            {Object.entries(t.nav).map(([key, value]) => (
              <li key={key}>
                <button onClick={() => scrollToSection(key)} className={`text-sm font-medium hover:text-[#00ff88] transition-colors duration-300 px-2 py-1 ${
                  theme === 'light' ? 'text-gray-700' : 'text-white'
                }`}>
                  {value}
                </button>
              </li>
            ))}
            
            {/* Theme Toggle */}
            <li>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:opacity-80 transition-all duration-300`}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
            
            {/* Language Toggle */}
            <li>
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:opacity-80 transition-all duration-300 font-medium`}
              >
                {language === 'fr' ? 'EN' : 'FR'}
              </button>
            </li>
          </ul>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded bg-gray-800 text-sm font-medium"
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
            <button 
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 px-2 py-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={`block w-6 h-0.5 ${
                theme === 'dark' ? 'bg-white' : 'bg-gray-900'
              } transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 ${
                theme === 'dark' ? 'bg-white' : 'bg-gray-900'
              } transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 ${
                theme === 'dark' ? 'bg-white' : 'bg-gray-900'
              } transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 relative">
          <div className="w-full max-w-5xl px-2 py-2">
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-3 border-[#00ff88] mb-6 md:mb-8"
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Yoné Toussaint" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-tight mb-4 tracking-tight"
              >
                Yoné<br />
                <span className="text-[#00ff88]">Toussaint</span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[clamp(1.1rem,3vw,1.3rem)] text-gray-400 mb-8 max-w-xl px-2 py-1 leading-relaxed h-20"
              >
                {typedText || t.hero.description}
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 px-2 py-2"
              >
                <button
                  onClick={() => scrollToSection('work')}
                  className={`px-8 py-3.5 ${
                    theme === 'dark' 
                      ? 'bg-[#00ff88] text-[#0a0a0a] border-[#00ff88] hover:bg-transparent hover:text-[#00ff88]'
                      : 'bg-green-600 text-white border-green-600 hover:bg-transparent hover:text-green-600'
                  } font-semibold rounded-lg border-2 transition-all duration-300 active:scale-95 text-base`}
                >
                  {t.hero.ctaWork}
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`px-8 py-3.5 bg-transparent font-semibold rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-white hover:border-[#00ff88] hover:text-[#00ff88]'
                      : 'border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600'
                  } transition-all duration-300 active:scale-95 text-base`}
                >
                  {t.hero.ctaContact}
                </button>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className={`w-5 h-8 border-2 ${
              theme === 'dark' ? 'border-[#00ff88]/60' : 'border-green-600/60'
            } rounded-xl opacity-70`}>
              <div className={`scroll-dot absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 ${
                theme === 'dark' ? 'bg-[#00ff88]' : 'bg-green-600'
              } rounded-sm`} />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="work" className="py-20 px-4 max-w-6xl mx-auto">
          <h2 
            className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
            dangerouslySetInnerHTML={{ __html: t.projects.title }}
          />
          
          {/* Project Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12 px-2 py-2">
            {['all', 'web', 'sdk', 'opensource'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveProjectFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeProjectFilter === filter
                    ? theme === 'dark'
                      ? 'bg-[#00ff88] text-black'
                      : 'bg-green-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t.projects[`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`]}
              </button>
            ))}
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-2">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`project-card ${
                  theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'
                } p-6 rounded-xl border hover:border-[#00ff88] active:scale-[0.99] transition-all duration-300 shadow-lg`}
              >
                {/* Project Logo & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`text-3xl p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-100 border-gray-300'
                  }`}>
                    {project.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className={`px-2 py-1 text-xs border rounded ${
                          theme === 'dark' 
                            ? 'bg-[#2a2a2a] border-[#333]' 
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className={`text-sm mb-5 leading-relaxed px-1 py-1 line-clamp-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag, i) => (
                    <span key={i} className={`px-2.5 py-1 text-xs border rounded ${
                      theme === 'dark' 
                        ? 'bg-[#1a1a1a] border-[#2a2a2a]' 
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {project.link && project.link !== '#' && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackProjectClick(project.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all duration-300 active:scale-[0.98] text-sm ${
                        theme === 'dark'
                          ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#00ff88] hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88]'
                          : 'bg-gray-100 border-gray-300 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600'
                      }`}
                    >
                      <span>{t.projects.visitSite}</span>
                      <span>→</span>
                    </a>
                  )}
                  
                  <button
                    onClick={() => setSelectedProject(project)}
                    className={`px-4 py-2.5 rounded-lg border font-medium transition-all duration-300 active:scale-[0.98] text-sm ${
                      theme === 'dark'
                        ? 'border-[#2a2a2a] text-gray-400 hover:border-[#00ff88] hover:text-[#00ff88]'
                        : 'border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600'
                    }`}
                  >
                    {t.projects.viewDetails}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-4 max-w-4xl mx-auto">
          <h2 
            className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
            dangerouslySetInnerHTML={{ __html: t.experience.title }}
          />
          
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative pl-8 border-l-2 ${
                  theme === 'dark' ? 'border-[#00ff88]' : 'border-green-600'
                }`}
              >
                {/* Current badge */}
                {exp.current && (
                  <span className={`absolute -left-2 top-0 px-3 py-1 text-xs font-medium rounded-full ${
                    theme === 'dark' 
                      ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {t.experience.current}
                  </span>
                )}
                
                <div className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-[#111]' : 'bg-white shadow-sm'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className={`text-lg ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>
                        {exp.company}
                      </p>
                    </div>
                    <div className={`mt-2 md:mt-0 text-right ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p className="font-medium">{exp.period}</p>
                      <p className="text-sm">{exp.location}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">{t.experience.responsibilities}:</h4>
                    <ul className={`space-y-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {exp.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">{t.experience.achievements}:</h4>
                    <ul className={`space-y-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`mr-2 ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">{t.experience.techStack}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech, i) => (
                        <span key={i} className={`px-3 py-1 text-sm rounded-full ${
                          theme === 'dark'
                            ? 'bg-[#2a2a2a] text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
          <h2 
            className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
            dangerouslySetInnerHTML={{ __html: t.skills.title }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 py-2">
            {Object.entries(skills).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-[#111]' : 'bg-white shadow-sm'
                }`}
              >
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'}`}>
                  {t.skills[category]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill, index) => (
                    <span
                      key={index}
                      className={`skill-item px-4 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#00ff88] hover:bg-[#2a2a2a]'
                          : 'bg-gray-100 border-gray-300 hover:border-green-600 hover:bg-green-50'
                      } transition-all duration-200`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-20 px-4 max-w-4xl mx-auto">
          <h2 
            className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
            dangerouslySetInnerHTML={{ __html: t.certifications.title }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 py-2">
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`text-3xl p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                  }`}>
                    {cert.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{cert.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cert.issuer}
                    </p>
                    <div className={`flex items-center gap-4 mt-2 text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span>{t.certifications.issued}: {new Date(cert.date).toLocaleDateString(language)}</span>
                      {cert.expiry && (
                        <span>{t.certifications.validUntil}: {new Date(cert.expiry).toLocaleDateString(language)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between mt-4 pt-4 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    ID: {cert.credentialId}
                  </span>
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-[#1a1a1a] text-[#00ff88] hover:bg-[#00ff88] hover:text-black'
                        : 'bg-gray-100 text-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {t.certifications.viewCert}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 max-w-4xl mx-auto">
          <h2 
            className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
            dangerouslySetInnerHTML={{ __html: t.testimonials.title }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 py-2">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-[#111]' : 'bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                  }`}>
                    👤
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
                
                <p className={`mb-4 italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(testimonial.date).toLocaleDateString(language)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 px-4 max-w-6xl mx-auto">
          <h2 
            className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
            dangerouslySetInnerHTML={{ __html: t.blog.title }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-2">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block mb-4 ${
                  theme === 'dark' 
                    ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {post.readTime} {t.blog.readTime}
                </div>
                
                <h3 className="text-lg font-bold mb-3">{post.title}</h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, i) => (
                    <span key={i} className={`px-2 py-1 text-xs rounded ${
                      theme === 'dark' 
                        ? 'bg-[#2a2a2a] text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(post.date).toLocaleDateString(language)}
                  </span>
                  <button className={`text-sm font-medium hover:underline ${
                    theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'
                  }`}>
                    {t.blog.readMore} →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 max-w-2xl mx-auto">
          <div className="text-center px-2 py-2">
            <h2 
              className="text-[clamp(2rem,5vw,3rem)] mb-6 font-extrabold tracking-tight"
              dangerouslySetInnerHTML={{ __html: t.contact.title }}
            />
            <p className={`text-lg mb-10 px-2 py-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.contact.subtitle}
            </p>
            
            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="mb-12">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      } outline-none transition-all duration-300`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {t.contact.email} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      } outline-none transition-all duration-300`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t.contact.subject} *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                    } outline-none transition-all duration-300`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t.contact.message} *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#111] border-gray-700 text-white focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                    } outline-none transition-all duration-300 resize-none`}
                  />
                </div>
                
                {formStatus.message && (
                  <div className={`p-4 rounded-lg ${
                    formStatus.type === 'success'
                      ? theme === 'dark'
                        ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20'
                        : 'bg-green-50 text-green-800 border border-green-200'
                      : formStatus.type === 'error'
                      ? theme === 'dark'
                        ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                        : 'bg-red-50 text-red-800 border border-red-200'
                      : theme === 'dark'
                        ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {formStatus.message}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={formStatus.type === 'sending'}
                  className={`w-full py-3.5 font-semibold rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {formStatus.type === 'sending' ? t.contact.sending : t.contact.send}
                </button>
              </div>
            </form>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-12">
              <div className={`p-5 rounded-xl ${
                theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        yone95572@gmail.com
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('yone95572@gmail.com')}
                    className={`p-2 rounded-lg hover:opacity-80 transition-all duration-200 ${
                      theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                    }`}
                    title={language === 'fr' ? 'Copier l\'email' : 'Copy email'}
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div className={`p-5 rounded-xl ${
                theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        +47279318
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('+47279318')}
                    className={`p-2 rounded-lg hover:opacity-80 transition-all duration-200 ${
                      theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                    }`}
                    title={language === 'fr' ? 'Copier le numéro' : 'Copy number'}
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 py-2">
              {contactLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-300 active:scale-95 ${
                    theme === 'dark'
                      ? 'bg-[#111] border-[#222] hover:border-[#00ff88] hover:bg-[#1a1a1a]'
                      : 'bg-white border-gray-200 hover:border-green-600 hover:bg-green-50 shadow-sm'
                  }`}
                >
                  <span className="text-2xl mb-2">{link.icon}</span>
                  <span className="text-sm font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`text-center py-8 px-4 ${
          theme === 'dark' ? 'border-t border-[#222] text-gray-600' : 'border-t border-gray-200 text-gray-500'
        }`}>
          <p className="text-sm px-2 py-1">{t.footer.copyright}</p>
          <p className="text-xs mt-2 px-2 py-1 opacity-70">{t.footer.builtWith}</p>
          
          {/* Admin Access Button (hidden by default) */}
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="mt-4 text-xs opacity-50 hover:opacity-100 transition-opacity"
          >
            {showAdmin ? 'Hide Admin' : 'Admin'}
          </button>
          
          {/* Analytics Badge */}
          <div className="mt-4 text-xs opacity-50">
            {analytics.pageViews} views • {analytics.contactSubmissions} contacts
          </div>
        </footer>

        {/* Admin Dashboard Modal */}
        {showAdmin && (
          <Suspense fallback={<div>Loading admin...</div>}>
            <AdminDashboard
              projects={projects}
              analytics={analytics}
              theme={theme}
              onClose={() => setShowAdmin(false)}
            />
          </Suspense>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <Suspense fallback={<div>Loading project details...</div>}>
            <ProjectDetails
              project={selectedProject}
              t={t}
              theme={theme}
              onClose={() => setSelectedProject(null)}
            />
          </Suspense>
        )}
      </div>
    </ThemeContext.Provider>
  );
}