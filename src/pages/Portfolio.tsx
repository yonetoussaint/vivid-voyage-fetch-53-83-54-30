import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Import all portfolio components
import Navigation from '@/components/portfolio/Navigation';
import HeroSection from '@/components/portfolio/HeroSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import CertificationsSection from '@/components/portfolio/CertificationsSection';
import TestimonialsSection from '@/components/portfolio/TestimonialsSection';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import CursorFollower from '@/components/portfolio/CursorFollower';

// Lazy load modal components
const ProjectDetails = lazy(() => import('@/components/ProjectDetails'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));

// Translations
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

  // Data arrays
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

  const skills = {
    frontend: ['React.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    backend: ['Node.js', 'Express', 'Python', 'REST API', 'GraphQL'],
    mobile: ['React Native', 'Expo'],
    databases: ['MongoDB', 'PostgreSQL', 'Redis', 'Supabase'],
    tools: ['Git', 'Docker', 'AWS', 'CI/CD', 'Jest', 'Webpack'],
    languages: ['Français', 'Anglais', 'Créole']
  };

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
  // Replace the typing effect useEffect in Portfolio component with this:
useEffect(() => {
  const texts = [
    t.hero.description,
    language === 'fr' ? "Expert en React & TypeScript" : "React & TypeScript Expert",
    language === 'fr' ? "Spécialiste en développement Full Stack" : "Full Stack Development Specialist",
    language === 'fr' ? "Contributeur Open Source" : "Open Source Contributor"
  ];

  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let timeoutId;

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
      timeoutId = setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 2000);
      return;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % texts.length;
    }

    const speed = isDeleting ? 50 : 100;
    timeoutId = setTimeout(typeWriter, speed);
  };

  // Clear existing animation
  setTypedText('');
  currentTextIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  
  timeoutId = setTimeout(typeWriter, 500);

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
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

        <CursorFollower 
          theme={theme} 
          cursorPos={cursorPos} 
          cursorVisible={cursorVisible} 
        />

        <Navigation
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          t={t}
          theme={theme}
          toggleTheme={toggleTheme}
          toggleLanguage={toggleLanguage}
          language={language}
          scrollToSection={scrollToSection}
        />

        <HeroSection
          theme={theme}
          t={t}
          typedText={typedText}
          scrollToSection={scrollToSection}
        />

        <ProjectsSection
          theme={theme}
          t={t}
          activeProjectFilter={activeProjectFilter}
          setActiveProjectFilter={setActiveProjectFilter}
          filteredProjects={filteredProjects}
          setSelectedProject={setSelectedProject}
          trackProjectClick={trackProjectClick}
        />

        <ExperienceSection
          theme={theme}
          t={t}
          experience={experience}
        />

        <SkillsSection
          theme={theme}
          t={t}
          skills={skills}
        />

        <CertificationsSection
          theme={theme}
          t={t}
          certifications={certifications}
          language={language}
        />

        <TestimonialsSection
          theme={theme}
          t={t}
          testimonials={testimonials}
          language={language}
        />

        <BlogSection
          theme={theme}
          t={t}
          blogPosts={blogPosts}
          language={language}
        />

        <ContactSection
          theme={theme}
          t={t}
          language={language}
          contactForm={contactForm}
          handleInputChange={handleInputChange}
          handleContactSubmit={handleContactSubmit}
          formStatus={formStatus}
          copyToClipboard={copyToClipboard}
          contactLinks={contactLinks}
        />

        <Footer
          theme={theme}
          t={t}
          setShowAdmin={setShowAdmin}
          showAdmin={showAdmin}
          analytics={analytics}
        />

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